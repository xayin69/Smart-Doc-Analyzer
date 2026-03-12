from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    clean_text = Column(Text, nullable=False)

    status = Column(String, default="uploaded")  
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # ORM relationship
    user = relationship("User", back_populates="documents")
    # relationships to chunks and task results will be defined in their respective models
    chunks = relationship(
    "Chunk",
    back_populates="documents",
    cascade="all, delete"
    )

    task_results = relationship(
    "TaskResult",
    back_populates="documents",
    cascade="all, delete"
    )