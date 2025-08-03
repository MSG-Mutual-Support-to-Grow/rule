from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
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

# Import LLM automation
from backend.modules.llm.llm_automation import llm_automation
from backend.modules.llm.handlers.openrouter_handler import OpenRouterProvider

# Pydantic model for job description request
class JobDescriptionRequest(BaseModel):
    job_description: str

# Pydantic model for processing configuration
class ProcessingModeRequest(BaseModel):
    job_description: Optional[str] = None
    processing_mode: str = "individual"  # "individual" or "batch"
    return_full_analysis: bool = True

# Pydantic models for LLM provider management
class LLMConfigRequest(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None

class LLMPromptRequest(BaseModel):
    prompt: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get job description
def get_job_description(custom_job_description: Optional[str] = None) -> str:
    """Get job description from parameter or file"""
    if custom_job_description:
        return custom_job_description
    
    job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jd_jsons/job_description.json")
    job_description = "No specific job description provided."
    
    if os.path.exists(job_file_path):
        try:
            with open(job_file_path, 'r', encoding='utf-8') as f:
                job_data = json.load(f)
                job_description = job_data.get("job_description", job_description)
        except Exception as e:
            print(f"[WARNING] Failed to read job description file: {e}")
    
    return job_description

# Unified processing function
def process_single_resume(file_path: str, job_description: str, resume_id: str, filename: str = None):
    """Process a single resume and return standardized result"""
    try:
        if is_pdf_text_based(file_path):
            result = process_resume(file_path, job_description, resume_id)
        else:
            result = process_resume_ocr(file_path, job_description, resume_id)

        if not result:
            return {
                "success": False,
                "error": "AI analysis failed",
                "resume_id": resume_id,
                "filename": filename,
                "fit_score": 1,
                "fit_score_reason": "AI analysis failed - cannot assess job requirements match",
                "eligibility_status": "Not Eligible",
                "eligibility_reason": "Resume analysis could not be completed - unable to verify job requirements",
                "work_experience_raw": "Could not extract work experience"
            }

        # Ensure all results have required fields for consistency
        if "resume_id" not in result:
            result["resume_id"] = resume_id
        if "filename" not in result and filename:
            result["filename"] = filename
        if "fit_score" not in result:
            result["fit_score"] = 1  # Default to lowest score if not provided
        if "fit_score_reason" not in result:
            result["fit_score_reason"] = "Resume analysis incomplete - cannot assess job requirements match"
        if "eligibility_status" not in result:
            # Determine eligibility based on fit_score - be logical and practical
            fit_score = result.get("fit_score", 1)
            result["eligibility_status"] = "Eligible" if fit_score >= 6 else "Not Eligible"
        if "eligibility_reason" not in result:
            fit_score = result.get("fit_score", 1)
            if fit_score >= 6:
                result["eligibility_reason"] = "Candidate has relevant technical background and experience that aligns with job requirements"
            else:
                result["eligibility_reason"] = f"Candidate's background is not logically relevant to this job role (fit score: {fit_score}/10). Experience appears to be in a different field."
        if "work_experience_raw" not in result:
            result["work_experience_raw"] = "Work experience information not available"

        result["success"] = True
        return result

    except Exception as e:
        import traceback
        error_message = str(e)
        tb = traceback.format_exc()
        print(f"[ERROR] Exception in process_single_resume: {error_message}\n{tb}")
        
        return {
            "success": False,
            "error": error_message,
            "trace": tb,
            "resume_id": resume_id,
            "filename": filename,
            "fit_score": 1,
            "fit_score_reason": "Processing failed - cannot assess job requirements",
            "eligibility_status": "Not Eligible",
            "eligibility_reason": "Resume could not be processed - unable to verify job requirements match",
            "work_experience_raw": "Could not extract work experience"
        }

@app.post("/api/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and process a single resume"""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    try:
        job_description = get_job_description()
        resume_id = str(uuid4())
        
        result = process_single_resume(temp_file_path, job_description, resume_id, file.filename)
        
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

        if not result.get("success", False):
            return JSONResponse(
                content={
                    "error": result.get("error", "Processing failed"),
                    "trace": result.get("trace"),
                    "resume_id": resume_id
                }, 
                status_code=500
            )

        return JSONResponse(content=result, status_code=200)

    except Exception as e:
        import traceback
        error_message = str(e)
        tb = traceback.format_exc()
        print(f"[ERROR] Exception in upload_resume: {error_message}\n{tb}")
        
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        return JSONResponse(
            content={
                "error": error_message, 
                "trace": tb,
                "resume_id": str(uuid4())
            }, 
            status_code=500
        )


@app.post("/api/save-job-description/")
async def save_job_description(request: JobDescriptionRequest):
    """Save job description to a single JSON file"""
    try:
        # Path to the job description file
        job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jd_jsons/job_description.json")
        
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

@app.get("/api/get-job-description/")
async def get_job_description():
    """Get the current job description from the JSON file"""
    try:
        # Path to the job description file
        job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jd_jsons/job_description.json")
        
        # Check if file exists
        if not os.path.exists(job_file_path):
            return JSONResponse(
                content={
                    "error": "No job description found",
                    "message": "No job description has been saved yet. Please save a job description first."
                },
                status_code=404
            )
        
        # Read the job description from file
        with open(job_file_path, 'r', encoding='utf-8') as f:
            job_data = json.load(f)
        
        # Return the job description data
        return JSONResponse(
            content={
                "success": True,
                "job_description": job_data.get("job_description", ""),
                "file_path": "jd_jsons/job_description.json",
                "message": "Job description retrieved successfully"
            },
            status_code=200
        )
    
    except json.JSONDecodeError:
        return JSONResponse(
            content={
                "error": "Invalid JSON format",
                "message": "The job description file contains invalid JSON data"
            },
            status_code=500
        )
    
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to retrieve job description: {str(e)}"},
            status_code=500
        )

        
@app.post("/api/upload-resume-batch/")
async def upload_resume_batch(files: List[UploadFile] = File(...)):
    """Upload and process multiple resumes in batch mode"""
    job_description = get_job_description()
    results = []
    failed_files = []

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            failed_files.append({
                "filename": file.filename,
                "error": "Only PDF files are accepted",
                "resume_id": None
            })
            continue

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        try:
            resume_id = str(uuid4())
            result = process_single_resume(temp_path, job_description, resume_id, file.filename)

            if result.get("success", False):
                results.append(result)
            else:
                failed_files.append({
                    "filename": file.filename,
                    "error": result.get("error", "Processing failed"),
                    "resume_id": resume_id
                })

        except Exception as e:
            failed_files.append({
                "filename": file.filename,
                "error": str(e),
                "resume_id": str(uuid4())
            })
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    # Sort successful results by fit_score (highest first)
    ranked_results = sorted(results, key=lambda x: x.get("fit_score", 0), reverse=True)
    
    # Create summary for batch response
    summary_list = [
        {
            "resume_id": r["resume_id"], 
            "filename": r.get("filename", "Unknown"), 
            "fit_score": r.get("fit_score", 0),
            "fit_score_reason": r.get("fit_score_reason", "No reason provided"),
            "candidate_name": r.get("full_name", "Unknown")
        }
        for r in ranked_results
    ]
    
    response_data = {
        "success": True,
        "total_processed": len(files),
        "successful_analyses": len(results),
        "failed_analyses": len(failed_files),
        "ranked_resumes": summary_list,
        "failed_files": failed_files
    }
    
    return JSONResponse(content=response_data, status_code=200)


@app.get("/api/get-analysis/{resume_id}")
async def get_analysis(resume_id: str):
    """Get detailed analysis for a specific resume"""
    outputs_dir = os.path.join(os.path.dirname(__file__), "..", "..", "outputs")
    json_file = os.path.join(outputs_dir, f"{resume_id}.json")
    
    if os.path.exists(json_file):
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return JSONResponse(content=data, status_code=200)
        except Exception as e:
            return JSONResponse(
                content={"error": f"Failed to read analysis: {str(e)}"}, 
                status_code=500
            )
    else:
        return JSONResponse(
            content={"error": "Resume analysis not found."}, 
            status_code=404
        )

# ==================== LLM Provider Management Endpoints ====================

@app.get("/api/llm/providers")
async def get_available_providers():
    """Get list of all available LLM providers and their models"""
    try:
        status = llm_automation.get_provider_status()
        return JSONResponse(content=status, status_code=200)
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to get providers: {str(e)}"}, 
            status_code=500
        )

@app.get("/api/llm/config")
async def get_current_config():
    """Get current LLM configuration with available providers and models"""
    try:
        # Get current config
        config = llm_automation.current_config
        # Don't expose API key in response
        safe_config = {k: v for k, v in config.items() if k != "api_key"}
        safe_config["has_api_key"] = bool(config.get("api_key"))
        
        # Get provider status (includes available providers and models)
        provider_status = llm_automation.get_provider_status()
        
        # Combine config with provider data
        response_data = {
            "current_config": safe_config,
            "available_providers": provider_status.get("available_providers", []),
            "provider_models": provider_status.get("provider_models", {})
        }
        
        return JSONResponse(content=response_data, status_code=200)
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to get config: {str(e)}"}, 
            status_code=500
        )

@app.post("/api/llm/config")
async def update_llm_config(request: LLMConfigRequest):
    """Update LLM provider configuration"""
    try:
        result = llm_automation.update_provider_config(
            provider=request.provider,
            model=request.model,
            api_key=request.api_key,
            base_url=request.base_url
        )
        
        status_code = 200 if result["success"] else 400
        return JSONResponse(content=result, status_code=status_code)
        
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to update config: {str(e)}"}, 
            status_code=500
        )

@app.post("/api/llm/prompt")
async def send_llm_prompt(request: LLMPromptRequest):
    """Send prompt to currently configured LLM provider"""
    try:
        result = llm_automation.send_prompt_with_current_provider(request.prompt)
        
        status_code = 200 if result["success"] else 400
        return JSONResponse(content=result, status_code=status_code)
        
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to send prompt: {str(e)}"}, 
            status_code=500
        )

@app.get("/api/llm/models/{provider}")
async def get_provider_models(provider: str):
    """Get available models for a specific provider"""
    try:
        models = llm_automation.get_available_models(provider)
        
        if not models:
            return JSONResponse(
                content={"error": f"No models found for provider: {provider}"}, 
                status_code=404
            )
        
        return JSONResponse(
            content={"provider": provider, "models": models}, 
            status_code=200
        )
        
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to get models: {str(e)}"}, 
            status_code=500
        )

@app.post("/api/llm/reset")
async def reset_llm_config():
    """Reset LLM configuration to default settings"""
    try:
        result = llm_automation.reset_to_default()
        
        status_code = 200 if result["success"] else 400
        return JSONResponse(content=result, status_code=status_code)
        
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to reset config: {str(e)}"}, 
            status_code=500
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

