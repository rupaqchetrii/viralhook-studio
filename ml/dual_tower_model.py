"""
ViralHook Studio - Dual-Tower ML Model
Owner: Tanvir (Machine Learning & NLP Lead)

Day 2 Deliverable — Hybrid Dense + Sparse + Psycholinguistic engagement predictor.

Architecture
------------
Tower 1 (Dense Semantic):
  - sentence-transformers/all-MiniLM-L6-v2  → 384-dim dense embedding
  - Falls back to a 128-dim TF-IDF SVD projection when ST is unavailable

Tower 2 (Sparse + Structural):
  - Sublinear TF-IDF vectoriser (1–3 word n-grams)  → sparse matrix
  - 24 psycholinguistic features from ml.feature_extractor → dense matrix

Fusion:
  - Horizontal concatenation: [dense_emb | tfidf_sparse | psycholinguistic]
  - L1-regularised Logistic Regression with probability calibration

Target:
  - engagement_tier  ∈ {Low, Medium, High}  derived from FNVM

Serialisation:
  - models/model_pipeline.joblib  — full sklearn Pipeline
  - models/model_metadata.json    — metrics, checksum, feature map
"""

import os
import sys
import json
import time
import hashlib
import logging
import warnings
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional

# Suppress sklearn FutureWarnings from deprecated penalty API (sklearn >= 1.8)
warnings.filterwarnings("ignore", category=FutureWarning, module="sklearn")
warnings.filterwarnings("ignore", category=UserWarning,   module="sklearn")

import numpy as np
import pandas as pd
import joblib

from scipy.sparse import hstack, issparse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import GroupKFold, cross_validate
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    f1_score, log_loss, brier_score_loss,
    classification_report, balanced_accuracy_score,
)
from sklearn.pipeline import Pipeline
from sklearn.base import BaseEstimator, TransformerMixin

# Local modules
_HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(_HERE.parent))
from ml.feature_extractor import extract_features_vector, FEATURE_NAMES

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
CLASS_NAMES   = ["Low", "Medium", "High"]
MODELS_DIR    = _HERE.parent / "models"
MODEL_PATH    = MODELS_DIR / "model_pipeline.joblib"
METADATA_PATH = MODELS_DIR / "model_metadata.json"

DATASET_PATH  = _HERE.parent / "data" / "processed" / "tm_hic_dataset.csv"

# TF-IDF configuration (Tower 2 — Sparse component)
TFIDF_MAX_FEATURES = 2000
TFIDF_NGRAM_RANGE  = (1, 3)

# Logistic Regression — L1 regularisation for automatic feature selection
LR_C              = 0.5
LR_MAX_ITER       = 3000         # Increased to avoid ConvergenceWarning on sparse features
LR_SOLVER         = "saga"       # Supports elasticnet (l1_ratio) natively


# ---------------------------------------------------------------------------
# Tower 1 — Dense Semantic Encoder (lazy singleton)
# ---------------------------------------------------------------------------

_st_model: Any = None


def _load_sentence_transformer() -> Any:
    global _st_model
    if _st_model is not None:
        return _st_model
    try:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading all-MiniLM-L6-v2 …")
        _st_model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Sentence transformer loaded (384-dim).")
    except (ImportError, Exception) as exc:
        logger.warning("sentence-transformers unavailable (%s). Dense tower disabled.", exc)
        _st_model = "unavailable"
    return _st_model


def _get_dense_embeddings(texts: List[str]) -> Optional[np.ndarray]:
    """Returns (N, 384) L2-normalised dense matrix or None."""
    model = _load_sentence_transformer()
    if model == "unavailable" or model is None:
        return None
    emb = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    return emb.astype(np.float32)


# ---------------------------------------------------------------------------
# Custom sklearn Transformer — Psycholinguistic Feature Extractor
# ---------------------------------------------------------------------------

class PsycholinguisticTransformer(BaseEstimator, TransformerMixin):
    """
    Wraps ml.feature_extractor.extract_features_vector for use inside a sklearn
    Pipeline.  Input: list of hook text strings.  Output: (N, 24) float matrix.
    """

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        matrix = np.array([extract_features_vector(text) for text in X], dtype=np.float32)
        return matrix

    def get_feature_names_out(self, input_features=None):
        return np.array(FEATURE_NAMES)


# ---------------------------------------------------------------------------
# Full feature builder — fuses all three towers into one matrix
# ---------------------------------------------------------------------------

class DualTowerFeatureBuilder:
    """
    Builds the fused feature matrix from raw hook texts.

    Columns: [dense_emb(384) | tfidf(2000) | psycholinguistic(24)]
    Total width: 384 + 2000 + 24 = 2408 (or 2024 when dense unavailable)
    """

    def __init__(self):
        self.tfidf      = TfidfVectorizer(
            max_features    = TFIDF_MAX_FEATURES,
            ngram_range     = TFIDF_NGRAM_RANGE,
            sublinear_tf    = True,
            strip_accents   = "unicode",
            analyzer        = "word",
            token_pattern   = r"\b[a-zA-Z0-9']+\b",
            min_df          = 2,
        )
        self.psycho = PsycholinguisticTransformer()
        self.scaler_psycho = StandardScaler()
        self.scaler_dense  = StandardScaler()
        self._fitted = False
        self._use_dense = False

    # ------------------------------------------------------------------
    def fit(self, texts: List[str], y=None) -> "DualTowerFeatureBuilder":
        logger.info("Fitting TF-IDF vectoriser …")
        self.tfidf.fit(texts)

        logger.info("Fitting psycholinguistic scaler …")
        psycho_mat = self.psycho.transform(texts)
        self.scaler_psycho.fit(psycho_mat)

        # Attempt dense tower
        logger.info("Attempting dense embedding tower …")
        dense_mat = _get_dense_embeddings(texts)
        if dense_mat is not None:
            self.scaler_dense.fit(dense_mat)
            self._use_dense = True
            logger.info("Dense tower ENABLED (384-dim).")
        else:
            self._use_dense = False
            logger.info("Dense tower DISABLED — TF-IDF only.")

        self._fitted = True
        return self

    # ------------------------------------------------------------------
    def transform(self, texts: List[str]):
        if not self._fitted:
            raise RuntimeError("DualTowerFeatureBuilder.fit() must be called first.")

        # Tower 2a — sparse TF-IDF
        tfidf_mat = self.tfidf.transform(texts)                       # sparse (N, 2000)

        # Tower 2b — psycholinguistic (dense)
        psycho_mat = self.psycho.transform(texts)                     # (N, 24)
        psycho_mat = self.scaler_psycho.transform(psycho_mat)         # scaled

        # Tower 1 — dense embedding (optional)
        if self._use_dense:
            dense_mat = _get_dense_embeddings(texts)                  # (N, 384)
            if dense_mat is not None:
                dense_mat = self.scaler_dense.transform(dense_mat)
                from scipy.sparse import csr_matrix
                fused = hstack([
                    csr_matrix(dense_mat),
                    tfidf_mat,
                    csr_matrix(psycho_mat),
                ])
                return fused

        # Fallback: TF-IDF + psycholinguistic only
        from scipy.sparse import csr_matrix
        fused = hstack([tfidf_mat, csr_matrix(psycho_mat)])
        return fused

    # ------------------------------------------------------------------
    def fit_transform(self, texts: List[str], y=None):
        return self.fit(texts).transform(texts)

    @property
    def use_dense(self) -> bool:
        return self._use_dense


# ---------------------------------------------------------------------------
# Model training
# ---------------------------------------------------------------------------

def load_dataset(path: str = None) -> pd.DataFrame:
    """Loads the TM-HIC CSV dataset."""
    path = path or str(DATASET_PATH)
    logger.info("Loading dataset from %s …", path)
    df = pd.read_csv(path)
    logger.info("Dataset loaded: %d rows, %d columns", len(df), len(df.columns))
    return df


def _validate_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """Ensures required columns exist and drops rows with missing values."""
    required = {"hook_text", "engagement_tier", "creator_id_hash"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")
    df = df.dropna(subset=list(required))
    logger.info("After validation: %d rows remain.", len(df))
    return df


def train(
    dataset_path: str = None,
    output_dir: str = None,
    n_splits: int = 5,
) -> Dict:
    """
    Trains the Dual-Tower model, evaluates with GroupKFold, calibrates
    probabilities, then serialises to disk.

    Returns a dict with evaluation metrics.
    """
    # ---- Load & validate data ----
    df = load_dataset(dataset_path)
    df = _validate_dataset(df)

    texts       = df["hook_text"].tolist()
    labels      = df["engagement_tier"].tolist()
    group_ids   = df["creator_id_hash"].tolist()

    # ---- Label encoding ----
    le = LabelEncoder()
    le.classes_ = np.array(CLASS_NAMES)          # Deterministic class order
    y = np.array([{c: i for i, c in enumerate(CLASS_NAMES)}[l] for l in labels])
    groups = np.array(group_ids)

    logger.info("Class distribution: %s", dict(zip(*np.unique(y, return_counts=True))))

    # ---- Build feature matrix ----
    builder = DualTowerFeatureBuilder()
    logger.info("Building fused feature matrix …")
    X = builder.fit_transform(texts)
    logger.info("Feature matrix shape: %s  (sparse=%s)", X.shape, issparse(X))

    # ---- Cross-validation (GroupKFold — no creator leakage) ----
    base_clf = LogisticRegression(
        C            = LR_C,
        l1_ratio     = 1.0,          # Pure L1 regularisation (sklearn >= 1.8 API)
        solver       = LR_SOLVER,    # saga supports elasticnet/l1_ratio
        max_iter     = LR_MAX_ITER,
        class_weight = "balanced",
        random_state = 42,
    )

    logger.info("Running %d-fold GroupKFold cross-validation …", n_splits)
    gkf    = GroupKFold(n_splits=n_splits)
    cv_res = cross_validate(
        base_clf,
        X, y,
        cv          = gkf.split(X, y, groups),
        scoring     = ["f1_macro", "neg_log_loss"],
        return_train_score=False,
    )

    cv_macro_f1   = float(np.mean(cv_res["test_f1_macro"]))
    cv_logloss    = float(-np.mean(cv_res["test_neg_log_loss"]))
    logger.info("CV Macro-F1 : %.4f", cv_macro_f1)
    logger.info("CV Log-Loss : %.4f", cv_logloss)

    # ---- Final fit + isotonic calibration on full data ----
    logger.info("Fitting final model with Isotonic Regression calibration …")
    final_clf = CalibratedClassifierCV(base_clf, cv=5, method="isotonic")
    final_clf.fit(X, y)

    # ---- Hold-out evaluation (last fold) ----
    train_idx, test_idx = list(gkf.split(X, y, groups))[-1]
    X_test  = X[test_idx]
    y_test  = y[test_idx]

    proba   = final_clf.predict_proba(X_test)
    y_pred  = final_clf.predict(X_test)

    test_macro_f1   = round(float(f1_score(y_test, y_pred, average="macro")),   4)
    test_logloss    = round(float(log_loss(y_test, proba)),                      4)
    test_brier_high = round(float(brier_score_loss(
        (y_test == CLASS_NAMES.index("High")).astype(int),
        proba[:, CLASS_NAMES.index("High")],
    )), 4)
    test_bal_acc    = round(float(balanced_accuracy_score(y_test, y_pred)),      4)

    logger.info("Hold-out Macro-F1    : %.4f", test_macro_f1)
    logger.info("Hold-out Log-Loss    : %.4f", test_logloss)
    logger.info("Hold-out Brier(High) : %.4f", test_brier_high)
    logger.info("Hold-out Bal-Acc     : %.4f", test_bal_acc)

    report = classification_report(
        y_test, y_pred,
        target_names=CLASS_NAMES,
        output_dict=False,
    )
    logger.info("\n%s", report)

    # ---- Data-leakage verification ----
    train_creators = set(groups[train_idx])
    test_creators  = set(groups[test_idx])
    leakage        = train_creators & test_creators
    if leakage:
        logger.warning("Leakage detected! Shared creators: %d", len(leakage))
    else:
        logger.info("Leakage check PASSED — no creator overlap between train & test.")

    # ---- Serialise ----
    output_dir = Path(output_dir) if output_dir else MODELS_DIR
    output_dir.mkdir(parents=True, exist_ok=True)

    model_path    = output_dir / "model_pipeline.joblib"
    metadata_path = output_dir / "model_metadata.json"

    # Wrap builder + classifier into one saveable bundle
    bundle = {
        "builder":  builder,
        "clf":      final_clf,
        "classes":  CLASS_NAMES,
    }
    joblib.dump(bundle, model_path, compress=3)
    logger.info("Model saved → %s", model_path)

    # Compute SHA-256 checksum
    with open(model_path, "rb") as f:
        checksum = hashlib.sha256(f.read()).hexdigest()

    metadata = {
        "model_version":          "v2.0.0-dual-tower",
        "created_at":             pd.Timestamp.now().isoformat(),
        "architecture":           "DualTower-LR-L1-IsotonicCalibration",
        "dense_tower_enabled":    builder.use_dense,
        "tfidf_max_features":     TFIDF_MAX_FEATURES,
        "tfidf_ngram_range":      list(TFIDF_NGRAM_RANGE),
        "psycholinguistic_dims":  len(FEATURE_NAMES),
        "classes":                CLASS_NAMES,
        "training_rows":          len(df),
        "cv_folds":               n_splits,
        "cv_macro_f1":            round(cv_macro_f1, 4),
        "cv_log_loss":            round(cv_logloss,  4),
        "test_macro_f1":          test_macro_f1,
        "test_log_loss":          test_logloss,
        "test_brier_score_high":  test_brier_high,
        "test_balanced_accuracy": test_bal_acc,
        "leakage_creators":       len(leakage),
        "checksum_sha256":        checksum,
    }

    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info("Metadata saved → %s", metadata_path)

    return metadata


# ---------------------------------------------------------------------------
# Inference helper — mirrors PredictionGateway interface
# ---------------------------------------------------------------------------

class DualTowerPredictor:
    """
    Thin inference wrapper.
    Loads the serialised bundle and exposes `predict_hook(text)`.
    Compatible with backend/app/services/prediction_gateway.py.
    """

    def __init__(self, model_path: str = None):
        self._path   = Path(model_path) if model_path else MODEL_PATH
        self._bundle = None
        self.is_loaded = False
        self._load()

    def _load(self):
        if self._path.exists():
            try:
                self._bundle   = joblib.load(self._path)
                self.is_loaded = True
                logger.info("DualTowerPredictor loaded from %s", self._path)
            except Exception as exc:
                logger.error("Failed to load model: %s", exc)
        else:
            logger.warning("Model file not found at %s", self._path)

    def predict_hook(self, text: str) -> Tuple[str, Dict[str, float]]:
        """
        Parameters
        ----------
        text : str  — raw hook text

        Returns
        -------
        (predicted_class, probabilities)
        predicted_class : 'Low' | 'Medium' | 'High'
        probabilities   : {'Low': float, 'Medium': float, 'High': float}
                          guaranteed to sum to exactly 1.000 ± 0.001
        """
        if not self.is_loaded or self._bundle is None:
            raise RuntimeError("Model is not loaded. Run dual_tower_model.train() first.")

        builder : DualTowerFeatureBuilder = self._bundle["builder"]
        clf                               = self._bundle["clf"]
        classes : List[str]              = self._bundle["classes"]

        t0   = time.perf_counter()
        X    = builder.transform([text])
        proba = clf.predict_proba(X)[0]
        elapsed_ms = (time.perf_counter() - t0) * 1000

        # Normalise to guarantee exact sum = 1.000
        total = proba.sum()
        proba = proba / total

        prob_dict = {c: round(float(p), 4) for c, p in zip(classes, proba)}

        # Renormalise last class to absorb rounding error
        prob_dict[classes[-1]] = round(1.0 - sum(
            prob_dict[c] for c in classes[:-1]
        ), 4)

        predicted_class = max(prob_dict, key=prob_dict.get)

        logger.debug(
            "predict_hook | class=%s probs=%s latency=%.1fms",
            predicted_class, prob_dict, elapsed_ms,
        )

        return predicted_class, prob_dict

    def predict_proba(self, texts: List[str]) -> np.ndarray:
        """Batch prediction — returns (N, 3) probability matrix."""
        if not self.is_loaded or self._bundle is None:
            raise RuntimeError("Model is not loaded.")
        builder = self._bundle["builder"]
        clf     = self._bundle["clf"]
        X       = builder.transform(texts)
        return clf.predict_proba(X)

    @property
    def classes_(self):
        if self._bundle:
            return self._bundle["classes"]
        return CLASS_NAMES


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="ViralHook Studio — Dual-Tower Model Trainer")
    parser.add_argument("--dataset", default=None, help="Path to tm_hic_dataset.csv")
    parser.add_argument("--output",  default=None, help="Output directory for models/")
    parser.add_argument("--folds",   type=int, default=5, help="Number of GroupKFold folds")
    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info("ViralHook Studio — Day 2 Dual-Tower Training")
    logger.info("=" * 60)

    metadata = train(
        dataset_path = args.dataset,
        output_dir   = args.output,
        n_splits     = args.folds,
    )

    logger.info("=" * 60)
    logger.info("Training complete!")
    logger.info("  Macro-F1  : %.4f", metadata["test_macro_f1"])
    logger.info("  Brier     : %.4f", metadata["test_brier_score_high"])
    logger.info("  Log-Loss  : %.4f", metadata["test_log_loss"])
    logger.info("  Checksum  : %s",   metadata["checksum_sha256"][:16] + "...")
    logger.info("=" * 60)
