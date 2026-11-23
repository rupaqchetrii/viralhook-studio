from functools import lru_cache
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ViralHook Studio API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # CORS Origins for Frontend Integration
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [orig.strip() for orig in v.split(",") if orig.strip()]
        return v

    # Model and Decision Parameters
    CLOSE_RESULT_MARGIN: float = 0.08  # Project decision rule for "Close result"
    MODEL_PATH: str = "models/model_pipeline.joblib"
    METADATA_PATH: str = "models/model_metadata.json"

    # Ethical Virality Disclaimer (Required by Faculty Mentor)
    DISCLAIMER: str = (
        "Notice: The predicted engagement class is only an estimate based on "
        "historical text patterns in the dataset. It cannot and does not guarantee "
        "that a video will go viral. Real-world performance depends heavily on "
        "visual delivery, topic relevance, timing, and platform recommendation algorithms."
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
