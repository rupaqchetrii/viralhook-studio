"""
Unit tests for Dual-Tower ML Model
Owner: Tanvir (Machine Learning & NLP Lead)

Day 2 Deliverable — validates:
  - Feature builder output shape & type
  - Psycholinguistic transformer produces 24 features
  - Probability calibration: sum = 1.000 ± 0.001
  - Inference latency < 50 ms on CPU (after model is trained)
  - Data leakage: no creator overlap between GroupKFold train & test splits
  - Serialisation: model file + metadata JSON exist after training
  - Metadata has required keys and reasonable metric values
  - CLASS_NAMES constant is exactly ['Low', 'Medium', 'High']
"""

import os
import sys
import json
import time
import tempfile
import unittest
from pathlib import Path

import numpy as np
from sklearn.model_selection import GroupKFold

_HERE = Path(__file__).resolve().parent
ROOT  = _HERE.parent
sys.path.insert(0, str(ROOT))

from ml.dual_tower_model import (
    DualTowerFeatureBuilder,
    PsycholinguisticTransformer,
    DualTowerPredictor,
    CLASS_NAMES,
    load_dataset,
    _validate_dataset,
)


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------

SAMPLE_HOOKS = [
    "Stop doing this one morning habit or you will ruin your productivity",
    "Why you should never invest in crypto without knowing this secret",
    "Hey guys, welcome back to my channel! Today we are talking about budget",
    "The #1 mistake people make when learning to code (and how to fix it)",
    "If you have a sleep schedule, watch this immediately...",
    "So basically I decided to make a video about morning routine",
    "Here is how I got 1M views in just 30 days without spending hours editing",
    "In this video I will show you how to clear debt",
]

SAMPLE_LABELS = ["High", "High", "Low", "High", "High", "Low", "High", "Low"]


# ---------------------------------------------------------------------------
# Tests — constants & configuration
# ---------------------------------------------------------------------------

class TestClassNames(unittest.TestCase):

    def test_class_names_exact(self):
        """CLASS_NAMES must be exactly ['Low', 'Medium', 'High'] in that order."""
        self.assertEqual(CLASS_NAMES, ["Low", "Medium", "High"])

    def test_class_names_has_three_elements(self):
        self.assertEqual(len(CLASS_NAMES), 3)


# ---------------------------------------------------------------------------
# Tests — PsycholinguisticTransformer
# ---------------------------------------------------------------------------

class TestPsycholinguisticTransformer(unittest.TestCase):

    def setUp(self):
        self.transformer = PsycholinguisticTransformer()

    def test_output_shape(self):
        """Must produce exactly (N, 24) matrix."""
        result = self.transformer.transform(SAMPLE_HOOKS)
        self.assertEqual(result.shape[0], len(SAMPLE_HOOKS))
        self.assertEqual(result.shape[1], 24)

    def test_dtype_is_float32(self):
        result = self.transformer.transform(SAMPLE_HOOKS)
        self.assertEqual(result.dtype, np.float32)

    def test_empty_string_handled(self):
        """Empty string must not crash; produces all zeros."""
        result = self.transformer.transform([""])
        self.assertEqual(result.shape, (1, 24))
        self.assertTrue(np.isfinite(result).all())

    def test_fit_returns_self(self):
        """fit() must return self for pipeline compatibility."""
        returned = self.transformer.fit(SAMPLE_HOOKS)
        self.assertIs(returned, self.transformer)


# ---------------------------------------------------------------------------
# Tests — DualTowerFeatureBuilder
# ---------------------------------------------------------------------------

class TestDualTowerFeatureBuilder(unittest.TestCase):

    def setUp(self):
        self.builder = DualTowerFeatureBuilder()
        self.builder.fit(SAMPLE_HOOKS)

    def test_transform_output_has_correct_rows(self):
        X = self.builder.transform(SAMPLE_HOOKS)
        self.assertEqual(X.shape[0], len(SAMPLE_HOOKS))

    def test_transform_output_columns_at_least_24(self):
        """Feature matrix must have at least 24 columns (psycholinguistic alone)."""
        X = self.builder.transform(SAMPLE_HOOKS)
        self.assertGreaterEqual(X.shape[1], 24)

    def test_transform_output_is_finite(self):
        """All values in feature matrix must be finite (no NaN / Inf)."""
        import scipy.sparse as sp
        X = self.builder.transform(SAMPLE_HOOKS)
        if sp.issparse(X):
            arr = X.toarray()
        else:
            arr = np.asarray(X)
        self.assertTrue(np.isfinite(arr).all(),
                        "Feature matrix contains NaN or Inf values.")

    def test_fit_transform_matches_separate_fit_and_transform(self):
        """fit_transform should return same shape as fit().transform()."""
        b1 = DualTowerFeatureBuilder()
        X1 = b1.fit_transform(SAMPLE_HOOKS)

        b2 = DualTowerFeatureBuilder()
        b2.fit(SAMPLE_HOOKS)
        X2 = b2.transform(SAMPLE_HOOKS)

        self.assertEqual(X1.shape, X2.shape)

    def test_new_texts_can_be_transformed_after_fit(self):
        """Builder fitted on training data should transform unseen texts."""
        new_texts = [
            "The secret to growing on social media nobody tells you",
            "Hello everyone, let me show you something incredible",
        ]
        X = self.builder.transform(new_texts)
        self.assertEqual(X.shape[0], 2)

    def test_transform_before_fit_raises(self):
        """Calling transform before fit must raise RuntimeError."""
        b = DualTowerFeatureBuilder()
        with self.assertRaises(RuntimeError):
            b.transform(SAMPLE_HOOKS)


# ---------------------------------------------------------------------------
# Tests — full training pipeline + serialisation (uses temp dir)
# ---------------------------------------------------------------------------

class TestModelTrainingAndSerialisation(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Trains the model once into a temp directory for all tests in this class."""
        from ml.dual_tower_model import train, DATASET_PATH

        if not DATASET_PATH.exists():
            raise unittest.SkipTest(
                f"Dataset not found at {DATASET_PATH}. Run ml/data_pipeline.py first."
            )

        cls.tmp_dir = tempfile.mkdtemp(prefix="viralhook_test_")
        cls.metadata = train(
            dataset_path = str(DATASET_PATH),
            output_dir   = cls.tmp_dir,
            n_splits     = 3,   # Faster for unit tests
        )
        cls.model_path    = Path(cls.tmp_dir) / "model_pipeline.joblib"
        cls.metadata_path = Path(cls.tmp_dir) / "model_metadata.json"

    # ---- File existence ----

    def test_model_file_created(self):
        self.assertTrue(self.model_path.exists(),
                        f"model_pipeline.joblib not found in {self.tmp_dir}")

    def test_metadata_file_created(self):
        self.assertTrue(self.metadata_path.exists(),
                        f"model_metadata.json not found in {self.tmp_dir}")

    # ---- Metadata content ----

    def test_metadata_has_required_keys(self):
        required_keys = {
            "model_version", "architecture", "classes",
            "cv_macro_f1", "test_macro_f1", "test_log_loss",
            "test_brier_score_high", "leakage_creators", "checksum_sha256",
        }
        for key in required_keys:
            self.assertIn(key, self.metadata,
                          msg=f"Metadata missing required key: '{key}'")

    def test_metadata_classes_match_class_names(self):
        self.assertEqual(self.metadata["classes"], CLASS_NAMES)

    def test_metadata_macro_f1_is_reasonable(self):
        """Macro-F1 should be better than random (> 0.20 on balanced 3-class problem)."""
        self.assertGreater(self.metadata["test_macro_f1"], 0.20)

    def test_metadata_brier_score_below_threshold(self):
        """Brier Score for High class must be < 0.35 (project soft goal: < 0.18 at scale)."""
        self.assertLess(self.metadata["test_brier_score_high"], 0.35)

    def test_no_creator_leakage(self):
        """No creator should appear in both train and test splits."""
        self.assertEqual(
            self.metadata["leakage_creators"],
            0,
            msg="Creator leakage detected between train and test splits!"
        )

    # ---- Inference quality ----

    def test_predict_hook_returns_valid_class(self):
        predictor = DualTowerPredictor(model_path=str(self.model_path))
        pred_class, proba = predictor.predict_hook(
            "Stop doing this one morning habit or you will ruin your productivity"
        )
        self.assertIn(pred_class, CLASS_NAMES)

    def test_probabilities_sum_to_one(self):
        """Calibrated probabilities must sum to exactly 1.000 ± 0.001."""
        predictor = DualTowerPredictor(model_path=str(self.model_path))
        hooks = [
            "Why you should never invest in crypto without knowing this secret",
            "Hey guys welcome back to my channel today",
            "The #1 mistake people make when learning to code",
        ]
        for hook in hooks:
            _, proba = predictor.predict_hook(hook)
            total = sum(proba.values())
            self.assertAlmostEqual(
                total, 1.0, delta=0.001,
                msg=f"Probabilities sum to {total:.6f} for hook: {hook!r}"
            )

    def test_inference_latency_under_50ms(self):
        """Feature extraction + inference must complete in < 50 ms on CPU."""
        predictor = DualTowerPredictor(model_path=str(self.model_path))
        hook = "Stop doing this one morning habit or you will ruin your productivity"

        # Warm up
        predictor.predict_hook(hook)

        # Time 5 inferences and check the median
        timings = []
        for _ in range(5):
            t0 = time.perf_counter()
            predictor.predict_hook(hook)
            timings.append((time.perf_counter() - t0) * 1000)

        median_ms = sorted(timings)[len(timings) // 2]
        self.assertLess(
            median_ms, 50.0,
            msg=f"Median inference latency {median_ms:.1f} ms exceeds 50 ms budget."
        )

    def test_batch_predict_shape(self):
        """Batch predict_proba should return (N, 3) matrix."""
        predictor = DualTowerPredictor(model_path=str(self.model_path))
        hooks = SAMPLE_HOOKS[:4]
        proba_matrix = predictor.predict_proba(hooks)
        self.assertEqual(proba_matrix.shape[0], 4)
        self.assertEqual(proba_matrix.shape[1], 3)

    def test_classes_property(self):
        predictor = DualTowerPredictor(model_path=str(self.model_path))
        self.assertEqual(predictor.classes_, CLASS_NAMES)


# ---------------------------------------------------------------------------
# Tests — GroupKFold leakage verification (data-level)
# ---------------------------------------------------------------------------

class TestDataLeakageVerification(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        from ml.dual_tower_model import DATASET_PATH
        if not DATASET_PATH.exists():
            raise unittest.SkipTest(f"Dataset not found at {DATASET_PATH}.")
        df = load_dataset(str(DATASET_PATH))
        cls.df = _validate_dataset(df)

    def test_no_creator_overlap_in_group_kfold(self):
        """
        GroupKFold must produce zero train/test creator overlap for all folds.
        This is the core leakage prevention guarantee of the ML design.
        """
        groups = np.array(self.df["creator_id_hash"].tolist())
        gkf    = GroupKFold(n_splits=5)
        y      = np.zeros(len(self.df))   # Dummy labels — only groups matter here

        for fold, (train_idx, test_idx) in enumerate(gkf.split(y, y, groups)):
            train_creators = set(groups[train_idx])
            test_creators  = set(groups[test_idx])
            overlap        = train_creators & test_creators
            self.assertEqual(
                len(overlap), 0,
                msg=f"Fold {fold+1}: {len(overlap)} creators appear in both train & test!"
            )

    def test_dataset_has_all_three_tiers(self):
        """Dataset must contain Low, Medium, and High engagement tiers."""
        tiers = set(self.df["engagement_tier"].unique())
        self.assertIn("Low",    tiers)
        self.assertIn("Medium", tiers)
        self.assertIn("High",   tiers)

    def test_dataset_minimum_size(self):
        """Dataset must have at least 1,000 records for meaningful training."""
        self.assertGreaterEqual(len(self.df), 1000)


if __name__ == "__main__":
    unittest.main(verbosity=2)
