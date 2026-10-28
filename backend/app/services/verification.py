"""Verification orchestration service.

Combines OCR extraction, field parsing, and fuzzy matching into a single
verification workflow while preserving the existing API contract.
"""

import logging
from typing import Optional

from app.core.config import settings
from app.schemas.verification import (
    ExtractionResult,
    MatchResult,
    VerificationResponse,
    VerificationRequest,
)
from app.services.extraction import ExtractionService
from app.services.matching import MatchingService
from app.services.ocr import OCRService

logger = logging.getLogger(__name__)

# Field order for comparison, consistent with the existing engine
FIELD_ORDER = ["full_name", "pan_number", "aadhaar_number"]

# Mapping from form field to extraction result attribute
EXTRACTION_FIELD_MAP = {
    "full_name": "extracted_name",
    "pan_number": "extracted_pan",
    "aadhaar_number": "extracted_aadhaar",
}


class VerificationService:
    """Orchestrates the end-to-end document verification workflow."""

    def __init__(
        self,
        ocr_service: OCRService | None = None,
        extraction_service: ExtractionService | None = None,
        matching_service: MatchingService | None = None,
    ) -> None:
        self.ocr_service = ocr_service or OCRService()
        self.extraction_service = extraction_service or ExtractionService()
        self.matching_service = (
            matching_service or MatchingService(threshold=settings.match_threshold)
        )

    def verify_document(
        self,
        file_bytes: bytes,
        content_type: str,
        request: VerificationRequest,
    ) -> VerificationResponse:
        """Run the full verification workflow.

        Args:
            file_bytes: Raw uploaded document bytes.
            content_type: MIME type of the uploaded file.
            request: Candidate-submitted form data.

        Returns:
            VerificationResponse with extraction and matching results.
        """
        # Step 1: Extract text from the document
        raw_text = self.ocr_service.extract(file_bytes, content_type)

        # Step 2: Parse identity fields from extracted text
        extraction_result = self.extraction_service.extract(raw_text)

        # Step 3: Compare submitted values with extracted values
        match_results: list[MatchResult] = []
        for field_name in FIELD_ORDER:
            form_value = getattr(request, field_name)
            extraction_attr = EXTRACTION_FIELD_MAP[field_name]
            extracted_value = getattr(extraction_result, extraction_attr)
            match_results.append(
                self.matching_service.compare_field(
                    field_name, form_value, extracted_value
                )
            )

        # Step 4: Aggregate results
        match_count = sum(1 for mr in match_results if mr.matched)
        total_fields = len(match_results)
        overall_match = match_count >= settings.min_match_count

        if overall_match:
            message = (
                f"✓ Document verified! {match_count} out of {total_fields} fields matched."
            )
        else:
            message = (
                f"✗ Document verification failed! Only {match_count} out of {total_fields} fields matched."
            )

        return VerificationResponse(
            overall_match=overall_match,
            match_count=match_count,
            total_fields=total_fields,
            extraction_result=extraction_result,
            match_results=match_results,
            message=message,
        )

    def verify_empty_document(self, request: VerificationRequest) -> VerificationResponse:
        """Handle verification when no readable text could be extracted.

        Returns a failed response with empty extraction results.
        """
        extraction_result = ExtractionResult(
            raw_text=None,
            extracted_name=None,
            extracted_pan=None,
            extracted_aadhaar=None,
        )
        match_results: list[MatchResult] = []
        for field_name in FIELD_ORDER:
            form_value = getattr(request, field_name)
            match_results.append(
                self.matching_service.compare_field(
                    field_name, form_value, None
                )
            )

        return VerificationResponse(
            overall_match=False,
            match_count=0,
            total_fields=len(match_results),
            extraction_result=extraction_result,
            match_results=match_results,
            message=(
                "✗ Document verification failed! Could not extract readable text "
                "from the uploaded document."
            ),
        )
