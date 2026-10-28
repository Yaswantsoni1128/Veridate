"""Provider registry for managing verification provider instances.

Tracks provider status and provides access to configured providers.
Providers are kept server-side; no credentials are exposed to the frontend.
"""

import logging
from typing import Optional

from app.services.providers.base import (
    ProviderResult,
    ProviderStatus,
    VerificationProvider,
)
from app.services.providers.mock import MockVerificationProvider

logger = logging.getLogger(__name__)


class ProviderRegistry:
    """Registry for verification providers.

    Manages provider lifecycle and status. Providers are configured
    server-side only. The mock provider is available for local development
    but is clearly labeled as non-official.
    """

    def __init__(self) -> None:
        self._providers: dict[str, VerificationProvider] = {}
        self._register_default_providers()

    def _register_default_providers(self) -> None:
        """Register built-in providers.

        The mock provider is registered for local development only.
        Official providers (DigiLocker/NAD, universities, employers) must
        be configured separately with real credentials.
        """
        self._providers["mock"] = MockVerificationProvider()
        logger.info("Registered mock provider (sandbox mode - not official verification)")

    def get_provider(self, name: str) -> Optional[VerificationProvider]:
        """Get a provider by name."""
        return self._providers.get(name)

    def list_providers(self) -> dict[str, ProviderStatus]:
        """List all registered providers with their status."""
        return {name: provider.get_status() for name, provider in self._providers.items()}

    def register_provider(self, name: str, provider: VerificationProvider) -> None:
        """Register a new provider (e.g., DigiLocker, university, employer).

        This is how official provider integrations would be added. Credentials
        must remain server-side and are never exposed to the frontend.
        """
        self._providers[name] = provider
        logger.info("Registered provider: %s", name)

    def is_available(self, name: str) -> bool:
        """Check if a provider is available for verification."""
        provider = self._providers.get(name)
        return provider.is_available() if provider else False

    async def verify_with_provider(
        self,
        name: str,
        candidate_data: dict,
        document_data: dict | None = None,
    ) -> ProviderResult:
        """Run verification through a specific provider.

        Args:
            name: Provider name.
            candidate_data: Candidate-submitted information.
            document_data: Optional document metadata and extracted fields.

        Returns:
            ProviderResult from the provider.

        Raises:
            ValueError: If the provider is not found or not available.
        """
        provider = self._providers.get(name)
        if not provider:
            raise ValueError(f"Provider '{name}' not found")
        if not provider.is_available():
            raise ValueError(f"Provider '{name}' is not available")
        return await provider.initiate_verification(candidate_data, document_data)


# Global registry instance
provider_registry = ProviderRegistry()
