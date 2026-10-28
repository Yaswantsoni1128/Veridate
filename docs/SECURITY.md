# Security

## Security Features

### File Upload Security
- **Magic byte validation**: File type is verified by content signature, not just filename extension
- **MIME type validation**: Declared MIME type checked against allowed list
- **Size limits**: Maximum upload size configurable via `MAX_UPLOAD_SIZE_MB` (default: 10MB)
- **Supported types only**: JPG, PNG, BMP, TIFF, PDF — executable and other dangerous types rejected
- **Randomized storage**: Files stored with server-controlled paths, not original filenames

### Data Handling
- **Temporary files**: Auto-cleaned via context manager after processing
- **No public URLs**: Documents are not served via public endpoints by default
- **Sensitive data masking**: PAN and Aadhaar numbers masked in frontend candidate lists
- **No credential exposure**: No API keys, passwords, or secrets hardcoded in source
- **Environment configuration**: All sensitive configuration via environment variables

### Logging
- **Structured logging**: Errors logged with context but without sensitive data
- **Audit logging**: Records actor, action, case ID, and metadata — excludes PAN/Aadhaar values and document contents
- **No OCR logging**: Raw OCR output is not logged in production

### CORS
- Configured origins only: `http://localhost:3000`, `http://localhost:5173` (development)
- Production should restrict to specific domains

### Provider Integrations
- Provider credentials kept server-side only
- Mock provider clearly labeled as non-official
- No claims of official issuer verification without real integration

## Security Checklist for Production

- [ ] Replace SQLite with PostgreSQL
- [ ] Add authentication and authorization (OAuth2/JWT)
- [ ] Add role-based access control (admin, analyst, viewer)
- [ ] Configure HTTPS/TLS
- [ ] Restrict CORS origins to production domains
- [ ] Add rate limiting on API endpoints
- [ ] Set up secure file storage (private S3 bucket or equivalent)
- [ ] Configure document retention and deletion policies
- [ ] Add security headers (HSTS, CSP, X-Frame-Options)
- [ ] Conduct penetration testing
- [ ] Review Aadhaar-related legal compliance requirements

## Known Limitations

- No authentication implemented yet (auth context is a placeholder)
- No rate limiting on API endpoints
- No HTTPS enforcement in development
- Document storage uses local filesystem (not encrypted at rest)

## Reporting Security Issues

Report security concerns through the project's issue tracker.
