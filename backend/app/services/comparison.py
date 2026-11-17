import re
from backend.app.config import get_settings
from backend.app.schemas.compare import (
    CompareRequest,
    CompareResponse,
    HookAnalysisResult,
    MarginGuard,
)
from backend.app.services.prediction_gateway import gateway

settings = get_settings()


def compare_two_hooks(payload: CompareRequest) -> CompareResponse:
    """
    Core comparison service for Hook A and Hook B.
    Enforces the faculty-approved 0.08 threshold for 'Close result'.
    Calculates pacing tempo (2.75 wps), FNVM scores, and topic alignment.
    """
    text_a = payload.hook_a.strip()
    text_b = payload.hook_b.strip()

    # 1. Run predictions through gateway
    class_a, raw_probs_a, is_mock_a = gateway.predict_hook(text_a)
    class_b, raw_probs_b, is_mock_b = gateway.predict_hook(text_b)

    # 2. Extract metrics
    words_a = len(text_a.split())
    words_b = len(text_b.split())
    chars_a = len(text_a)
    chars_b = len(text_b)

    p_high_a = raw_probs_a.get("High", raw_probs_a.get("high", 0.33))
    p_high_b = raw_probs_b.get("High", raw_probs_b.get("high", 0.33))
    p_med_a = raw_probs_a.get("Medium", raw_probs_a.get("medium", 0.33))
    p_med_b = raw_probs_b.get("Medium", raw_probs_b.get("medium", 0.33))
    p_low_a = raw_probs_a.get("Low", raw_probs_a.get("low", 0.34))
    p_low_b = raw_probs_b.get("Low", raw_probs_b.get("low", 0.34))

    diff = round(abs(p_high_a - p_high_b), 4)
    is_mock = is_mock_a or is_mock_b

    # 3. Decision Logic with "Close result" Rule (threshold: <= 0.08)
    if diff <= settings.CLOSE_RESULT_MARGIN:
        is_close = True
        verdict = "Close result"
        leading_hook = None
        winner_tag = "DEAD_HEAT"
        explanation = (
            f"Both hooks show comparable estimated potential (probability difference is only "
            f"{diff:.1%}, within the project's {settings.CLOSE_RESULT_MARGIN:.0%} threshold). "
            f"Neither hook has a distinct statistical advantage. Choose the one that best fits your video delivery."
        )
    elif p_high_a > p_high_b:
        is_close = False
        verdict = "Hook A leads"
        leading_hook = "A"
        winner_tag = "HOOK_A"
        explanation = (
            f"Hook A leads with an estimated {p_high_a:.0%} chance of high engagement vs {p_high_b:.0%} for Hook B "
            f"(+{diff:.1%} lead), showing stronger linguistic signals for quick viewer retention."
        )
    else:
        is_close = False
        verdict = "Hook B leads"
        leading_hook = "B"
        winner_tag = "HOOK_B"
        explanation = (
            f"Hook B leads with an estimated {p_high_b:.0%} chance of high engagement vs {p_high_a:.0%} for Hook A "
            f"(+{diff:.1%} lead), showing stronger curiosity and direct audience phrasing."
        )

    # 4. Pacing and FNVM derivations
    spoken_time_a = round(words_a / 2.75, 2)
    spoken_time_b = round(words_b / 2.75, 2)

    pacing_zone_a = "green" if spoken_time_a <= 3.0 else ("yellow" if spoken_time_a <= 4.5 else "red")
    pacing_zone_b = "green" if spoken_time_b <= 3.0 else ("yellow" if spoken_time_b <= 4.5 else "red")

    fnvm_a = round((p_high_a * 3.8 + p_med_a * 1.5 + p_low_a * 0.4) * 10) / 10
    fnvm_b = round((p_high_b * 3.8 + p_med_b * 1.5 + p_low_b * 0.4) * 10) / 10

    # 5. Semantic Topic Alignment / Clickbait check
    topic = (payload.topic_summary or "").strip().lower()
    topic_tokens = set(re.findall(r"\b\w{4,}\b", topic))

    def evaluate_alignment(hook_text: str):
        if not topic_tokens:
            return 0.85, False
        hook_tokens = set(re.findall(r"\b\w{4,}\b", hook_text.lower()))
        overlap = topic_tokens.intersection(hook_tokens)
        if len(overlap) == 0 and len(topic_tokens) >= 2:
            return 0.35, True
        return min(0.96, round(0.45 + len(overlap) * 0.20, 2)), False

    align_a, clickbait_a = evaluate_alignment(text_a)
    align_b, clickbait_b = evaluate_alignment(text_b)

    # 6. Build Dual-cased Probabilities for both backend PRD tests & frontend arena
    probs_a_dual = {
        "Low": p_low_a, "Medium": p_med_a, "High": p_high_a,
        "low": p_low_a, "medium": p_med_a, "high": p_high_a,
    }
    probs_b_dual = {
        "Low": p_low_b, "Medium": p_med_b, "High": p_high_b,
        "low": p_low_b, "medium": p_med_b, "high": p_high_b,
    }

    result_a = HookAnalysisResult(
        text=text_a,
        predicted_class=class_a,
        probabilities=probs_a_dual,
        word_count=words_a,
        character_count=chars_a,
        spokenTime=spoken_time_a,
        pacingZone=pacing_zone_a,
        fnvmScore=fnvm_a,
        topicAlignment=align_a,
        clickbaitWarning=clickbait_a,
        linterFlags=[],
    )

    result_b = HookAnalysisResult(
        text=text_b,
        predicted_class=class_b,
        probabilities=probs_b_dual,
        word_count=words_b,
        character_count=chars_b,
        spokenTime=spoken_time_b,
        pacingZone=pacing_zone_b,
        fnvmScore=fnvm_b,
        topicAlignment=align_b,
        clickbaitWarning=clickbait_b,
        linterFlags=[],
    )

    margin_guard = MarginGuard(
        delta_p=diff,
        is_dead_heat=is_close,
        threshold=settings.CLOSE_RESULT_MARGIN,
        winner=winner_tag,
        summary=(
            f"Statistical Dead-Heat (ΔP = {diff:.1%} <= {settings.CLOSE_RESULT_MARGIN:.1%}). "
            f"Both hooks show virtually equivalent engagement probability. Choose based on tone and production style."
            if is_close
            else explanation
        ),
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
        margin_guard=margin_guard,
    )
