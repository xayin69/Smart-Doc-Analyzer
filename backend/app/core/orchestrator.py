from typing import List
import json

from sqlalchemy.orm import Session

from app.core.task_types import TaskType

# Services
from app.services.summarizer import summarize_chunk, summarize_document
from app.services.sentiment import analyze_document_sentiment
from app.services.classifier import classify_document
from app.services.translator import translate_chunk
from app.services.rag import run_rag

# Repositories
from database.repositories.document_repo import get_document_by_filename
from database.repositories.task_result_repo import create_task_result
from database.repositories.chunk_repo import get_chunks_by_document_id
from database.repositories.feedback_repo import get_model_task_rating_stats

from app.core.model_router import select_model


def _clean_text_output(text: str) -> str:
    cleaned = text.strip()

    # Strip markdown code fences
    if cleaned.startswith("```") and cleaned.endswith("```"):
        lines = cleaned.splitlines()
        if len(lines) >= 2:
            cleaned = "\n".join(lines[1:-1]).strip()

    # Strip wrapping triple quotes
    if cleaned.startswith('"""') and cleaned.endswith('"""'):
        cleaned = cleaned[3:-3].strip()
    if cleaned.startswith("'''") and cleaned.endswith("'''"):
        cleaned = cleaned[3:-3].strip()

    # Strip wrapping single/double quote pair
    if len(cleaned) >= 2 and cleaned[0] == cleaned[-1] and cleaned[0] in {'"', "'"}:
        cleaned = cleaned[1:-1].strip()

    return cleaned


def _serialize_for_storage(result: str | dict | list) -> str:
    if isinstance(result, str):
        return _clean_text_output(result)
    return json.dumps(result, ensure_ascii=False)



def run_task(
    db: Session,
    task: TaskType,
    *,
    filename: str,
    text: str | None = None,
    question: str | None = None,
    target_language: str | None = None,
    forced_model_name: str | None = None, 
):
    """
    Central task orchestrator.
    Loads document from DB, runs task, saves result automatically.
    """

    # 1) Get document from DB
    document = get_document_by_filename(db, filename)

    if not document:
        raise ValueError("Document not found in database.")

    # 2) Get chunks from DB
    db_chunks = get_chunks_by_document_id(db, document.id)
    chunks = [c.content for c in db_chunks]
    # 3) Select model based on task, content type, and feedback
    if forced_model_name:
       model_name = forced_model_name
    else:
       selected_model = select_model(task=task, has_images=False)
       model_name = selected_model.name

    # 4)initialize feedback stats
    avg, count = get_model_task_rating_stats(
        db=db,
        task_type=task.value,
        model_name=model_name,
    )

    adaptive_mode = False

    if avg is not None and count >= 3 and avg < 3.5:
        adaptive_mode = True
    print("Average:", avg, "Count:", count, "Adaptive:", adaptive_mode)

    # 5) Execute task
    # ---------- SUMMARIZATION ----------
    if task == TaskType.SUMMARIZE_CHUNK:
        if not text:
            raise ValueError("Text required for chunk summarization.")
        result = summarize_chunk(text, adaptive_mode=adaptive_mode)

    elif task == TaskType.SUMMARIZE_DOCUMENT:
        if not db_chunks:
            raise ValueError("No chunks found for document.")

        chunk_texts = [chunk.content for chunk in db_chunks]

        result = summarize_document(chunk_texts, adaptive_mode=adaptive_mode)

    # ---------- SENTIMENT ----------
    elif task == TaskType.SENTIMENT:
        # Convert DB chunks to text list
        chunk_texts = [chunk.content for chunk in db_chunks]

        # Call service (document-level logic lives there)
        result = analyze_document_sentiment(chunk_texts, adaptive_mode=adaptive_mode)

    # ---------- TOPIC CLASSIFICATION ----------
    elif task == TaskType.TOPIC_CLASSIFICATION:
        chunk_texts = [chunk.content for chunk in db_chunks]

        result = classify_document(chunk_texts, adaptive_mode=adaptive_mode)

    # ---------- TRANSLATION ----------
    elif task == TaskType.TRANSLATE:
        if not target_language:
            raise ValueError("target_language is required for translation.")

        chunk_texts = [chunk.content for chunk in db_chunks]

        translated_chunks = [
            translate_chunk(text, target_language, adaptive_mode=adaptive_mode)
            for text in chunk_texts
        ]

        result = "\n\n".join(translated_chunks)

    # ---------- RAG / QA ----------
    elif task == TaskType.QA:
        if not question:
            raise ValueError("question is required for QA.")

        if not chunks:
            raise ValueError("chunks are required for QA.")

        result = run_rag(chunks, question, adaptive_mode=adaptive_mode)

    else:
        raise ValueError(f"Unsupported task: {task}")

    # Normalize plain-text task outputs
    if isinstance(result, str):
        result = _clean_text_output(result)

    # 6) Save result automatically
    create_task_result(
        db=db,
        document_id=document.id,
        task_type=task.value,
        result=_serialize_for_storage(result),
        model_name=model_name,
        question=question if task == TaskType.QA else None,
    )
    return result
