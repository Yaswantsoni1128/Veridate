# API Reference

## Base URL

```
http://localhost:8000
```

## Authentication

Currently no authentication is implemented. All endpoints are open. Production deployments should add authentication and authorization.

## Endpoints

### Health

#### `GET /health`
Check service health.

**Response:**
```json
{ "status": "healthy" }
```

### Document Verification

#### `POST /verify-document`
Verify an uploaded document against candidate-submitted form data.

**Content-Type:** `multipart/form-data`

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | string | Yes | Candidate's full name |
| `pan_number` | string | Yes | Candidate's PAN number |
| `aadhaar_number` | string | Yes | Candidate's Aadhaar number |
| `document` | file | Yes | Image (JPG, PNG, BMP, TIFF) or PDF |

**Response (200):**
```json
{
  "overall_match": true,
  "match_count": 2,
  "total_fields": 3,
  "extraction_result": {
    "raw_text": "OCR text...",
    "extracted_name": "John Doe",
    "extracted_pan": "ABCDE1234F",
    "extracted_aadhaar": "123456789012"
  },
  "match_results": [
    {
      "field": "full_name",
      "matched": true,
      "similarity_score": 1.0,
      "form_value": "John Doe",
      "extracted_value": "John Doe"
    },
    {
      "field": "pan_number",
      "matched": true,
      "similarity_score": 1.0,
      "form_value": "ABCDE1234F",
      "extracted_value": "ABCDE1234F"
    },
    {
      "field": "aadhaar_number",
      "matched": false,
      "similarity_score": 0.0,
      "form_value": "123456789012",
      "extracted_value": null
    }
  ],
  "message": "✓ Document verified! 2 out of 3 fields matched."
}
```

**Errors:**
- `400` — File validation failed (unsupported type, too large, invalid content)
- `500` — Internal processing error

### Candidates

#### `POST /candidates/`
Create a new candidate.

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | string | Yes | Candidate's full name |
| `application_id` | string | Yes | Unique application identifier |
| `email` | string | No | Candidate's email |

**Response:** Candidate object

#### `GET /candidates/{id}`
Get a candidate by ID.

**Response:** Candidate object

#### `GET /candidates/`
List candidates with optional filtering.

**Query Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `skip` | int | Offset for pagination (default: 0) |
| `limit` | int | Max results (default: 50) |
| `search` | string | Search by name or application ID |
| `status` | string | Filter by status |

**Response:**
```json
{
  "items": [...],
  "total": 100,
  "skip": 0,
  "limit": 50
}
```

### Verification Cases

#### `GET /cases/`
List verification cases.

**Query Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `skip` | int | Offset for pagination |
| `limit` | int | Max results |
| `status` | string | Filter by status |
| `candidate_id` | int | Filter by candidate |

#### `GET /cases/{id}`
Get a verification case by ID.

#### `PATCH /cases/{id}`
Update a verification case (reviewer decisions).

**Body:**
```json
{
  "status": "review_required",
  "overall_match": false,
  "message": "Requires manual review"
}
```

### Documents

#### `GET /documents/`
List documents.

**Query Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `skip` | int | Offset for pagination |
| `limit` | int | Max results |
| `case_id` | int | Filter by case ID |

### Audit Logs

#### `GET /audit-logs/`
List audit logs.

**Query Parameters:**
| Field | Type | Description |
|-------|------|-------------|
| `skip` | int | Offset for pagination |
| `limit` | int | Max results |
| `case_id` | int | Filter by case ID |

### Dashboard

#### `GET /dashboard/metrics`
Get dashboard metrics.

**Response:**
```json
{
  "total_candidates": 42,
  "total_cases": 38,
  "cases_awaiting_review": 5,
  "matched_cases": 20,
  "mismatch_cases": 13
}
```

## Data Models

### Candidate
```json
{
  "id": 1,
  "full_name": "John Doe",
  "application_id": "APP-001",
  "email": "john@example.com",
  "status": "pending",
  "documents_count": 3,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### VerificationCase
```json
{
  "id": 1,
  "candidate_id": 1,
  "status": "completed",
  "overall_match": true,
  "match_count": 2,
  "total_fields": 3,
  "message": "✓ Document verified! 2 out of 3 fields matched.",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Document
```json
{
  "id": 1,
  "candidate_id": 1,
  "verification_case_id": 1,
  "file_name": "id_card.jpg",
  "file_type": "image/jpeg",
  "file_size": 1024,
  "storage_path": "/uploads/id_card.jpg",
  "status": "processed",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### AuditLog
```json
{
  "id": 1,
  "actor": "analyst@example.com",
  "action": "verification_completed",
  "case_id": 1,
  "metadata_json": "{\"overall_match\": true}",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Interactive Documentation

Swagger UI: http://localhost:8000/docs
ReDoc: http://localhost:8000/redoc
