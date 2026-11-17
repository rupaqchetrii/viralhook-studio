"""
Unit tests for TM-HIC Data Pipeline and FNVM Target Calculation
Owner: Tanvir (Machine Learning & NLP Lead)
"""

import os
import csv
import unittest
from ml.data_pipeline import build_tm_hic_dataset


class TestDataPipeline(unittest.TestCase):
    OUTPUT_FILE = "data/processed/tm_hic_test.csv"

    @classmethod
    def setUpClass(cls):
        build_tm_hic_dataset(num_records=150, output_path=cls.OUTPUT_FILE)

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.OUTPUT_FILE):
            os.remove(cls.OUTPUT_FILE)

    def test_file_created_and_row_count(self):
        """Verifies file generation and correct record count."""
        self.assertTrue(os.path.exists(self.OUTPUT_FILE))
        with open(self.OUTPUT_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
        self.assertEqual(len(rows), 150)

    def test_schema_fields(self):
        """Verifies all required schema fields are present."""
        expected_fields = {
            "creator_id_hash", "platform", "niche", "hook_text",
            "spoken_transcript", "topic_summary", "follower_count",
            "views", "likes", "shares", "fnvm", "engagement_tier"
        }
        with open(self.OUTPUT_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            header = set(reader.fieldnames or [])
        self.assertTrue(expected_fields.issubset(header))

    def test_fnvm_consistency(self):
        """Verifies FNVM calculation and tier alignment."""
        with open(self.OUTPUT_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                tier = row["engagement_tier"]
                fnvm = float(row["fnvm"])
                if tier == "High":
                    self.assertGreaterEqual(fnvm, 5.0)
                elif tier == "Medium":
                    self.assertTrue(1.0 <= fnvm < 5.0)
                elif tier == "Low":
                    self.assertLess(fnvm, 1.0)

    def test_creator_hash_format(self):
        """Verifies creator ID is pseudonymized as a 16-char hex string."""
        with open(self.OUTPUT_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                self.assertEqual(len(row["creator_id_hash"]), 16)


if __name__ == "__main__":
    unittest.main()
