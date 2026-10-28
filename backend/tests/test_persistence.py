"""Persistence layer tests using SQLite in-memory database."""

import json
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.database import Base
from app.repositories.candidate import CandidateRepository
from app.repositories.verification_case import VerificationCaseRepository
from app.repositories.document import DocumentRepository
from app.repositories.audit_log import AuditLogRepository


@pytest.fixture
def db_session():
    """Create a fresh SQLite in-memory database for each test."""
    test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(test_engine)
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(test_engine)


class TestCandidateRepository:
    """Tests for CandidateRepository."""

    def test_create_candidate(self, db_session):
        """Test creating a new candidate."""
        repo = CandidateRepository(db_session)
        candidate = repo.create(
            full_name="John Doe",
            application_id="APP-001",
            email="john@example.com",
        )
        assert candidate.id is not None
        assert candidate.full_name == "John Doe"
        assert candidate.application_id == "APP-001"
        assert candidate.email == "john@example.com"
        assert candidate.status == "pending"
        assert candidate.documents_count == 0

    def test_get_candidate(self, db_session):
        """Test retrieving a candidate by ID."""
        repo = CandidateRepository(db_session)
        candidate = repo.create(
            full_name="Jane Smith",
            application_id="APP-002",
        )
        retrieved = repo.get(candidate.id)
        assert retrieved is not None
        assert retrieved.full_name == "Jane Smith"

    def test_get_by_application_id(self, db_session):
        """Test retrieving a candidate by application ID."""
        repo = CandidateRepository(db_session)
        repo.create(full_name="Bob", application_id="APP-003")
        candidate = repo.get_by_application_id("APP-003")
        assert candidate is not None
        assert candidate.full_name == "Bob"

    def test_update_status(self, db_session):
        """Test updating candidate status."""
        repo = CandidateRepository(db_session)
        candidate = repo.create(full_name="Test", application_id="APP-004")
        updated = repo.update_status(candidate.id, "processing")
        assert updated is not None
        assert updated.status == "processing"

    def test_increment_documents(self, db_session):
        """Test incrementing document count."""
        repo = CandidateRepository(db_session)
        candidate = repo.create(full_name="Test", application_id="APP-005")
        repo.increment_documents(candidate.id)
        repo.increment_documents(candidate.id)
        updated = repo.get(candidate.id)
        assert updated.documents_count == 2


class TestVerificationCaseRepository:
    """Tests for VerificationCaseRepository."""

    def test_create_case(self, db_session):
        """Test creating a verification case."""
        candidate_repo = CandidateRepository(db_session)
        candidate = candidate_repo.create(full_name="Test", application_id="APP-006")

        repo = VerificationCaseRepository(db_session)
        case = repo.create(
            candidate_id=candidate.id,
            status="processing",
            match_count=2,
            total_fields=3,
            message="Test message",
        )
        assert case.id is not None
        assert case.candidate_id == candidate.id
        assert case.match_count == 2
        assert case.total_fields == 3

    def test_get_by_candidate(self, db_session):
        """Test getting cases by candidate."""
        candidate_repo = CandidateRepository(db_session)
        candidate = candidate_repo.create(full_name="Test", application_id="APP-007")

        repo = VerificationCaseRepository(db_session)
        repo.create(candidate_id=candidate.id, status="pending")
        repo.create(candidate_id=candidate.id, status="completed")

        cases = repo.get_by_candidate(candidate.id)
        assert len(cases) == 2

    def test_update_result(self, db_session):
        """Test updating case results."""
        candidate_repo = CandidateRepository(db_session)
        candidate = candidate_repo.create(full_name="Test", application_id="APP-008")

        repo = VerificationCaseRepository(db_session)
        case = repo.create(candidate_id=candidate.id, status="pending")
        updated = repo.update_result(
            case_id=case.id,
            status="completed",
            overall_match=True,
            match_count=3,
            total_fields=3,
            message="All matched",
        )
        assert updated is not None
        assert updated.status == "completed"
        assert updated.overall_match is True
        assert updated.match_count == 3


class TestDocumentRepository:
    """Tests for DocumentRepository."""

    def test_create_document(self, db_session):
        """Test creating a document record."""
        candidate_repo = CandidateRepository(db_session)
        candidate = candidate_repo.create(full_name="Test", application_id="APP-009")

        repo = DocumentRepository(db_session)
        doc = repo.create(
            candidate_id=candidate.id,
            file_name="id_card.jpg",
            file_type="image/jpeg",
            file_size=1024,
            storage_path="/uploads/id_card.jpg",
        )
        assert doc.id is not None
        assert doc.file_name == "id_card.jpg"
        assert doc.status == "uploaded"

    def test_update_status(self, db_session):
        """Test updating document status."""
        candidate_repo = CandidateRepository(db_session)
        candidate = candidate_repo.create(full_name="Test", application_id="APP-010")
        doc_repo = DocumentRepository(db_session)
        doc = doc_repo.create(
            candidate_id=candidate.id,
            file_name="test.pdf",
            file_type="application/pdf",
            file_size=2048,
            storage_path="/uploads/test.pdf",
        )
        updated = doc_repo.update_status(doc.id, "processed")
        assert updated is not None
        assert updated.status == "processed"


class TestAuditLogRepository:
    """Tests for AuditLogRepository."""

    def test_create_audit_log(self, db_session):
        """Test creating an audit log entry."""
        repo = AuditLogRepository(db_session)
        log = repo.create(
            actor="analyst@example.com",
            action="case_created",
            case_id=1,
            metadata={"field": "value"},
        )
        assert log.id is not None
        assert log.actor == "analyst@example.com"
        assert log.action == "case_created"
        assert log.case_id == 1
        assert json.loads(log.metadata_json) == {"field": "value"}

    def test_list_by_case(self, db_session):
        """Test listing audit logs by case."""
        repo = AuditLogRepository(db_session)
        repo.create(actor="user1", action="upload", case_id=1)
        repo.create(actor="user1", action="verify", case_id=1)
        repo.create(actor="user1", action="review", case_id=2)

        logs = repo.list_by_case(1)
        assert len(logs) == 2
