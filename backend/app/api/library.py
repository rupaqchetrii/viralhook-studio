"""
library.py API — Hook Library & Performance Tracker endpoints (Day 3).
"""
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from backend.app.services.library import (
    save_comparison,
    get_library,
    get_library_item,
    delete_library_item,
    add_performance_record,
    get_performance_records,
)

router = APIRouter(prefix="/library", tags=["Library"])


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class SaveComparisonRequest(BaseModel):
    hook_a: str
    hook_b: str
    verdict: str
    leading_hook: Optional[str] = None
    score_diff: float
    is_close: bool
    prob_high_a: float
    prob_high_b: float
    class_a: str
    class_b: str
    is_mock: bool = False
    topic: Optional[str] = None
    notes: Optional[str] = None


class PerformanceRecordRequest(BaseModel):
    library_id: Optional[int] = None
    hook_text: str
    platform: str = "TikTok"
    actual_views: Optional[int] = None
    actual_likes: Optional[int] = None
    actual_comments: Optional[int] = None
    engagement_rate: Optional[float] = None
    outcome_class: Optional[str] = Field(None, description="Low | Medium | High")
    notes: Optional[str] = None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/save", summary="Save a comparison to the Hook Library")
def save_to_library(payload: SaveComparisonRequest):
    row_id = save_comparison(
        hook_a=payload.hook_a,
        hook_b=payload.hook_b,
        verdict=payload.verdict,
        leading_hook=payload.leading_hook,
        score_diff=payload.score_diff,
        is_close=payload.is_close,
        prob_high_a=payload.prob_high_a,
        prob_high_b=payload.prob_high_b,
        class_a=payload.class_a,
        class_b=payload.class_b,
        is_mock=payload.is_mock,
        topic=payload.topic,
        notes=payload.notes,
    )
    return {"status": "saved", "id": row_id}


@router.get("/", summary="List saved comparisons")
def list_library(
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    items = get_library(limit=limit, offset=offset)
    return {"status": "success", "count": len(items), "items": items}


@router.get("/{item_id}", summary="Get a single library entry")
def get_library_entry(item_id: int):
    item = get_library_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Library item {item_id} not found.")
    return {"status": "success", "item": item}


@router.delete("/{item_id}", summary="Delete a library entry")
def delete_library_entry(item_id: int):
    deleted = delete_library_item(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Library item {item_id} not found.")
    return {"status": "deleted", "id": item_id}


# ---------------------------------------------------------------------------
# Performance Tracker sub-routes
# ---------------------------------------------------------------------------

@router.post("/performance/record", summary="Record actual performance for a hook")
def record_performance(payload: PerformanceRecordRequest):
    record_id = add_performance_record(
        library_id=payload.library_id,
        hook_text=payload.hook_text,
        platform=payload.platform,
        actual_views=payload.actual_views,
        actual_likes=payload.actual_likes,
        actual_comments=payload.actual_comments,
        engagement_rate=payload.engagement_rate,
        outcome_class=payload.outcome_class,
        notes=payload.notes,
    )
    return {"status": "recorded", "id": record_id}


@router.get("/performance/all", summary="List all performance records")
def list_performance(library_id: Optional[int] = Query(default=None)):
    records = get_performance_records(library_id=library_id)
    return {"status": "success", "count": len(records), "records": records}
