"""Pytest configuration and shared fixtures."""

from io import BytesIO
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Return a FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def mock_ocr_text():
    """Sample OCR text with identity fields."""
    return """
    GOVERNMENT OF INDIA
    Name: John Doe
    PAN: ABCDE1234F
    Aadhaar: 1234 5678 9012
    Date of Birth: 01/01/1990
    """
