from typing import Dict, Optional
from pydantic import BaseModel, Field, field_validator


class CompareRequest(BaseModel):
    hook_a: str = Field(..., description="Text of opening Hook A", max_length=280)
    hook_b: str = Field(..., description="Text of opening Hook B", max_length=280)

    @field_validator("hook_a", "hook_b")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Hook text cannot be empty or whitespace only.")
        return trimmed

    model_config = {
        "json_schema_extra": {
            "example": {
                "hook_a": "Here are five Python mistakes beginners make.",
                "hook_b": "You're probably making this Python mistake without knowing it."
            }
        }
    }


class HookAnalysisResult(BaseModel):
    text: str
    predicted_class: str
    probabilities: Dict[str, float]
    word_count: int
    character_count: int


class CompareResponse(BaseModel):
    status: str = "success"
    verdict: str
    leading_hook: Optional[str] = None
    score_difference: float
    is_close_result: bool
    explanation: str
    hook_a: HookAnalysisResult
    hook_b: HookAnalysisResult
    disclaimer: str
    is_mock_model: bool
