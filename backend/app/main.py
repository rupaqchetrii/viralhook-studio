from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from backend.app.config import get_settings
from backend.app.api.compare import router as compare_router
from backend.app.api.analyze import router as analyze_router
from backend.app.api.library import router as library_router
from backend.app.api.remix import router as remix_router
from backend.app.api.history_db import router as history_db_router
from backend.app.api.audio import router as audio_router
from backend.app.api.ingest import router as ingest_router
from backend.app.api.embeddings import router as embeddings_router
from backend.app.api.oauth import router as oauth_router
from backend.app.services.prediction_gateway import gateway

settings = get_settings()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
FRONTEND_DIST_INDEX = FRONTEND_DIST / "index.html"
DAY1_STATIC_INDEX = BASE_DIR / "frontend" / "public" / "day1_static.html"
FRONTEND_INDEX = BASE_DIR / "frontend" / "index.html"
FRONTEND_SHOWCASE = BASE_DIR / "frontend" / "showcase.html"

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for ViralHook Studio — Short-form Video Hook A/B Comparison Platform.",
)

# Configure CORS Middleware for Local & Vercel Deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers on primary prefix and /api/v1 alias for compatibility
app.include_router(compare_router, prefix=settings.API_V1_PREFIX)
app.include_router(analyze_router, prefix=settings.API_V1_PREFIX)
app.include_router(library_router, prefix=settings.API_V1_PREFIX)
app.include_router(remix_router, prefix=settings.API_V1_PREFIX)
app.include_router(history_db_router, prefix=settings.API_V1_PREFIX)
app.include_router(audio_router, prefix=settings.API_V1_PREFIX)
app.include_router(ingest_router, prefix=settings.API_V1_PREFIX)
app.include_router(embeddings_router, prefix=settings.API_V1_PREFIX)
app.include_router(oauth_router, prefix=settings.API_V1_PREFIX)

if (FRONTEND_DIST / "assets").exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")


@app.get("/favicon.svg", include_in_schema=False)
def serve_favicon():
    favicon_path = FRONTEND_DIST / "favicon.svg"
    if not favicon_path.exists():
        favicon_path = BASE_DIR / "frontend" / "public" / "favicon.svg"
    if favicon_path.exists():
        return FileResponse(favicon_path, media_type="image/svg+xml")
    return FileResponse(DAY1_STATIC_INDEX)


@app.get("/", tags=["UI"], summary="Serve ViralHook Studio Web Interface")
@app.get("/day2", tags=["UI"], summary="Serve Day 2 Prototype Web Interface")
def serve_ui():
    """Serves the Day 2 React Studio interface."""
    if FRONTEND_DIST_INDEX.exists():
        return FileResponse(FRONTEND_DIST_INDEX)
    if DAY1_STATIC_INDEX.exists():
        return FileResponse(DAY1_STATIC_INDEX)
    if FRONTEND_INDEX.exists():
        return FileResponse(FRONTEND_INDEX)
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_PREFIX}/health",
        "compare_endpoint": f"{settings.API_V1_PREFIX}/compare",
    }


@app.get("/day1", tags=["UI"], summary="Serve Day 1 Prototype Web Interface")
def serve_day1_ui():
    """Serves the standalone Day 1 prototype interface."""
    if DAY1_STATIC_INDEX.exists():
        return FileResponse(DAY1_STATIC_INDEX)
    return {"message": "Day 1 prototype file not found"}


@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"], summary="System & Model Health Check")
@app.get("/api/v1/health", tags=["Health"], summary="System & Model Health Check (v1 alias)")
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "model_loaded": gateway.is_loaded,
        "inference_mode": "trained_model" if gateway.is_loaded else "heuristic_fallback",
        "close_result_margin": settings.CLOSE_RESULT_MARGIN,
        "features": {
            "whisper_audio": True,
            "cloud_db": True,
            "social_ingest": True,
            "feedback_loop_48h": True,
            "hook_library": True,
            "remix_lab": True,
            "deep_transformer_embeddings": True,
            "oauth_social_sync": True
        }
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
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=True)
