"""Field extraction service for parsing identity fields from OCR text."""

import re
import logging
from typing import Optional

from app.schemas.verification import ExtractionResult

logger = logging.getLogger(__name__)

# PAN pattern: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)
PAN_PATTERN = re.compile(r"[A-Z]{5}[0-9]{4}[A-Z]")

# Aadhaar pattern: 12 digits, optionally grouped with spaces
AADHAAR_PATTERN = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b|\d{12}\b")


class ExtractionService:
    """Service responsible for parsing identity fields from raw OCR text."""

    def parse_name(self, text: str) -> Optional[str]:
        """Extract a candidate name from OCR text.

        Heuristic: first non-empty line under 100 characters that contains
        letters and does not start with digits.
        """
        lines = text.split("\n")
        for line in lines:
            line_clean = line.strip()
            if not line_clean or len(line_clean) >= 100:
                continue
            if not any(c.isalpha() for c in line_clean):
                continue
            if any(char.isdigit() for char in line_clean[:20]):
                continue
            return line_clean
        return None

    def parse_pan(self, text: str) -> Optional[str]:
        """Extract a PAN number using regex pattern matching."""
        text_upper = text.upper()
        matches = PAN_PATTERN.findall(text_upper)
        return matches[0] if matches else None

    def parse_aadhaar(self, text: str) -> Optional[str]:
        """Extract an Aadhaar number using regex pattern matching.

        Spaces are stripped from the matched value.
        """
        matches = AADHAAR_PATTERN.findall(text)
        if not matches:
            return None
        return matches[0].replace(" ", "")

    def extract(self, text: str) -> ExtractionResult:
        """Parse all identity fields from OCR text.

        Args:
            text: Raw OCR extracted text.

        Returns:
            ExtractionResult with raw text and parsed fields.
        """
        return ExtractionResult(
            raw_text=text,
            extracted_name=self.parse_name(text),
            extracted_pan=self.parse_pan(text),
            extracted_aadhaar=self.parse_aadhaar(text),
        )
