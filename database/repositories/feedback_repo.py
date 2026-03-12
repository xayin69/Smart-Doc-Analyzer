from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models.feedback import Feedback
from database.models.task_result import TaskResult


def create_feedback(
    db: Session,
    user_id: int,
    task_result_id: int,
    rating: int,
    comment: str | None
) -> Feedback:

    feedback = Feedback(
        user_id=user_id,
        task_result_id=task_result_id,
        rating=rating,
        comment=comment
    )

    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return feedback


def get_existing_feedback(
    db: Session,
    user_id: int,
    task_result_id: int
) -> Feedback | None:

    return (
        db.query(Feedback)
        .filter(
            Feedback.user_id == user_id,
            Feedback.task_result_id == task_result_id
        )
        .first()
    )


def get_user_rated_task_ids(
    db: Session,
    user_id: int,
    task_ids: list[int],
) -> list[int]:
    if not task_ids:
        return []

    rows = (
        db.query(Feedback.task_result_id)
        .filter(
            Feedback.user_id == user_id,
            Feedback.task_result_id.in_(task_ids),
        )
        .all()
    )
    return [task_id for (task_id,) in rows]


def get_model_task_rating_stats(
    db: Session,
    task_type: str,
    model_name: str
):
    """
    Returns (average_rating, rating_count)
    """

    result = (
        db.query(
            func.avg(Feedback.rating),
            func.count(Feedback.id)
        )
        .join(TaskResult, Feedback.task_result_id == TaskResult.id)
        .filter(
            TaskResult.task_type == task_type,
            TaskResult.model_name == model_name
        )
        .first()
    )

    avg_rating, count = result

    return (float(avg_rating) if avg_rating else None, count)
