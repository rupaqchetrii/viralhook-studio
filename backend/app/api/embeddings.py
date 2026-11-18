"""
api/embeddings.py — Transformer Deep Embedding Analysis API
ViralHook Studio — Day 3+ Master Upgrade (10/10 Vision)
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from backend.app.services.deep_embeddings import embedding_engine

router = APIRouter(prefix="/embeddings", tags=["Transformer Embeddings"])


class EmbeddingAnalysisRequest(BaseModel):
    hook_a: str = Field(..., description="Opening Hook Option A")
    hook_b: str = Field(..., description="Opening Hook Option B")
    topic: Optional[str] = Field(default="", description="Video core promise/topic")


class EmbeddingAnalysisResponse(BaseModel):
    status: str = "success"
    embedding_dimension: int
    architecture: str
    cosine_similarity: float
    normalized_similarity_percent: float
    semantic_distance: float
    hook_a_metrics: Dict[str, Any]
    hook_b_metrics: Dict[str, Any]
    interpretation: str


@router.post(
    "/analyze",
    response_model=EmbeddingAnalysisResponse,
    summary="Compute 384-dimensional Transformer Semantic Distance & Tension Analysis",
)
def analyze_embeddings_endpoint(payload: EmbeddingAnalysisRequest):
    if not payload.hook_a.strip() or not payload.hook_b.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Both hook_a and hook_b must be non-empty strings.",
        )

    analysis = embedding_engine.analyze_pair(
        hook_a=payload.hook_a,
        hook_b=payload.hook_b,
        topic=payload.topic or "",
    )

    return EmbeddingAnalysisResponse(
        status="success",
        **analysis,
    )
