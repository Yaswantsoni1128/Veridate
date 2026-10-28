"""Candidate repository for data access operations."""

from typing import Optional

from sqlalchemy.orm import Session

from app.models.candidate import Candidate


class CandidateRepository:
    """Repository for Candidate model operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, candidate_id: int) -> Optional[Candidate]:
        """Get a candidate by ID."""
        return self.db.query(Candidate).filter(Candidate.id == candidate_id).first()

    def get_by_application_id(self, application_id: str) -> Optional[Candidate]:
        """Get a candidate by application ID."""
        return (
            self.db.query(Candidate)
            .filter(Candidate.application_id == application_id)
            .first()
        )

    def create(
        self,
        full_name: str,
        application_id: str,
        email: Optional[str] = None,
    ) -> Candidate:
        """Create a new candidate."""
        candidate = Candidate(
            full_name=full_name,
            application_id=application_id,
            email=email,
            status="pending",
            documents_count=0,
        )
        self.db.add(candidate)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def update_status(self, candidate_id: int, status: str) -> Optional[Candidate]:
        """Update a candidate's status."""
        candidate = self.get(candidate_id)
        if candidate:
            candidate.status = status
            self.db.commit()
            self.db.refresh(candidate)
        return candidate

    def increment_documents(self, candidate_id: int) -> Optional[Candidate]:
        """Increment the document count for a candidate."""
        candidate = self.get(candidate_id)
        if candidate:
            candidate.documents_count += 1
            self.db.commit()
            self.db.refresh(candidate)
        return candidate
