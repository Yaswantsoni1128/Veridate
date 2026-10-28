"""File validation service for uploads.

Validates file size, MIME type, and file content signature (magic bytes)
rather than relying on filename extension alone.
"""

import logging
import os
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

# Magic byte signatures for supported file types
MAGIC_BYTES: dict[bytes, str] = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"BM": "image/bmp",
    b"II*\x00": "image/tiff",
    b"MM\x00*": "image/tiff",
    b"%PDF": "application/pdf",
}

MAX_MAGIC_BYTES_LEN = max(len(sig) for sig in MAGIC_BYTES)


class FileValidationError(Exception):
    """Raised when an uploaded file fails validation."""


class FileValidationService:
    """Service responsible for validating uploaded document files."""

    def __init__(
        self,
        max_size_mb: int | None = None,
        allowed_extensions: set[str] | None = None,
        allowed_mime_types: set[str] | None = None,
    ) -> None:
        self.max_size_mb = max_size_mb or settings.max_upload_size_mb
        self.allowed_extensions = allowed_extensions or settings.allowed_extensions
        self.allowed_mime_types = allowed_mime_types or settings.allowed_mime_types

    def validate_extension(self, filename: str) -> str:
        """Validate the file extension and return the lowercase extension.

        Raises:
            FileValidationError: If the extension is missing or unsupported.
        """
        if not filename or "." not in filename:
            raise FileValidationError("File must have a valid extension.")
        ext = os.path.splitext(filename)[1].lower()
        if ext not in self.allowed_extensions:
            raise FileValidationError(
                f"Unsupported file type: {ext}. "
                f"Supported types: {', '.join(sorted(self.allowed_extensions))}"
            )
        return ext

    def validate_mime_type(self, content_type: Optional[str]) -> None:
        """Validate the declared MIME type.

        Raises:
            FileValidationError: If the MIME type is missing or unsupported.
        """
        if not content_type or content_type not in self.allowed_mime_types:
            raise FileValidationError(
                f"Unsupported or missing MIME type: {content_type}. "
                f"Supported types: {', '.join(sorted(self.allowed_mime_types))}"
            )

    def validate_size(self, file_size: int) -> None:
        """Validate the file size against the configured limit.

        Raises:
            FileValidationError: If the file exceeds the size limit.
        """
        max_size_bytes = self.max_size_mb * 1024 * 1024
        if file_size > max_size_bytes:
            raise FileValidationError(
                f"File size exceeds {self.max_size_mb} MB limit."
            )

    def detect_content_type(self, file_bytes: bytes) -> str:
        """Detect MIME type from file magic bytes.

        Falls back to "application/octet-stream" if the signature is unknown.
        """
        header = file_bytes[:MAX_MAGIC_BYTES_LEN]
        for magic, mime in MAGIC_BYTES.items():
            if header.startswith(magic):
                return mime
        return "application/octet-stream"

    def validate(
        self,
        filename: str,
        content_type: Optional[str],
        file_size: int,
        file_bytes: bytes,
    ) -> str:
        """Run all validation checks and return the detected MIME type.

        Args:
            filename: Original filename.
            content_type: Declared MIME type from the client.
            file_size: File size in bytes.
            file_bytes: Raw file bytes for magic-byte detection.

        Returns:
            Detected MIME type string.

        Raises:
            FileValidationError: If any validation check fails.
        """
        self.validate_extension(filename)
        self.validate_mime_type(content_type)
        self.validate_size(file_size)
        detected = self.detect_content_type(file_bytes)
        if detected == "application/octet-stream":
            raise FileValidationError(
                "File content does not match a supported document type."
            )
        return detected
