"""API routes for dashboard metrics."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.candidate import Candidate
from app.models.verification_case import VerificationCase

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """Get dashboard metrics."""
    total_candidates = db.query(Candidate).count()
    total_cases = db.query(VerificationCase).count()
    cases_awaiting_review = (
        db.query(VerificationCase)
        .filter(VerificationCase.status == "review_required")
        .count()
    )
    matched_cases = (
        db.query(VerificationCase)
        .filter(VerificationCase.overall_match == True)  # noqa: E712
        .count()
    )
    mismatch_cases = (
        db.query(VerificationCase)
        .filter(VerificationCase.overall_match == False)  # noqa: E712
        .count()
    )
    return {
        "total_candidates": total_candidates,
        "total_cases": total_cases,
        "cases_awaiting_review": cases_awaiting_review,
        "matched_cases": matched_cases,
        "mismatch_cases": mismatch_cases,
    }
