"""Base provider interface for official verification integrations.

Defines the contract that all official verification providers (DigiLocker/NAD,
universities, employers) must implement. Providers are responsible for
authorized verification against issuer databases - they are distinct from OCR
field matching and do not constitute proof of document authenticity on their own.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Optional


class ProviderStatus(str, Enum):
    """Provider integration status."""

    NOT_CONFIGURED = "not_configured"
    AWAITING_CREDENTIALS = "awaiting_credentials"
    SANDBOX = "sandbox"
    CONNECTED = "connected"
    UNAVAILABLE = "temporarily_unavailable"


@dataclass
class ProviderResult:
    """Normalized result from a verification provider."""

    provider_name: str
    provider_reference: Optional[str]
    verified: bool
    confidence_score: Optional[float]
    verified_at: Optional[datetime]
    error_message: Optional[str]
    raw_response: Optional[dict]


class VerificationProvider(ABC):
    """Abstract base class for verification providers.

    Each provider implements authorized verification against an official
    issuer database. Results from providers are distinct from OCR-based
    field matching and represent official issuer confirmation when available.
    """

    def __init__(self, name: str, status: ProviderStatus = ProviderStatus.NOT_CONFIGURED) -> None:
        self.name = name
        self.status = status

    @abstractmethod
    async def initiate_verification(
        self,
        candidate_data: dict,
        document_data: dict | None = None,
    ) -> ProviderResult:
        """Initiate an authorized verification request with the provider.

        Args:
            candidate_data: Candidate-submitted information for verification.
            document_data: Optional document metadata and extracted fields.

        Returns:
            ProviderResult with the verification outcome.
        """

    @abstractmethod
    async def check_status(
        self,
        reference_id: str,
    ) -> ProviderResult:
        """Check the status of an in-progress verification request.

        Args:
            reference_id: The provider reference ID from initiate_verification.

        Returns:
            ProviderResult with the current status.
        """

    @abstractmethod
    async def get_result(
        self,
        reference_id: str,
    ) -> ProviderResult:
        """Retrieve the final verification result from the provider.

        Args:
            reference_id: The provider reference ID.

        Returns:
            ProviderResult with the final outcome.
        """

    @abstractmethod
    def is_available(self) -> bool:
        """Check if the provider is available for verification requests."""

    def get_status(self) -> ProviderStatus:
        """Get the current provider integration status."""
        return self.status
