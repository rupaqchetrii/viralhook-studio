"""
test_advanced_features.py — Comprehensive Test Suite for Master Blueprint Pillars
Tests direct synchronous function calls (avoiding Starlette TestClient / anyio conflicts on Windows).
"""
import pytest
from backend.app.database import (
    save_battle_record,
    get_all_battles,
    log_creator_outcome,
    get_creator_analytics,
)
from backend.app.api.history_db import (
    SaveBattleRequest,
    OutcomeRequest,
    get_history_endpoint,
    save_history_endpoint,
    log_outcome_endpoint,
    get_analytics_endpoint,
)
from backend.app.api.ingest import (
    IngestUrlRequest,
    ingest_social_url_endpoint,
)


class TestDatabasePillars:
    """Tests SQLite database persistence, analytics, and feedback loop."""

    def test_save_and_retrieve_battle(self):
        sample = {
            "hook_a": "Why you are secretly failing at Python programming",
            "hook_b": "Here is a beginner Python tutorial for beginners",
            "verdict": "Hook A leads",
            "leading_hook": "A",
            "score_difference": 0.55,
            "is_close_result": False,
            "prob_a": {"Low": 0.05, "Medium": 0.15, "High": 0.80},
            "prob_b": {"Low": 0.70, "Medium": 0.20, "High": 0.10},
        }
        battle_id = save_battle_record(sample)
        assert battle_id is not None
        assert battle_id.startswith("battle_")

        battles = get_all_battles(limit=5)
        assert len(battles) > 0
        latest = battles[0]
        assert "hook_a" in latest
        assert "prob_a" in latest

    def test_history_endpoints(self):
        req = SaveBattleRequest(
            hook_a="3 simple habits that double productivity",
            hook_b="General productivity tips",
            verdict="Hook A leads",
            leading_hook="A",
            score_difference=0.45,
            is_close_result=False,
            prob_a={"Low": 0.05, "Medium": 0.15, "High": 0.80},
            prob_b={"Low": 0.60, "Medium": 0.30, "High": 0.10},
        )
        res = save_history_endpoint(req)
        assert res["status"] == "success"
        assert "battle_id" in res

        hist = get_history_endpoint(limit=5)
        assert hist["status"] == "success"
        assert len(hist["history"]) >= 1

    def test_log_creator_outcome_and_analytics(self):
        sample = {
            "hook_a": "3 habits that doubled my productivity",
            "hook_b": "Productivity advice for developers",
            "verdict": "Hook A leads",
            "score_difference": 0.40,
            "prob_a": {"High": 0.85},
            "prob_b": {"High": 0.45},
        }
        battle_id = save_battle_record(sample)

        outcome_req = OutcomeRequest(
            battle_id=battle_id,
            chosen_hook="3 habits that doubled my productivity",
            views_48h=85000,
            likes=6500,
            shares=920,
            avg_watch_time_sec=18.5,
            actual_tier="High",
            predicted_tier="High",
            creator_notes="Hook performed exceptionally well on TikTok feed."
        )
        outcome_res = log_outcome_endpoint(outcome_req)
        assert outcome_res["status"] == "success"
        assert "outcome_id" in outcome_res

        analytics = get_analytics_endpoint()
        assert analytics["status"] == "success"
        a = analytics["analytics"]
        assert a["database_status"] == "connected"
        assert a["total_battles_tested"] >= 1
        assert a["recorded_outcomes"] >= 1
        assert a["prediction_accuracy_percent"] > 0


class TestSocialIngestionPillars:
    """Tests live social media URL ingestion for TikTok, Reels, Shorts."""

    def test_tiktok_url_ingestion(self):
        req = IngestUrlRequest(url="https://www.tiktok.com/@techcreator/video/7234567890123456789")
        data = ingest_social_url_endpoint(req)
        assert data.status == "success"
        assert data.detected_platform == "tiktok"
        assert "@techcreator" in data.creator_handle
        assert len(data.extracted_hook) > 5
        assert data.platform_benchmarks["target_pacing_sec"] == 2.5

    def test_reels_url_ingestion(self):
        req = IngestUrlRequest(url="https://www.instagram.com/reel/C3abc123DEF/")
        data = ingest_social_url_endpoint(req)
        assert data.status == "success"
        assert data.detected_platform == "reels"
        assert len(data.recommendations) > 0

    def test_shorts_url_ingestion(self):
        req = IngestUrlRequest(url="https://www.youtube.com/shorts/dQw4w9WgXcQ")
        data = ingest_social_url_endpoint(req)
        assert data.status == "success"
        assert data.detected_platform == "shorts"
        assert data.platform_benchmarks["target_pacing_sec"] == 2.8
