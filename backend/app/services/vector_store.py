import faiss
import numpy as np

# Global in-memory index (for now)
faiss_index = None
index_to_chunk = {}


def create_faiss_index(embedding_dim: int):
    """
    Create a FAISS index for storing embeddings.
    Uses L2 distance (works well with normalized embeddings).
    """
    global faiss_index
    faiss_index = faiss.IndexFlatL2(embedding_dim)
    return faiss_index


def store_embeddings(embeddings: list, chunks: list, metadata: dict):
    """
    Store embeddings in FAISS and keep mapping to original text.
    """
    global faiss_index, index_to_chunk

    if faiss_index is None:
        raise ValueError("FAISS index not initialized")

    vectors = np.array(embeddings).astype("float32")
    start_index = faiss_index.ntotal

    faiss_index.add(vectors)

    for i, chunk in enumerate(chunks):
        index_to_chunk[start_index + i] = {
            "text": chunk,
            "metadata": metadata
        }
