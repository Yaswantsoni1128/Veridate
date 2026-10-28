"""Unit tests for the OCR service."""

import io
from unittest.mock import MagicMock, patch

import pytest
from PIL import Image

from app.services.ocr import OCRService


class TestOCRService:
    """Tests for OCR text extraction."""

    def setup_method(self) -> None:
        self.service = OCRService(timeout=30)

    @patch("app.services.ocr.pytesseract.image_to_string")
    @patch("app.services.ocr.Image.open")
    def test_extract_from_image_success(
        self, mock_image_open: MagicMock, mock_ocr: MagicMock
    ) -> None:
        """Test successful OCR extraction from an image."""
        mock_image = MagicMock(spec=Image.Image)
        mock_image_open.return_value = mock_image
        mock_ocr.return_value = "John Doe\nABCDE1234F\n123456789012"

        result = self.service.extract_from_image(b"fake-image-bytes")

        assert result == "John Doe\nABCDE1234F\n123456789012"
        mock_ocr.assert_called_once_with(mock_image, timeout=30)

    @patch("app.services.ocr.pytesseract.image_to_string")
    @patch("app.services.ocr.Image.open")
    def test_extract_from_image_failure(
        self, mock_image_open: MagicMock, mock_ocr: MagicMock
    ) -> None:
        """Test OCR extraction returns empty string on failure."""
        mock_image_open.side_effect = Exception("Invalid image")

        result = self.service.extract_from_image(b"invalid-bytes")

        assert result == ""

    @patch("app.services.ocr.convert_from_bytes")
    @patch("app.services.ocr.pytesseract.image_to_string")
    def test_extract_from_pdf_success(
        self, mock_ocr: MagicMock, mock_convert: MagicMock
    ) -> None:
        """Test successful OCR extraction from a PDF."""
        mock_page1 = MagicMock()
        mock_page2 = MagicMock()
        mock_convert.return_value = [mock_page1, mock_page2]
        mock_ocr.side_effect = ["Page 1 text", "Page 2 text"]

        result = self.service.extract_from_pdf(b"fake-pdf-bytes")

        assert result == "Page 1 text Page 2 text"
        assert mock_ocr.call_count == 2

    @patch("app.services.ocr.convert_from_bytes")
    def test_extract_from_pdf_failure(
        self, mock_convert: MagicMock
    ) -> None:
        """Test PDF extraction returns empty string on failure."""
        mock_convert.side_effect = Exception("PDF conversion failed")

        result = self.service.extract_from_pdf(b"invalid-pdf")

        assert result == ""

    def test_extract_routes_to_image(self) -> None:
        """Test that non-PDF content types route to image extraction."""
        with patch.object(
            self.service, "extract_from_image", return_value="image text"
        ) as mock_image, patch.object(
            self.service, "extract_from_pdf", return_value="pdf text"
        ) as mock_pdf:
            result = self.service.extract(b"bytes", "image/png")
            assert result == "image text"
            mock_image.assert_called_once_with(b"bytes")
            mock_pdf.assert_not_called()

    def test_extract_routes_to_pdf(self) -> None:
        """Test that PDF content types route to PDF extraction."""
        with patch.object(
            self.service, "extract_from_image", return_value="image text"
        ) as mock_image, patch.object(
            self.service, "extract_from_pdf", return_value="pdf text"
        ) as mock_pdf:
            result = self.service.extract(b"bytes", "application/pdf")
            assert result == "pdf text"
            mock_pdf.assert_called_once_with(b"bytes")
            mock_image.assert_not_called()
