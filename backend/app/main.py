from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import get_settings
from backend.app.api.compare import router as compare_router
from backend.app.services.prediction_gateway import gateway

settings = get_settings()

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

# Include API Routers on both /api and /api/v1 for seamless compatibility
app.include_router(compare_router, prefix="/api")
app.include_router(compare_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_check": "/api/health",
        "compare_endpoint": "/api/compare",
    }


@app.get("/api/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "model_loaded": gateway.is_loaded,
        "inference_mode": "trained_model" if gateway.is_loaded else "heuristic_fallback",
        "close_result_margin": settings.CLOSE_RESULT_MARGIN,
    }


@app.get("/api/model/info", tags=["Model"])
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
