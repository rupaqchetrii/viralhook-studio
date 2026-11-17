"""
ViralHook Studio - Hook-to-Promise Consistency Checker
Owner: Tanvir (Machine Learning & NLP Lead)

Day 2 Deliverable — Semantic alignment between a video hook and its stated topic/promise.

Implements:
  - TF-IDF cosine similarity (always available, zero extra deps)
  - Dense cosine similarity via sentence-transformers (optional, used when installed)

The 0.40 threshold is the faculty-approved clickbait guard:
  - score >= 0.40 → "aligned"   (hook is faithful to topic)
  - score <  0.40 → "clickbait_risk" (hook may over-promise / mislead)
"""

import re
import math
from typing import Dict, Tuple

# Alignment verdict constants
THRESHOLD_CLICKBAIT = 0.40

VERDICT_ALIGNED = "aligned"
VERDICT_CLICKBAIT = "clickbait_risk"
VERDICT_INSUFFICIENT = "insufficient_data"


# ---------------------------------------------------------------------------
# Lightweight TF-IDF cosine (always available, no sentence-transformers dep)
# ---------------------------------------------------------------------------

def _tokenise(text: str):
    """Lowercase word tokens; strips punctuation."""
    return re.findall(r"\b[a-z0-9']+\b", text.lower())


def _tf(tokens):
    freq = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1
    total = len(tokens) or 1
    return {k: v / total for k, v in freq.items()}


def _idf(tok_a, tok_b):
    """Simple 2-document IDF so domain-specific words carry more weight."""
    vocab = set(tok_a) | set(tok_b)
    idf = {}
    for word in vocab:
        docs_containing = int(word in tok_a) + int(word in tok_b)
        idf[word] = math.log((2 + 1) / (docs_containing + 1)) + 1.0
    return idf


def _tfidf_cosine(text_a: str, text_b: str) -> float:
    """Returns cosine similarity in [0, 1] using a local 2-doc TF-IDF space."""
    tok_a = _tokenise(text_a)
    tok_b = _tokenise(text_b)

    if not tok_a or not tok_b:
        return 0.0

    idf = _idf(tok_a, tok_b)
    vocab = set(idf.keys())

    tfa = _tf(tok_a)
    tfb = _tf(tok_b)

    vec_a = {w: tfa.get(w, 0.0) * idf[w] for w in vocab}
    vec_b = {w: tfb.get(w, 0.0) * idf[w] for w in vocab}

    dot = sum(vec_a[w] * vec_b[w] for w in vocab)
    norm_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    norm_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))

    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0

    return round(min(1.0, dot / (norm_a * norm_b)), 4)


# ---------------------------------------------------------------------------
# Dense cosine via sentence-transformers (optional upgrade)
# ---------------------------------------------------------------------------

_st_model = None   # Lazy singleton — loaded only when first needed


def _load_sentence_transformer():
    global _st_model
    if _st_model is not None:
        return _st_model
    try:
        from sentence_transformers import SentenceTransformer
        _st_model = SentenceTransformer("all-MiniLM-L6-v2")
    except (ImportError, Exception):
        _st_model = "unavailable"
    return _st_model


def _dense_cosine(text_a: str, text_b: str) -> float:
    """
    Returns cosine similarity in [0, 1] using all-MiniLM-L6-v2 dense vectors.
    Falls back to TF-IDF cosine if sentence-transformers is not installed.
    """
    model = _load_sentence_transformer()
    if model == "unavailable" or model is None:
        return _tfidf_cosine(text_a, text_b)

    import numpy as np
    emb = model.encode([text_a, text_b], normalize_embeddings=True)
    score = float(np.dot(emb[0], emb[1]))
    return round(max(0.0, min(1.0, score)), 4)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def check_consistency(hook_text: str,
                      topic_summary: str,
                      use_dense: bool = False) -> Dict:
    """
    Checks semantic alignment between the hook opening line and the video's
    stated topic / promise.

    Parameters
    ----------
    hook_text     : The opening line (first 0-5 seconds).
    topic_summary : Short description of what the video is actually about.
    use_dense     : If True, attempts to use sentence-transformers (384-dim
                    dense cosine).  Falls back to TF-IDF if unavailable.

    Returns
    -------
    dict with keys:
      alignment_score : float  — Cosine similarity [0.0 – 1.0]
      verdict         : str    — "aligned" | "clickbait_risk" | "insufficient_data"
      explanation     : str    — Human-readable explanation
      method          : str    — "dense" | "tfidf"
    """
    hook_clean    = (hook_text    or "").strip()
    topic_clean   = (topic_summary or "").strip()

    if len(hook_clean) < 3 or len(topic_clean) < 3:
        return {
            "alignment_score": 0.0,
            "verdict":         VERDICT_INSUFFICIENT,
            "explanation":     "Hook or topic text is too short to evaluate alignment.",
            "method":          "none",
        }

    if use_dense:
        score  = _dense_cosine(hook_clean, topic_clean)
        method = "dense"
        # Verify model actually loaded; if TF-IDF was used as fallback, label correctly
        model = _load_sentence_transformer()
        if model == "unavailable" or model is None:
            method = "tfidf"
    else:
        score  = _tfidf_cosine(hook_clean, topic_clean)
        method = "tfidf"

    if score >= THRESHOLD_CLICKBAIT:
        verdict = VERDICT_ALIGNED
        explanation = (
            f"Hook and topic are semantically aligned "
            f"(similarity score = {score:.2f} ≥ {THRESHOLD_CLICKBAIT:.2f}). "
            "The opening line faithfully represents the video content."
        )
    else:
        verdict = VERDICT_CLICKBAIT
        explanation = (
            f"Low alignment detected (similarity score = {score:.2f} < {THRESHOLD_CLICKBAIT:.2f}). "
            "The hook may over-promise or mislead viewers relative to the actual video content. "
            "Consider revising the hook to better reflect the topic."
        )

    return {
        "alignment_score": score,
        "verdict":         verdict,
        "explanation":     explanation,
        "method":          method,
    }


def batch_check(pairs: list, use_dense: bool = False) -> list:
    """
    Runs check_consistency over a list of (hook_text, topic_summary) tuples.
    Returns a list of result dicts in the same order.
    """
    return [
        check_consistency(hook, topic, use_dense=use_dense)
        for hook, topic in pairs
    ]


if __name__ == "__main__":
    # Quick smoke test
    examples = [
        (
            "Stop doing this one morning habit or you will ruin your productivity",
            "Practical guide to building a productive morning routine.",
        ),
        (
            "Hey guys, welcome back to my channel! Today we are talking about budget",
            "Advanced quantum computing research breakthroughs in 2026.",
        ),
        (
            "The secret to 10x viral growth revealed...",
            "Tips to grow a social media following organically.",
        ),
    ]
    print("=" * 60)
    for hook, topic in examples:
        result = check_consistency(hook, topic)
        print(f"Hook   : {hook[:55]}...")
        print(f"Topic  : {topic[:55]}...")
        print(f"Score  : {result['alignment_score']}  |  Verdict: {result['verdict']}  |  Method: {result['method']}")
        print("-" * 60)
