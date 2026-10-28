"""API routes for document management."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.document import Document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/")
def list_documents(
    skip: int = 0,
    limit: int = 50,
    case_id: int | None = None,
    db: Session = Depends(get_db),
):
    """List documents with optional case filter."""
    query = db.query(Document)
    if case_id:
        query = query.filter(Document.verification_case_id == case_id)
    total = query.count()
    documents = query.offset(skip).limit(limit).all()
    return {"items": documents, "total": total, "skip": skip, "limit": limit}
