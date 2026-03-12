# Smart Doc Analyzer

Smart Doc Analyzer is a full-stack app for uploading documents and running AI tasks such as summarization, translation, sentiment analysis, topic classification, and document Q&A.

## Features

- User authentication with email verification and password reset
- Profile setup and profile editing
- Document upload and chunking
- Semantic search + RAG-style question answering
- Task execution pipeline:
- `summarize_document`
- `translate`
- `topic_classification`
- `sentiment`
- `qa`
- Task history with delete actions
- Per-task user feedback and contact feedback form
- Model selection from backend-provided model registry

## Tech Stack

- Frontend: React + TypeScript + Vite + Zustand + Axios
- Backend: FastAPI + SQLAlchemy + Uvicorn
- Database: SQLite (`database/app.db`)
- AI/ML:
- Ollama (local LLM inference)
- Sentence Transformers (`all-MiniLM-L6-v2`) for embeddings
- FAISS for vector search

## Project Structure

```text
Smart-Doc-Analyzer/
  backend/                      # FastAPI backend
    app/
    requirements.txt
    .env
  frontend/smart-doc-analyzer/  # React frontend
    src/
    package.json
  database/                     # SQLAlchemy models + DB config
    models/
    repositories/
    db.py
  README.md
```

## Prerequisites

Install these first:

- Git
- Python 3.11 or 3.12
- Node.js 20+ and npm
- Ollama

Required downloads at runtime:

- Ollama models used by the app:
- `kwangsuklee/gemma-3-12b-it-Q4_K_M:latest`
- `qwen3-vl:8b`
- Hugging Face model on first backend start:
- `sentence-transformers/all-MiniLM-L6-v2`

All commands below are written for Windows PowerShell.

## 1) Download the Project

Clone the repository:

```powershell
git clone <your-repo-url>
cd Smart-Doc-Analyzer
```

## 2) Backend Setup

Create and activate a virtual environment from the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

Create `backend/.env` with at least:

```env
SECRET_KEY=change_this_to_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_app_password
```

Optional variables used in code:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FRONTEND_BASE_URL=http://localhost:5173
EXPOSE_VERIFICATION_CODE=false

SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_email@example.com
FEEDBACK_TO_EMAIL=your_email@example.com
FEEDBACK_FROM_EMAIL=your_email@example.com
```

Start backend from the project root:

```powershell
$env:PYTHONPATH="backend"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 3) Ollama Setup

In a separate PowerShell terminal:

```powershell
ollama serve
ollama pull kwangsuklee/gemma-3-12b-it-Q4_K_M:latest
ollama pull qwen3-vl:8b
```

## 4) Frontend Setup

In another terminal:

```powershell
cd frontend\smart-doc-analyzer
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:8000`.

## 5) Health Checks

- Backend root: `http://localhost:8000/`
- Backend health: `http://localhost:8000/health`
- FastAPI docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

## Important Notes

- Database tables are auto-created on backend startup.
- The current DB URL is hardcoded in `database/db.py` to:
- `sqlite:///C:/Users/user/OneDrive/Desktop/Smart-Doc-Analyzer/database/app.db`
- If you run the project from a different path or machine, update that value.
- Backend startup downloads `all-MiniLM-L6-v2` the first time; internet is required.
- Backend expects SMTP credentials for signup verification and feedback email flows.

## Make It Ready for GitHub Push

Before first push, make sure local/generated files are not staged:

- `venv/`
- `backend/venv/`
- `backend/node_modules/`
- `frontend/smart-doc-analyzer/node_modules/`
- `frontend/smart-doc-analyzer/dist/`
- `logs/` and `backend/logs/`
- `*.db`
- any `.env` files

If this folder is not a Git repo yet:

```powershell
git init
git add .
git restore --staged venv backend/venv backend/node_modules frontend/smart-doc-analyzer/node_modules frontend/smart-doc-analyzer/dist logs backend/logs
git restore --staged smart_doc.db database/app.db
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

Run this check before pushing:

```powershell
git status
```

Only source files and docs should appear as staged.
