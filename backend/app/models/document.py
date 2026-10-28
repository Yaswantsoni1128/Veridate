"""Document model."""

from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Document(BaseModel):
    """Uploaded document metadata linked to a candidate and verification case."""

    __tablename__ = "documents"

    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"), nullable=False, index=True)
    verification_case_id: Mapped[int | None] = mapped_column(
        ForeignKey("verification_cases.id"), nullable=True, index=True
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="uploaded", index=True
    )

    # Relationships
    candidate: Mapped["Candidate"] = relationship(back_populates="documents")
    verification_case: Mapped["VerificationCase | None"] = relationship(
        back_populates="documents"
    )

    def __repr__(self) -> str:
        return f"<Document(id={self.id}, file_name={self.file_name}, status={self.status})>"
