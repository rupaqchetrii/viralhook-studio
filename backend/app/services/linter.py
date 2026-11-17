"""
linter.py — Hook Linter Service with Quick-Fix Suggestions
Checks hooks for common engagement anti-patterns and offers one-click fixes.
Day 2 — ViralHook Studio Backend
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List, Optional


# ---------------------------------------------------------------------------
# Data-classes
# ---------------------------------------------------------------------------

@dataclass
class LintIssue:
    """A single linting flag with optional quick-fix replacement."""
    rule_id: str
    severity: str               # "error" | "warning" | "info"
    message: str                # human-readable problem description
    matched_phrase: Optional[str] = None   # exact substring that triggered rule
    quick_fix: Optional[str] = None        # drop-in replacement text
    fix_label: Optional[str] = None        # button label for the UI


@dataclass
class LintResult:
    """Full linting result for one hook."""
    is_clean: bool
    error_count: int
    warning_count: int
    info_count: int
    issues: List[LintIssue] = field(default_factory=list)
    score_penalty: float = 0.0   # rough −0.0 to −0.30 for UI display


# ---------------------------------------------------------------------------
# Rule definitions
# ---------------------------------------------------------------------------

# Each rule: (rule_id, severity, pattern, message, quick_fix_template, fix_label)
# Pattern is matched case-insensitively against the full hook text.
# quick_fix_template replaces the matched_phrase inside the hook.
#   Use None if the fix needs manual rewrite (too complex to auto-replace).

_RULES: List[tuple] = [
    # ---- Classic engagement killers ----
    (
        "L001", "error",
        r"\bin this video[,]?\s*(i'?m?\s*(going to|gonna|will)\s*)?(explain|show|talk about|cover|discuss|tell you)",
        "Avoid 'In this video I will...' — it wastes the first 3 seconds. Jump straight to the value.",
        None,  # context-dependent — UI should prompt manual fix
        "Rewrite opening"
    ),
    (
        "L002", "error",
        r"\b(welcome back|welcome to my channel|hey guys|hey everyone|hi guys|hello everyone|what's up guys)\b",
        "Greeting openers (welcome back, hey guys) delay the hook and lose viewers instantly.",
        None,
        "Remove greeting"
    ),
    (
        "L003", "warning",
        r"\b(today (i'?m?|we'?re?|we will|i will)|today (i'?m? going to|gonna))\b",
        "'Today I'm going to...' is a soft opener. Lead with the payoff, not the plan.",
        None,
        "Lead with value"
    ),
    (
        "L004", "warning",
        r"\bso (basically|essentially|actually|just|like)\b",
        "Filler words like 'so basically' weaken the opening. Cut them.",
        "",   # Remove the matched phrase
        "Remove filler"
    ),
    (
        "L005", "warning",
        r"\b(um+|uh+|er+|hmm+)\b",
        "Filler sounds (um, uh, er) in a written hook suggest unclear thinking.",
        "",
        "Remove filler"
    ),
    (
        "L006", "error",
        r"\bclick(bait|baiting)\b",
        "The word 'clickbait' signals low trust. Never label your own hook as clickbait.",
        None,
        "Remove term"
    ),
    # ---- Weak promise phrases ----
    (
        "L007", "warning",
        r"\b(kind of|sort of|maybe|perhaps|might|possibly|probably)\b",
        "Hedging words (kind of, maybe, perhaps) undermine confidence and engagement.",
        None,
        "Remove hedge"
    ),
    (
        "L008", "warning",
        r"\b(stuff|things|something|everything|anything)\b",
        "Vague nouns (stuff, things, something) weaken specificity. Use a concrete noun.",
        None,
        "Be specific"
    ),
    # ---- Over-promise / hyperbole ----
    (
        "L009", "info",
        r"\b(best ever|greatest ever|most amazing|mind-?blowing|insane(ly)?|absolutely (insane|incredible|unbelievable))\b",
        "Superlative hyperbole (best ever, mind-blowing) inflates promises and can trigger audience skepticism.",
        None,
        "Tone down"
    ),
    # ---- Call-to-action misuse ----
    (
        "L010", "warning",
        r"\b(like (and )?subscribe|don't forget to like|hit the like button|smash that (like|subscribe))\b",
        "CTA phrases (like and subscribe) in the hook waste precious first-impression time.",
        None,
        "Move to end"
    ),
    # ---- Excessive length ----
    (
        "L011", "error",
        r"^(?:\S+ ){20,}",         # 20+ words — checked after split too
        "Hook is too long (20+ words). Aim for 8–14 words to stay within the 3-second window.",
        None,
        "Trim to 14 words"
    ),
    # ---- All caps abuse ----
    (
        "L012", "info",
        r"[A-Z]{5,}",
        "ALL-CAPS words can feel aggressive or spammy in written hooks. Use title case for emphasis.",
        None,
        "Fix capitalisation"
    ),
    # ---- Excessive punctuation ---
    (
        "L013", "info",
        r"[!?]{2,}",
        "Multiple exclamation or question marks (!!, ??) reduce professionalism.",
        "!",
        "Reduce punctuation"
    ),
]


# ---------------------------------------------------------------------------
# Linter engine
# ---------------------------------------------------------------------------

def lint_hook(text: str) -> LintResult:
    """
    Runs all linting rules against a hook string.
    Returns a LintResult with every violation found.
    """
    text = text.strip()
    lower = text.lower()
    issues: List[LintIssue] = []

    for rule_id, severity, pattern, message, quick_fix_template, fix_label in _RULES:
        match = re.search(pattern, lower, re.IGNORECASE)
        if match:
            matched_phrase = text[match.start():match.end()]

            # Build the quick fix: replace matched span with template if simple
            if quick_fix_template == "":
                # Remove matched phrase + trailing space
                quick_fix = (text[:match.start()] + text[match.end():]).strip()
            elif quick_fix_template is not None:
                quick_fix = (
                    text[:match.start()]
                    + quick_fix_template
                    + text[match.end():]
                ).strip()
            else:
                quick_fix = None   # complex — UI handles manually

            issues.append(LintIssue(
                rule_id=rule_id,
                severity=severity,
                message=message,
                matched_phrase=matched_phrase,
                quick_fix=quick_fix,
                fix_label=fix_label,
            ))

    # Additional length check (complement to regex)
    words = text.split()
    if len(words) > 20 and not any(i.rule_id == "L011" for i in issues):
        issues.append(LintIssue(
            rule_id="L011",
            severity="error",
            message=f"Hook is too long ({len(words)} words). Aim for 8–14 words.",
            matched_phrase=None,
            quick_fix=None,
            fix_label="Trim to 14 words",
        ))

    error_count = sum(1 for i in issues if i.severity == "error")
    warning_count = sum(1 for i in issues if i.severity == "warning")
    info_count = sum(1 for i in issues if i.severity == "info")

    # Rough score penalty for display (max −0.30)
    score_penalty = round(
        min(0.30, error_count * 0.10 + warning_count * 0.04 + info_count * 0.01), 2
    )

    return LintResult(
        is_clean=(error_count == 0 and warning_count == 0),
        error_count=error_count,
        warning_count=warning_count,
        info_count=info_count,
        issues=issues,
        score_penalty=score_penalty,
    )
