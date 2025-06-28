from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import sys
import uuid
import tempfile

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

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    # Validate file type (optional)
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Save uploaded file to a temporary location (in-memory or temp dir)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    try:
        # Detect PDF type and process accordingly
        if is_pdf_text_based(temp_file_path):
            result = process_resume(temp_file_path)
        else:
            result = process_resume_ocr(temp_file_path)

        # Clean up the temp file
        os.remove(temp_file_path)

        if not result:
            return JSONResponse(content={"error": "AI analysis failed"}, status_code=500)

        # The pipeline already saves JSON; just return the result here
        return JSONResponse(content=result, status_code=200)

    except Exception as e:
        # Clean up the temp file if it still exists
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        return JSONResponse(content={"error": str(e)}, status_code=500)
