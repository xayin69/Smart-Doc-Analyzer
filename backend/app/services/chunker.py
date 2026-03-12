def chunk_text(
    text: str,
    max_chars: int = 800,
    overlap_chars: int = 200
) -> list[str]:
    """
    Split cleaned text into overlapping chunks.
    Chunking is paragraph-based with character limits.
    """

    # 1. Split text into paragraphs (double newline)
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        # 2. If adding this paragraph exceeds max size → save chunk
        if len(current_chunk) + len(paragraph) > max_chars:
            chunks.append(current_chunk.strip())

            # 3. Create overlap from the end of previous chunk
            overlap = current_chunk[-overlap_chars:] if overlap_chars > 0 else ""
            current_chunk = overlap + "\n\n" + paragraph
        else:
            # 4. Otherwise, keep building current chunk
            if current_chunk:
                current_chunk += "\n\n" + paragraph
            else:
                current_chunk = paragraph

    # 5. Add the last chunk
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks
