"""
test_e2e_day3.py — ViralHook Studio Day 3 End-to-End & Edge-Case Test Suite
Validates:
1. Real ML model inference via PredictionGateway (T3.1)
2. Pairwise comparison under trained model (T3.2)
3. Close-result rule adherence (|P(High)_A - P(High)_B| <= 0.08)
4. Edge cases: identical hooks, emojis, symbols, extreme length, questions (T3.3)
"""
import pytest
from backend.app.services.prediction_gateway import gateway
from backend.app.services.comparison import compare_two_hooks
from backend.app.schemas.compare import CompareRequest, AnalyzeRequest
from backend.app.api.analyze import analyze_hook_endpoint
from backend.app.config import get_settings

settings = get_settings()


class TestDay3ModelIntegration:
    """T3.1 — Verify gateway is serving the real trained model, not heuristic."""

    def test_model_is_loaded(self):
        assert gateway.is_loaded is True
        assert gateway.model is not None

    def test_metadata_has_f1_score(self):
        meta = gateway.metadata
        assert "cv_macro_f1_mean" in meta
        assert meta["cv_macro_f1_mean"] >= 0.85
        assert meta["classes"] == ["Low", "Medium", "High"]

    def test_real_model_inference_flag(self):
        _, _, is_mock = gateway.predict_hook("Stop doing this right now or you will regret it")
        assert is_mock is False


class TestDay3PairwiseComparisons:
    """T3.2 — End-to-End comparison with the trained model."""

    def test_viral_vs_cliche_comparison(self):
        req = CompareRequest(
            hook_a="Stop making this #1 coding mistake before it ruins your career",
            hook_b="Hey guys welcome back to my channel today we will talk about programming"
        )
        res = compare_two_hooks(req)
        assert res.status == "success"
        assert res.leading_hook == "A"
        assert res.verdict == "Hook A leads"
        assert res.is_close_result is False
        assert res.hook_a.probabilities["High"] > res.hook_b.probabilities["High"]

    def test_close_result_decision_rule(self):
        # Two very similar phrasing hooks
        req = CompareRequest(
            hook_a="5 tips to improve your morning routine this week",
            hook_b="5 simple tips to improve your morning routine today"
        )
        res = compare_two_hooks(req)
        assert res.status == "success"
        diff = abs(res.hook_a.probabilities["High"] - res.hook_b.probabilities["High"])
        if diff <= settings.CLOSE_RESULT_MARGIN:
            assert res.is_close_result is True
            assert res.verdict == "Close result"
            assert res.leading_hook is None


class TestDay3EdgeCases:
    """T3.3 — Edge case robustness testing."""

    def test_identical_hooks_produce_close_result(self):
        text = "Why you are secretly failing at Python programming"
        req = CompareRequest(hook_a=text, hook_b=text)
        res = compare_two_hooks(req)
        assert res.status == "success"
        assert res.score_difference == 0.0
        assert res.is_close_result is True
        assert res.verdict == "Close result"
        assert res.leading_hook is None

    def test_emojis_in_hook(self):
        req = CompareRequest(
            hook_a="🔥🔥 This one AI trick will blow your mind 🚀",
            hook_b="General advice on artificial intelligence tools"
        )
        res = compare_two_hooks(req)
        assert res.status == "success"
        assert res.hook_a.predicted_class in ("Low", "Medium", "High")

    def test_punctuation_and_numbers(self):
        req = AnalyzeRequest(hook="Why 99% of creators fail in their first 30 days?!")
        res = analyze_hook_endpoint(req)
        assert res.status == "success"
        assert res.word_count > 0
        assert res.estimated_spoken_seconds > 0

    def test_maximum_allowed_length(self):
        # 280 chars max length
        hook_long = "Are you tired of wasting hours trying to figure out how to scale your startup? " * 3
        hook_long = hook_long[:280].strip()
        req = AnalyzeRequest(hook=hook_long)
        res = analyze_hook_endpoint(req)
        assert res.status == "success"
        assert res.word_count >= 20
        # Linter should flag excessive length
        assert any(i.rule_id == "L011" for i in res.lint_issues)

    def test_whitespace_rejection(self):
        with pytest.raises(ValueError):
            CompareRequest(hook_a="   ", hook_b="Valid hook text")
