"""
test_api.py — ViralHook Studio Backend Test Suite
Covers Day 1 (T1.1–T1.4) + Day 2 (T2.2 explainer, T2.5 linter, T2.6 analyze endpoint).
All tests are synchronous — no pytest-asyncio required.
"""
import asyncio
import inspect
import pytest

# ---------------------------------------------------------------------------
# T1.1 — Dependency imports
# ---------------------------------------------------------------------------

class TestDependencyImports:
    """T1.1 — All core packages import without error."""

    def test_fastapi_imports(self):
        import fastapi
        import uvicorn
        import pydantic
        assert fastapi.__version__ >= "0.100.0"

    def test_sklearn_imports(self):
        import sklearn
        from sklearn.linear_model import LogisticRegression
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.pipeline import Pipeline
        assert sklearn.__version__ >= "1.0.0"

    def test_numpy_pandas_imports(self):
        import numpy as np
        import pandas as pd
        assert np.__version__ >= "1.20.0"
        assert pd.__version__ >= "1.3.0"

    def test_joblib_import(self):
        import joblib
        assert joblib is not None


# ---------------------------------------------------------------------------
# T1.2 — Config
# ---------------------------------------------------------------------------

class TestConfig:
    """T1.2 — Settings load correctly."""

    def test_settings_load(self):
        from backend.app.config import get_settings
        s = get_settings()
        assert "ViralHook Studio" in s.PROJECT_NAME
        assert s.API_V1_PREFIX == "/api"
        assert 0 < s.CLOSE_RESULT_MARGIN <= 1.0

    def test_disclaimer_present(self):
        from backend.app.config import get_settings
        s = get_settings()
        assert len(s.DISCLAIMER) > 20

    def test_model_path_configured(self):
        from backend.app.config import get_settings
        s = get_settings()
        assert "model_pipeline" in s.MODEL_PATH


# ---------------------------------------------------------------------------
# T1.3 — Health Endpoint
# ---------------------------------------------------------------------------

class TestHealthEndpoint:
    """T1.3 — Health check returns correct structure."""

    def test_health_check_keys(self):
        from backend.app.main import health_check
        result = asyncio.run(health_check()) if inspect.iscoroutinefunction(health_check) else health_check()
        assert result["status"] == "healthy"
        assert "inference_mode" in result
        assert "model_loaded" in result
        assert "version" in result

    def test_inference_mode_values(self):
        from backend.app.main import health_check
        result = health_check()
        assert result["inference_mode"] in ("trained_model", "heuristic_fallback")


# ---------------------------------------------------------------------------
# T1.4 — Prediction Gateway (heuristic)
# ---------------------------------------------------------------------------

class TestPredictionGateway:
    """T1.4 — Gateway returns valid predictions in fallback mode."""

    def test_gateway_singleton(self):
        from backend.app.services.prediction_gateway import gateway
        assert gateway is not None

    def test_predict_returns_valid_class(self):
        from backend.app.services.prediction_gateway import gateway
        cls, probs, is_mock = gateway.predict_hook("You won't believe this 5-step trick")
        assert cls in ("Low", "Medium", "High")
        assert set(probs.keys()) == {"Low", "Medium", "High"}
        assert abs(sum(probs.values()) - 1.0) < 0.01

    def test_strong_hook_scores_high(self):
        from backend.app.services.prediction_gateway import gateway
        cls, probs, _ = gateway.predict_hook("You won't believe this 5-step secret nobody talks about")
        assert probs["High"] >= 0.60

    def test_weak_hook_scores_lower(self):
        from backend.app.services.prediction_gateway import gateway
        cls_weak, probs_weak, _ = gateway.predict_hook("Here is a tutorial")
        cls_strong, probs_strong, _ = gateway.predict_hook("Stop doing this — 3 mistakes ruining your growth")
        assert probs_strong["High"] > probs_weak["High"]

    def test_empty_text_returns_valid(self):
        """Gateway must not crash on edge-case short text."""
        from backend.app.services.prediction_gateway import gateway
        cls, probs, _ = gateway.predict_hook("ok")
        assert cls in ("Low", "Medium", "High")


# ---------------------------------------------------------------------------
# T2.2 — Explainer Service
# ---------------------------------------------------------------------------

class TestExplainerService:
    """T2.2 — Hook explainer produces correct feature breakdown."""

    def test_explain_strong_hook(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("You won't believe what happens when you try this 5-minute hack")
        assert result.has_direct_address is True
        assert result.has_number is True
        assert result.has_curiosity_trigger is True
        assert result.word_count > 0
        assert result.estimated_spoken_seconds > 0

    def test_explain_weak_hook(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("Here is a tutorial on productivity")
        assert result.has_direct_address is False
        assert result.has_number is False

    def test_pacing_sweet_spot(self):
        from backend.app.services.explainer import explain_hook
        # 7 words ≈ 2.5s — sweet spot
        result = explain_hook("Stop making these 3 coding mistakes today")
        assert result.pacing_band == "sweet_spot"

    def test_pacing_too_long(self):
        from backend.app.services.explainer import explain_hook
        long_hook = " ".join(["word"] * 20)
        result = explain_hook(long_hook)
        assert result.pacing_band == "too_long"

    def test_signals_list_not_empty(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("Why you are failing at content creation")
        assert len(result.signals) >= 3

    def test_summary_is_string(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("5 tools every developer needs in 2024")
        assert isinstance(result.summary, str)
        assert len(result.summary) > 10

    def test_question_hook_detected(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("Why are you still making this mistake?")
        assert result.has_question is True

    def test_negative_frame_detected(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("Stop doing this — it will ruin your channel")
        assert result.has_negative_frame is True

    def test_readability_grade_numeric(self):
        from backend.app.services.explainer import explain_hook
        result = explain_hook("You need to know this secret trick now")
        assert isinstance(result.readability_grade, float)
        assert result.readability_grade >= 0


# ---------------------------------------------------------------------------
# T2.5 — Linter Service
# ---------------------------------------------------------------------------

class TestLinterService:
    """T2.5 — Linter catches anti-patterns and provides quick-fixes."""

    def test_clean_hook_passes(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("You're making 5 Python mistakes that hurt your code quality")
        assert result.error_count == 0

    def test_in_this_video_flagged(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("In this video I'm going to explain how Python works")
        assert result.error_count >= 1
        assert any(i.rule_id == "L001" for i in result.issues)

    def test_greeting_opener_flagged(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("Hey guys welcome back to my channel today")
        assert any(i.rule_id == "L002" for i in result.issues)

    def test_cta_in_hook_flagged(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("Don't forget to like and subscribe before we start")
        assert any(i.rule_id == "L010" for i in result.issues)

    def test_multiple_exclamation_marks_flagged(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("This will change your life!!")
        assert any(i.rule_id == "L013" for i in result.issues)

    def test_filler_word_flagged(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("So basically this is how Python loops work")
        assert any(i.rule_id == "L004" for i in result.issues)

    def test_too_long_hook_flagged(self):
        from backend.app.services.linter import lint_hook
        long_hook = "In this tutorial today I am going to walk you through each and every single step of the process very carefully"
        result = lint_hook(long_hook)
        assert result.error_count >= 1

    def test_score_penalty_range(self):
        from backend.app.services.linter import lint_hook
        result = lint_hook("In this video I'm going to explain everything so basically like and subscribe")
        assert 0.0 <= result.score_penalty <= 0.30

    def test_is_clean_flag(self):
        from backend.app.services.linter import lint_hook
        clean = lint_hook("3 mistakes that are killing your engagement right now")
        dirty = lint_hook("Hey guys welcome back! In this video I will explain stuff")
        assert dirty.is_clean is False


# ---------------------------------------------------------------------------
# T2.6 — Comparison Service (enhanced)
# ---------------------------------------------------------------------------

class TestComparisonService:
    """T2.6 — Comparison service with close-result threshold logic."""

    def test_clear_winner(self):
        from backend.app.services.comparison import compare_two_hooks
        from backend.app.schemas.compare import CompareRequest
        req = CompareRequest(
            hook_a="You won't believe this 5-step secret nobody talks about",
            hook_b="Here is a tutorial"
        )
        result = compare_two_hooks(req)
        assert result.status == "success"
        assert result.verdict in ("Hook A leads", "Hook B leads", "Close result")
        assert result.disclaimer

    def test_close_result_when_similar(self):
        from backend.app.services.comparison import compare_two_hooks
        from backend.app.schemas.compare import CompareRequest
        # Both hooks are similar in structure — expect close result
        req = CompareRequest(
            hook_a="You need to know this 1 trick",
            hook_b="You should know this 1 secret"
        )
        result = compare_two_hooks(req)
        assert result.score_difference >= 0
        assert result.is_close_result == (result.score_difference <= 0.08)

    def test_response_has_all_fields(self):
        from backend.app.services.comparison import compare_two_hooks
        from backend.app.schemas.compare import CompareRequest
        req = CompareRequest(hook_a="Stop making these mistakes", hook_b="Why you fail at content")
        result = compare_two_hooks(req)
        assert result.hook_a.word_count > 0
        assert result.hook_b.word_count > 0
        assert isinstance(result.is_mock_model, bool)


# ---------------------------------------------------------------------------
# T2.7 — Analyze Endpoint (integration)
# ---------------------------------------------------------------------------

class TestAnalyzeEndpoint:
    """T2.7 — /api/analyze endpoint integration test."""

    def test_analyze_endpoint_success(self):
        from backend.app.api.analyze import analyze_hook_endpoint
        from backend.app.schemas.compare import AnalyzeRequest
        req = AnalyzeRequest(hook="You won't believe this 5-minute productivity hack")
        result = analyze_hook_endpoint(req)
        assert result.status == "success"
        assert result.predicted_class in ("Low", "Medium", "High")
        assert len(result.signals) > 0
        assert result.word_count > 0

    def test_analyze_returns_lint_data(self):
        from backend.app.api.analyze import analyze_hook_endpoint
        from backend.app.schemas.compare import AnalyzeRequest
        req = AnalyzeRequest(hook="In this video I'm going to explain Python")
        result = analyze_hook_endpoint(req)
        assert isinstance(result.lint_error_count, int)
        assert result.lint_error_count >= 1   # L001 should fire

    def test_analyze_disclaimer_present(self):
        from backend.app.api.analyze import analyze_hook_endpoint
        from backend.app.schemas.compare import AnalyzeRequest
        req = AnalyzeRequest(hook="Stop making these 3 coding mistakes")
        result = analyze_hook_endpoint(req)
        assert len(result.disclaimer) > 20

    def test_analyze_probabilities_sum_to_one(self):
        from backend.app.api.analyze import analyze_hook_endpoint
        from backend.app.schemas.compare import AnalyzeRequest
        req = AnalyzeRequest(hook="Why your content never goes viral")
        result = analyze_hook_endpoint(req)
        total = sum(result.probabilities.values())
        assert abs(total - 1.0) < 0.02
