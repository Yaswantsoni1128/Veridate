"""Database configuration and session management.

Database URL is configured through the DATABASE_URL environment variable.
For local development, SQLite is used by default. For production, set
DATABASE_URL to a PostgreSQL connection string.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.base import BaseModel

DATABASE_URL = settings.database_url

# For SQLite, check_same_thread must be False for use with FastAPI
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = BaseModel


def get_db():
    """Yield a database session and ensure it is closed afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
