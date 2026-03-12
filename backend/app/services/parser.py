import pdfplumber

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF file provided as bytes.
    Supports multi-page PDFs.
    """
    text = ""

    with pdfplumber.open(file_bytes) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    return text.strip()
