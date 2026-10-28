"""API routes for candidate management."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.candidate import Candidate
from app.repositories.candidate import CandidateRepository

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_candidate(
    full_name: str,
    application_id: str,
    email: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Create a new candidate."""
    repo = CandidateRepository(db)
    existing = repo.get_by_application_id(application_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Candidate with application ID {application_id} already exists",
        )
    return repo.create(full_name=full_name, application_id=application_id, email=email)


@router.get("/{candidate_id}")
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Get a candidate by ID."""
    repo = CandidateRepository(db)
    candidate = repo.get(candidate_id)
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )
    return candidate


@router.get("/")
def list_candidates(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List candidates with optional search and status filter."""
    query = db.query(Candidate)
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            Candidate.full_name.ilike(search_term)
            | Candidate.application_id.ilike(search_term)
        )
    if status:
        query = query.filter(Candidate.status == status)
    total = query.count()
    candidates = query.offset(skip).limit(limit).all()
    return {"items": candidates, "total": total, "skip": skip, "limit": limit}
