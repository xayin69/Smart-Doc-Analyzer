
from typing import Dict, List


DOCUMENT_STORE: Dict[str, Dict] = {}

def save_document(
    filename: str,
    clean_text: str,
    chunks: List[str]
):
    DOCUMENT_STORE[filename] = {
        "clean_text": clean_text,
        "chunks": chunks
    }

def get_chunks(filename: str) -> List[str]:
    if filename not in DOCUMENT_STORE:
        raise ValueError("Document not found. Upload it first.")
    return DOCUMENT_STORE[filename]["chunks"]

def get_clean_text(filename: str) -> str:
    if filename not in DOCUMENT_STORE:
        raise ValueError("Document not found. Upload it first.")
    return DOCUMENT_STORE[filename]["clean_text"]
