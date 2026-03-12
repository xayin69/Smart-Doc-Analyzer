import os
import smtplib
import ssl
from email.message import EmailMessage
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.db import get_db
from app.core.dependencies import get_current_user
from database.repositories.feedback_repo import (
    create_feedback,
    get_existing_feedback,
    get_user_rated_task_ids,
)
from database.models.task_result import TaskResult
from database.models.document import Document

router = APIRouter()
logger = logging.getLogger(__name__)


class FeedbackContactPayload(BaseModel):
    username: str
    email: str
    subject: str
    feedback: str


def _send_feedback_email(payload: FeedbackContactPayload) -> None:
    smtp_host = os.getenv("SMTP_HOST") or os.getenv("SMTP_SERVER") or "smtp.gmail.com"
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME") or os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")
    recipient = os.getenv("FEEDBACK_TO_EMAIL") or os.getenv("SMTP_EMAIL") or "hazem.momani2002@gmail.com"
    from_email = os.getenv("FEEDBACK_FROM_EMAIL", smtp_username or recipient)

    if not smtp_username or not smtp_password:
        raise HTTPException(
            status_code=500,
            detail="Email service is not configured. Set SMTP_USERNAME and SMTP_PASSWORD in backend/.env.",
        )

    message = EmailMessage()
    message["Subject"] = f"[Smart Doc Feedback] {payload.subject}"
    message["From"] = from_email
    message["To"] = recipient
    message["Reply-To"] = payload.email
    message.set_content(
        "New feedback received:\n\n"
        f"Username: {payload.username}\n"
        f"Email: {payload.email}\n"
        f"Subject: {payload.subject}\n\n"
        "Message:\n"
        f"{payload.feedback}\n"
    )

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
            server.starttls(context=context)
            server.login(smtp_username, smtp_password)
            server.send_message(message)
    except Exception as exc:
        logger.exception("Failed to send feedback email")
        raise HTTPException(status_code=500, detail=f"Failed to send feedback email: {exc}") from exc


@router.post("/feedback/contact")
def submit_contact_feedback(payload: FeedbackContactPayload):
    if not payload.username.strip():
        raise HTTPException(status_code=400, detail="Username is required.")
    if not payload.email.strip():
        raise HTTPException(status_code=400, detail="Email is required.")
    if not payload.subject.strip():
        raise HTTPException(status_code=400, detail="Subject is required.")
    if not payload.feedback.strip():
        raise HTTPException(status_code=400, detail="Feedback message is required.")

    _send_feedback_email(payload)
    return {"message": "Feedback sent successfully."}


@router.get("/feedback/rated")
def get_rated_feedback(
    task_ids: str = "",
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    parsed_ids: list[int] = []
    for raw in task_ids.split(","):
        raw = raw.strip()
        if not raw:
            continue
        if raw.isdigit():
            parsed_ids.append(int(raw))

    rated_ids = get_user_rated_task_ids(
        db=db,
        user_id=current_user.id,
        task_ids=parsed_ids,
    )
    return {"rated_task_ids": rated_ids}

@router.post("/feedback")
def submit_feedback(
    task_result_id: int,
    rating: int,
    comment: str | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Validate rating
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")

    # Ensure task_result exists AND belongs to user
    task_result = (
        db.query(TaskResult)
        .join(Document)
        .filter(
            TaskResult.id == task_result_id,
            Document.user_id == current_user.id
        )
        .first()
    )

    if not task_result:
        raise HTTPException(status_code=404, detail="Task result not found.")

    # Prevent double rating
    existing = get_existing_feedback(db, current_user.id, task_result_id)
    if existing:
        raise HTTPException(status_code=400, detail="You already rated this result.")

    create_feedback(
        db=db,
        user_id=current_user.id,
        task_result_id=task_result_id,
        rating=rating,
        comment=comment
    )

    return {"message": "Feedback submitted successfully."}

