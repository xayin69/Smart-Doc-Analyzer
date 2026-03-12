from sentence_transformers import SentenceTransformer
# Load once (important for performance)
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks(chunks: list[str]):
    """
    Convert text chunks into vector embeddings
    """
    if not chunks:
        return []

    embeddings = model.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embeddings
