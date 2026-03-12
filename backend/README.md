# Smart Doc Analyzer Backend

This folder contains the FastAPI backend for Smart Doc Analyzer.

All commands below are written for Windows PowerShell.

## What This Backend Uses

Main Python libraries (from `requirements.txt`):

- `fastapi`, `uvicorn`, `starlette`
- `sqlalchemy`
- `python-jose`, `passlib`, `bcrypt`
- `python-dotenv`, `email-validator`, `python-multipart`
- `pdfplumber`
- `sentence-transformers`, `transformers`, `torch`
- `faiss-cpu`

LLM/runtime dependencies used by the code:

- Ollama server on `http://localhost:11434`
- Ollama models:
- `kwangsuklee/gemma-3-12b-it-Q4_K_M:latest`
- `qwen3-vl:8b`

## Prerequisites

- Python 3.11 or 3.12
- `pip`
- Ollama installed

## Install Python Dependencies

From project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

## Environment Variables (`backend/.env`)

Required:

```env
SECRET_KEY=change_this_to_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_app_password
```

Optional (used in some routes):

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FRONTEND_BASE_URL=http://localhost:5173
EXPOSE_VERIFICATION_CODE=false

SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_email@example.com
FEEDBACK_TO_EMAIL=your_email@example.com
FEEDBACK_FROM_EMAIL=your_email@example.com
```

## Start Ollama

In a separate PowerShell terminal:

```powershell
ollama serve
ollama pull kwangsuklee/gemma-3-12b-it-Q4_K_M:latest
ollama pull qwen3-vl:8b
```

## Run Backend

Run from project root (important because this backend imports both `app` and root `database` modules):

```powershell
$env:PYTHONPATH="backend"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:

- `http://localhost:8000/`
- `http://localhost:8000/health`
- `http://localhost:8000/docs`

## Notes

- Database tables are created at startup.
- Embeddings model `all-MiniLM-L6-v2` is downloaded on first run (internet required once).
- Database path is currently hardcoded in `database/db.py`.
- If you clone to another location, update `DATABASE_URL` there.
