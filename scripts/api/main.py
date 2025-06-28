from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import sys

# Ensure correct root path for module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from scripts.pipelines.analyze_resume import (
    is_pdf_text_based,
    process_resume,
    process_resume_ocr,
    save_result_to_json
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "resumes")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        print(f"[DEBUG] Saving uploaded file to: {file_path}")

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"[DEBUG] Checking if PDF is text-based: {file_path}")
        if is_pdf_text_based(file_path):
            print("[DEBUG] Detected text-based PDF.")
            result = process_resume(file_path)
        else:
            print("[DEBUG] Detected image-based PDF, using OCR.")
            result = process_resume_ocr(file_path)

        if result:
            save_result_to_json(result, file_path)  # ✅ Save to JSON
            return JSONResponse(content=result, status_code=200)
        else:
            return JSONResponse(content={"error": "AI analysis failed"}, status_code=500)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)