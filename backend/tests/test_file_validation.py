"""Unit tests for the file validation service."""

import pytest

from app.services.file_validation import (
    FileValidationService,
    FileValidationError,
)


class TestFileValidationService:
    """Tests for file upload validation."""

    def setup_method(self) -> None:
        self.service = FileValidationService(max_size_mb=10)

    def test_valid_png_passes(self) -> None:
        """Test that a valid PNG file passes all validation."""
        png_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100
        detected = self.service.validate(
            filename="test.png",
            content_type="image/png",
            file_size=len(png_bytes),
            file_bytes=png_bytes,
        )
        assert detected == "image/png"

    def test_valid_pdf_passes(self) -> None:
        """Test that a valid PDF file passes all validation."""
        pdf_bytes = b"%PDF-1.4\n" + b"\x00" * 100
        detected = self.service.validate(
            filename="test.pdf",
            content_type="application/pdf",
            file_size=len(pdf_bytes),
            file_bytes=pdf_bytes,
        )
        assert detected == "application/pdf"

    def test_unsupported_extension_fails(self) -> None:
        """Test that unsupported file extensions are rejected."""
        with pytest.raises(FileValidationError, match="Unsupported file type"):
            self.service.validate(
                filename="test.exe",
                content_type="application/x-msdownload",
                file_size=100,
                file_bytes=b"MZ\x90\x00",
            )

    def test_missing_extension_fails(self) -> None:
        """Test that files without extensions are rejected."""
        with pytest.raises(FileValidationError, match="valid extension"):
            self.service.validate(
                filename="testfile",
                content_type="image/png",
                file_size=100,
                file_bytes=b"\x89PNG\r\n\x1a\n",
            )

    def test_unsupported_mime_type_fails(self) -> None:
        """Test that unsupported MIME types are rejected."""
        with pytest.raises(FileValidationError, match="Unsupported or missing"):
            self.service.validate(
                filename="test.png",
                content_type="text/plain",
                file_size=100,
                file_bytes=b"\x89PNG\r\n\x1a\n",
            )

    def test_file_too_large_fails(self) -> None:
        """Test that oversized files are rejected."""
        with pytest.raises(FileValidationError, match="exceeds"):
            self.service.validate(
                filename="test.png",
                content_type="image/png",
                file_size=11 * 1024 * 1024,
                file_bytes=b"\x89PNG\r\n\x1a\n",
            )

    def test_magic_bytes_mismatch_fails(self) -> None:
        """Test that files with wrong magic bytes are rejected."""
        with pytest.raises(FileValidationError, match="does not match"):
            self.service.validate(
                filename="test.png",
                content_type="image/png",
                file_size=20,
                file_bytes=b"not a real png file at all",
            )

    def test_jpeg_magic_bytes(self) -> None:
        """Test JPEG magic byte detection."""
        jpeg_bytes = b"\xff\xd8\xff\xe0" + b"\x00" * 100
        detected = self.service.validate(
            filename="test.jpg",
            content_type="image/jpeg",
            file_size=len(jpeg_bytes),
            file_bytes=jpeg_bytes,
        )
        assert detected == "image/jpeg"

    def test_bmp_magic_bytes(self) -> None:
        """Test BMP magic byte detection."""
        bmp_bytes = b"BM" + b"\x00" * 100
        detected = self.service.validate(
            filename="test.bmp",
            content_type="image/bmp",
            file_size=len(bmp_bytes),
            file_bytes=bmp_bytes,
        )
        assert detected == "image/bmp"

    def test_tiff_magic_bytes(self) -> None:
        """Test TIFF magic byte detection (both endiannesses)."""
        tiff_le = b"II*\x00" + b"\x00" * 100
        detected = self.service.validate(
            filename="test.tiff",
            content_type="image/tiff",
            file_size=len(tiff_le),
            file_bytes=tiff_le,
        )
        assert detected == "image/tiff"

        tiff_be = b"MM\x00*" + b"\x00" * 100
        detected = self.service.validate(
            filename="test.tif",
            content_type="image/tiff",
            file_size=len(tiff_be),
            file_bytes=tiff_be,
        )
        assert detected == "image/tiff"
