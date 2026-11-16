import pytest
from pydantic import ValidationError
from backend.app.schemas.compare import CompareRequest
from backend.app.services.comparison import compare_two_hooks
from backend.app.api.compare import compare_hooks_endpoint
from backend.app.main import health_check


def test_health_check_endpoint():
    result = health_check()
    assert result["status"] == "healthy"
    assert "version" in result
    assert result["close_result_margin"] == 0.08
    assert result["inference_mode"] in ["trained_model", "heuristic_fallback"]


def test_compare_endpoint_hook_a_leads():
    payload = CompareRequest(
        hook_a="Stop scrolling if you code in Python, here are 5 critical mistakes.",
        hook_b="Hello everyone today in this video I will discuss some programming errors."
    )
    res = compare_hooks_endpoint(payload)
    assert res.status == "success"
    assert res.verdict == "Hook A leads"
    assert res.leading_hook == "A"
    assert res.is_close_result is False
    assert res.score_difference > 0.08
    assert "disclaimer" in res.model_dump()


def test_compare_endpoint_close_result():
    # Two identical hooks must yield score difference = 0.0 <= 0.08 -> Close result
    payload = CompareRequest(
        hook_a="Here are 5 mistakes Python devs make.",
        hook_b="Here are 5 mistakes Python devs make."
    )
    res = compare_hooks_endpoint(payload)
    assert res.status == "success"
    assert res.is_close_result is True
    assert res.verdict == "Close result"
    assert res.leading_hook is None
    assert "within the project's 8%" in res.explanation


def test_empty_input_validation():
    with pytest.raises(ValidationError):
        CompareRequest(hook_a="   ", hook_b="Valid text")

    with pytest.raises(ValidationError):
        CompareRequest(hook_a="Valid text", hook_b="")
