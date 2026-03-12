from sqlalchemy.orm import Session
from database.models.document import Document
from database.models.feedback import Feedback
from database.models.task_result import TaskResult


def create_document(
    db: Session,
    filename: str,
    clean_text: str,
    file_path: str,
    user_id: int
) -> Document:
    document = Document(
        filename=filename,
        clean_text=clean_text,
        file_path=file_path,
        user_id=user_id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_document_by_id(
    db: Session,
    document_id: int
) -> Document | None:
    return db.query(Document).filter(
        Document.id == document_id
    ).first()


def get_document_by_filename(
    db: Session,
    filename: str
) -> Document | None:
    return db.query(Document).filter(
        Document.filename == filename
    ).first()

def delete_document_by_id(db: Session, document_id: int, user_id: int):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == user_id
        )
        .first()
    )

    if document:
        # Remove feedback for all task results under this document explicitly.
        task_ids = [
            task_id for (task_id,) in db.query(TaskResult.id).filter(
                TaskResult.document_id == document.id
            ).all()
        ]
        if task_ids:
            db.query(Feedback).filter(Feedback.task_result_id.in_(task_ids)).delete(
                synchronize_session=False
            )
        db.delete(document)
        db.commit()

    return document
