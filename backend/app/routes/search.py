from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services import vector_store
from app.services.semantic_search import semantic_search
from app.core.dependencies import get_current_user
from app.core.limits import acquire_user_slot, check_rate_limit, release_user_slot
from app.core.orchestrator import run_task
from app.core.task_types import TaskType
from database.db import get_db
from database.models.user import User

router = APIRouter()


class SearchRequest(BaseModel):
    filename: str
    query: str
    top_k: int = 3


@router.post("/search")
def search(
    http_request: Request,
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    del current_user
    check_rate_limit(http_request)
    acquire_user_slot()

    try:
        if vector_store.faiss_index is None or vector_store.faiss_index.ntotal == 0:
            return {"error": "Vector store is empty. Upload a document first."}

        # 1) Semantic retrieval
        results = semantic_search(
            query=request.query,
            faiss_index=vector_store.faiss_index,
            top_k=request.top_k,
            index_to_chunk=vector_store.index_to_chunk,
        )

        if not results:
            return {
                "query": request.query,
                "answer": "I could not find relevant information in the document.",
                "sources": [],
            }

        # 2) Extract context for RAG
        chunk = [r["chunk"] for r in results]

        # 3) Reasoning
        answer = run_task(
            db,
            TaskType.QA,
            filename=request.filename,
            text=chunk,
            question=request.query,
        )

        return {
            "query": request.query,
            "answer": answer,
            "sources": [
                {
                    "chunk": r["chunk"],
                    "similarity": r["score"],
                }
                for r in results
            ],
        }
    finally:
        release_user_slot()
