"""
api/analyze.py — Single Hook Analyze Endpoint
POST /api/analyze → full prediction + explainer + linter result for one hook.
Day 2 — ViralHook Studio Backend
"""
from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.compare import AnalyzeRequest, AnalyzeResponse, SignalItem, LintIssueItem
from backend.app.services.prediction_gateway import gateway
from backend.app.services.explainer import explain_hook
from backend.app.services.linter import lint_hook
from backend.app.config import get_settings

router = APIRouter(prefix="", tags=["Analysis"])
settings = get_settings()


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a single video opening hook",
    description=(
        "Runs a single hook through the ML/heuristic prediction pipeline, "
        "the feature explainer, and the linter. Returns predicted engagement class, "
        "probabilities, plain-English feature breakdown, and linting issues with quick-fixes."
    ),
)
def analyze_hook_endpoint(payload: AnalyzeRequest) -> AnalyzeResponse:
    try:
        text = payload.hook.strip()

        # 1. Prediction
        predicted_class, probabilities, is_mock = gateway.predict_hook(text)

        # 2. Explainer
        explanation = explain_hook(text)

        # 3. Linter
        lint = lint_hook(text)

        # 4. Assemble signals
        signals = [
            SignalItem(
                label=s.label,
                value=s.value,
                impact=s.impact,
                tip=s.tip,
            )
            for s in explanation.signals
        ]

        # 5. Assemble lint issues
        lint_issues = [
            LintIssueItem(
                rule_id=i.rule_id,
                severity=i.severity,
                message=i.message,
                matched_phrase=i.matched_phrase,
                quick_fix=i.quick_fix,
                fix_label=i.fix_label,
            )
            for i in lint.issues
        ]

        return AnalyzeResponse(
            status="success",
            hook=text,
            predicted_class=predicted_class,
            probabilities=probabilities,
            is_mock_model=is_mock,
            summary=explanation.summary,
            word_count=explanation.word_count,
            char_count=explanation.char_count,
            estimated_spoken_seconds=explanation.estimated_spoken_seconds,
            pacing_band=explanation.pacing_band,
            pacing_label=explanation.pacing_label,
            readability_grade=explanation.readability_grade,
            positive_signal_count=explanation.positive_count,
            negative_signal_count=explanation.negative_count,
            signals=signals,
            lint_is_clean=lint.is_clean,
            lint_error_count=lint.error_count,
            lint_warning_count=lint.warning_count,
            lint_info_count=lint.info_count,
            lint_score_penalty=lint.score_penalty,
            lint_issues=lint_issues,
            disclaimer=settings.DISCLAIMER,
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing the hook: {str(e)}",
        )
