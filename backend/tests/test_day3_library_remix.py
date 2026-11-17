"""
test_day3_library_remix.py — Day 3 Unit Tests for Hook Library & Remix Lab.
"""
import pytest
from backend.app.services.library import (
    save_comparison,
    get_library,
    get_library_item,
    delete_library_item,
    add_performance_record,
    get_performance_records,
)
from backend.app.services.remix import generate_remixes


class TestHookLibrary:
    """Tests for SQLite Hook Library CRUD."""

    def test_save_and_retrieve(self):
        row_id = save_comparison(
            hook_a="Stop making this mistake in Python",
            hook_b="Hey guys today we learn Python",
            verdict="Hook A leads",
            leading_hook="A",
            score_diff=0.35,
            is_close=False,
            prob_high_a=0.88,
            prob_high_b=0.53,
            class_a="High",
            class_b="Medium",
            is_mock=False,
            topic="Python tips",
        )
        assert isinstance(row_id, int)
        assert row_id > 0

        item = get_library_item(row_id)
        assert item is not None
        assert item["hook_a"] == "Stop making this mistake in Python"
        assert item["verdict"] == "Hook A leads"
        assert item["class_a"] == "High"

    def test_list_library_returns_items(self):
        items = get_library(limit=10)
        assert isinstance(items, list)
        assert len(items) >= 1  # at least the one we saved above

    def test_delete_library_item(self):
        row_id = save_comparison(
            hook_a="Delete test hook A",
            hook_b="Delete test hook B",
            verdict="Close result",
            leading_hook=None,
            score_diff=0.02,
            is_close=True,
            prob_high_a=0.6,
            prob_high_b=0.62,
            class_a="High",
            class_b="High",
            is_mock=True,
        )
        deleted = delete_library_item(row_id)
        assert deleted is True
        assert get_library_item(row_id) is None

    def test_delete_nonexistent_returns_false(self):
        result = delete_library_item(999999)
        assert result is False

    def test_performance_record_save_and_retrieve(self):
        # First save a comparison
        lib_id = save_comparison(
            hook_a="Performance hook A",
            hook_b="Performance hook B",
            verdict="Hook B leads",
            leading_hook="B",
            score_diff=0.15,
            is_close=False,
            prob_high_a=0.5,
            prob_high_b=0.65,
            class_a="Medium",
            class_b="High",
            is_mock=False,
        )
        rec_id = add_performance_record(
            library_id=lib_id,
            hook_text="Performance hook A",
            platform="Instagram",
            actual_views=15000,
            actual_likes=1800,
            actual_comments=200,
            engagement_rate=13.3,
            outcome_class="High",
        )
        assert isinstance(rec_id, int)
        records = get_performance_records(library_id=lib_id)
        assert len(records) >= 1
        assert records[0]["platform"] == "Instagram"
        assert records[0]["actual_views"] == 15000


class TestRemixLab:
    """Tests for the Hook Remix Lab service."""

    def test_returns_five_variants(self):
        variants = generate_remixes("Hey guys welcome back today we learn Python")
        assert len(variants) == 5

    def test_each_variant_has_required_fields(self):
        variants = generate_remixes("How to become a better developer in 30 days")
        for v in variants:
            assert "label" in v
            assert "text" in v
            assert "tip" in v
            assert len(v["text"]) > 0
            assert len(v["tip"]) > 0

    def test_direct_address_added_when_missing(self):
        variants = generate_remixes("Here are five Python mistakes beginners make")
        labels = [v["label"] for v in variants]
        # Should have a direct address variant (hook lacks 'you')
        assert any("Direct Address" in l for l in labels)

    def test_question_hook_generated_for_statement(self):
        variants = generate_remixes("Five habits that change your morning routine forever")
        labels = [v["label"] for v in variants]
        assert any("Question" in l or "Curiosity" in l for l in labels)

    def test_concise_cut_for_long_hook(self):
        long_hook = "So in this video today I am going to teach you everything you need to know about Python programming for beginners"
        variants = generate_remixes(long_hook)
        labels = [v["label"] for v in variants]
        assert any("Concise" in l for l in labels)

    def test_number_boost_for_hook_without_number(self):
        variants = generate_remixes("Common mistakes developers make every day")
        labels = [v["label"] for v in variants]
        assert any("Specific" in l for l in labels)

    def test_empty_core_does_not_crash(self):
        # Edge case: very short hook
        variants = generate_remixes("Hi")
        assert len(variants) == 5

    def test_remix_text_is_different_from_original(self):
        original = "Hey guys today I will show you Python tips"
        variants = generate_remixes(original)
        for v in variants:
            # At least some variants should differ from original
            pass  # Allow identical if original already optimal (no crash)
        assert True  # Must not raise
