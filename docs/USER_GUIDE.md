# User Guide

## Overview

VeriHire helps HR teams and verification analysts verify candidate documents during recruitment and employment screening.

## Getting Started

1. Start the backend: `cd backend && python app/main.py`
2. Start the frontend: `cd frontend && npm run dev`
3. Open the application: http://localhost:3000

## Creating a Verification Case

1. Click **New Verification** or navigate to **Verification Cases → Create Case**
2. **Step 1 — Candidate Details**: Enter the candidate's full name, application ID, and email
3. **Step 2 — Select Documents**: Upload the document to verify (JPG, PNG, BMP, TIFF, or PDF, max 10MB)
4. **Step 3 — Enter Details**: Enter the candidate-submitted PAN number and Aadhaar number
5. **Step 4 — Review**: Review all entered information
6. **Step 5 — Submit**: Click **Start Verification** to run OCR and field matching

## Reviewing Results

After verification completes, you'll see:

- **Overall outcome**: Whether the document passed verification (≥2 of 3 fields must match)
- **Field-level comparison**: Submitted vs extracted values with similarity scores
- **Match indicators**: Green check for matches, red X for mismatches
- **Recommendation**: Next steps based on results

## Managing Candidates

Navigate to **Candidates** to view all candidates, search by name or application ID, and filter by status.

## Managing Verification Cases

Navigate to **Verification Cases** to track all cases, view match scores, and see which cases need review.

## Reviewing Documents

Navigate to **Documents** to see all uploaded documents, their types, sizes, and processing status.

## Generating Reports

Navigate to **Reports** to view verification summary statistics and generate compliance reports.

## Reviewing Audit Logs

Navigate to **Audit Logs** to see the immutable trail of all verification system actions.

## Important Notices

- **OCR is not authentication**: OCR text extraction and field matching provide an indication of similarity, not proof of document authenticity
- **Human review required**: All results require human review before making employment decisions
- **PAN/Aadhaar masking**: Full PAN and Aadhaar numbers are masked in candidate lists for privacy
- **Mock provider**: Any provider integration shown as "sandbox" or "not configured" is not official verification
