"""
ViralHook Studio — Cloud & Render Root Entrypoint
Exports the FastAPI `app` instance from backend.app.main so that
Render's default command:
    uvicorn main:app --host 0.0.0.0 --port $PORT
or
    python main.py
starts the production application cleanly from repository root.
"""
import os
import sys
from pathlib import Path

# Ensure root directory and backend package are in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Import the existing production FastAPI application
from backend.app.main import app  # noqa: E402

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"[ViralHook Studio] Starting cloud server on {host}:{port} ...")
    uvicorn.run("main:app", host=host, port=port, reload=False)
