"""Integration tests for the verification API endpoints."""

from fastapi.testclient import TestClient

from app.main import app


class TestVerifyDocumentAPI:
    """Tests for the /verify-document endpoint."""

    def setup_method(self) -> None:
        self.client = TestClient(app)

    def test_health_endpoint(self) -> None:
        """Test the health check endpoint returns healthy status."""
        response = self.client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    def test_verify_document_missing_file(self) -> None:
        """Test verification without a file returns 422."""
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "John Doe",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "123456789012",
            },
        )
        assert response.status_code == 422

    def test_verify_document_unsupported_format(self) -> None:
        """Test verification with an unsupported file type returns 400."""
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "John Doe",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "123456789012",
            },
            files={"document": ("test.exe", b"MZ binary content", "application/x-msdownload")},
        )
        assert response.status_code == 400

    def test_verify_document_valid_png(self) -> None:
        """Test verification with a valid PNG file returns 200."""
        # Create a minimal valid PNG file (8x8 red pixel)
        png_bytes = (
            b"\x89PNG\r\n\x1a\n"
            b"\x00\x00\x00\rIHDR\x00\x00\x00\x08\x00\x00\x00\x08\x08\x06\x00\x00\x00"
            b"\x1f\xf3\xff\xa4"
            b"\x00\x00\x00\x01sRGB\x00\xae\xce\x1c\xe9"
            b"\x00\x00\x00\x04gAMA\x00\x00\xb1\x8f\x0b\xfc"
            b"\x00\x00\x00\tpHYs\x00\x00\x0e\xc3\x00\x00\x0e\xc3\x01"
            b"\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x01\x00\x18\xdd\x8d\xb4"
            b"\x00\x00\x00\x00IEND\xaeB`\x82"
        )
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "John Doe",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "123456789012",
            },
            files={"document": ("test.png", png_bytes, "image/png")},
        )
        assert response.status_code == 200
        data = response.json()
        assert "overall_match" in data
        assert "match_count" in data
        assert "total_fields" in data
        assert "extraction_result" in data
        assert "match_results" in data
        assert "message" in data
        assert data["total_fields"] == 3
        assert len(data["match_results"]) == 3

    def test_verify_document_valid_pdf(self) -> None:
        """Test verification with a valid PDF file returns 200."""
        # Minimal valid PDF
        pdf_bytes = (
            b"%PDF-1.4\n"
            b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
            b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
            b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n"
            b"xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n"
            b"0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n170\n%%EOF"
        )
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "John Doe",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "123456789012",
            },
            files={"document": ("test.pdf", pdf_bytes, "application/pdf")},
        )
        assert response.status_code == 200

    def test_verify_document_empty_fields(self) -> None:
        """Test verification with form fields that won't match OCR output."""
        png_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "No Match Name",
                "pan_number": "XXXXXXXXXX",
                "aadhaar_number": "000000000000",
            },
            files={"document": ("test.png", png_bytes, "image/png")},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["match_count"] == 0
        assert data["overall_match"] is False

    def test_file_too_large(self) -> None:
        """Test that files exceeding the size limit are rejected."""
        # Create a file larger than 10 MB
        large_content = b"\x89PNG\r\n\x1a\n" + b"\x00" * (11 * 1024 * 1024)
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "John Doe",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "123456789012",
            },
            files={"document": ("large.png", large_content, "image/png")},
        )
        assert response.status_code == 400

    def test_magic_bytes_mismatch(self) -> None:
        """Test that a file with wrong magic bytes but .png extension is rejected."""
        response = self.client.post(
            "/verify-document",
            data={
                "full_name": "John Doe",
                "pan_number": "ABCDE1234F",
                "aadhaar_number": "123456789012",
            },
            files={"document": ("fake.png", b"not a real png", "image/png")},
        )
        assert response.status_code == 400
