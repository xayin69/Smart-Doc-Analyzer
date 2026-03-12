from database.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from database.repositories.history_repo import get_all_documents_with_tasks
from database.repositories.document_repo import delete_document_by_id
from database.repositories.task_result_repo import delete_task_result_by_id
from database.models.user import User
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("/history")
def get_history(db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    documents = get_all_documents_with_tasks(db, current_user.id)

    result = []

    for doc in documents:
        result.append({
            "document_id": doc.id,
            "filename": doc.filename,
            "created_at": doc.created_at,
            "tasks": [
                {
                    "task_id": task.id,
                    "task_type": task.task_type,
                    "created_at": task.created_at,
                    "result_text": task.result_text,
                    "question": task.question,
                }
                for task in doc.task_results
            ]
        })

    return result

@router.delete("/history/document/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    document = delete_document_by_id(db, document_id, current_user.id)

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    return {"message": "Document and all related data deleted"}

@router.delete("/history/task/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = delete_task_result_by_id(db, task_id, current_user.id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}
