"""
train_model.py — ViralHook Studio ML Training Pipeline
Day 3 — Train TF-IDF + 24-Feature + Logistic Regression model
Saves: backend/models/model_pipeline.joblib + model_metadata.json

Run from project root:
    python train_model.py
"""
import json
import hashlib
import sys
import os
from pathlib import Path

# Add project root to path
ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

import pandas as pd
import numpy as np
import joblib
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, f1_score
from sklearn.base import BaseEstimator, TransformerMixin

from ml.feature_extractor import extract_features_vector, FEATURE_NAMES
from ml.ml_transformers import PsycholinguisticFeatureExtractor


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

DATA_PATH       = ROOT / "data" / "processed" / "tm_hic_dataset.csv"
MODEL_DIR       = ROOT / "backend" / "models"
MODEL_PATH      = MODEL_DIR / "model_pipeline.joblib"
METADATA_PATH   = MODEL_DIR / "model_metadata.json"
LABEL_COL       = "engagement_tier"
TEXT_COL        = "hook_text"
CLASSES         = ["Low", "Medium", "High"]
RANDOM_STATE    = 42


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def train():
    print("=" * 60)
    print("ViralHook Studio — ML Training Pipeline (Day 3)")
    print("=" * 60)

    # ------------------------------------------------------------------
    # 1. Load dataset
    # ------------------------------------------------------------------
    print(f"\n[1/6] Loading dataset from {DATA_PATH} ...")
    df = pd.read_csv(DATA_PATH)
    print(f"      Loaded {len(df)} rows, columns: {list(df.columns)}")
    print(f"      Class distribution:\n{df[LABEL_COL].value_counts().to_string()}")

    X = df[TEXT_COL].astype(str).tolist()
    y = df[LABEL_COL].astype(str).tolist()

    # ------------------------------------------------------------------
    # 2. Build Pipeline
    # ------------------------------------------------------------------
    print("\n[2/6] Building Hybrid TF-IDF + 24-Feature pipeline ...")

    tfidf = TfidfVectorizer(
        analyzer="word",
        ngram_range=(1, 2),         # unigrams + bigrams
        max_features=3000,
        sublinear_tf=True,
        min_df=2,
        strip_accents="unicode",
        lowercase=True,
    )

    psycho_extractor = PsycholinguisticFeatureExtractor()

    # Combine both towers via FeatureUnion
    combined_features = FeatureUnion([
        ("tfidf",  tfidf),
        ("psycho", psycho_extractor),
    ])

    clf = LogisticRegression(
        solver="lbfgs",
        max_iter=1000,
        C=1.0,
        class_weight="balanced",
        random_state=RANDOM_STATE,
    )

    pipeline = Pipeline([
        ("features", combined_features),
        ("classifier", clf),
    ])

    print("      Pipeline built: TF-IDF(1-2 grams, 3k vocab) + 24 features → Logistic Regression")

    # ------------------------------------------------------------------
    # 3. Cross-validation
    # ------------------------------------------------------------------
    print("\n[3/6] Running 5-fold Stratified Cross-Validation ...")
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
    cv_scores = cross_val_score(pipeline, X, y, cv=cv, scoring="f1_macro", n_jobs=-1)
    print(f"      Macro-F1 scores: {[round(s, 4) for s in cv_scores]}")
    print(f"      Mean Macro-F1:   {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # ------------------------------------------------------------------
    # 4. Final fit on full dataset
    # ------------------------------------------------------------------
    print("\n[4/6] Fitting final model on full dataset ...")
    pipeline.fit(X, y)

    # Verify predictions
    y_pred = pipeline.predict(X)
    train_f1 = f1_score(y, y_pred, average="macro")
    print(f"      Train Macro-F1 (sanity check): {train_f1:.4f}")
    print("\n      Classification Report (train set):")
    print(classification_report(y, y_pred, target_names=CLASSES))

    # Quick spot-checks
    test_cases = [
        ("You're making 5 Python mistakes that are destroying your code quality", "High"),
        ("Stop doing this — it will ruin your channel growth forever", "High"),
        ("5 tips to improve your morning routine this week", "Medium"),
        ("Hey guys welcome back to my channel today we are talking about Python", "Low"),
        ("In this video I will show you how to code", "Low"),
    ]
    print("      Spot checks:")
    for text, expected in test_cases:
        pred = pipeline.predict([text])[0]
        proba = pipeline.predict_proba([text])[0]
        classes = pipeline.classes_
        p_dict = {str(c): round(float(p), 3) for c, p in zip(classes, proba)}
        status = "✅" if str(pred) == expected else "⚠️ "
        print(f"      {status} [{pred}] expected [{expected}] | {p_dict}")
        print(f"         Hook: \"{text[:60]}...\"" if len(text) > 60 else f"         Hook: \"{text}\"")

    # ------------------------------------------------------------------
    # 5. Save model
    # ------------------------------------------------------------------
    print(f"\n[5/6] Saving model to {MODEL_PATH} ...")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH, compress=3)
    model_sha256 = sha256_file(MODEL_PATH)
    print(f"      Model saved. SHA-256: {model_sha256[:16]}...")

    # Save metadata
    metadata = {
        "model_type": "TF-IDF (1-2gram, 3k) + 24 Psycholinguistic Features + Logistic Regression",
        "training_dataset": "TM-HIC (Tri-Modal Hook Intelligence Corpus)",
        "dataset_path": str(DATA_PATH.relative_to(ROOT)),
        "num_records": len(df),
        "classes": CLASSES,
        "pipeline_classes": [str(c) for c in pipeline.classes_],
        "cv_macro_f1_mean": round(float(cv_scores.mean()), 4),
        "cv_macro_f1_std":  round(float(cv_scores.std()), 4),
        "cv_folds": 5,
        "train_macro_f1": round(float(train_f1), 4),
        "feature_names_psycho": FEATURE_NAMES,
        "tfidf_vocab_size": int(len(tfidf.vocabulary_)),
        "sha256": model_sha256,
        "disclaimer": "Result is an estimate based on historical synthetic data, not a guarantee of virality.",
        "close_result_margin": 0.08,
    }
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"      Metadata saved to {METADATA_PATH}")

    # ------------------------------------------------------------------
    # 6. Summary
    # ------------------------------------------------------------------
    print("\n[6/6] TRAINING COMPLETE ✅")
    print(f"      Model file:    {MODEL_PATH}")
    print(f"      Metadata file: {METADATA_PATH}")
    print(f"      CV Macro-F1:   {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    print(f"      SHA-256:       {model_sha256[:32]}...")
    print("\nRestart the backend server — the gateway will auto-load the trained model.")
    print("Health check will show: inference_mode = 'trained_model'")

    return pipeline, metadata


if __name__ == "__main__":
    train()
