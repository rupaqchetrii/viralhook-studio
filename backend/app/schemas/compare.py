from typing import Dict, Optional, List, Any
from pydantic import BaseModel, Field, field_validator


class MarginGuard(BaseModel):
    delta_p: float
    is_dead_heat: bool
    threshold: float = 0.08
    winner: str  # 'HOOK_A' | 'HOOK_B' | 'DEAD_HEAT'
    summary: str


class CompareRequest(BaseModel):
    hook_a: str = Field(..., description="Text of opening Hook A", max_length=280)
    hook_b: str = Field(..., description="Text of opening Hook B", max_length=280)
    topic_summary: Optional[str] = ""
    platform: Optional[str] = "tiktok"
    niche: Optional[str] = "general"

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
                "hook_b": "You're probably making this Python mistake without knowing it.",
                "topic_summary": "Python programming tips",
                "platform": "tiktok",
                "niche": "tech"
            }
        }
    }


class HookAnalysisResult(BaseModel):
    text: str
    predicted_class: str
    probabilities: Dict[str, float]
    word_count: int
    character_count: int
    spokenTime: Optional[float] = None
    pacingZone: Optional[str] = None
    fnvmScore: Optional[float] = None
    topicAlignment: Optional[float] = None
    clickbaitWarning: Optional[bool] = False
    linterFlags: Optional[List[Any]] = []


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
    margin_guard: Optional[MarginGuard] = None
