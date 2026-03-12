from pathlib import Path
import os
from app.core.logging_config import setup_logging
from dotenv import load_dotenv
import logging
import requests
# Load backend/.env before importing modules that read environment variables.
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_PATH)

from fastapi.responses import JSONResponse
from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database.db import init_db
from app.routes.upload import router as upload_router
from app.routes.search import router as search_router
from app.routes.summarize import router as summarize_router
from app.routes.topic import router as topic_router
from app.routes.sentimentresult import router as sentiment_router
from app.routes.translate import router as translate_router
from app.routes.history import router as history_router
from app.routes.auth import router as auth_router
from app.routes.feedback import router as feedback_router
from app.routes.models import router as models_router
from app.routes.tasks import router as tasks_router
from app.routes.profile import router as profile_router

app = FastAPI()


setup_logging()
logger = logging.getLogger(__name__)
logger.info("Smart Doc Analyzer backend starting...")


cors_origins_raw = os.getenv("CORS_ORIGINS", "").strip()
if cors_origins_raw:
    cors_origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]
else:
    cors_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB tables at startup
@app.on_event("startup")
def on_startup():
    init_db()
    logger.info("Database initialized successfully.")

app.include_router(upload_router)
app.include_router(search_router)
app.include_router(summarize_router)
app.include_router(topic_router)
app.include_router(sentiment_router)
app.include_router(translate_router)
app.include_router(history_router)
app.include_router(auth_router)
app.include_router(feedback_router)
app.include_router(models_router)
app.include_router(tasks_router)
app.include_router(profile_router)

@app.get("/health")
def health_check():
    health_status = {
        "backend": "ok",
        "database": "unknown",
        "model": "unknown"
    }

    # Check database
    try:
        from database.db import get_db
        db = next(get_db())
        db.execute(text("SELECT 1"))
        health_status["database"] = "ok"
    except Exception:
        health_status["database"] = "error"
    finally:
        try:
            db.close()
        except Exception:
            pass

    # Check model (Ollama)
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            health_status["model"] = "ok"
        else:
            health_status["model"] = "error"
    except Exception:
        health_status["model"] = "error"

    return health_status


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(
        f"Unhandled error at {request.url}",
        exc_info=True
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.get("/")
def root():
    return {"message": "Smart Doc Analyzer backend is running"}
