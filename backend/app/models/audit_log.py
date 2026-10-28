"""Audit log model."""

from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class AuditLog(BaseModel):
    """Immutable audit trail entry for verification system actions."""

    __tablename__ = "audit_logs"

    actor: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    case_id: Mapped[int | None] = mapped_column(
        ForeignKey("verification_cases.id"), nullable=True, index=True
    )
    metadata_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    verification_case: Mapped["VerificationCase | None"] = relationship(
        back_populates="audit_logs"
    )

    def __repr__(self) -> str:
        return f"<AuditLog(id={self.id}, actor={self.actor}, action={self.action})>"
