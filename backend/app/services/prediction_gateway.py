import os
import re
from typing import Dict, Any, Tuple
from pathlib import Path

# Try importing joblib safely
try:
    import joblib
except ImportError:
    joblib = None

from backend.app.config import get_settings

settings = get_settings()


class PredictionGateway:
    """
    Intelligent Prediction Gateway.
    - Dynamically loads and serves Tanvir's trained scikit-learn model when available.
    - Provides a robust, deterministic heuristic fallback on Day 1 so the API runs
      immediately and unblocks frontend development without waiting for training.
    """

    def __init__(self):
        self.model = None
        self.metadata: Dict[str, Any] = {}
        self.is_loaded = False
        self._load_model_if_available()

    def _get_model_full_path(self) -> Path:
        base_dir = Path(__file__).resolve().parent.parent.parent
        return base_dir / settings.MODEL_PATH

    def _get_metadata_full_path(self) -> Path:
        base_dir = Path(__file__).resolve().parent.parent.parent
        return base_dir / settings.METADATA_PATH

    def _load_model_if_available(self):
        model_path = self._get_model_full_path()
        if joblib and model_path.exists():
            try:
                self.model = joblib.load(model_path)
                self.is_loaded = True
                meta_path = self._get_metadata_full_path()
                if meta_path.exists():
                    import json
                    with open(meta_path, "r", encoding="utf-8") as f:
                        self.metadata = json.load(f)
                print(f"[PredictionGateway] Successfully loaded model from {model_path}")
            except Exception as e:
                print(f"[PredictionGateway] Warning: Failed to load model from {model_path}: {e}")
                self.model = None
                self.is_loaded = False
        else:
            self.model = None
            self.is_loaded = False

    def predict_hook(self, text: str) -> Tuple[str, Dict[str, float], bool]:
        """
        Analyzes a single opening line.
        Returns:
            predicted_class: 'Low' | 'Medium' | 'High'
            probabilities: {'Low': float, 'Medium': float, 'High': float}
            is_mock: bool indicating whether heuristic fallback was used
        """
        # Reload dynamically if model was placed on disk after server startup
        if not self.is_loaded:
            self._load_model_if_available()

        if self.is_loaded and self.model is not None:
            return self._predict_with_real_model(text)
        else:
            return self._predict_with_heuristic_fallback(text)

    def _predict_with_real_model(self, text: str) -> Tuple[str, Dict[str, float], bool]:
        try:
            # Assumes model output classes: ['Low', 'Medium', 'High']
            probs = self.model.predict_proba([text])[0]
            classes = list(getattr(self.model, "classes_", ["Low", "Medium", "High"]))

            prob_dict = {
                "Low": round(float(probs[classes.index("Low")]), 4) if "Low" in classes else 0.33,
                "Medium": round(float(probs[classes.index("Medium")]), 4) if "Medium" in classes else 0.33,
                "High": round(float(probs[classes.index("High")]), 4) if "High" in classes else 0.34,
            }
            # Normalize to guarantee exact sum = 1.0
            total = sum(prob_dict.values())
            prob_dict = {k: round(v / total, 4) for k, v in prob_dict.items()}

            best_class = max(prob_dict, key=prob_dict.get)
            return best_class, prob_dict, False
        except Exception as e:
            print(f"[PredictionGateway] Error during real model inference: {e}, falling back.")
            return self._predict_with_heuristic_fallback(text)

    def _predict_with_heuristic_fallback(self, text: str) -> Tuple[str, Dict[str, float], bool]:
        """
        Deterministic, rule-based heuristic estimating engagement potential
        based on psycholinguistic markers:
        - Direct address ('you', 'your')
        - Curiosity keywords ('why', 'how', 'secret', 'stop', 'mistake', 'reason')
        - Digits / Specificity ('5', '3')
        - Optimal hook length (5 to 14 words)
        """
        clean_text = text.lower().strip()
        words = clean_text.split()
        word_count = len(words)

        score = 0.50  # Base neutral score (50%)

        # 1. Direct address bonus
        if any(term in words for term in ["you", "your", "you're", "you’re"]):
            score += 0.12

        # 2. Curiosity / Power openers
        curiosity_triggers = ["why", "how", "secret", "stop", "mistake", "mistakes", "never", "nobody", "reason", "don't"]
        for trig in curiosity_triggers:
            if trig in words:
                score += 0.08
                break

        # 3. Specificity / Numbers
        if re.search(r"\b\d+\b", clean_text):
            score += 0.08

        # 4. Word length economy (optimal: 5 - 12 words)
        if 5 <= word_count <= 12:
            score += 0.07
        elif word_count < 4:
            score -= 0.10  # Too brief / uninformative
        elif word_count > 18:
            score -= 0.12  # Too verbose for first 3 seconds

        # Clamp score between 0.10 and 0.90
        score = max(0.10, min(0.90, score))

        # Derive 3-class distribution
        p_high = round(score, 4)
        p_low = round(max(0.05, (1.0 - p_high) * 0.45), 4)
        p_med = round(1.0 - p_high - p_low, 4)

        prob_dict = {"Low": p_low, "Medium": p_med, "High": p_high}
        best_class = max(prob_dict, key=prob_dict.get)

        return best_class, prob_dict, True


# Singleton instance
gateway = PredictionGateway()
