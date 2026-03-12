from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.limits import acquire_user_slot, check_rate_limit, release_user_slot
from app.core.orchestrator import run_task
from app.core.task_types import TaskType
from database.db import get_db
from database.models.user import User

router = APIRouter()


class ExecuteTaskRequest(BaseModel):
    filename: str
    task_type: str
    question: str | None = None
    target_language: str | None = None
    model_name: str | None = None


@router.post("/tasks/execute")
def execute_task(
    request: Request,
    payload: ExecuteTaskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    check_rate_limit(request)
    acquire_user_slot()

    try:
        task_type_map = {
            "summarize_document": TaskType.SUMMARIZE_DOCUMENT,
            "translate": TaskType.TRANSLATE,
            "topic_classification": TaskType.TOPIC_CLASSIFICATION,
            "sentiment": TaskType.SENTIMENT,
            "qa": TaskType.QA,
        }

        task = task_type_map.get(payload.task_type)
        if not task:
            raise HTTPException(status_code=400, detail="Unsupported task_type.")

        try:
            result = run_task(
                db=db,
                task=task,
                filename=payload.filename,
                question=payload.question,
                target_language=payload.target_language,
                forced_model_name=payload.model_name,
            )
        except ValueError as exc:
            raise HTTPException(status_code=404, detail=str(exc))

        return {
            "filename": payload.filename,
            "task_type": payload.task_type,
            "model_name": payload.model_name,
            "result": result,
        }
    finally:
        release_user_slot()
