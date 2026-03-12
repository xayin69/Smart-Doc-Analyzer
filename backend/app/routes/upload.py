from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.services.parser import extract_text_from_pdf
from app.services.cleaner import clean_text
from app.services.chunker import chunk_text
from app.services.embeddings import embed_chunks
from app.services.vector_store import create_faiss_index,store_embeddings
from app.services.document_store import save_document
from database.db import get_db
from database.repositories.document_repo import create_document
from database.repositories.chunk_repo import create_chunk
from database.models.document import Document

from app.core.dependencies import get_current_user
from database.models.user import User


# Router instance to group and register upload-related endpoints.
router = APIRouter()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    normalized_name = (file.filename or "").strip()
    if not normalized_name:
        raise HTTPException(status_code=400, detail="Invalid file name.")

    existing = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id,
            func.lower(Document.filename) == normalized_name.lower(),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="File already uploaded, try another file.",
        )

    content = await file.read()

    # Step 1: Extract text
    if file.filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(content)
    else:
        raw_text = content.decode("utf-8", errors="ignore")

    # Step 2: Clean text
    cleaned_text = clean_text(raw_text)

    # Step 3: Chunk text
    chunks = chunk_text(cleaned_text)

    # Step 4: Embed chunks
    embeddings = embed_chunks(chunks)
    
    # Step 5: Save document metadata
    save_document(
        filename=file.filename,
        clean_text=cleaned_text,
        chunks=chunks,
        
    )

    # Step 5b: Persist document + chunks to DB for orchestrator tasks
    document = create_document(
        db=db,
        filename=file.filename,
        clean_text=cleaned_text,
        file_path=file.filename,
        user_id=current_user.id
        
    )

    for chunk in chunks:
        create_chunk(
            db=db,
            document_id=document.id,
            content=chunk
        )

    # Step 6: Store embeddings
    if not hasattr(upload_file, "faiss_initialized"):
        create_faiss_index(len(embeddings[0]))
        upload_file.faiss_initialized = True

    store_embeddings(
        embeddings=embeddings,
        chunks=chunks,
        metadata={"filename": file.filename}
    )
    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "chunks_preview": chunks[:3],  # only show first 3 for now
        "embedding_dim": len(embeddings[0]),
        "total_vectors_in_db": len(embeddings)
    }
