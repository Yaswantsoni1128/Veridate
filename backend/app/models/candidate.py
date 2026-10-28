"""Candidate model."""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Candidate(BaseModel):
    """Candidate profile for verification workflows."""

    __tablename__ = "candidates"

    full_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    application_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending", index=True
    )
    documents_count: Mapped[int] = mapped_column(default=0, nullable=False)

    # Relationships
    verification_cases: Mapped[list["VerificationCase"]] = relationship(
        back_populates="candidate", cascade="all, delete-orphan"
    )
    documents: Mapped[list["Document"]] = relationship(
        back_populates="candidate", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Candidate(id={self.id}, application_id={self.application_id}, full_name={self.full_name})>"
