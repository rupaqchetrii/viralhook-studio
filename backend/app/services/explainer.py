"""
explainer.py — Hook Feature Explainer Service
Produces plain-English feature breakdown for any hook text.
Day 2 — ViralHook Studio Backend
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List


# ---------------------------------------------------------------------------
# Data-classes
# ---------------------------------------------------------------------------

@dataclass
class FeatureSignal:
    """A single detected signal with a human-readable label and impact."""
    label: str
    value: str
    impact: str          # "positive" | "negative" | "neutral"
    tip: str             # actionable advice


@dataclass
class HookExplanation:
    """Full feature breakdown for one hook."""
    summary: str                        # 1-sentence plain-English verdict
    word_count: int
    char_count: int
    estimated_spoken_seconds: float     # word_count / 2.75 wps
    pacing_band: str                    # "sweet_spot" | "acceptable" | "too_long"
    pacing_label: str                   # human-readable band label
    has_direct_address: bool
    has_curiosity_trigger: bool
    has_number: bool
    has_question: bool
    has_negative_frame: bool
    has_power_word: bool
    readability_grade: float            # Flesch-Kincaid grade (approximate)
    signals: List[FeatureSignal] = field(default_factory=list)
    positive_count: int = 0
    negative_count: int = 0


# ---------------------------------------------------------------------------
# Vocabulary banks
# ---------------------------------------------------------------------------

DIRECT_ADDRESS = {
    "you", "your", "you're", "you've", "you'll", "yourself"
}

CURIOSITY_TRIGGERS = {
    "why", "how", "secret", "stop", "mistake", "mistakes", "never",
    "nobody", "reason", "don't", "hack", "trick", "truth", "revealed",
    "discover", "surprising", "actually", "real", "hidden", "unknown"
}

NEGATIVE_FRAME = {
    "mistake", "mistakes", "wrong", "stop", "never", "ruin", "broken",
    "fail", "failure", "bad", "terrible", "worst", "avoid", "dangerous"
}

POWER_WORDS = {
    "instantly", "fast", "quick", "immediately", "today", "now",
    "proven", "easy", "simple", "free", "best", "top", "ultimate",
    "complete", "essential", "must", "critical", "important"
}

QUESTION_OPENERS = {"what", "why", "how", "when", "who", "which", "can", "would", "do", "is", "are"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _count_syllables(word: str) -> int:
    """Very lightweight English syllable estimator."""
    word = word.lower().strip(".,!?;:'\"")
    if not word:
        return 0
    vowels = "aeiouy"
    count = 0
    prev_vowel = False
    for ch in word:
        if ch in vowels:
            if not prev_vowel:
                count += 1
            prev_vowel = True
        else:
            prev_vowel = False
    if word.endswith("e") and count > 1:
        count -= 1
    return max(1, count)


def _flesch_kincaid_grade(text: str) -> float:
    """
    Approximate Flesch-Kincaid Grade Level.
    FK Grade = 0.39 × (words/sentences) + 11.8 × (syllables/words) − 15.59
    For single-sentence hooks we treat the whole text as 1 sentence.
    """
    words = text.split()
    if not words:
        return 0.0
    syllables = sum(_count_syllables(w) for w in words)
    sentences = max(1, len(re.findall(r"[.!?]+", text)))
    asl = len(words) / sentences          # average sentence length
    asw = syllables / len(words)          # average syllables per word
    grade = 0.39 * asl + 11.8 * asw - 15.59
    return round(max(0.0, grade), 1)


def _pacing_band(spoken_secs: float) -> tuple[str, str]:
    """Return (band_key, human_label) for estimated speaking time."""
    if spoken_secs <= 2.8:
        return "sweet_spot", "🟢 Sweet Spot (immediate curiosity)"
    elif spoken_secs <= 4.2:
        return "acceptable", "🟡 Acceptable (ensure punchy delivery)"
    else:
        return "too_long", "🔴 High Drop-off Risk (> 4.2 s)"


# ---------------------------------------------------------------------------
# Main explainer function
# ---------------------------------------------------------------------------

def explain_hook(text: str) -> HookExplanation:
    """
    Analyses a single hook string and returns a full HookExplanation.
    Pure Python — no ML model required.
    """
    text = text.strip()
    lower = text.lower()
    words = text.split()
    lower_words = lower.split()
    word_set = set(lower_words)

    # --- Counts ---
    word_count = len(words)
    char_count = len(text)
    syllables = sum(_count_syllables(w) for w in words)

    # --- Pacing ---
    spoken_secs = round(word_count / 2.75, 2)
    band_key, band_label = _pacing_band(spoken_secs)

    # --- Boolean flags ---
    has_direct_address = bool(word_set & DIRECT_ADDRESS)
    has_curiosity_trigger = bool(word_set & CURIOSITY_TRIGGERS)
    has_number = bool(re.search(r"\b\d+\b", text))
    has_question = (
        text.rstrip().endswith("?") or
        (lower_words and lower_words[0] in QUESTION_OPENERS)
    )
    has_negative_frame = bool(word_set & NEGATIVE_FRAME)
    has_power_word = bool(word_set & POWER_WORDS)

    # --- Readability ---
    fk_grade = _flesch_kincaid_grade(text)

    # --- Build signal list ---
    signals: List[FeatureSignal] = []

    # Direct address
    if has_direct_address:
        signals.append(FeatureSignal(
            label="Direct Address",
            value="✅ Uses 'you/your'",
            impact="positive",
            tip="Good — directly speaking to the viewer boosts perceived relevance."
        ))
    else:
        signals.append(FeatureSignal(
            label="Direct Address",
            value="❌ No personal address",
            impact="negative",
            tip="Try adding 'you' or 'your' to make the hook feel personal."
        ))

    # Curiosity trigger
    if has_curiosity_trigger:
        signals.append(FeatureSignal(
            label="Curiosity Trigger",
            value="✅ Detected",
            impact="positive",
            tip="A curiosity gap or reveal word is present — great for retention."
        ))
    else:
        signals.append(FeatureSignal(
            label="Curiosity Trigger",
            value="❌ Not detected",
            impact="negative",
            tip="Add a curiosity word (why, secret, mistake, never) to spark intrigue."
        ))

    # Number / Specificity
    if has_number:
        signals.append(FeatureSignal(
            label="Specificity (Number)",
            value="✅ Contains a number",
            impact="positive",
            tip="Numbers signal a concrete promise — viewers trust specific claims."
        ))
    else:
        signals.append(FeatureSignal(
            label="Specificity (Number)",
            value="⚠️ No number found",
            impact="neutral",
            tip="Consider adding a number (e.g., '3 steps', '5 tools') for specificity."
        ))

    # Question
    if has_question:
        signals.append(FeatureSignal(
            label="Question Format",
            value="✅ Opens with a question",
            impact="positive",
            tip="Questions create open loops in the brain — strong for curiosity."
        ))

    # Negative framing
    if has_negative_frame:
        signals.append(FeatureSignal(
            label="Negative Frame / Loss Aversion",
            value="✅ Uses loss-aversion phrasing",
            impact="positive",
            tip="Negative framing (stop, mistake, never) activates loss-aversion bias."
        ))

    # Power words
    if has_power_word:
        signals.append(FeatureSignal(
            label="Power Word",
            value="✅ Power word detected",
            impact="positive",
            tip="Power words (fast, proven, essential) add urgency and credibility."
        ))

    # Pacing
    if band_key == "sweet_spot":
        signals.append(FeatureSignal(
            label="Speaking Pace",
            value=f"✅ ~{spoken_secs}s spoken",
            impact="positive",
            tip="Fits within the ideal 1.5–2.8 second opening window."
        ))
    elif band_key == "acceptable":
        signals.append(FeatureSignal(
            label="Speaking Pace",
            value=f"🟡 ~{spoken_secs}s spoken",
            impact="neutral",
            tip="Acceptable length — deliver it with punchy energy."
        ))
    else:
        signals.append(FeatureSignal(
            label="Speaking Pace",
            value=f"🔴 ~{spoken_secs}s spoken ({word_count} words)",
            impact="negative",
            tip=f"Too long — trim to under 12 words to stay under 4.2 seconds."
        ))

    # Readability
    if 4 <= fk_grade <= 7:
        signals.append(FeatureSignal(
            label="Readability (FK Grade)",
            value=f"✅ Grade {fk_grade} (optimal 4–7)",
            impact="positive",
            tip="Simple enough for instant comprehension during a scroll."
        ))
    elif fk_grade > 10:
        signals.append(FeatureSignal(
            label="Readability (FK Grade)",
            value=f"⚠️ Grade {fk_grade} (complex)",
            impact="negative",
            tip="Too complex for a 3-second hook — simplify vocabulary."
        ))
    else:
        signals.append(FeatureSignal(
            label="Readability (FK Grade)",
            value=f"🟡 Grade {fk_grade}",
            impact="neutral",
            tip="Readability is fair — aim for grade 4–7 for viral hooks."
        ))

    # --- Count positives/negatives ---
    positive_count = sum(1 for s in signals if s.impact == "positive")
    negative_count = sum(1 for s in signals if s.impact == "negative")

    # --- Build plain-English summary ---
    total_signals = len(signals)
    if positive_count >= 4:
        summary = (
            f"Strong hook with {positive_count}/{total_signals} positive signals. "
            f"Direct, specific, and curiosity-driven — well positioned for high engagement."
        )
    elif positive_count >= 2:
        summary = (
            f"Moderate hook with {positive_count}/{total_signals} positive signals. "
            f"Has some engagement markers but could be sharper."
        )
    else:
        summary = (
            f"Weak hook with only {positive_count}/{total_signals} positive signals. "
            f"Lacks direct address, curiosity, and specificity — consider a rewrite."
        )

    return HookExplanation(
        summary=summary,
        word_count=word_count,
        char_count=char_count,
        estimated_spoken_seconds=spoken_secs,
        pacing_band=band_key,
        pacing_label=band_label,
        has_direct_address=has_direct_address,
        has_curiosity_trigger=has_curiosity_trigger,
        has_number=has_number,
        has_question=has_question,
        has_negative_frame=has_negative_frame,
        has_power_word=has_power_word,
        readability_grade=fk_grade,
        signals=signals,
        positive_count=positive_count,
        negative_count=negative_count,
    )
