from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
import sys
import uuid
import tempfile
import json

# Ensure correct root path for module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.pipelines.analyze_resume import (
    is_pdf_text_based,
    process_resume,
    process_resume_ocr,
)

# Pydantic model for job description request
class JobDescriptionRequest(BaseModel):
    job_description: str

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
        # Read job description from saved JSON file
        job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
        job_description = "No specific job description provided."  # Default value
        
        try:
            if os.path.exists(job_file_path):
                with open(job_file_path, 'r', encoding='utf-8') as f:
                    job_data = json.load(f)
                    job_description = job_data.get("job_description", "No specific job description provided.")
            else:
                print("[WARNING] No job description file found. Using default.")
        except Exception as e:
            print(f"[WARNING] Could not read job description: {e}. Using default.")

        # Detect PDF type and process accordingly with job description
        if is_pdf_text_based(temp_file_path):
            result = process_resume(temp_file_path, job_description)
        else:
            result = process_resume_ocr(temp_file_path, job_description)

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

@app.post("/save-job-description/")
async def save_job_description(request: JobDescriptionRequest):
    """Save job description to a single JSON file"""
    try:
        # Path to the job description file
        job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(job_file_path), exist_ok=True)
        
        # Create the JSON data
        job_data = {
            "job_description": request.job_description
        }
        
        # Save to JSON file (overwrite existing)
        with open(job_file_path, 'w', encoding='utf-8') as f:
            json.dump(job_data, f, indent=2, ensure_ascii=False)
        
        return JSONResponse(
            content={"message": "Job description saved successfully"},
            status_code=200
        )
    
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to save job description: {str(e)}"},
            status_code=500
        )

# @app.get("/get-job-description/")
# async def get_job_description():
#     """Get the currently saved job description"""
#     try:
#         job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
        
#         if not os.path.exists(job_file_path):
#             return JSONResponse(
#                 content={"job_description": "No job description saved yet"},
#                 status_code=200
#             )
        
#         with open(job_file_path, 'r', encoding='utf-8') as f:
#             job_data = json.load(f)
        
#         return JSONResponse(content=job_data, status_code=200)
    
#     except Exception as e:
#         return JSONResponse(
#             content={"error": f"Failed to read job description: {str(e)}"},
#             status_code=500
#         )

# @app.post("/analyze-resume-with-job/")
# async def analyze_resume_with_job(file: UploadFile = File(...), job_description: str = ""):
#     """Upload resume and analyze with provided job description (saves job description too)"""
#     # Validate file type
#     if not file.filename.lower().endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

#     # Save uploaded file to a temporary location
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
#         shutil.copyfileobj(file.file, temp_file)
#         temp_file_path = temp_file.name

#     try:
#         # If job description is provided, save it first
#         if job_description.strip():
#             job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
#             os.makedirs(os.path.dirname(job_file_path), exist_ok=True)
            
#             job_data = {"job_description": job_description}
#             with open(job_file_path, 'w', encoding='utf-8') as f:
#                 json.dump(job_data, f, indent=2, ensure_ascii=False)
            
#             print(f"[DEBUG] Job description saved and will be used for analysis")
#         else:
#             # Read existing job description
#             job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
#             if os.path.exists(job_file_path):
#                 with open(job_file_path, 'r', encoding='utf-8') as f:
#                     job_data = json.load(f)
#                     job_description = job_data.get("job_description", "No specific job description provided.")
#             else:
#                 job_description = "No specific job description provided."

#         # Detect PDF type and process accordingly
#         if is_pdf_text_based(temp_file_path):
#             result = process_resume(temp_file_path, job_description)
#         else:
#             result = process_resume_ocr(temp_file_path, job_description)

#         # Clean up the temp file
#         os.remove(temp_file_path)

#         if not result:
#             return JSONResponse(content={"error": "AI analysis failed"}, status_code=500)

#         # Add job description used in the response
#         result["job_description_used"] = job_description

#         return JSONResponse(content=result, status_code=200)

#     except Exception as e:
#         # Clean up the temp file if it still exists
#         if os.path.exists(temp_file_path):
#             os.remove(temp_file_path)
#         return JSONResponse(content={"error": str(e)}, status_code=500)
