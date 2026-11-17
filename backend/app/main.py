from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from backend.app.config import get_settings
from backend.app.api.compare import router as compare_router
from backend.app.api.analyze import router as analyze_router
from backend.app.services.prediction_gateway import gateway

settings = get_settings()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_INDEX = BASE_DIR / "frontend" / "index.html"

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for ViralHook Studio — Short-form Video Hook A/B Comparison Platform.",
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers on primary prefix and /api/v1 alias for compatibility
app.include_router(compare_router, prefix=settings.API_V1_PREFIX)
app.include_router(analyze_router, prefix=settings.API_V1_PREFIX)
if settings.API_V1_PREFIX != "/api/v1":
    app.include_router(compare_router, prefix="/api/v1")
    app.include_router(analyze_router, prefix="/api/v1")


@app.get("/", tags=["UI"], summary="Serve ViralHook Studio Web Interface")
def serve_ui():
    """Serves the single-page creator UI if available, else API information."""
    if FRONTEND_INDEX.exists():
        return FileResponse(FRONTEND_INDEX)
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_PREFIX}/health",
        "compare_endpoint": f"{settings.API_V1_PREFIX}/compare",
    }


@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"], summary="System & Model Health Check")
@app.get("/api/v1/health", tags=["Health"], summary="System & Model Health Check (v1 alias)")
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "model_loaded": gateway.is_loaded,
        "inference_mode": "trained_model" if gateway.is_loaded else "heuristic_fallback",
        "close_result_margin": settings.CLOSE_RESULT_MARGIN,
    }


@app.get(f"{settings.API_V1_PREFIX}/model/info", tags=["Model"])
@app.get("/api/v1/model/info", tags=["Model"])
def model_info():
    return {
        "is_loaded": gateway.is_loaded,
        "metadata": gateway.metadata,
        "classes": list(getattr(gateway.model, "classes_", ["Low", "Medium", "High"])),
        "close_result_margin": settings.CLOSE_RESULT_MARGIN,
        "disclaimer": settings.DISCLAIMER,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
