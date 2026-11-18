"""
api/history_db.py — Database & 48-Hour Outcome Feedback Endpoints
Provides:
- GET /api/db/history
- POST /api/db/history
- POST /api/db/outcome
- GET /api/db/analytics
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from backend.app.database import (
    save_battle_record,
    get_all_battles,
    log_creator_outcome,
    get_creator_analytics,
)

router = APIRouter(prefix="", tags=["Database & Feedback Loop"])


class SaveBattleRequest(BaseModel):
    hook_a: str
    hook_b: str
    topic_summary: Optional[str] = ""
    platform: Optional[str] = "tiktok"
    niche: Optional[str] = "tech"
    verdict: str
    leading_hook: Optional[str] = None
    score_difference: float
    is_close_result: bool
    prob_a: Dict[str, float]
    prob_b: Dict[str, float]


class OutcomeRequest(BaseModel):
    battle_id: str
    chosen_hook: str
    views_48h: int = Field(..., ge=0)
    likes: Optional[int] = 0
    shares: Optional[int] = 0
    avg_watch_time_sec: Optional[float] = 0.0
    actual_tier: str = Field(..., description="'Low' | 'Medium' | 'High'")
    predicted_tier: str = Field(..., description="'Low' | 'Medium' | 'High'")
    creator_notes: Optional[str] = ""


@router.get("/db/history", summary="Get Persisted Battle History")
def get_history_endpoint(limit: int = 30):
    try:
        return {"status": "success", "history": get_all_battles(limit=limit)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/db/history", summary="Persist Battle Record to Database")
def save_history_endpoint(payload: SaveBattleRequest):
    try:
        battle_id = save_battle_record(payload.model_dump())
        return {"status": "success", "battle_id": battle_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/db/outcome", summary="Log 48-Hour Actual Creator Performance")
def log_outcome_endpoint(payload: OutcomeRequest):
    try:
        outcome_id = log_creator_outcome(payload.model_dump())
        return {
            "status": "success",
            "outcome_id": outcome_id,
            "message": "Feedback recorded. Model calibration loop updated successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/db/analytics", summary="Creator Channel Analytics & Model Accuracy")
def get_analytics_endpoint():
    try:
        return {"status": "success", "analytics": get_creator_analytics()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
