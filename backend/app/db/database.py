"""
database.py — SQLite connection & schema bootstrap for ViralHook Studio Day 3.
Provides a lightweight, dependency-free SQLite layer (no ORM required).
"""
import sqlite3
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

DB_PATH = Path(__file__).resolve().parent.parent.parent.parent / "data" / "viralhook.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def bootstrap_schema():
    """Create tables if they don't exist."""
    with get_connection() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS hook_library (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                hook_a      TEXT NOT NULL,
                hook_b      TEXT NOT NULL,
                verdict     TEXT NOT NULL,
                leading_hook TEXT,
                score_diff  REAL NOT NULL,
                is_close    INTEGER NOT NULL DEFAULT 0,
                prob_high_a REAL NOT NULL,
                prob_high_b REAL NOT NULL,
                class_a     TEXT NOT NULL,
                class_b     TEXT NOT NULL,
                is_mock     INTEGER NOT NULL DEFAULT 0,
                topic       TEXT,
                notes       TEXT,
                created_at  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS performance_tracker (
                id              INTEGER PRIMARY KEY AUTOINCREMENT,
                library_id      INTEGER REFERENCES hook_library(id) ON DELETE CASCADE,
                hook_text       TEXT NOT NULL,
                platform        TEXT NOT NULL DEFAULT 'TikTok',
                actual_views    INTEGER,
                actual_likes    INTEGER,
                actual_comments INTEGER,
                engagement_rate REAL,
                outcome_class   TEXT,
                notes           TEXT,
                recorded_at     TEXT NOT NULL
            );
        """)


# Bootstrap on import
bootstrap_schema()
