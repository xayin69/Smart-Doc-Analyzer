from sqlalchemy.orm import Session
from database.models.task_result import TaskResult
from database.models.document import Document
from database.models.feedback import Feedback

def create_task_result(
    db: Session,
    document_id: int,
    task_type: str,
    result: str,
    model_name: str,
    question: str | None = None,
    ) -> TaskResult:
    """
    Save the result of a task (summary, sentiment, translation, etc.)
    """

    task_result = TaskResult(
        document_id=document_id,
        task_type=task_type,
        model_name=model_name,
        question=question,
        result_text=result
    )

    db.add(task_result)
    db.commit()
    db.refresh(task_result)

    return task_result


def get_results_by_document_id(
    db: Session,
    document_id: int
) -> list[TaskResult]:
    """
    Get all task results for a document
    """

    return (
        db.query(TaskResult)
        .filter(TaskResult.document_id == document_id)
        .all()
    )

def delete_task_result_by_id(db: Session, task_id: int, user_id: int):
    task = (
        db.query(TaskResult)
        .join(Document)
        .filter(
            TaskResult.id == task_id,
            Document.user_id == user_id
        )
        .first()
    )

    if task:
        # Remove linked feedback explicitly to avoid stale rows in SQLite setups
        # where FK cascades may not be enforced.
        db.query(Feedback).filter(Feedback.task_result_id == task.id).delete()
        db.delete(task)
        db.commit()

    return task
