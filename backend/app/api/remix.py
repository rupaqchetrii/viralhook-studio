"""
remix.py API — Hook Remix Lab endpoint (Day 3).
"""
from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.app.services.remix import generate_remixes

router = APIRouter(prefix="/remix", tags=["Remix Lab"])


class RemixRequest(BaseModel):
    hook: str = Field(..., max_length=280, description="The original hook text to remix.")

    model_config = {
        "json_schema_extra": {
            "example": {"hook": "Hey guys welcome back to my channel today we talk about Python"}
        }
    }


class RemixVariant(BaseModel):
    label: str
    text: str
    tip: str


class RemixResponse(BaseModel):
    status: str = "success"
    original: str
    variants: list[RemixVariant]


@router.post("/", summary="Generate hook rewrite variants (Remix Lab)")
def remix_hook(payload: RemixRequest) -> RemixResponse:
    variants = generate_remixes(payload.hook.strip())
    return RemixResponse(
        status="success",
        original=payload.hook.strip(),
        variants=[RemixVariant(**v) for v in variants],
    )
