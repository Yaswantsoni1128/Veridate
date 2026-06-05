# Quick Start Guide - Document Verification System

## Installation Summary

### 1. Install Tesseract OCR (One-time setup)

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

**macOS:**
```bash
brew install tesseract
```

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Run the installer and note the installation path

---

## Running the Project

### Terminal 1 - Start Backend Server

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```

✅ Backend will run on: **http://localhost:8000**

### Terminal 2 - Start Frontend Server

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

✅ Frontend will run on: **http://localhost:3000** or **http://localhost:5173**

---

## Testing the Application

1. Open frontend in browser (http://localhost:3000)
2. Fill in the form:
   - **Full Name:** Any name (minimum 3 characters)
   - **PAN:** Format like ABCDE1234F
   - **Aadhaar:** 12 digits like 123456789012
3. Upload a document (image or PDF with text)
4. View verification results

### Sample Test Data
- Name: John Doe
- PAN: ABCDE1234F  
- Aadhaar: 123456789012

---

## API Documentation

Once backend is running, visit: **http://localhost:8000/docs**

This shows interactive API documentation with the ability to test endpoints directly.

---

## Troubleshooting

### "Tesseract is not installed" error
- Verify installation: `tesseract --version`
- If not in PATH, check installation location
- You may need to restart terminal after installing

### "Connection refused" errors
- Make sure backend is running on port 8000
- Make sure frontend is running on port 3000/5173
- Check firewall settings

### OCR not working on uploaded files
- Ensure file is clear and readable
- Try JPG/PNG format instead of PDF
- Verify file is not corrupted

---

## Project Structure

```
Doc-verify/
├── backend/main.py            ← FastAPI server
├── backend/requirements.txt    ← Python dependencies
├── frontend/src/App.tsx       ← Main React app
├── frontend/package.json      ← Node dependencies
├── frontend/src/components/   ← React components
│   ├── PersonalInfo.tsx
│   ├── DocumentInfo.tsx
│   ├── FileUpload.tsx
│   └── Results.tsx
└── README.md                  ← Full documentation
```

---

## Key Features

✅ **Step 1:** Enter personal information (name)
✅ **Step 2:** Enter document numbers (PAN, Aadhaar)
✅ **Step 3:** Upload document image or PDF
✅ **Results:** See extracted text and verification status

---

## Next Steps

- **Read full README.md** for detailed documentation
- **Explore API docs** at http://localhost:8000/docs
- **Check code comments** for learning points
- **Try uploading different documents** to test OCR

Enjoy! 🚀
