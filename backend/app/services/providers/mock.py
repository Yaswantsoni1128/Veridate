"""Mock verification provider for local development.

THIS IS A MOCK PROVIDER. It does not connect to any official issuer database.
Results from this provider are simulated and must NOT be presented as official
verification. Use only for local development and testing.
"""

import uuid
from datetime import datetime, timezone
from typing import Optional

from app.services.providers.base import (
    ProviderResult,
    ProviderStatus,
    VerificationProvider,
)


class MockVerificationProvider(VerificationProvider):
    """Mock provider that simulates official verification responses.

    This provider returns deterministic mock results based on simple heuristics.
    It is clearly labeled as mock and must never be presented as official
    issuer verification.
    """

    def __init__(self) -> None:
        super().__init__(
            name="mock_provider",
            status=ProviderStatus.SANDBOX,
        )

    async def initiate_verification(
        self,
        candidate_data: dict,
        document_data: dict | None = None,
    ) -> ProviderResult:
        """Simulate initiating a verification request."""
        reference_id = f"mock-{uuid.uuid4().hex[:12]}"

        # Simulate a simple matching heuristic
        submitted_name = candidate_data.get("full_name", "")
        extracted_name = (document_data or {}).get("extracted_name", "")

        verified = bool(submitted_name and extracted_name and submitted_name.lower() in extracted_name.lower())

        return ProviderResult(
            provider_name=self.name,
            provider_reference=reference_id,
            verified=verified,
            confidence_score=0.85 if verified else 0.30,
            verified_at=datetime.now(timezone.utc),
            error_message=None,
            raw_response={
                "mock": True,
                "reference_id": reference_id,
                "submitted_name": submitted_name,
                "extracted_name": extracted_name,
                "note": "This is a mock provider result. Not official verification.",
            },
        )

    async def check_status(
        self,
        reference_id: str,
    ) -> ProviderResult:
        """Simulate checking verification status."""
        return ProviderResult(
            provider_name=self.name,
            provider_reference=reference_id,
            verified=True,
            confidence_score=0.85,
            verified_at=datetime.now(timezone.utc),
            error_message=None,
            raw_response={"mock": True, "status": "completed"},
        )

    async def get_result(
        self,
        reference_id: str,
    ) -> ProviderResult:
        """Simulate retrieving verification result."""
        return ProviderResult(
            provider_name=self.name,
            provider_reference=reference_id,
            verified=True,
            confidence_score=0.85,
            verified_at=datetime.now(timezone.utc),
            error_message=None,
            raw_response={
                "mock": True,
                "status": "completed",
                "note": "This is a mock provider result. Not official verification.",
            },
        )

    def is_available(self) -> bool:
        """Mock provider is always available in sandbox mode."""
        return self.status == ProviderStatus.SANDBOX
