from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from app.core.orchestrator import run_task
from app.core.task_types import TaskType
from app.core.limits import acquire_user_slot, check_rate_limit, release_user_slot
from database.db import get_db

from app.core.dependencies import get_current_user
from database.models.user import User

router = APIRouter()


@router.post("/translate")
def translate(
    request: Request,
    filename: str,
    target_language: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    check_rate_limit(request)
    acquire_user_slot()

    try:
        try:
            result = run_task(
                db,
                TaskType.TRANSLATE,
                filename=filename,
                target_language=target_language
            )
        except ValueError as exc:
            raise HTTPException(status_code=404, detail=str(exc))

        return {
            "filename": filename,
            "source_language": "auto",
            "target_language": target_language,
            "translated_text": result
        }
    finally:
        release_user_slot()
