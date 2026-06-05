"""
FastAPI Backend for Document Verification
Extracts text from images and PDFs using OCR and compares with form data
"""

import os
import tempfile
from typing import Optional
from pathlib import Path

import pytesseract
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdf2image import convert_from_bytes
from PIL import Image
from pydantic import BaseModel
from rapidfuzz import fuzz
from io import BytesIO

# Initialize FastAPI app
app = FastAPI(title="Document Verification API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class FormData(BaseModel):
    """User form input data"""
    full_name: str
    pan_number: str
    aadhaar_number: str


class ExtractionResult(BaseModel):
    """OCR extraction result"""
    raw_text: Optional[str]
    extracted_name: Optional[str]
    extracted_pan: Optional[str]
    extracted_aadhaar: Optional[str]


class MatchResult(BaseModel):
    """Comparison result for each field"""
    field: str
    matched: bool
    similarity_score: float
    form_value: str
    extracted_value: str


class VerificationResponse(BaseModel):
    """Complete verification response"""
    overall_match: bool
    match_count: int
    total_fields: int
    extraction_result: ExtractionResult
    match_results: list[MatchResult]
    message: str


def extract_text_from_image(image_bytes: bytes) -> str:
    """
    Extract text from image using Tesseract OCR
    
    Args:
        image_bytes: Image file content as bytes
        
    Returns:
        Extracted text from the image
    """
    try:
        image = Image.open(BytesIO(image_bytes))
        # Tesseract OCR extraction
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return ""


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text from PDF using pdf2image and Tesseract OCR
    Converts PDF pages to images and extracts text from each page
    
    Args:
        pdf_bytes: PDF file content as bytes
        
    Returns:
        Extracted text from all PDF pages
    """
    try:
        # Convert PDF pages to images
        images = convert_from_bytes(pdf_bytes)
        
        # Extract text from each page and combine
        all_text = []
        for image in images:
            text = pytesseract.image_to_string(image)
            all_text.append(text)
            
        return " ".join(all_text).strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""


def parse_extracted_data(text: str) -> ExtractionResult:
    """
    Parse OCR extracted text to find name, PAN, and Aadhaar numbers
    Uses simple pattern matching
    
    Args:
        text: Raw OCR extracted text
        
    Returns:
        ExtractionResult with parsed fields
    """
    import re
    
    # Convert text to uppercase for matching
    text_upper = text.upper()
    
    # PAN number pattern: 10 alphanumeric characters (e.g., ABCDE1234F)
    pan_pattern = r'[A-Z]{5}[0-9]{4}[A-Z]{1}'
    pan_matches = re.findall(pan_pattern, text_upper)
    extracted_pan = pan_matches[0] if pan_matches else None
    
    # Aadhaar number pattern: 12 digits (e.g., 123456789012)
    aadhaar_pattern = r'\b\d{4}\s?\d{4}\s?\d{4}\b|\d{12}\b'
    aadhaar_matches = re.findall(aadhaar_pattern, text)
    # Clean up extracted aadhaar (remove spaces)
    extracted_aadhaar = aadhaar_matches[0].replace(" ", "") if aadhaar_matches else None
    
    # Extract name (simple: first meaningful line or words before other numbers)
    lines = text.split('\n')
    extracted_name = None
    for line in lines:
        line_clean = line.strip()
        # Look for lines that appear to be names (contain letters, not too long)
        if line_clean and len(line_clean) < 100 and any(c.isalpha() for c in line_clean):
            if not any(char.isdigit() for char in line_clean[:20]):  # First 20 chars should have limited digits
                extracted_name = line_clean
                break
    
    return ExtractionResult(
        raw_text=text,
        extracted_name=extracted_name,
        extracted_pan=extracted_pan,
        extracted_aadhaar=extracted_aadhaar
    )


def calculate_similarity(value1: Optional[str], value2: Optional[str]) -> float:
    """
    Calculate similarity between two strings using fuzzy matching
    
    Args:
        value1: First value to compare
        value2: Second value to compare
        
    Returns:
        Similarity score between 0 and 100
    """
    if not value1 or not value2:
        return 0.0
    
    # For numbers, use token_set_ratio for better matching
    ratio = fuzz.token_set_ratio(str(value1).upper(), str(value2).upper())
    return ratio / 100.0  # Return as 0-1 range


def compare_values(form_data: FormData, extraction: ExtractionResult) -> list[MatchResult]:
    """
    Compare form input values with extracted OCR values
    
    Args:
        form_data: User input from form
        extraction: Extracted values from OCR
        
    Returns:
        List of match results for each field
    """
    match_results = []
    threshold = 0.8  # 80% similarity threshold for match
    
    # Compare Name
    name_similarity = calculate_similarity(form_data.full_name, extraction.extracted_name)
    match_results.append(MatchResult(
        field="full_name",
        matched=name_similarity >= threshold,
        similarity_score=name_similarity,
        form_value=form_data.full_name,
        extracted_value=extraction.extracted_name or "Not found"
    ))
    
    # Compare PAN
    pan_similarity = calculate_similarity(form_data.pan_number, extraction.extracted_pan)
    match_results.append(MatchResult(
        field="pan_number",
        matched=pan_similarity >= threshold,
        similarity_score=pan_similarity,
        form_value=form_data.pan_number,
        extracted_value=extraction.extracted_pan or "Not found"
    ))
    
    # Compare Aadhaar
    aadhaar_similarity = calculate_similarity(form_data.aadhaar_number, extraction.extracted_aadhaar)
    match_results.append(MatchResult(
        field="aadhaar_number",
        matched=aadhaar_similarity >= threshold,
        similarity_score=aadhaar_similarity,
        form_value=form_data.aadhaar_number,
        extracted_value=extraction.extracted_aadhaar or "Not found"
    ))
    
    return match_results


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/verify-document", response_model=VerificationResponse)
async def verify_document(
    full_name: str = Form(...),
    pan_number: str = Form(...),
    aadhaar_number: str = Form(...),
    document: UploadFile = File(...)
) -> VerificationResponse:
    """
    Verify document by extracting text and comparing with form data
    
    Args:
        full_name: Full name from form
        pan_number: PAN number from form
        aadhaar_number: Aadhaar number from form
        document: Uploaded image or PDF file
        
    Returns:
        VerificationResponse with extraction and comparison results
    """
    try:
        # Read uploaded file
        file_content = await document.read()
        file_name = document.filename or "document"
        file_ext = Path(file_name).suffix.lower()
        
        # Extract text based on file type
        if file_ext in ['.pdf']:
            extracted_text = extract_text_from_pdf(file_content)
        elif file_ext in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff']:
            extracted_text = extract_text_from_image(file_content)
        else:
            return VerificationResponse(
                overall_match=False,
                match_count=0,
                total_fields=3,
                extraction_result=ExtractionResult(raw_text=None, extracted_name=None, extracted_pan=None, extracted_aadhaar=None),
                match_results=[],
                message=f"Unsupported file format: {file_ext}. Please upload JPG, PNG, or PDF files."
            )
        
        # Parse extracted text
        extraction_result = parse_extracted_data(extracted_text)
        
        # Create form data object
        form_data = FormData(
            full_name=full_name,
            pan_number=pan_number,
            aadhaar_number=aadhaar_number
        )
        
        # Compare values
        match_results = compare_values(form_data, extraction_result)
        
        # Calculate overall match
        matched_count = sum(1 for mr in match_results if mr.matched)
        overall_match = matched_count >= 2  # At least 2 out of 3 fields must match
        
        # Prepare response message
        if overall_match:
            message = f"✓ Document verified! {matched_count} out of 3 fields matched."
        else:
            message = f"✗ Document verification failed! Only {matched_count} out of 3 fields matched."
        
        return VerificationResponse(
            overall_match=overall_match,
            match_count=matched_count,
            total_fields=3,
            extraction_result=extraction_result,
            match_results=match_results,
            message=message
        )
        
    except Exception as e:
        print(f"Error processing document: {e}")
        return VerificationResponse(
            overall_match=False,
            match_count=0,
            total_fields=3,
            extraction_result=ExtractionResult(raw_text=None, extracted_name=None, extracted_pan=None, extracted_aadhaar=None),
            match_results=[],
            message=f"Error processing document: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
