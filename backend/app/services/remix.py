"""
remix.py — Hook Remix Lab service (Day 3).
Generates 5 deterministic rewrite variants using psycholinguistic transformation rules.
No LLM API key required — works entirely offline.
"""
import re
from typing import List, Dict


# ---------------------------------------------------------------------------
# Transformation templates
# ---------------------------------------------------------------------------

POWER_OPENERS = [
    "Stop doing",
    "Nobody tells you",
    "Here's why",
    "The real reason",
    "Most people don't know",
]

CURIOSITY_PREFIXES = [
    "Why {core}?",
    "How {core} — explained in 60 seconds.",
    "The truth about {core} nobody talks about.",
    "What happens when {core}?",
    "Before you {action}: {core}.",
]


def _extract_core(text: str) -> str:
    """Strip common filler openers and return the semantic core of the hook."""
    fillers = [
        r"^(hey guys[,.]?\s*)", r"^(welcome back[,.]?\s*)", r"^(today (i[' ]?ll|we)[' ]?(talk|show|cover)[^.]*[.!?]?\s*)",
        r"^(in this video[,.]?\s*)", r"^(so[,.]?\s*)", r"^(okay[,.]?\s*)", r"^(alright[,.]?\s*)",
    ]
    core = text.strip()
    for pat in fillers:
        core = re.sub(pat, "", core, flags=re.IGNORECASE).strip()
    # Capitalize first character
    if core:
        core = core[0].upper() + core[1:]
    return core or text.strip()


def _first_verb(text: str) -> str:
    """Very lightweight: grab the first verb-like word (action word)."""
    # Simple heuristic: return the first word after removing articles/determiners
    skip = {"the", "a", "an", "i", "you", "we", "they", "here", "this", "that"}
    for w in text.lower().split():
        if w not in skip and len(w) > 2:
            return w
    return "do this"


def generate_remixes(hook: str) -> List[Dict[str, str]]:
    """
    Returns up to 5 rewrite variants with a label and explanation for each.
    """
    core = _extract_core(hook)
    action = _first_verb(hook)
    words = hook.strip().split()
    word_count = len(words)

    remixes = []

    # 1. Direct Address Rewrite
    if not any(w.lower() in ("you", "your", "you're") for w in words):
        remixes.append({
            "label": "Direct Address",
            "text": f"You need to know this — {core}",
            "tip": "Adding 'you' creates an immediate personal connection with the viewer.",
        })
    else:
        remixes.append({
            "label": "Direct Address (Enhanced)",
            "text": f"If you're watching this, {core}",
            "tip": "Reinforces direct address with a conditional hook to increase personal relevance.",
        })

    # 2. Curiosity Gap Rewrite
    remixes.append({
        "label": "Curiosity Gap",
        "text": f"Most creators get this wrong — {core}",
        "tip": "Curiosity gaps ('most people get this wrong') trigger the reader's desire to self-verify.",
    })

    # 3. Number / Specificity Rewrite
    has_number = bool(re.search(r"\b\d+\b", hook))
    if not has_number:
        remixes.append({
            "label": "Specificity Boost",
            "text": f"3 things about {core} that changed everything.",
            "tip": "Specific numbers ('3 things') improve trust and set a clear expectation of content length.",
        })
    else:
        remixes.append({
            "label": "Specificity Enhanced",
            "text": re.sub(r"\b(\d+)\b", lambda m: str(int(m.group()) + 1), hook, count=1),
            "tip": "Slightly higher numbers (e.g. 5→6) can feel more credible and less clickbait-y.",
        })

    # 4. Question Rewrite
    if not hook.strip().endswith("?"):
        remixes.append({
            "label": "Question Hook",
            "text": f"What if {core.lower().rstrip('.')}?",
            "tip": "Open-ended questions activate the viewer's answer-seeking instinct and increase watch time.",
        })
    else:
        remixes.append({
            "label": "Statement Hook",
            "text": f"Here's the truth — {core.rstrip('?')}.",
            "tip": "Declarative statements ('Here's the truth') can feel more authoritative than questions.",
        })

    # 5. Concise Rewrite (trim to ≤10 words)
    if word_count > 10:
        trimmed = " ".join(words[:8]).rstrip(",;:") + "..."
        remixes.append({
            "label": "Concise Cut (≤10 words)",
            "text": trimmed,
            "tip": "Shorter hooks (≤10 words) are easier to deliver in the first 1–2 seconds of a video.",
        })
    else:
        remixes.append({
            "label": "Power Opener",
            "text": f"Stop ignoring this — {core}",
            "tip": "'Stop' is a high-impact imperative that interrupts scroll behaviour and demands attention.",
        })

    return remixes[:5]
