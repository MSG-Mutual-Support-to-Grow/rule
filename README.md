# 🧠 Resume Parser API (FastAPI)

This FastAPI-based API allows you to upload PDF resumes and automatically extracts structured information using a smart AI pipeline. It handles both *text-based* and *image-based* PDFs using OCR when needed.

---

## 🚀 Features

- ✅ Upload .pdf resumes
- 🧠 Automatically detects whether the resume is text or image
- 🔍 Parses data using NLP pipelines or OCR
- 🌐 CORS-enabled for frontend integrations
- 🔐 Safe file uploads with UUID-based filenames

---

## 📁 Project Structure



resume\_parser\_api/
├── main.py                           # FastAPI app
├── resumes/                          # Uploaded resume storage
└── scripts/
└── pipelines/
├── analyze\_resume.py         # Core AI processing logic

`

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
`

### 2. Create & Activate Virtual Environment

bash
python -m venv venv
source venv/bin/activate     # Linux/macOS
venv\Scripts\activate        # Windows


### 3. Install Requirements

bash
pip install -r requirements.txt


> *Note:* Add dependencies like fastapi, uvicorn, pytesseract, PyMuPDF, pdfplumber, etc. to requirements.txt.

---

## ▶️ Run the API

bash
uvicorn main:app --reload


API will be available at:
👉 http://localhost:8000

---

## 📤 API Endpoint

### POST /upload-resume/

#### Description:

Upload a PDF resume for AI-based analysis.

#### Request:

* *Content-Type:* multipart/form-data
* *Field:* file (PDF resume)

#### Example with curl:

bash
curl -X POST http://localhost:8000/upload-resume/ \
  -F "file=@/path/to/resume.pdf"


#### Response:

json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "123-456-7890",
  "total_experience_years": 5,
  "roles": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "years": 3
    },
    ...
  ]
}


---

## 🧠 AI Pipeline (Under the Hood)

* is_pdf_text_based()
  ➜ Detects whether the PDF contains selectable text

* process_resume()
  ➜ Uses NLP pipeline for text-based resumes

* process_resume_ocr()
  ➜ Falls back to OCR (e.g., EasyOCR or Tesseract) for scanned/image PDFs

---