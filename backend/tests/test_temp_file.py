"""Unit tests for the temp file utility."""

import os

from app.services.temp_file import temp_file


class TestTempFile:
    """Tests for temporary file creation and cleanup."""

    def test_temp_file_created_and_deleted(self) -> None:
        """Test that a temp file is created, readable, and deleted after use."""
        path = None
        with temp_file(b"test content", suffix=".txt") as p:
            path = p
            assert os.path.exists(p)
            with open(p, "rb") as f:
                assert f.read() == b"test content"
        assert not os.path.exists(path), "Temp file should be deleted after context exit"

    def test_temp_file_cleaned_on_exception(self) -> None:
        """Test that temp files are cleaned up even when an exception occurs."""
        path = None
        try:
            with temp_file(b"content", suffix=".txt") as p:
                path = p
                assert os.path.exists(p)
                raise RuntimeError("Simulated error")
        except RuntimeError:
            pass
        assert not os.path.exists(path), "Temp file should be deleted after exception"

    def test_temp_file_custom_suffix(self) -> None:
        """Test that custom suffix is applied."""
        with temp_file(b"data", suffix=".pdf") as p:
            assert p.endswith(".pdf")
        assert not os.path.exists(p)
