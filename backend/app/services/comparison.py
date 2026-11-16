from backend.app.config import get_settings
from backend.app.schemas.compare import (
    CompareRequest,
    CompareResponse,
    HookAnalysisResult,
)
from backend.app.services.prediction_gateway import gateway

settings = get_settings()


def compare_two_hooks(payload: CompareRequest) -> CompareResponse:
    """
    Core comparison service for Hook A and Hook B.
    Enforces the faculty-approved 0.08 threshold for 'Close result'.
    """
    text_a = payload.hook_a.strip()
    text_b = payload.hook_b.strip()

    # 1. Run predictions through gateway
    class_a, probs_a, is_mock_a = gateway.predict_hook(text_a)
    class_b, probs_b, is_mock_b = gateway.predict_hook(text_b)

    # 2. Extract metrics
    words_a = len(text_a.split())
    words_b = len(text_b.split())
    chars_a = len(text_a)
    chars_b = len(text_b)

    p_high_a = probs_a.get("High", 0.33)
    p_high_b = probs_b.get("High", 0.33)

    diff = round(abs(p_high_a - p_high_b), 4)
    is_mock = is_mock_a or is_mock_b

    # 3. Decision Logic with "Close result" Rule
    if diff <= settings.CLOSE_RESULT_MARGIN:
        is_close = True
        verdict = "Close result"
        leading_hook = None
        explanation = (
            f"Both hooks show comparable estimated potential (probability difference is only "
            f"{diff:.1%}, within the project's {settings.CLOSE_RESULT_MARGIN:.0%} threshold). "
            f"Neither hook has a distinct statistical advantage. Choose the one that best fits your video delivery."
        )
    elif p_high_a > p_high_b:
        is_close = False
        verdict = "Hook A leads"
        leading_hook = "A"
        explanation = (
            f"Hook A leads with an estimated {p_high_a:.0%} chance of high engagement vs {p_high_b:.0%} for Hook B "
            f"(+{diff:.1%} lead), showing stronger linguistic signals for quick viewer retention."
        )
    else:
        is_close = False
        verdict = "Hook B leads"
        leading_hook = "B"
        explanation = (
            f"Hook B leads with an estimated {p_high_b:.0%} chance of high engagement vs {p_high_a:.0%} for Hook A "
            f"(+{diff:.1%} lead), showing stronger curiosity and direct audience phrasing."
        )

    # 4. Assemble Results
    result_a = HookAnalysisResult(
        text=text_a,
        predicted_class=class_a,
        probabilities=probs_a,
        word_count=words_a,
        character_count=chars_a,
    )

    result_b = HookAnalysisResult(
        text=text_b,
        predicted_class=class_b,
        probabilities=probs_b,
        word_count=words_b,
        character_count=chars_b,
    )

    return CompareResponse(
        status="success",
        verdict=verdict,
        leading_hook=leading_hook,
        score_difference=diff,
        is_close_result=is_close,
        explanation=explanation,
        hook_a=result_a,
        hook_b=result_b,
        disclaimer=settings.DISCLAIMER,
        is_mock_model=is_mock,
    )
