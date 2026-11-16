# API Contract & Schema Specification (v1)

Base URL: `http://localhost:8000/api/v1`

---

## 1. Single Hook Analysis: `POST /api/v1/analyze`
Analyzes a single opening line across psycholinguistic dimensions, spoken duration, and engagement probability.

### Request Body
```json
{
  "hook_text": "Stop scrolling if you write code in Python.",
  "platform": "reels",
  "niche": "tech_code",
  "intended_audience": "junior developers",
  "video_topic_summary": "Five common Python memory management mistakes"
}
```

### Response Body (200 OK)
```json
{
  "status": "success",
  "model_version": "v1.0.0-dual-tower",
  "model_checksum": "a7f3b9c8...",
  "spoken_pacing": {
    "estimated_seconds": 2.2,
    "word_count": 8,
    "syllables_per_word": 1.25,
    "pace_zone": "optimal"
  },
  "psychological_triggers": {
    "archetype": "Negative Urgency / Direct Challenge",
    "curiosity_gap_score": 0.82,
    "direct_address": true,
    "urgency_markers": ["Stop scrolling"],
    "specificity_score": 0.75
  },
  "linter_diagnostics": [
    {
      "phrase": "Stop scrolling",
      "type": "warning",
      "reason": "Overused pattern on some platforms; strong in tech, but can fatigue general feeds.",
      "suggested_replacements": ["If you write Python, watch this", "Most Python devs don't know this"]
    }
  ],
  "hook_to_promise_alignment": {
    "score": 0.88,
    "verdict": "aligned",
    "explanation": "Hook directly matches the stated topic of Python coding."
  },
  "engagement_prediction": {
    "predicted_class": "high",
    "calibrated_probabilities": {
      "low": 0.12,
      "medium": 0.28,
      "high": 0.60
    },
    "confidence_margin": "solid"
  }
}
```

---

## 2. A/B Hook Battle Comparison: `POST /api/v1/compare`
Compares Hook A and Hook B side by side with Minimum Significant Margin (MSM) enforcement.

### Request Body
```json
{
  "platform": "tiktok",
  "niche": "tech_code",
  "hook_a": "Here are 5 mistakes beginner programmers make.",
  "hook_b": "You're probably making this Python mistake without knowing it."
}
```

### Response Body (200 OK)
```json
{
  "status": "success",
  "comparison_summary": {
    "verdict": "model_estimated_lead",
    "lead_hook": "B",
    "probability_delta": 0.22,
    "is_statistically_significant": true,
    "lead_reasons": [
      "Hook B utilizes direct address ('You're') creating immediate self-relevance.",
      "Hook B introduces a curiosity gap ('without knowing it')."
    ]
  },
  "hook_a_results": { "...": "..." },
  "hook_b_results": { "...": "..." },
  "side_by_side_matrix": {
    "pacing": { "A": "2.1s (optimal)", "B": "2.8s (optimal)" },
    "readability_grade": { "A": 5.2, "B": 4.8 },
    "curiosity_score": { "A": 0.45, "B": 0.85 }
  }
}
```
*(Note: If `probability_delta < 0.08`, `verdict` returns `statistical_dead_heat` and no winner is declared).*

