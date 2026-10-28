"""API routes for verification cases."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.verification_case import VerificationCase
from app.repositories.verification_case import VerificationCaseRepository

router = APIRouter(prefix="/cases", tags=["cases"])


@router.get("/")
def list_cases(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    candidate_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """List verification cases with optional filters."""
    query = db.query(VerificationCase)
    if status:
        query = query.filter(VerificationCase.status == status)
    if candidate_id:
        query = query.filter(VerificationCase.candidate_id == candidate_id)
    total = query.count()
    cases = query.order_by(VerificationCase.created_at.desc()).offset(skip).limit(limit).all()
    return {"items": cases, "total": total, "skip": skip, "limit": limit}


@router.get("/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get a verification case by ID."""
    repo = VerificationCaseRepository(db)
    case = repo.get(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification case not found",
        )
    return case


@router.patch("/{case_id}")
def update_case(
    case_id: int,
    status: Optional[str] = None,
    overall_match: Optional[bool] = None,
    message: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Update a verification case (reviewer decisions)."""
    repo = VerificationCaseRepository(db)
    case = repo.get(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification case not found",
        )
    if status is not None:
        case.status = status
    if overall_match is not None:
        case.overall_match = overall_match
    if message is not None:
        case.message = message
    db.commit()
    db.refresh(case)
    return case
