"""Verification case model."""

from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class VerificationCase(BaseModel):
    """A verification case linking a candidate to document verification results."""

    __tablename__ = "verification_cases"

    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending", index=True
    )
    overall_match: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    match_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_fields: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    message: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    candidate: Mapped["Candidate"] = relationship(back_populates="verification_cases")
    documents: Mapped[list["Document"]] = relationship(
        back_populates="verification_case", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[list["AuditLog"]] = relationship(
        back_populates="verification_case", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<VerificationCase(id={self.id}, candidate_id={self.candidate_id}, status={self.status})>"
