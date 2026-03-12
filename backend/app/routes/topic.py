from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.orchestrator import run_task
from app.core.task_types import TaskType
from app.core.limits import acquire_user_slot, check_rate_limit, release_user_slot
from database.db import get_db

from app.core.dependencies import get_current_user
from database.models.user import User

router = APIRouter()


class TopicRequest(BaseModel):
    filename: str


@router.post("/classify-topics")
def classify_topics(
    request: Request,
    payload: TopicRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_rate_limit(request)
    acquire_user_slot()

    try:
        try:
            result = run_task(
                db,
                TaskType.TOPIC_CLASSIFICATION,
                filename=payload.filename
            )
        except ValueError as exc:
            raise HTTPException(status_code=404, detail=str(exc))

        return {
            "filename": payload.filename,
            "topics": result
        }
    finally:
        release_user_slot()



