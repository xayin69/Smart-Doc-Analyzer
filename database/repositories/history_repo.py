from sqlalchemy.orm import Session
from database.models.document import Document


def get_all_documents_with_tasks(db: Session, user_id: int):
    return (
        db.query(Document)
        .filter(Document.user_id == user_id)
        .all()
    )

