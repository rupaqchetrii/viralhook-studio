from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Shared validator helper
# ---------------------------------------------------------------------------

def _require_non_empty(value: str) -> str:
    trimmed = value.strip()
    if not trimmed:
        raise ValueError("Hook text cannot be empty or whitespace only.")
    return trimmed


class MarginGuard(BaseModel):
    delta_p: float
    is_dead_heat: bool
    threshold: float = 0.08
    winner: str  # 'HOOK_A' | 'HOOK_B' | 'DEAD_HEAT'
    summary: str


# ---------------------------------------------------------------------------
# Compare A vs B
# ---------------------------------------------------------------------------

class CompareRequest(BaseModel):
    hook_a: str = Field(..., description="Text of opening Hook A", max_length=280)
    hook_b: str = Field(..., description="Text of opening Hook B", max_length=280)
    topic_summary: Optional[str] = ""
    platform: Optional[str] = "tiktok"
    niche: Optional[str] = "general"

    @field_validator("hook_a", "hook_b")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        return _require_non_empty(value)

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


# ---------------------------------------------------------------------------
# Single Hook Analyze endpoint
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    hook: str = Field(..., description="Single opening hook text to analyze", max_length=280)

    @field_validator("hook")
    @classmethod
    def validate_non_empty(cls, value: str) -> str:
        return _require_non_empty(value)

    model_config = {
        "json_schema_extra": {
            "example": {
                "hook": "You won't believe what happens when you try this 5-minute hack."
            }
        }
    }


class SignalItem(BaseModel):
    label: str
    value: str
    impact: str          # "positive" | "negative" | "neutral"
    tip: str


class LintIssueItem(BaseModel):
    rule_id: str
    severity: str
    message: str
    matched_phrase: Optional[str] = None
    quick_fix: Optional[str] = None
    fix_label: Optional[str] = None


class AnalyzeResponse(BaseModel):
    status: str = "success"
    hook: str
    # Prediction
    predicted_class: str
    probabilities: Dict[str, float]
    is_mock_model: bool
    # Explainer
    summary: str
    word_count: int
    char_count: int
    estimated_spoken_seconds: float
    pacing_band: str
    pacing_label: str
    readability_grade: float
    positive_signal_count: int
    negative_signal_count: int
    signals: List[SignalItem]
    # Linter
    lint_is_clean: bool
    lint_error_count: int
    lint_warning_count: int
    lint_info_count: int
    lint_score_penalty: float
    lint_issues: List[LintIssueItem]
    # Disclaimer
    disclaimer: str
