import re

def clean_text(text: str) -> str:
    """
    Clean extracted text to make it suitable for NLP & embeddings.
    Works for English and Arabic.
    """

    # Normalize line endings
    text = text.replace("\r\n", "\n")

    # Remove excessive newlines (keep structure)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove excessive spaces
    text = re.sub(r"[ \t]{2,}", " ", text)

    # Remove non-printable characters
    text = re.sub(r"[^\x09\x0A\x0D\x20-\x7E\u0600-\u06FF]", "", text)

    return text.strip()
