"""Document repository for data access operations."""

from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    """Repository for Document model operations."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, document_id: int) -> Optional[Document]:
        """Get a document by ID."""
        return self.db.query(Document).filter(Document.id == document_id).first()

    def get_by_case(self, case_id: int) -> List[Document]:
        """Get all documents for a verification case."""
        return (
            self.db.query(Document)
            .filter(Document.verification_case_id == case_id)
            .all()
        )

    def create(
        self,
        candidate_id: int,
        file_name: str,
        file_type: str,
        file_size: int,
        storage_path: str,
        verification_case_id: Optional[int] = None,
        status: str = "uploaded",
    ) -> Document:
        """Create a new document record."""
        document = Document(
            candidate_id=candidate_id,
            verification_case_id=verification_case_id,
            file_name=file_name,
            file_type=file_type,
            file_size=file_size,
            storage_path=storage_path,
            status=status,
        )
        self.db.add(document)
        self.db.commit()
        self.db.refresh(document)
        return document

    def update_status(
        self, document_id: int, status: str
    ) -> Optional[Document]:
        """Update a document's processing status."""
        document = self.get(document_id)
        if document:
            document.status = status
            self.db.commit()
            self.db.refresh(document)
        return document
