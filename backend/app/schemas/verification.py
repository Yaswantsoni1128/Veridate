"""Pydantic schemas for verification request and response models."""

from typing import Optional

from pydantic import BaseModel, Field


class MatchResult(BaseModel):
    """Field-level comparison result."""

    field: str = Field(..., description="Field name being compared")
    matched: bool = Field(..., description="Whether the field matched")
    similarity_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Similarity score between 0.0 and 1.0",
    )
    form_value: str = Field(..., description="Value submitted in the form")
    extracted_value: str = Field(..., description="Value extracted from the document")


class ExtractionResult(BaseModel):
    """OCR extraction result."""

    raw_text: Optional[str] = Field(
        None, description="Raw text extracted from the document"
    )
    extracted_name: Optional[str] = Field(None, description="Extracted full name")
    extracted_pan: Optional[str] = Field(None, description="Extracted PAN number")
    extracted_aadhaar: Optional[str] = Field(None, description="Extracted Aadhaar number")


class VerificationResponse(BaseModel):
    """Complete verification response."""

    overall_match: bool = Field(..., description="Whether overall verification passed")
    match_count: int = Field(..., description="Number of fields that matched")
    total_fields: int = Field(..., description="Total number of fields compared")
    extraction_result: ExtractionResult = Field(
        ..., description="OCR extraction details"
    )
    match_results: list[MatchResult] = Field(
        ..., description="Per-field comparison results"
    )
    message: str = Field(..., description="Human-readable verification message")


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = Field(..., description="Service health status")


class VerificationRequest(BaseModel):
    """Candidate-submitted form data for verification."""

    full_name: str = Field(..., description="Candidate's full name")
    pan_number: str = Field(..., description="PAN number")
    aadhaar_number: str = Field(..., description="Aadhaar number")
