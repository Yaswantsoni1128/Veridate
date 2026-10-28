# Backend Workflow — Document Verification API

## Overview
The backend is a FastAPI-based REST API that receives document images/PDFs along with user-submitted form data, extracts text via OCR, parses key identity fields (name, PAN, Aadhaar), compares them against the form input using fuzzy matching, and returns a verification result.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Web Framework | **FastAPI** | Async web framework; defines routes, request validation via Pydantic, and automatic OpenAPI/Swagger docs |
| ASGI Server | **uvicorn** | Production-grade ASGI server that runs the FastAPI app (`host="0.0.0.0"`, `port=8000`) |
| OCR Engine | **pytesseract** + **Tesseract OCR** | Extracts raw text from uploaded images and PDF pages |
| PDF Handling | **pdf2image** + **Pillow (PIL)** | Converts PDF pages into images so Tesseract can OCR them |
| Fuzzy Matching | **rapidfuzz** | Computes similarity scores between form values and OCR-extracted values |
| Data Validation | **Pydantic (BaseModel)** | Defines request/response schemas and enforces type validation |
| Multipart Handling | **FastAPI `File` / `Form`** | Receives uploaded document files and form fields in a single `multipart/form-data` request |
| CORS | **fastapi.middleware.cors.CORSMiddleware** | Allows cross-origin requests from the React frontend (ports 3000, 5173) |

---

## Request/Response Models

| Model | Fields | Role |
|-------|--------|------|
| `FormData` | `full_name`, `pan_number`, `aadhaar_number` | User-submitted form input (request) |
| `ExtractionResult` | `raw_text`, `extracted_name`, `extracted_pan`, `extracted_aadhaar` | OCR-parsed output |
| `MatchResult` | `field`, `matched`, `similarity_score`, `form_value`, `extracted_value` | Per-field comparison outcome |
| `VerificationResponse` | `overall_match`, `match_count`, `total_fields`, `extraction_result`, `match_results`, `message` | Final aggregated response |

---

## Endpoints

### `GET /health`
Health check endpoint. Returns `{"status": "healthy"}`.

### `POST /verify-document`
Main verification endpoint. Accepts `multipart/form-data` with:
- `full_name` (string)
- `pan_number` (string)
- `aadhaar_number` (string)
- `document` (uploaded file: JPG, JPEG, PNG, BMP, TIFF, or PDF)

Returns a `VerificationResponse`.

---

## Business Logic / Workflow

### 1. Request Reception
The `/verify-document` endpoint receives the form fields and the uploaded document file as `multipart/form-data`.

### 2. File Type Detection
The uploaded file's extension is inspected:
- `.pdf` → PDF extraction path
- `.jpg`, `.jpeg`, `.png`, `.bmp`, `.tiff` → Image extraction path
- Anything else → returns an unsupported-format error response

### 3. Text Extraction (OCR)

**Image path** (`extract_text_from_image`):
- Opens the image bytes with Pillow (`Image.open`)
- Runs `pytesseract.image_to_string` to extract raw text
- Returns stripped text, or empty string on failure

**PDF path** (`extract_text_from_pdf`):
- Converts PDF bytes to a list of page images using `pdf2image.convert_from_bytes`
- Runs Tesseract OCR on each page image
- Joins all page text into a single string

### 4. Data Parsing (`parse_extracted_data`)
The raw OCR text is uppercased and parsed with regex:
- **PAN**: pattern `[A-Z]{5}[0-9]{4}[A-Z]{1}` (e.g., `ABCDE1234F`)
- **Aadhaar**: pattern `\b\d{4}\s?\d{4}\s?\d{4}\b|\d{12}\b` (12 digits, optional spaces); spaces are stripped from the match
- **Name**: first line that contains letters, is under 100 chars, and has limited leading digits

Returns an `ExtractionResult` with `raw_text` and the three parsed fields.

### 5. Similarity Comparison (`calculate_similarity` + `compare_values`)
For each of the three fields (name, PAN, Aadhaar):
- Uses `rapidfuzz.fuzz.token_set_ratio` to compute a similarity score between the form value and the extracted value (both uppercased)
- Score is normalized to a 0–1 range
- A field is considered matched if `similarity_score >= 0.8` (80% threshold)

Produces a list of three `MatchResult` objects.

### 6. Overall Verification Decision
- `matched_count` = number of fields where `matched == true`
- `overall_match = matched_count >= 2` (at least 2 of 3 fields must match)
- `message` reports success (`✓ Document verified!`) or failure (`✗ Document verification failed!`)

### 7. Response
Returns the full `VerificationResponse` including extraction details, per-field match results, counts, and the human-readable message.

---

## Error Handling
- OCR failures return empty strings rather than crashing
- Unsupported file types return a structured error response
- Unexpected exceptions are caught and returned as a failed `VerificationResponse` with the error message

---

## Configuration / Environment
- Server runs on `0.0.0.0:8000` via `uvicorn`
- No environment variables are currently read from `os.environ`/`os.getenv` in `backend/main.py`
- `.env.example` documents an optional `PYTESSERACT_PATH` (commented out) for systems where the Tesseract binary is not on PATH; it is not referenced in code
- CORS is configured for `http://localhost:3000` and `http://localhost:5173` (React dev servers)
