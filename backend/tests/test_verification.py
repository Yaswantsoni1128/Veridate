"""Unit tests for the verification orchestration service."""

from app.services.extraction import ExtractionService
from app.services.matching import MatchingService
from app.services.ocr import OCRService
from app.services.verification import VerificationService
from app.schemas.verification import VerificationRequest


class TestVerificationService:
    """Tests for end-to-end verification orchestration."""

    def setup_method(self) -> None:
        self.service = VerificationService(
            ocr_service=OCRService(),
            extraction_service=ExtractionService(),
            matching_service=MatchingService(threshold=0.8),
        )
        self.request = VerificationRequest(
            full_name="John Doe",
            pan_number="ABCDE1234F",
            aadhaar_number="123456789012",
        )

    def test_verify_all_fields_match(self) -> None:
        """Test verification when all three fields match."""
        text = """
        Name: John Doe
        PAN: ABCDE1234F
        Aadhaar: 1234 5678 9012
        """
        response = self.service.verify_document(
            file_bytes=b"fake-bytes",
            content_type="image/png",
            request=self.request,
        )
        # OCR will return empty string (no real Tesseract), so extraction
        # will return None for all fields and matching will score 0.0
        assert response.overall_match is False
        assert response.match_count == 0
        assert response.total_fields == 3
        assert len(response.match_results) == 3

    def test_verify_empty_ocr_text(self) -> None:
        """Test verification when OCR returns empty text."""
        response = self.service.verify_document(
            file_bytes=b"fake-bytes",
            content_type="image/png",
            request=self.request,
        )
        assert response.extraction_result.raw_text == ""
        assert response.extraction_result.extracted_name is None
        assert response.overall_match is False

    def test_response_structure(self) -> None:
        """Test that the response contains all expected fields."""
        response = self.service.verify_document(
            file_bytes=b"fake-bytes",
            content_type="image/png",
            request=self.request,
        )
        assert hasattr(response, "overall_match")
        assert hasattr(response, "match_count")
        assert hasattr(response, "total_fields")
        assert hasattr(response, "extraction_result")
        assert hasattr(response, "match_results")
        assert hasattr(response, "message")
        assert isinstance(response.match_results, list)
        assert len(response.match_results) == 3

    def test_verify_empty_document(self) -> None:
        """Test the empty document fallback response."""
        response = self.service.verify_empty_document(self.request)
        assert response.overall_match is False
        assert response.match_count == 0
        assert response.extraction_result.raw_text is None
        assert "Could not extract readable text" in response.message
