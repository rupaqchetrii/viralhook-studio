"""
ViralHook Studio - 24 Psycholinguistic & Structural Feature Extractor
Owner: Tanvir (Machine Learning & NLP Lead)

Calculates 24 deterministic features from video opening hook text:
1. duration_seconds (words / 2.75 wps)
2. word_count
3. char_count
4. avg_word_length
5. syllable_count
6. syllable_density
7. pacing_zone_is_green (t <= 3.0s)
8. pacing_zone_is_red (t > 4.5s)
9. flesch_reading_ease
10. flesch_kincaid_grade
11. direct_address_count (you, your, u)
12. has_direct_address
13. curiosity_gap_score
14. has_curiosity_gap
15. is_question
16. question_count
17. exclamation_count
18. ellipsis_count
19. has_ellipsis
20. has_digit
21. digit_count
22. has_superlative
23. has_negative_hook
24. power_words_count
"""

import re
import math
from typing import Dict, Any, List

# Conversational tempo standard for short-form video (words per second)
WORDS_PER_SECOND = 2.75

# Curated Lexicons
DIRECT_ADDRESS_TOKENS = {
    "you", "your", "yours", "yourself", "yourselves", "u", "ur"
}

CURIOSITY_PATTERNS = [
    r"\bthe secret to\b",
    r"\bwhy (you should|nobody|never|most people)\b",
    r"\bwhat happens when\b",
    r"\bnobody is talking about\b",
    r"\bnobody talks about\b",
    r"\bthe truth about\b",
    r"\bthe real reason\b",
    r"\bthis is why\b",
    r"\bstop doing this\b",
    r"\bhere is how to\b",
    r"\bhere's how to\b",
    r"\bif you want to\b",
    r"\bhow i got\b",
    r"\bhow to actually\b",
    r"\bthe #?1 mistake\b",
    r"\bi tried .* so you don't have to\b"
]

SUPERLATIVES = {
    "best", "worst", "fastest", "easiest", "biggest", "greatest", "smartest",
    "quickest", "cheapest", "simplest", "deadliest", "ultimate", "insane"
}

NEGATIVE_HOOK_WORDS = {
    "stop", "never", "don't", "dont", "quit", "ruin", "mistake", "wrong",
    "avoid", "worst", "waste", "danger", "toxic", "scam", "illegal", "kill"
}

POWER_WORDS = {
    "secret", "hack", "shocking", "proven", "banned", "genius", "revealed",
    "insane", "effortless", "instantly", "formula", "blueprint", "unlock",
    "hidden", "stealth", "master", "cheat", "viral", "uncovered", "glitch"
}

CLICHE_PATTERNS = [
    r"\bin this video (i will|i'm going to|we will)\b",
    r"\bhey guys\b",
    r"\bwelcome back to\b",
    r"\btoday we are going to\b",
    r"\bmake sure to (like|subscribe|follow)\b",
    r"\bso basically\b"
]


def count_syllables_word(word: str) -> int:
    """Estimates syllable count using vowel clusters and standard English phonetics."""
    word = word.lower().strip()
    if not word:
        return 0
    # Strip non-alphabet characters
    word = re.sub(r'[^a-z]', '', word)
    if not word:
        return 1

    # Simple phonetic rules
    if len(word) <= 3:
        return 1

    # Count vowel groups
    vowels = "aeiouy"
    num_vowels = len(re.findall(r'[aeiouy]+', word))

    # Adjust for silent 'e' at end
    if word.endswith('e') and not word.endswith('le') and num_vowels > 1:
        num_vowels -= 1

    return max(1, num_vowels)


def extract_features(text: str) -> Dict[str, float]:
    """
    Extracts all 24 psycholinguistic and structural features from a hook string.
    Returns a dictionary mapping feature names to numerical float values.
    """
    cleaned = (text or "").strip()
    words = re.findall(r"\b[A-Za-z0-9']+\b", cleaned)
    word_count = len(words)
    char_count = len(cleaned)

    # 1. Pacing & Duration
    duration_seconds = round(word_count / WORDS_PER_SECOND, 3) if word_count > 0 else 0.0
    avg_word_length = round(char_count / word_count, 3) if word_count > 0 else 0.0

    syllable_count = sum(count_syllables_word(w) for w in words)
    syllable_density = round(syllable_count / word_count, 3) if word_count > 0 else 0.0

    pacing_zone_is_green = 1.0 if (0 < duration_seconds <= 3.0) else 0.0
    pacing_zone_is_red = 1.0 if (duration_seconds > 4.5) else 0.0

    # 2. Readability Metrics
    # Approximate sentence count (at least 1 if non-empty)
    sentences = max(1, len(re.split(r'[.!?]+', cleaned)) - 1 if cleaned else 1)
    words_per_sentence = word_count / sentences if word_count > 0 else 0.0
    syllables_per_word = syllable_count / word_count if word_count > 0 else 0.0

    # Flesch Reading Ease: 206.835 - 1.015 * (words/sentence) - 84.6 * (syllables/word)
    if word_count > 0:
        fre = 206.835 - (1.015 * words_per_sentence) - (84.6 * syllables_per_word)
        flesch_reading_ease = round(max(0.0, min(100.0, fre)), 2)
        # Flesch-Kincaid Grade Level: 0.39 * (words/sentence) + 11.8 * (syllables/word) - 15.59
        fkgl = (0.39 * words_per_sentence) + (11.8 * syllables_per_word) - 15.59
        flesch_kincaid_grade = round(max(0.0, min(20.0, fkgl)), 2)
    else:
        flesch_reading_ease = 0.0
        flesch_kincaid_grade = 0.0

    # 3. Psycholinguistic & Curiosity Signals
    lower_text = cleaned.lower()
    lower_words = [w.lower() for w in words]

    # Direct address
    direct_address_count = float(sum(1 for w in lower_words if w in DIRECT_ADDRESS_TOKENS))
    has_direct_address = 1.0 if direct_address_count > 0 else 0.0

    # Curiosity loops
    curiosity_matches = sum(1 for pat in CURIOSITY_PATTERNS if re.search(pat, lower_text))
    curiosity_gap_score = round(min(1.0, curiosity_matches * 0.5), 2)
    has_curiosity_gap = 1.0 if curiosity_gap_score > 0 else 0.0

    # Questions
    has_question_mark = "?" in cleaned
    starts_question_word = bool(re.match(r"^(why|how|what|can|is|do|did|are|would|will|should|could)\b", lower_text))
    is_question = 1.0 if (has_question_mark or starts_question_word) else 0.0
    question_count = float(cleaned.count("?"))

    # Punctuation & Cliffhangers
    exclamation_count = float(cleaned.count("!"))
    ellipsis_count = float(len(re.findall(r"\.{2,}|…", cleaned)))
    has_ellipsis = 1.0 if ellipsis_count > 0 else 0.0

    # 4. Lexical Specificity & Hooks
    digits = re.findall(r"\d+", cleaned)
    digit_count = float(len(digits))
    has_digit = 1.0 if digit_count > 0 else 0.0

    has_superlative = 1.0 if any(w in SUPERLATIVES for w in lower_words) else 0.0
    has_negative_hook = 1.0 if any(w in NEGATIVE_HOOK_WORDS for w in lower_words) else 0.0
    power_words_count = float(sum(1 for w in lower_words if w in POWER_WORDS))

    # Return exactly 24 features in fixed deterministic order
    return {
        "duration_seconds": float(duration_seconds),
        "word_count": float(word_count),
        "char_count": float(char_count),
        "avg_word_length": float(avg_word_length),
        "syllable_count": float(syllable_count),
        "syllable_density": float(syllable_density),
        "pacing_zone_is_green": float(pacing_zone_is_green),
        "pacing_zone_is_red": float(pacing_zone_is_red),
        "flesch_reading_ease": float(flesch_reading_ease),
        "flesch_kincaid_grade": float(flesch_kincaid_grade),
        "direct_address_count": float(direct_address_count),
        "has_direct_address": float(has_direct_address),
        "curiosity_gap_score": float(curiosity_gap_score),
        "has_curiosity_gap": float(has_curiosity_gap),
        "is_question": float(is_question),
        "question_count": float(question_count),
        "exclamation_count": float(exclamation_count),
        "ellipsis_count": float(ellipsis_count),
        "has_ellipsis": float(has_ellipsis),
        "has_digit": float(has_digit),
        "digit_count": float(digit_count),
        "has_superlative": float(has_superlative),
        "has_negative_hook": float(has_negative_hook),
        "power_words_count": float(power_words_count)
    }


FEATURE_NAMES = list(extract_features("Test hook").keys())
assert len(FEATURE_NAMES) == 24, f"Expected exactly 24 features, got {len(FEATURE_NAMES)}"


def extract_features_vector(text: str) -> List[float]:
    """Returns the 24 features as an ordered float list ready for ML models."""
    feats = extract_features(text)
    return [feats[name] for name in FEATURE_NAMES]
