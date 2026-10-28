# VeriHire — AI-Powered Document Verification Platform

A professional web application for verifying documents submitted during recruitment and employment screening. Built with FastAPI (backend) and React + Vite + TypeScript (frontend).

## Product Overview

VeriHire helps HR teams and verification analysts:

- Create and manage candidate verification cases
- Upload identity documents, educational certificates, marksheets, experience letters, offer letters, and payslips
- Extract information from uploaded documents using OCR (Tesseract)
- Compare extracted information with candidate-submitted details using fuzzy matching (RapidFuzz)
- Identify mismatches, missing fields, and documents requiring manual review
- Review field-level comparison results
- Generate verification reports
- Maintain an audit trail of verification actions

## Core Principle

The platform distinguishes between **extracted information**, **matching information**, **document-integrity signals**, **human review**, and **official issuer verification**. A document is never claimed genuine merely because OCR succeeded or fields matched.

## Tech Stack

### Backend
- **FastAPI** — Web framework with automatic OpenAPI docs
- **uvicorn** — ASGI server
- **Pydantic** — Data validation
- **Tesseract OCR** (via pytesseract) — Text extraction from images/PDFs
- **Pillow + pdf2image** — Image/PDF processing
- **RapidFuzz** — Fuzzy string matching
- **SQLAlchemy + Alembic** — ORM and database migrations (SQLite for dev, PostgreSQL for prod)
- **Pytest** — Testing

### Frontend
- **React 18 + TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **React Router** — Client-side routing
- **TanStack Query** — Server-state management
- **React Hook Form + Zod** — Form validation
- **Lucide React** — Icons

## Project Structure

```
Doc-Verify/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # API route handlers
│   │   ├── core/             # Config, database, security
│   │   ├── models/           # SQLAlchemy models
│   │   ├── repositories/     # Data access layer
│   │   ├── services/         # Business logic (OCR, extraction, matching, providers)
│   │   └── main.py           # FastAPI app entry point
│   ├── migrations/           # Alembic migration files
│   ├── tests/                # Pytest test suite
│   ├── requirements.txt      # Python dependencies
│   └── main.py               # Legacy entry point (preserved)
├── frontend/
│   ├── src/
│   │   ├── app/              # App wrapper with providers
│   │   ├── components/       # UI components (ui/, layout/)
│   │   ├── contexts/         # React context (auth)
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities (API client)
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Route definitions
│   │   ├── services/         # API service layer
│   │   └── types/            # TypeScript types
│   ├── dist/                 # Production build output
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite configuration
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── SECURITY.md
│   ├── USER_GUIDE.md
│   └── DEVELOPMENT_LOG.md
├── .env.example              # Environment variable template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## Prerequisites

### Backend
- Python 3.10+
- Tesseract OCR installed and available on PATH (or set `PYTESSERACT_PATH`)
- pip

### Frontend
- Node.js 18+
- npm

## Installation

### 1. Clone the repository

```bash
cd D:\Project_phase_2k26\Doc-Verify
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy ..\.env.example .env  # Windows
# cp ../.env.example .env  # Linux/Mac

# Initialize database
alembic upgrade head

# Start the server
python app/main.py
# or: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API available at: http://localhost:8000
API docs: http://localhost:8000/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
copy ..\.env.example .env  # Windows
# cp ../.env.example .env  # Linux/Mac

# Start development server
npm run dev

# Production build
npm run build
```

Frontend available at: http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./verihire.db` |
| `PYTESSERACT_PATH` | Path to Tesseract binary | (system PATH) |
| `MAX_UPLOAD_SIZE_MB` | Max file upload size in MB | `10` |
| `MATCH_THRESHOLD` | Fuzzy match threshold (0.0-1.0) | `0.8` |
| `MIN_MATCH_COUNT` | Minimum fields to match for overall pass | `2` |
| `CORS_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:3000,http://localhost:5173` |
| `REACT_APP_API_URL` | Backend API URL for frontend | `http://localhost:8000` |

## Running Tests

### Backend

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm run build  # TypeScript check + Vite build
```

## API Endpoints

### Verification
- `GET /health` — Health check
- `POST /verify-document` — Verify document against candidate data (multipart/form-data)

### Candidates
- `POST /candidates/` — Create candidate
- `GET /candidates/{id}` — Get candidate
- `GET /candidates/` — List candidates (with search, status filter, pagination)

### Verification Cases
- `GET /cases/` — List cases (with filters, pagination)
- `GET /cases/{id}` — Get case
- `PATCH /cases/{id}` — Update case (reviewer decisions)

### Documents
- `GET /documents/` — List documents

### Audit Logs
- `GET /audit-logs/` — List audit logs

### Dashboard
- `GET /dashboard/metrics` — Dashboard metrics

## Verification Result Model

The platform uses a transparent outcome model:

| Status | Meaning |
|--------|---------|
| `PROCESSING` | Verification still in progress |
| `MATCHED_FIELDS` | Submitted and extracted values meet matching rules |
| `MISMATCH` | One or more required fields don't meet matching rules |
| `REVIEW_REQUIRED` | Extraction quality insufficient or human decision needed |
| `UNVERIFIABLE` | Required evidence or verification method unavailable |
| `ISSUER_VERIFIED` | Authorized issuer/provider returned successful result |

A similarity score is not a probability of document authenticity.

## Security

- Server-side file validation (magic bytes, MIME type, size limits)
- Randomized server-side filenames
- Safe temporary file handling with automatic cleanup
- No public file URLs by default
- Strict CORS configuration
- Sensitive data masking (PAN/Aadhaar masked in UI lists)
- No credentials hardcoded in source code
- Audit logging excludes sensitive values

See `docs/SECURITY.md` for details.

## Provider Integrations

Official provider integrations (DigiLocker/NAD, universities, employers) are prepared through a provider adapter pattern but are **not configured by default**. A clearly labeled mock provider is available for local development. Never present mock results as official verification.

See `docs/ARCHITECTURE.md` for provider integration details.

## Known Limitations

- Tesseract OCR binary must be installed separately (not included in Python deps)
- SQLite used by default; PostgreSQL required for production
- No user authentication implemented (auth context is a placeholder)
- Mock provider results are not official verification
- PDF generation for reports not yet implemented
- Persistence uses SQLite by default; production requires PostgreSQL

## License

Internal use only.
