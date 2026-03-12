from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker
from database.base import Base
from database.models.document import Document
from database.models.chunk import Chunk 
from database.models.task_result import TaskResult
from database.models.user import User
from database.models.password_reset_token import PasswordResetToken
from database.models.feedback import Feedback
from database.models.user_profile import UserProfile


# ===============================
# DATABASE CONFIG
# ===============================

DATABASE_URL = "sqlite:///C:/Users/user/OneDrive/Desktop/Smart-Doc-Analyzer/database/app.db"

# ===============================
# ENGINE
# ===============================

engine = create_engine(
    DATABASE_URL,
    echo=False,          # set True if you want SQL logs
    future=True
)


@event.listens_for(engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# ===============================
# SESSION
# ===============================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    future=True
)


# ===============================
# DB INIT
# ===============================

def init_db():
    """
    Create all tables.
    Called once at startup.
    """
    Base.metadata.create_all(bind=engine)
    _ensure_question_column()


def _ensure_question_column():
    """
    Lightweight SQLite migration for legacy DBs:
    add task_results.question if it's missing.
    """
    with engine.connect() as conn:
        columns = conn.execute(text("PRAGMA table_info(task_results)")).fetchall()
        column_names = {row[1] for row in columns}
        if "question" not in column_names:
            conn.execute(text("ALTER TABLE task_results ADD COLUMN question TEXT"))
            conn.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
