"""API routes for verification endpoints."""

import logging
import os

from fastapi import APIRouter, File, Form, UploadFile, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.repositories.audit_log import AuditLogRepository
from app.repositories.candidate import CandidateRepository
from app.repositories.document import DocumentRepository
from app.repositories.verification_case import VerificationCaseRepository
from app.schemas.verification import (
    HealthResponse,
    VerificationRequest,
    VerificationResponse,
)
from app.services.file_validation import FileValidationService, FileValidationError
from app.services.verification import VerificationService
from app.services.temp_file import temp_file

logger = logging.getLogger(__name__)

router = APIRouter()

# Instantiate services once at module load
validation_service = FileValidationService()
verification_service = VerificationService()


@router.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="healthy")


@router.post("/verify-document", response_model=VerificationResponse, tags=["verification"])
async def verify_document(
    full_name: str = Form(...),
    pan_number: str = Form(...),
    aadhaar_number: str = Form(...),
    document: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> VerificationResponse:
    """Verify an uploaded document against candidate-submitted form data.

    Args:
        full_name: Candidate's full name.
        pan_number: Candidate's PAN number.
        aadhaar_number: Candidate's Aadhaar number.
        document: Uploaded image or PDF file.
        db: Database session.

    Returns:
        VerificationResponse with extraction and matching results.

    Raises:
        HTTPException: For validation errors or processing failures.
    """
    request = VerificationRequest(
        full_name=full_name,
        pan_number=pan_number,
        aadhaar_number=aadhaar_number,
    )

    # Read uploaded file bytes
    file_bytes = await document.read()
    filename = document.filename or "document"
    content_type = document.content_type
    file_size = len(file_bytes)

    # Validate the file
    try:
        detected_mime = validation_service.validate(
            filename=filename,
            content_type=content_type,
            file_size=file_size,
            file_bytes=file_bytes,
        )
    except FileValidationError as exc:
        logger.warning("File validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    # Extract text and verify using a temp file (for pdf2image compatibility)
    try:
        with temp_file(file_bytes, suffix=os.path.splitext(filename)[1].lower()) as tmp_path:
            # Read the temp file back for processing
            with open(tmp_path, "rb") as f:
                tmp_bytes = f.read()
            response = verification_service.verify_document(
                file_bytes=tmp_bytes,
                content_type=detected_mime,
                request=request,
            )
    except Exception as exc:
        logger.error("Verification failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Document verification failed. Please try again.",
        )

    # Persist results to database
    try:
        candidate_repo = CandidateRepository(db)
        candidate = candidate_repo.get_by_application_id("APP-WALKIN")
        if not candidate:
            candidate = candidate_repo.create(
                full_name=full_name,
                application_id="APP-WALKIN",
            )
        candidate_repo.increment_documents(candidate.id)

        case_repo = VerificationCaseRepository(db)
        case = case_repo.create(
            candidate_id=candidate.id,
            status="completed",
            overall_match=response.overall_match,
            match_count=response.match_count,
            total_fields=response.total_fields,
            message=response.message,
        )

        doc_repo = DocumentRepository(db)
        doc_repo.create(
            candidate_id=candidate.id,
            verification_case_id=case.id,
            file_name=filename,
            file_type=detected_mime,
            file_size=file_size,
            storage_path=f"/uploads/{filename}",
            status="processed",
        )

        audit_repo = AuditLogRepository(db)
        audit_repo.create(
            actor="system",
            action="verification_completed",
            case_id=case.id,
            metadata={
                "overall_match": response.overall_match,
                "match_count": response.match_count,
                "total_fields": response.total_fields,
            },
        )
    except Exception as exc:
        # Don't fail the response if persistence fails
        logger.warning("Failed to persist verification results: %s", exc)

    return response
