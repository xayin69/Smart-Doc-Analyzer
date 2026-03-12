from sqlalchemy.orm import Session
from database.models.chunk import Chunk


def create_chunk(
    db: Session,
    document_id: int,
    content: str
) -> Chunk:
    chunk = Chunk(
        document_id=document_id,
        content=content
    )

    db.add(chunk)
    db.commit()
    db.refresh(chunk)

    return chunk


def get_chunks_by_document_id(
    db: Session,
    document_id: int
) -> list[Chunk]:
    return db.query(Chunk).filter(
        Chunk.document_id == document_id
    ).all()
