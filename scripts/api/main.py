from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import sys
import uuid

# Ensure correct root path for module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from scripts.pipelines.analyze_resume import (
    is_pdf_text_based,
    process_resume,
    process_resume_ocr,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    # Validate file type (optional)
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Generate unique filename to avoid overwriting
    ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Detect PDF type and process accordingly
        if is_pdf_text_based(file_path):
            result = process_resume(file_path)
        else:
            result = process_resume_ocr(file_path)

        if not result:
            return JSONResponse(content={"error": "AI analysis failed"}, status_code=500)

        # The pipeline already saves JSON; just return the result here
        return JSONResponse(content=result, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
