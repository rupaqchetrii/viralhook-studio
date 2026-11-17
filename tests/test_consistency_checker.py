"""
Unit tests for Consistency Checker — Hook-to-Promise Semantic Alignment
Owner: Tanvir (Machine Learning & NLP Lead)

Day 2 Deliverable — validates:
  - Clickbait detection threshold (< 0.40)
  - Aligned hook passes threshold (>= 0.40)
  - Edge cases: empty inputs, identical text, very short text
  - Batch API
  - Score is bounded in [0, 1]
  - Verdict constants are correct
"""

import unittest
from ml.consistency_checker import (
    check_consistency,
    batch_check,
    THRESHOLD_CLICKBAIT,
    VERDICT_ALIGNED,
    VERDICT_CLICKBAIT,
    VERDICT_INSUFFICIENT,
)


class TestConsistencyCheckerThreshold(unittest.TestCase):
    """Core threshold and verdict logic."""

    def test_aligned_hook_passes_threshold(self):
        """
        An identical or near-identical hook/topic pair must pass the aligned threshold.
        The 0.40 threshold is validated with identical text (score = 1.0) and with a
        pair that shares all the same domain keywords verbatim.
        """
        # Verbatim repetition of the topic keywords in the hook guarantees TF-IDF cosine >= 0.40
        hook  = "budget saving money tips budget saving money every month"
        topic = "budget saving money tips and advice for personal finances."
        result = check_consistency(hook, topic)
        self.assertGreaterEqual(result["alignment_score"], THRESHOLD_CLICKBAIT)
        self.assertEqual(result["verdict"], VERDICT_ALIGNED)

    def test_clickbait_hook_flagged(self):
        """A hook completely unrelated to the topic should score < 0.40 and flag as clickbait."""
        hook  = "Hey guys welcome back to my channel"
        topic = "Advanced quantum computing research breakthroughs in 2026."
        result = check_consistency(hook, topic)
        self.assertLess(result["alignment_score"], THRESHOLD_CLICKBAIT)
        self.assertEqual(result["verdict"], VERDICT_CLICKBAIT)

    def test_identical_texts_score_is_one(self):
        """When hook and topic are identical, similarity must be 1.0."""
        text = "Stop making this mistake with your morning routine"
        result = check_consistency(text, text)
        self.assertAlmostEqual(result["alignment_score"], 1.0, places=2)
        self.assertEqual(result["verdict"], VERDICT_ALIGNED)

    def test_score_bounded_zero_to_one(self):
        """Alignment score must always be in [0, 1]."""
        cases = [
            ("Stop doing this now", "Learn productivity techniques."),
            ("The #1 secret nobody talks about", "Financial planning advice."),
            ("", ""),
            ("ok", "hi"),
        ]
        for hook, topic in cases:
            result = check_consistency(hook, topic)
            self.assertGreaterEqual(result["alignment_score"], 0.0,
                                    msg=f"Score below 0 for: hook={hook!r}")
            self.assertLessEqual(result["alignment_score"],   1.0,
                                 msg=f"Score above 1 for: hook={hook!r}")

    def test_threshold_constant_value(self):
        """Faculty-approved clickbait guard threshold must remain 0.40."""
        self.assertAlmostEqual(THRESHOLD_CLICKBAIT, 0.40, places=5)


class TestConsistencyCheckerEdgeCases(unittest.TestCase):
    """Empty, short, and malformed inputs."""

    def test_empty_hook_returns_insufficient(self):
        result = check_consistency("", "Some topic about cooking.")
        self.assertEqual(result["verdict"], VERDICT_INSUFFICIENT)
        self.assertEqual(result["alignment_score"], 0.0)

    def test_empty_topic_returns_insufficient(self):
        result = check_consistency("Why you should stop doing this", "")
        self.assertEqual(result["verdict"], VERDICT_INSUFFICIENT)
        self.assertEqual(result["alignment_score"], 0.0)

    def test_both_empty_returns_insufficient(self):
        result = check_consistency("", "")
        self.assertEqual(result["verdict"], VERDICT_INSUFFICIENT)

    def test_very_short_texts_return_insufficient(self):
        result = check_consistency("hi", "ok")
        self.assertEqual(result["verdict"], VERDICT_INSUFFICIENT)

    def test_whitespace_only_returns_insufficient(self):
        result = check_consistency("   ", "   ")
        self.assertEqual(result["verdict"], VERDICT_INSUFFICIENT)

    def test_none_like_handling(self):
        """None values should not raise; return insufficient_data."""
        result = check_consistency(None, None)
        self.assertEqual(result["verdict"], VERDICT_INSUFFICIENT)


class TestConsistencyCheckerOutput(unittest.TestCase):
    """Response format and field validation."""

    def test_response_has_required_keys(self):
        result = check_consistency(
            "Stop scrolling if you code in Python",
            "Common Python mistakes to avoid."
        )
        for key in ("alignment_score", "verdict", "explanation", "method"):
            self.assertIn(key, result, msg=f"Missing key: {key}")

    def test_method_is_tfidf_when_no_dense(self):
        """Default call should use 'tfidf' method (use_dense=False)."""
        result = check_consistency(
            "The real reason your hooks fail",
            "Improving video hook performance.",
            use_dense=False,
        )
        self.assertEqual(result["method"], "tfidf")

    def test_explanation_is_non_empty_string(self):
        result = check_consistency(
            "Why you should never skip this morning habit",
            "Productivity morning routine tips."
        )
        self.assertIsInstance(result["explanation"], str)
        self.assertGreater(len(result["explanation"]), 10)

    def test_verdict_is_string(self):
        result = check_consistency("Hook text here", "Topic text here.")
        self.assertIn(result["verdict"],
                      {VERDICT_ALIGNED, VERDICT_CLICKBAIT, VERDICT_INSUFFICIENT})


class TestBatchCheck(unittest.TestCase):
    """Batch API — batch_check()."""

    def test_batch_returns_correct_length(self):
        pairs = [
            ("The secret to viral growth revealed", "Social media growth strategies."),
            ("Hey guys welcome back", "Quantum physics lecture notes."),
            ("Stop making this mistake with your budget", "Personal finance tips."),
        ]
        results = batch_check(pairs)
        self.assertEqual(len(results), len(pairs))

    def test_batch_all_results_are_dicts(self):
        pairs = [
            ("How I got 1M views in 30 days", "Content creation tips."),
            ("", ""),
        ]
        results = batch_check(pairs)
        for r in results:
            self.assertIsInstance(r, dict)

    def test_batch_empty_list_returns_empty(self):
        self.assertEqual(batch_check([]), [])

    def test_batch_single_pair(self):
        results = batch_check([("Stop doing this now", "Productivity improvements.")])
        self.assertEqual(len(results), 1)
        self.assertIn("alignment_score", results[0])


class TestAlignmentScoreSemantics(unittest.TestCase):
    """
    Directional expectation tests — well-matched hooks score HIGHER
    than deliberately mismatched ones.
    """

    def test_matched_pair_scores_higher_than_mismatched(self):
        matched_hook   = "The best morning habits to boost your productivity every day"
        matched_topic  = "Morning productivity habits and routines."

        mismatch_hook  = "Hey guys, welcome back to my channel today"
        mismatch_topic = "Advanced quantum mechanics and subatomic particle theory."

        matched_score   = check_consistency(matched_hook,  matched_topic)["alignment_score"]
        mismatch_score  = check_consistency(mismatch_hook, mismatch_topic)["alignment_score"]

        self.assertGreater(
            matched_score,
            mismatch_score,
            msg=(
                f"Expected matched ({matched_score}) > mismatched ({mismatch_score}). "
                "Semantic alignment ordering violated."
            ),
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
