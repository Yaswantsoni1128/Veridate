# Document Verification System - OCR Demo

A full-stack web application for verifying identity documents using Optical Character Recognition (OCR). Users fill out a multi-step form and upload document images or PDFs, which are processed using Tesseract OCR to extract text and verify against the provided information.

## Features

✅ **Multi-step Form** - User-friendly form for entering personal information
✅ **Document Upload** - Support for images (JPG, PNG, BMP, TIFF) and PDFs
✅ **OCR Text Extraction** - Automatic text extraction using Tesseract
✅ **Field Parsing** - Extract name, PAN, and Aadhaar numbers from documents
✅ **Fuzzy Matching** - Compare extracted values with form inputs using similarity scoring
✅ **Modern UI** - Clean, responsive design with Tailwind CSS
✅ **Real-time Validation** - Form validation before submission
✅ **Detailed Results** - View extracted text and match confidence scores

## Project Structure

```
Doc-verify/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI application and API endpoints
│   └── requirements.txt     # Python dependencies
└── frontend/               # React TypeScript frontend
    ├── src/
    │   ├── components/     # React components
    │   │   ├── PersonalInfo.tsx      # Step 1: Personal information
    │   │   ├── DocumentInfo.tsx      # Step 2: Document numbers
    │   │   ├── FileUpload.tsx        # Step 3: File upload
    │   │   └── Results.tsx           # Results display
    │   ├── types/          # TypeScript type definitions
    │   ├── api/            # API client and endpoints
    │   ├── App.tsx         # Main App component
    │   ├── App.css         # Styling with Tailwind
    │   └── main.tsx        # Entry point
    ├── index.html          # HTML template
    ├── package.json        # Node dependencies
    ├── tsconfig.json       # TypeScript configuration
    ├── vite.config.ts      # Vite configuration
    ├── tailwind.config.js  # Tailwind CSS configuration
    └── postcss.config.js   # PostCSS configuration
├── README.md               # Project documentation
└── .gitignore             # Git ignore file
```

## Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Tesseract OCR** - Open-source OCR engine for text extraction
- **pytesseract** - Python wrapper for Tesseract
- **pdf2image** - Convert PDF pages to images
- **Pillow** - Python Imaging Library
- **rapidfuzz** - Fast fuzzy string matching
- **Uvicorn** - ASGI server for FastAPI

### Frontend
- **React 18** - JavaScript library for building UIs
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and development server

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- Tesseract OCR installed on system

#### Install Tesseract (Required)

**On Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**On macOS:**
```bash
brew install tesseract
```

**On Windows:**
Download installer from: https://github.com/UB-Mannheim/tesseract/wiki

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The front-end will be available at `http://localhost:3000` (or `http://localhost:5173` if port 3000 is in use)

## API Endpoints

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy"
}
```

### `POST /verify-document`
Verify uploaded document against form data

**Request (multipart/form-data):**
- `full_name`: string - User's full name
- `pan_number`: string - PAN number (format: AAAAA9999A)
- `aadhaar_number`: string - Aadhaar number (12 digits)
- `document`: file - Image (JPG, PNG, BMP, TIFF) or PDF file

**Response:**
```json
{
  "overall_match": true,
  "match_count": 3,
  "total_fields": 3,
  "extraction_result": {
    "raw_text": "Extracted text from document...",
    "extracted_name": "John Doe",
    "extracted_pan": "ABCDE1234F",
    "extracted_aadhaar": "123456789012"
  },
  "match_results": [
    {
      "field": "full_name",
      "matched": true,
      "similarity_score": 0.95,
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
      "matched": true,
      "similarity_score": 1.0,
      "form_value": "123456789012",
      "extracted_value": "123456789012"
    }
  ],
  "message": "✓ Document verified! 3 out of 3 fields matched."
}
```

## How It Works

1. **User Input** - User enters their personal information through a 3-step form
   - Step 1: Full name
   - Step 2: PAN and Aadhaar numbers
   - Step 3: Upload ID document image or PDF

2. **Document Processing** - Backend processes the uploaded document
   - Detects file type (image or PDF)
   - Converts PDFs to images if needed
   - Applies Tesseract OCR to extract text

3. **Text Parsing** - Backend parses extracted text
   - Uses regex patterns to find name, PAN, and Aadhaar
   - Cleans and normalizes extracted values

4. **Comparison** - Backend compares extracted values with form input
   - Uses fuzzy string matching (token_set_ratio)
   - Calculates similarity score (0-1 range)
   - Marks field as "matched" if similarity ≥ 0.8 (80%)

5. **Results Display** - Frontend displays detailed verification results
   - Shows overall verification status
   - Displays extracted text
   - Shows similarity scores and confidence levels
   - Highlights matched/unmatched fields

## Validation Rules

### Name
- Minimum 3 characters
- Similarity threshold: 80%

### PAN Number
- Format: AAAAA9999A (5 letters, 4 digits, 1 letter)
- Exact match or high similarity (80%+)

### Aadhaar Number
- Format: 12 digits
- Exact match or high similarity (80%+)

### Verification Pass Criteria
- At least 2 out of 3 fields must match
- Otherwise, verification fails

## File Support

**Images:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- TIFF (.tiff)

**Documents:**
- PDF (.pdf)

**File Size Limit:** 10 MB

## Development Notes

### Adding Comments for Learning
The codebase includes detailed comments explaining:
- Component purposes and functionality
- How OCR text extraction works
- Field parsing strategies
- API endpoint behavior
- TypeScript type definitions

### Extending the Application

1. **Add More Document Types**
   - Modify regex patterns in `parse_extracted_data()` function
   - Add document type detection logic

2. **Improve OCR Accuracy**
   - Preprocess images (contrast enhancement, rotation correction)
   - Try different Tesseract configurations
   - Use language-specific OCR models

3. **Add Database**
   - Store verification results
   - Track user submission history
   - Add authentication

4. **Enhance UI**
   - Add document preview before upload
   - Show OCR confidence metrics
   - Implement real-time field matching feedback

## Troubleshooting

### Tesseract Not Found Error
- Verify Tesseract is installed: `tesseract --version`
- On Linux, may need to install: `sudo apt-get install tesseract-ocr`
- Check pytesseract can find Tesseract path

### CORS Errors
- Ensure backend is running and CORS is enabled
- Check backend URL in `frontend/src/api/client.ts`

### File Upload Fails
- Check file format is supported
- Verify file size is < 10 MB
- Ensure both frontend and backend are running

### OCR Not Extracting Text
- Ensure image quality is reasonable
- Check file is not corrupted
- Try with a clear, well-lit document image

## License

This project is open-source and available for educational purposes.

## Future Enhancements

- [ ] Add support for more document types (driving license, passport, etc.)
- [ ] Store verification results in database
- [ ] Add user authentication
- [ ] Implement batch document verification
- [ ] Add document preview and annotation
- [ ] Improve OCR with preprocessing filters
- [ ] Add field confidence visualization
- [ ] Mobile app version

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [Tailwind CSS](https://tailwindcss.com/)
- [RapidFuzz Documentation](https://maxbachmann.github.io/RapidFuzz/)
