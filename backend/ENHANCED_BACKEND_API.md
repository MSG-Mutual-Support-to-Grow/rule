# Enhanced Backend API Documentation

## Overview

The backend now supports both **individual** and **batch** processing modes with enhanced flexibility and better error handling. All endpoints return consistent JSON responses with proper status codes.

## New Features

### ✨ Unified Processing Architecture
- **Consistent response format** across all endpoints
- **Better error handling** with detailed error messages
- **Flexible processing modes** (individual vs batch)
- **Custom job descriptions** can be provided per request
- **Bulk analysis retrieval** for better data management

### 🔄 Processing Modes

#### Individual Mode
- Process one resume at a time
- Returns full detailed analysis for each resume
- Best for: Real-time processing, detailed review

#### Batch Mode  
- Process multiple resumes simultaneously
- Returns ranked list sorted by fit score
- Best for: Candidate screening, bulk evaluation

## API Endpoints

### 📄 Resume Processing

#### 1. Individual Resume Upload (Original)
```http
POST /api/upload-resume/
```
**Description**: Upload and process a single resume with saved job description

**Request**: 
- `file`: PDF file (multipart/form-data)

**Response**:
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "fit_score": 8,
  "fit_score_reason": "Strong match for required skills",
  "candidate_fit_summary": "Excellent fit for the role",
  "resume_id": "uuid-here",
  "filename": "resume.pdf",
  // ... full analysis data
}
```

#### 2. Batch Resume Upload (Enhanced)
```http
POST /api/upload-resume-batch/
```
**Description**: Upload multiple resumes for batch processing

**Request**: 
- `files`: Multiple PDF files (multipart/form-data)

**Response**:
```json
{
  "success": true,
  "total_processed": 5,
  "successful_analyses": 4,
  "failed_analyses": 1,
  "ranked_resumes": [
    {
      "resume_id": "uuid-1",
      "filename": "candidate1.pdf",
      "fit_score": 9,
      "fit_score_reason": "Perfect match",
      "candidate_name": "Jane Smith"
    }
    // ... more candidates ranked by fit_score
  ],
  "failed_files": [
    {
      "filename": "corrupted.pdf",
      "error": "File processing failed",
      "resume_id": null
    }
  ]
}
```

#### 3. Flexible Processing (New)
```http
POST /api/process-resumes/
```
**Description**: Process resumes with configurable options

**Request Parameters**:
- `files`: PDF files (multipart/form-data)
- `processing_mode`: "individual" or "batch" (default: "individual")
- `job_description`: Custom job description (optional)
- `return_full_analysis`: boolean (default: true)

**Example Usage**:
```bash
curl -X POST "http://localhost:8000/api/process-resumes/" \
  -F "files=@resume1.pdf" \
  -F "files=@resume2.pdf" \
  -F "processing_mode=batch" \
  -F "return_full_analysis=false"
```

#### 4. Custom Job Description Analysis (New)
```http
POST /api/analyze-with-job-description/
```
**Description**: Analyze resumes with custom job description provided in request

**Request Parameters**:
- `files`: PDF files (multipart/form-data) 
- `job_description`: Job description text (required)
- `processing_mode`: "individual" or "batch" (default: "individual")

### 📊 Analysis Retrieval

#### 5. Get Single Analysis
```http
GET /api/get-analysis/{resume_id}
```
**Description**: Get detailed analysis for a specific resume

#### 6. Get Multiple Analyses (New)
```http
GET /api/get-analyses/?resume_ids=id1,id2,id3
```
**Description**: Get analyses for multiple resumes at once

**Response**:
```json
{
  "success": true,
  "requested_count": 3,
  "found_count": 2,
  "not_found_count": 1,
  "analyses": [
    // ... analysis objects
  ],
  "not_found": [
    {
      "resume_id": "missing-id",
      "error": "Analysis not found"
    }
  ]
}
```

#### 7. Get All Analyses (New)
```http
GET /api/get-all-analyses/?limit=50&sort_by=fit_score
```
**Description**: Get all available analyses with sorting and limiting

**Parameters**:
- `limit`: Maximum number of results (default: 50)
- `sort_by`: "fit_score" or "name" (default: "fit_score")

### ⚙️ Configuration & Info

#### 8. Processing Information (New)
```http
GET /api/processing-info/
```
**Description**: Get information about available processing modes and current configuration

**Response**:
```json
{
  "available_modes": {
    "individual": {
      "description": "Process one resume at a time with full detailed analysis",
      "endpoint": "/api/upload-resume/"
    },
    "batch": {
      "description": "Process multiple resumes and rank them by fit score", 
      "endpoint": "/api/upload-resume-batch/"
    }
    // ... more modes
  },
  "current_config": {
    "has_saved_job_description": true,
    "job_description_preview": "We are looking for...",
    "existing_analyses_count": 15,
    "recent_analyses": ["uuid1", "uuid2", "uuid3"]
  },
  "supported_file_types": ["pdf"],
  "max_files_per_batch": "unlimited"
}
```

#### 9. Job Description Management
```http
POST /api/save-job-description/
GET /api/processing-info/  # Shows current job description
```

### 🤖 LLM Configuration (Existing)
- `GET /api/llm/config` - Get current LLM configuration
- `POST /api/llm/config` - Update LLM configuration
- `GET /api/llm/providers` - Get available providers
- `POST /api/llm/reset` - Reset to default configuration

## Usage Examples

### Example 1: Individual Processing with Custom Job Description
```python
import requests

files = [('files', open('resume.pdf', 'rb'))]
data = {
    'job_description': 'Looking for Python developer with FastAPI experience',
    'processing_mode': 'individual'
}

response = requests.post(
    'http://localhost:8000/api/analyze-with-job-description/',
    files=files,
    data=data
)
```

### Example 2: Batch Processing Multiple Resumes
```python
import requests

files = [
    ('files', open('resume1.pdf', 'rb')),
    ('files', open('resume2.pdf', 'rb')),
    ('files', open('resume3.pdf', 'rb'))
]

response = requests.post(
    'http://localhost:8000/api/upload-resume-batch/',
    files=files
)

# Get ranked candidates
ranked_candidates = response.json()['ranked_resumes']
```

### Example 3: Get Top Candidates from All Analyses
```python
import requests

response = requests.get(
    'http://localhost:8000/api/get-all-analyses/?limit=10&sort_by=fit_score'
)

top_candidates = response.json()['analyses']
```

## Error Handling

All endpoints now return consistent error responses:

```json
{
  "success": false,
  "error": "Detailed error message",
  "trace": "Stack trace (in development)",
  "resume_id": "uuid-if-applicable"
}
```

## Response Format Consistency

### Success Response Structure
```json
{
  "success": true,
  "processing_mode": "individual|batch",
  "total_files": 3,
  "successful_analyses": 2,
  "failed_analyses": 1,
  "results": [...],  // Individual mode
  "ranked_resumes": [...],  // Batch mode
  "failed_files": [...]  // If any failures
}
```

### Individual Analysis Structure
```json
{
  "resume_id": "uuid",
  "filename": "resume.pdf",
  "full_name": "Candidate Name",
  "email": "email@example.com",
  "phone_number": "+1234567890",
  "total_experience_years": 5,
  "fit_score": 8,
  "fit_score_reason": "Strong technical match",
  "candidate_fit_summary": "Excellent candidate for the role",
  "skills": {...},
  "projects": [...],
  "roles": [...],
  "leadership_signals": true,
  "leadership_justification": "...",
  "success": true
}
```

## Testing

Run the test script to verify all endpoints:

```bash
python test_enhanced_backend.py
```

This will test all new endpoints and provide a summary of available functionality.
