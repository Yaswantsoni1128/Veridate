"""Fuzzy field matching service using RapidFuzz."""

import logging
from typing import Optional

from rapidfuzz import fuzz

from app.schemas.verification import MatchResult

logger = logging.getLogger(__name__)

DEFAULT_THRESHOLD = 0.8


class MatchingService:
    """Service responsible for comparing submitted values with extracted values."""

    def __init__(self, threshold: float = DEFAULT_THRESHOLD) -> None:
        self.threshold = threshold

    def calculate_similarity(
        self, value1: Optional[str], value2: Optional[str]
    ) -> float:
        """Calculate normalized similarity score between two strings.

        Returns 0.0 if either value is missing or empty.
        Score is in the range [0.0, 1.0].
        """
        if not value1 or not value2:
            return 0.0
        try:
            ratio = fuzz.token_set_ratio(
                str(value1).upper(), str(value2).upper()
            )
            return ratio / 100.0
        except Exception as exc:
            logger.error("Similarity calculation failed: %s", exc)
            return 0.0

    def is_matched(self, similarity_score: float) -> bool:
        """Determine whether a similarity score meets the match threshold."""
        return similarity_score >= self.threshold

    def compare_field(
        self,
        field_name: str,
        form_value: Optional[str],
        extracted_value: Optional[str],
    ) -> MatchResult:
        """Compare a single field and return a MatchResult."""
        score = self.calculate_similarity(form_value, extracted_value)
        matched = self.is_matched(score)
        return MatchResult(
            field=field_name,
            matched=matched,
            similarity_score=round(score, 4),
            form_value=form_value or "",
            extracted_value=extracted_value or "",
        )
