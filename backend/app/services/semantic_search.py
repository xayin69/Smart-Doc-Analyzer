import numpy as np
from app.services.embeddings import embed_chunks

def semantic_search(
    query: str,
    faiss_index,
    top_k: int = 3,
    index_to_chunk: dict[int, dict] | None = None,
    chunks: list[str] | None = None,
):
    """
    Perform semantic search over document chunks.
    """

    # Embed the user query
    query_embedding = embed_chunks([query])[0]
    query_vector = np.array([query_embedding]).astype("float32")

    # Search FAISS
    distances, indices = faiss_index.search(query_vector, top_k)

    # Map results back to text chunks
    results = []
    for idx, score in zip(indices[0], distances[0]):
        idx = int(idx)

        if index_to_chunk is not None:
            chunk_info = index_to_chunk.get(idx)
            if chunk_info is None:
                continue
            results.append(
                {
                    "chunk": chunk_info["text"],
                    "metadata": chunk_info["metadata"],
                    "score": float(score),
                }
            )
            continue

        if chunks is None:
            continue

        if idx < 0 or idx >= len(chunks):
            continue

        results.append(
            {
                "chunk": chunks[idx],
                "score": float(score),
            }
        )

    return results
