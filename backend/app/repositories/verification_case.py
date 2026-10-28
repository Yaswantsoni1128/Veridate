"""Verification case repository for data access operations."""

from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.verification_case import VerificationCase


class VerificationCaseRepository:
    """Repository for VerificationCase model operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, case_id: int) -> Optional[VerificationCase]:
        """Get a verification case by ID."""
        return (
            self.db.query(VerificationCase)
            .filter(VerificationCase.id == case_id)
            .first()
        )

    def get_by_candidate(self, candidate_id: int) -> List[VerificationCase]:
        """Get all verification cases for a candidate."""
        return (
            self.db.query(VerificationCase)
            .filter(VerificationCase.candidate_id == candidate_id)
            .order_by(VerificationCase.created_at.desc())
            .all()
        )

    def create(
        self,
        candidate_id: int,
        status: str = "pending",
        overall_match: Optional[bool] = None,
        match_count: int = 0,
        total_fields: int = 0,
        message: Optional[str] = None,
    ) -> VerificationCase:
        """Create a new verification case."""
        case = VerificationCase(
            candidate_id=candidate_id,
            status=status,
            overall_match=overall_match,
            match_count=match_count,
            total_fields=total_fields,
            message=message,
        )
        self.db.add(case)
        self.db.commit()
        self.db.refresh(case)
        return case

    def update_result(
        self,
        case_id: int,
        status: str,
        overall_match: bool,
        match_count: int,
        total_fields: int,
        message: str,
    ) -> Optional[VerificationCase]:
        """Update a verification case with results."""
        case = self.get(case_id)
        if case:
            case.status = status
            case.overall_match = overall_match
            case.match_count = match_count
            case.total_fields = total_fields
            case.message = message
            self.db.commit()
            self.db.refresh(case)
        return case

    def list_all(self, skip: int = 0, limit: int = 50) -> List[VerificationCase]:
        """List verification cases with pagination."""
        return (
            self.db.query(VerificationCase)
            .order_by(VerificationCase.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
