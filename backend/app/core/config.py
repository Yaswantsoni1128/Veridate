"""Backend application configuration loaded from environment variables."""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings sourced from environment variables with sensible defaults."""

    def __init__(self) -> None:
        self.app_name: str = os.getenv("APP_NAME", "VeriHire Backend")
        self.app_version: str = os.getenv("APP_VERSION", "1.0.0")
        self.host: str = os.getenv("HOST", "0.0.0.0")
        self.port: int = int(os.getenv("PORT", "8000"))
        self.debug: bool = os.getenv("DEBUG", "false").lower() == "true"

        # Tesseract OCR configuration
        self.tesseract_cmd: str | None = os.getenv("PYTESSERACT_PATH")
        self.tesseract_timeout: int = int(os.getenv("TESSERACT_TIMEOUT", "60"))

        # File upload limits
        self.max_upload_size_mb: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
        self.allowed_extensions: set[str] = {
            ".jpg",
            ".jpeg",
            ".png",
            ".bmp",
            ".tiff",
            ".tif",
            ".pdf",
        }
        self.allowed_mime_types: set[str] = {
            "image/jpeg",
            "image/png",
            "image/bmp",
            "image/tiff",
            "application/pdf",
        }

        # Matching thresholds
        self.match_threshold: float = float(os.getenv("MATCH_THRESHOLD", "0.8"))
        self.min_match_count: int = int(os.getenv("MIN_MATCH_COUNT", "2"))

        # CORS
        self.cors_origins: list[str] = [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:3000,http://localhost:5173",
            ).split(",")
            if origin.strip()
        ]

        # Database
        self.database_url: str = os.getenv(
            "DATABASE_URL", "sqlite:///./verihire.db"
        )


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()


settings = get_settings()
