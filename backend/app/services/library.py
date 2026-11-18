"""
library.py — Hook Library CRUD service (Day 3).
Saves/retrieves comparison results to/from SQLite.
"""
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from backend.app.db.database import get_connection


def save_comparison(
    hook_a: str,
    hook_b: str,
    verdict: str,
    leading_hook: Optional[str],
    score_diff: float,
    is_close: bool,
    prob_high_a: float,
    prob_high_b: float,
    class_a: str,
    class_b: str,
    is_mock: bool,
    topic: Optional[str] = None,
    notes: Optional[str] = None,
) -> int:
    """Insert a comparison record. Returns the new row id."""
    created_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO hook_library
              (hook_a, hook_b, verdict, leading_hook, score_diff, is_close,
               prob_high_a, prob_high_b, class_a, class_b, is_mock, topic, notes, created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                hook_a, hook_b, verdict, leading_hook,
                round(score_diff, 4), int(is_close),
                round(prob_high_a, 4), round(prob_high_b, 4),
                class_a, class_b, int(is_mock),
                topic, notes, created_at,
            ),
        )
        return cursor.lastrowid


def get_library(limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    """Fetch recent saved comparisons, newest first."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT * FROM hook_library
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            """,
            (limit, offset),
        ).fetchall()
    return [dict(r) for r in rows]


def get_library_item(item_id: int) -> Optional[Dict[str, Any]]:
    """Fetch a single library entry by id."""
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM hook_library WHERE id = ?", (item_id,)
        ).fetchone()
    return dict(row) if row else None


def delete_library_item(item_id: int) -> bool:
    """Delete a library entry. Returns True if a row was deleted."""
    with get_connection() as conn:
        cursor = conn.execute(
            "DELETE FROM hook_library WHERE id = ?", (item_id,)
        )
    return cursor.rowcount > 0


def add_performance_record(
    library_id: Optional[int],
    hook_text: str,
    platform: str = "TikTok",
    actual_views: Optional[int] = None,
    actual_likes: Optional[int] = None,
    actual_comments: Optional[int] = None,
    engagement_rate: Optional[float] = None,
    outcome_class: Optional[str] = None,
    notes: Optional[str] = None,
) -> int:
    recorded_at = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO performance_tracker
              (library_id, hook_text, platform, actual_views, actual_likes,
               actual_comments, engagement_rate, outcome_class, notes, recorded_at)
            VALUES (?,?,?,?,?,?,?,?,?,?)
            """,
            (
                library_id, hook_text, platform,
                actual_views, actual_likes, actual_comments,
                engagement_rate, outcome_class, notes, recorded_at,
            ),
        )
        return cursor.lastrowid


def get_performance_records(library_id: Optional[int] = None) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        if library_id is not None:
            rows = conn.execute(
                "SELECT * FROM performance_tracker WHERE library_id = ? ORDER BY id DESC",
                (library_id,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM performance_tracker ORDER BY id DESC LIMIT 100"
            ).fetchall()
    return [dict(r) for r in rows]
