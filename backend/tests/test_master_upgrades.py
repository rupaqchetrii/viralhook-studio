"""
backend/tests/test_master_upgrades.py
Validates Day 3+ Master Upgrades (10/10 Vision):
1. 384-dimensional Transformer / Deep Semantic Embedding Analysis
2. Direct Social OAuth Integration & 1-Click Analytics Sync
"""
import pytest
from backend.app.services.deep_embeddings import embedding_engine
from backend.app.api.embeddings import analyze_embeddings_endpoint, EmbeddingAnalysisRequest
from backend.app.api.oauth import (
    list_accounts,
    connect_account,
    ConnectAccountRequest,
    sync_latest_channel_videos,
)


def test_embedding_engine_output_shape():
    text = "Stop scrolling if you code in Python, here are 5 critical mistakes."
    vec = embedding_engine.encode(text)
    assert vec.shape == (384,)
    # Normalized L2 length ~ 1.0
    norm = float(sum(x * x for x in vec) ** 0.5)
    assert abs(norm - 1.0) < 1e-3


def test_embedding_pair_analysis():
    hook_a = "Stop scrolling if you want to get hired in tech in 2026."
    hook_b = "Hello everyone, today I will talk about software engineer jobs."
    result = embedding_engine.analyze_pair(hook_a, hook_b, topic="Tech careers and coding tips")

    assert result["embedding_dimension"] == 384
    assert "cosine_similarity" in result
    assert "semantic_distance" in result
    assert "hook_a_metrics" in result
    assert "hook_b_metrics" in result
    # Hook A should have higher rhetorical tension because of 'Stop' and specificity
    assert result["hook_a_metrics"]["rhetorical_tension"] >= result["hook_b_metrics"]["rhetorical_tension"]


def test_embeddings_api_endpoint():
    req = EmbeddingAnalysisRequest(
        hook_a="Stop making these 3 mistakes with your portfolio",
        hook_b="Here are 3 portfolio tips that got me hired at Google",
        topic="Tech job search",
    )
    res = analyze_embeddings_endpoint(req)
    assert res.status == "success"
    assert res.embedding_dimension == 384
    assert 0.0 <= res.normalized_similarity_percent <= 100.0


def test_oauth_list_accounts():
    data = list_accounts()
    assert data["status"] == "success"
    assert data["count"] >= 1
    assert any(a["platform"] in ["TikTok", "Instagram"] for a in data["accounts"])


def test_oauth_connect_account():
    req = ConnectAccountRequest(
        platform="tiktok",
        handle="@test_creator_99",
        display_name="Test Creator",
        followers=54000,
    )
    res = connect_account(req)
    assert res["status"] == "connected"
    assert res["account"]["handle"] == "@test_creator_99"


def test_oauth_sync_latest_analytics():
    res = sync_latest_channel_videos()
    assert res["status"] == "synced"
    assert res["videos_imported"] >= 1
    assert len(res["synced_record_ids"]) >= 1
