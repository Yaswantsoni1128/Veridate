# Architecture

## Request Flow

```
Frontend (React/Vite) → FastAPI Backend → OCR/Extraction/Matching → Database → Response
```

### Document Verification Flow

1. **Frontend**: User submits candidate details + document file via multipart/form-data
2. **API Layer** (`POST /verify-document`): Validates file (magic bytes, MIME type, size)
3. **OCR Service**: Extracts text using Tesseract (images directly, PDFs via pdf2image conversion)
4. **Extraction Service**: Parses name, PAN, Aadhaar using regex patterns
5. **Matching Service**: Compares submitted vs extracted values using RapidFuzz fuzzy matching
6. **Verification Service**: Aggregates results, applies match threshold (default 0.8), determines overall match (default: ≥2 of 3 fields)
7. **Persistence Layer**: Saves candidate, case, document, and audit log records to database
8. **Response**: Returns `VerificationResponse` with extraction results, per-field match results, and overall outcome

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│  Pages: Overview, Candidates, Cases, Documents,             │
│         Reports, Audit Logs, Settings, Create Case          │
└─────────────────────────────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │ API Routes  │  │ Validation  │  │ Verification    │    │
│  │ (/verify-   │  │ (FileValidation│ │ Service         │    │
│  │  document)  │  │  Service)   │  │ (orchestration) │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
│         │                    │                    │        │
│         ▼                    ▼                    ▼        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │ OCR Service │  │ Extraction  │  │ Matching Service│    │
│  │ (Tesseract) │  │ Service     │  │ (RapidFuzz)     │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
│         │                    │                    │        │
│         └────────────────────┴────────────────────┘        │
│                           │                                │
│         ┌─────────────────┴─────────────────┐              │
│         │     SQLAlchemy + Alembic          │              │
│         │  (SQLite dev / PostgreSQL prod)   │              │
│         └───────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Data Model

| Table | Fields | Relationships |
|-------|--------|---------------|
| `candidates` | id, full_name, application_id, email, status, documents_count, created_at, updated_at | 1:N verification_cases, 1:N documents |
| `verification_cases` | id, candidate_id, status, overall_match, match_count, total_fields, message, created_at, updated_at | N:1 candidate, 1:N documents, 1:N audit_logs |
| `documents` | id, candidate_id, verification_case_id, file_name, file_type, file_size, storage_path, status, created_at, updated_at | N:1 candidate, N:1 verification_case |
| `audit_logs` | id, actor, action, case_id, metadata_json, created_at, updated_at | N:1 verification_case |

## Provider Integration Architecture

Providers implement the `VerificationProvider` abstract base class:

- `initiate_verification()` — Start authorized verification request
- `check_status()` — Check in-progress request status
- `get_result()` — Retrieve final result
- `is_available()` — Check provider availability

Providers are managed by `ProviderRegistry`, which tracks status (not_configured, awaiting_credentials, sandbox, connected, temporarily_unavailable).

## Security Architecture

- File validation at API boundary (magic bytes, not just extension)
- Temporary files auto-cleaned via context manager
- Database configured via environment variables
- CORS restricted to configured origins
- Audit logs exclude sensitive values (no PAN/Aadhaar in logs)
