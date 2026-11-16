"""
Unit tests for 24 Psycholinguistic & Structural Feature Extractor
Owner: Tanvir (Machine Learning & NLP Lead)
"""

import unittest
from ml.feature_extractor import (
    extract_features,
    extract_features_vector,
    FEATURE_NAMES,
    WORDS_PER_SECOND
)


class TestFeatureExtractor(unittest.TestCase):

    def test_feature_names_count(self):
        """Must return exactly 24 features."""
        self.assertEqual(len(FEATURE_NAMES), 24)

    def test_empty_input(self):
        """Should handle empty strings gracefully without crashing."""
        feats = extract_features("")
        self.assertEqual(len(feats), 24)
        self.assertEqual(feats["word_count"], 0.0)
        self.assertEqual(feats["duration_seconds"], 0.0)
        self.assertEqual(feats["pacing_zone_is_green"], 0.0)
        self.assertEqual(feats["pacing_zone_is_red"], 0.0)

    def test_green_pacing_zone(self):
        """7 words / 2.75 wps = ~2.545s (Green zone <= 3.0s)."""
        hook = "Stop doing this if you want views"
        feats = extract_features(hook)
        self.assertEqual(feats["word_count"], 7.0)
        expected_duration = round(7.0 / WORDS_PER_SECOND, 3)
        self.assertEqual(feats["duration_seconds"], expected_duration)
        self.assertEqual(feats["pacing_zone_is_green"], 1.0)
        self.assertEqual(feats["pacing_zone_is_red"], 0.0)

    def test_red_pacing_zone(self):
        """16 words / 2.75 wps = ~5.8s (Red zone > 4.5s)."""
        hook = "In this video I will show you sixteen different words that make this hook way too long"
        feats = extract_features(hook)
        self.assertGreater(feats["duration_seconds"], 4.5)
        self.assertEqual(feats["pacing_zone_is_green"], 0.0)
        self.assertEqual(feats["pacing_zone_is_red"], 1.0)

    def test_psycholinguistic_signals(self):
        """Detects direct address, curiosity gap, negative hook, digits, and exclamation."""
        hook = "Why you should never make this #1 mistake!"
        feats = extract_features(hook)
        self.assertEqual(feats["has_direct_address"], 1.0)
        self.assertGreaterEqual(feats["direct_address_count"], 1.0)
        self.assertEqual(feats["has_curiosity_gap"], 1.0)
        self.assertEqual(feats["has_negative_hook"], 1.0)
        self.assertEqual(feats["has_digit"], 1.0)
        self.assertGreaterEqual(feats["exclamation_count"], 1.0)

    def test_feature_vector_format(self):
        """Extracts ordered vector of 24 floats."""
        hook = "The secret to 10x viral growth revealed..."
        vec = extract_features_vector(hook)
        self.assertIsInstance(vec, list)
        self.assertEqual(len(vec), 24)
        for val in vec:
            self.assertIsInstance(val, float)


if __name__ == "__main__":
    unittest.main()
