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

# Pydantic model for job description request
class JobDescriptionRequest(BaseModel):
    job_description: str

# Pydantic models for LLM provider management
class LLMConfigRequest(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None

class LLMTestRequest(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None

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

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    try:
        job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
        job_description = "No specific job description provided."
        if os.path.exists(job_file_path):
            with open(job_file_path, 'r', encoding='utf-8') as f:
                job_data = json.load(f)
                job_description = job_data.get("job_description", job_description)

        resume_id = str(uuid4())  # ✅ Generate resume_id
        if is_pdf_text_based(temp_file_path):
            result = process_resume(temp_file_path, job_description, resume_id)
        else:
            result = process_resume_ocr(temp_file_path, job_description, resume_id)

        os.remove(temp_file_path)

        if not result:
            return JSONResponse(content={"error": "AI analysis failed"}, status_code=500)

        return JSONResponse(content=result, status_code=200)

    except Exception as e:
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
        
@app.post("/upload-resume-batch/")
async def upload_resume_batch(files: List[UploadFile] = File(...)):
    job_file_path = os.path.join(os.path.dirname(__file__), "..", "..", "jsons/job_description.json")
    job_description = "No specific job description provided."
    if os.path.exists(job_file_path):
        with open(job_file_path, 'r', encoding='utf-8') as f:
            job_data = json.load(f)
            job_description = job_data.get("job_description", job_description)

    results = []

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            continue

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        try:
            resume_id = str(uuid4())

            if is_pdf_text_based(temp_path):
                result = process_resume(temp_path, job_description, resume_id)
            else:
                result = process_resume_ocr(temp_path, job_description, resume_id)

            if result:
                result["resume_id"] = resume_id
                result["file_name"] = file.filename
                result["fit_score"] = result.get("fit_score", 0)
                results.append(result)

        finally:
            os.remove(temp_path)

    ranked = sorted(results, key=lambda x: x["fit_score"], reverse=True)
    response_list = [
        {"resume_id": r["resume_id"], "file_name": r["file_name"], "fit_score": r["fit_score"]}
        for r in ranked
    ]
    return JSONResponse(content={"ranked_resumes": response_list}, status_code=200)


@app.get("/get-analysis/{resume_id}")
async def get_analysis(resume_id: str):
    outputs_dir = os.path.join(os.path.dirname(__file__), "..", "..", "outputs")
    json_file = os.path.join(outputs_dir, f"{resume_id}.json")
    if os.path.exists(json_file):
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        return JSONResponse(content=data, status_code=200)
    else:
        return JSONResponse(content={"error": "Resume analysis not found."}, status_code=404)

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
    """Get current LLM configuration"""
    try:
        config = llm_automation.current_config
        # Don't expose API key in response
        safe_config = {k: v for k, v in config.items() if k != "api_key"}
        safe_config["has_api_key"] = bool(config.get("api_key"))
        
        return JSONResponse(content=safe_config, status_code=200)
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

@app.post("/api/llm/test")
async def test_llm_connection(request: LLMTestRequest):
    """Test connection to LLM provider"""
    try:
        result = llm_automation.test_provider_connection(
            provider=request.provider,
            model=request.model,
            api_key=request.api_key
        )
        
        status_code = 200 if result["success"] else 400
        return JSONResponse(content=result, status_code=status_code)
        
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to test connection: {str(e)}"}, 
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

