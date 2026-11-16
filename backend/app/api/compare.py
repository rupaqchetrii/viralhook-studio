from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.compare import CompareRequest, CompareResponse
from backend.app.services.comparison import compare_two_hooks

router = APIRouter(prefix="", tags=["Comparison"])


@router.post(
    "/compare",
    response_model=CompareResponse,
    status_code=status.HTTP_200_OK,
    summary="Compare two video opening hooks",
    description="Takes Hook A and Hook B, evaluates them through the ML/Heuristic pipeline, and returns one clear comparison verdict.",
)
def compare_hooks_endpoint(payload: CompareRequest) -> CompareResponse:
    try:
        return compare_two_hooks(payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while comparing hooks: {str(e)}",
        )
