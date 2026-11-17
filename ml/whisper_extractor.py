"""
ViralHook Studio - Spoken Hook Audio Extraction via Whisper (0–5s)
Owner: Tanvir (Machine Learning & NLP Lead)

Responsible for extracting true opening spoken words from video/audio feeds (0-5 seconds)
to eliminate caption bias and discrepancies between on-screen text and spoken delivery.
"""

import os
import subprocess
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class WhisperHookExtractor:
    """
    Extracts spoken opening line from the first 0–5 seconds of an audio or video file.
    Uses faster-whisper or openai-whisper with automatic fallback.
    """

    def __init__(self, model_size: str = "tiny", compute_type: str = "int8"):
        self.model_size = model_size
        self.compute_type = compute_type
        self._model = None

    def _load_model(self):
        if self._model is not None:
            return self._model
        try:
            from faster_whisper import WhisperModel
            self._model = WhisperModel(self.model_size, device="cpu", compute_type=self.compute_type)
            logger.info("Loaded faster-whisper %s model on CPU", self.model_size)
        except ImportError:
            try:
                import whisper
                self._model = whisper.load_model(self.model_size, device="cpu")
                logger.info("Loaded standard whisper %s model on CPU", self.model_size)
            except ImportError:
                logger.warning("Whisper packages not installed. Running in transcript passthrough mode.")
                self._model = "unavailable"
        return self._model

    def extract_from_audio(self, audio_path: str, max_duration_sec: float = 5.0) -> str:
        """
        Transcribes the first `max_duration_sec` seconds of an audio/video file.
        Returns the transcribed opening hook string.
        """
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        model = self._load_model()
        if model == "unavailable":
            raise RuntimeError("Whisper is not installed. Please install faster-whisper or openai-whisper.")

        # If using faster-whisper
        if hasattr(model, "transcribe"):
            # faster-whisper returns segments generator
            segments, info = model.transcribe(
                audio_path,
                beam_size=1,
                language="en",
                vad_filter=True
            )
            spoken_words = []
            for segment in segments:
                if segment.start >= max_duration_sec:
                    break
                spoken_words.append(segment.text.strip())
                if segment.end >= max_duration_sec:
                    break
            return " ".join(spoken_words).strip()
        else:
            # standard openai-whisper
            result = model.transcribe(audio_path, language="en")
            segments = result.get("segments", [])
            spoken_words = []
            for seg in segments:
                if seg["start"] >= max_duration_sec:
                    break
                spoken_words.append(seg["text"].strip())
                if seg["end"] >= max_duration_sec:
                    break
            return " ".join(spoken_words).strip()
