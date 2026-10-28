"""OCR text extraction service using Tesseract."""

import logging
from typing import Optional

import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image

from app.core.config import settings

logger = logging.getLogger(__name__)


# Configure Tesseract path if provided via environment
if settings.tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd


class OCRService:
    """Service responsible for extracting text from images and PDFs."""

    def __init__(self, timeout: int | None = None) -> None:
        self.timeout = timeout or settings.tesseract_timeout

    def extract_from_image(self, image_bytes: bytes) -> str:
        """Extract text from an image file using Tesseract OCR.

        Args:
            image_bytes: Raw image file bytes.

        Returns:
            Extracted text as a string. Empty string on failure.
        """
        try:
            image = Image.open(__import__("io").BytesIO(image_bytes))
            text = pytesseract.image_to_string(image, timeout=self.timeout)
            return text.strip()
        except Exception as exc:
            logger.error("OCR image extraction failed: %s", exc)
            return ""

    def extract_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract text from a PDF by converting pages to images and running OCR.

        Args:
            pdf_bytes: Raw PDF file bytes.

        Returns:
            Combined extracted text from all pages. Empty string on failure.
        """
        try:
            images = convert_from_bytes(pdf_bytes)
            all_text: list[str] = []
            for image in images:
                text = pytesseract.image_to_string(image, timeout=self.timeout)
                all_text.append(text.strip())
            return " ".join(all_text).strip()
        except Exception as exc:
            logger.error("OCR PDF extraction failed: %s", exc)
            return ""

    def extract(self, file_bytes: bytes, content_type: str) -> str:
        """Route extraction based on content type.

        Args:
            file_bytes: Raw file bytes.
            content_type: MIME type of the file.

        Returns:
            Extracted text string.
        """
        if content_type == "application/pdf":
            return self.extract_from_pdf(file_bytes)
        return self.extract_from_image(file_bytes)
