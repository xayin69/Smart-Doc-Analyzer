from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database.base import Base

class TaskResult(Base):
    __tablename__ = "task_results"

    id = Column(Integer, primary_key=True, index=True)

    document_id = Column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    task_type = Column(String, nullable=False , index=True)
    # examples: "summary", "translation", "sentiment", "qa"

    model_name = Column(String, nullable=True)
    question = Column(Text, nullable=True)

    result_text = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # ORM relationship
    documents = relationship(
    "Document",
    back_populates="task_results"
    )
