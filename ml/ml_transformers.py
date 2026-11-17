"""
ml_transformers.py — Sklearn-compatible custom transformers for ViralHook Studio.
Kept in a named module so joblib can deserialize the saved pipeline correctly.
"""
from __future__ import annotations
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from ml.feature_extractor import extract_features_vector


class PsycholinguisticFeatureExtractor(BaseEstimator, TransformerMixin):
    """
    Sklearn Pipeline-compatible transformer that wraps Tanvir's 24-feature extractor.
    Must live in a named module (not __main__) so joblib can deserialize it.
    """

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return np.array([extract_features_vector(str(text)) for text in X])
