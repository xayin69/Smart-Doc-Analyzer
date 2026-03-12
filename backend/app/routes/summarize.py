from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from app.core.orchestrator import run_task
from app.core.task_types import TaskType
from app.core.limits import acquire_user_slot, check_rate_limit, release_user_slot
from database.db import get_db

from app.core.dependencies import get_current_user
from database.models.user import User



router = APIRouter()


@router.post("/summarize")
def summarize(
    request: Request,
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    """
    Summarize a document automatically.
    Loads document from DB.
    Saves result automatically.
    """

    check_rate_limit(request)
    acquire_user_slot()

    try:
        try:
            summary = run_task(
                db=db,
                task=TaskType.SUMMARIZE_DOCUMENT,
                filename=filename
            )
        except ValueError as e:
            raise HTTPException(
                status_code=404,
                detail=str(e)
            )

        return {
            "filename": filename,
            "summary": summary
        }
    finally:
        release_user_slot()
