"""Unit tests for the extraction service."""

from app.services.extraction import ExtractionService


class TestExtractionService:
    """Tests for parsing identity fields from OCR text."""

    def setup_method(self) -> None:
        self.service = ExtractionService()

    def test_parse_name_success(self) -> None:
        """Test name extraction from OCR text."""
        text = """
        Name: John Doe
        PAN: ABCDE1234F
        """
        result = self.service.parse_name(text)
        assert result == "Name: John Doe"

    def test_parse_name_no_valid_line(self) -> None:
        """Test name extraction returns None when no valid name line exists."""
        text = "12345\nABCDE1234F\n123456789012\n"
        result = self.service.parse_name(text)
        assert result is None

    def test_parse_name_empty_text(self) -> None:
        """Test name extraction from empty text."""
        result = self.service.parse_name("")
        assert result is None

    def test_parse_pan_success(self) -> None:
        """Test PAN extraction with valid format."""
        text = "PAN: ABCDE1234F"
        result = self.service.parse_pan(text)
        assert result == "ABCDE1234F"

    def test_parse_pan_case_insensitive(self) -> None:
        """Test PAN extraction works with lowercase input."""
        text = "pan: abcde1234f"
        result = self.service.parse_pan(text)
        assert result == "ABCDE1234F"

    def test_parse_pan_not_found(self) -> None:
        """Test PAN extraction returns None when no PAN pattern exists."""
        text = "No PAN here"
        result = self.service.parse_pan(text)
        assert result is None

    def test_parse_aadhaar_success(self) -> None:
        """Test Aadhaar extraction with spaces."""
        text = "Aadhaar: 1234 5678 9012"
        result = self.service.parse_aadhaar(text)
        assert result == "123456789012"

    def test_parse_aadhaar_no_spaces(self) -> None:
        """Test Aadhaar extraction without spaces."""
        text = "Aadhaar: 123456789012"
        result = self.service.parse_aadhaar(text)
        assert result == "123456789012"

    def test_parse_aadhaar_not_found(self) -> None:
        """Test Aadhaar extraction returns None when no match."""
        text = "No Aadhaar here"
        result = self.service.parse_aadhaar(text)
        assert result is None

    def test_extract_all_fields(self) -> None:
        """Test full extraction returns all parsed fields."""
        text = """
        Name: John Doe
        PAN: ABCDE1234F
        Aadhaar: 1234 5678 9012
        """
        result = self.service.extract(text)
        assert result.raw_text == text
        assert result.extracted_name == "Name: John Doe"
        assert result.extracted_pan == "ABCDE1234F"
        assert result.extracted_aadhaar == "123456789012"

    def test_extract_empty_text(self) -> None:
        """Test extraction from empty text returns all None fields."""
        result = self.service.extract("")
        assert result.raw_text == ""
        assert result.extracted_name is None
        assert result.extracted_pan is None
        assert result.extracted_aadhaar is None
