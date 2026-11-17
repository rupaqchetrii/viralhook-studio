"""
Unit tests for WhisperHookExtractor
Owner: Tanvir (Machine Learning & NLP Lead)
"""

import unittest
from ml.whisper_extractor import WhisperHookExtractor


class TestWhisperExtractor(unittest.TestCase):

    def setUp(self):
        self.extractor = WhisperHookExtractor(model_size="tiny")

    def test_missing_file_raises_error(self):
        """Should raise FileNotFoundError when audio file does not exist."""
        with self.assertRaises(FileNotFoundError):
            self.extractor.extract_from_audio("non_existent_audio_sample_xyz.mp3")


if __name__ == "__main__":
    unittest.main()
