# Resume Parser API Documentation

Complete API documentation for the Resume Parser application backend.

## 🚀 Base URL
```
http://localhost:8000
```

## 📋 API Endpoints

### 1. Upload Resume Analysis (Dynamic)

**POST** `/upload-resume/`

Uploads a PDF resume file and performs AI-powered analysis using the saved job description from `jsons/job_description.json`. The analysis is **dynamic** - it automatically uses the most recently saved job description to evaluate candidate eligibility and fit.

#### Request
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file` (required): PDF file to analyze

#### How It Works
1. **Reads Job Description**: Automatically loads the saved job description from `jsons/job_description.json`
2. **Fallback**: If no job description is saved, uses default: "No specific job description provided."
3. **Dynamic Analysis**: AI analyzes the resume specifically against the saved job requirements
4. **Saves Results**: Structured output saved to `outputs/` folder

#### Response Format

**Success (200):**
```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1-234-567-8900",
  "total_experience_years": 5,
  "roles": [
    {
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "years": 3
    }
  ],
  "skills": {
    "Python": {
      "source": "work_experience",
      "years": "5"
    },
    "JavaScript": {
      "source": "projects",
      "years": "3"
    }
  },
  "projects": [
    {
      "name": "E-commerce Platform",
      "tech_stack": ["React", "Node.js", "MongoDB"],
      "description": "Built a full-stack e-commerce solution"
    }
  ],
  "leadership_signals": true,
  "leadership_justification": "Led a team of 5 developers",
  "candidate_fit_summary": "Strong technical background with leadership experience",
  "eligibility_status": "Eligible",
  "eligibility_reason": "Meets all technical requirements for the Python Developer position"
}
```

**Error (400):**
```json
{
  "detail": "Only PDF files are accepted."
}
```

**Error (500):**
```json
{
  "error": "AI analysis failed"
}
```

#### Features
- ✅ **Dynamic Job Matching**: Uses saved job description automatically
- ✅ **PDF Processing**: Handles both text-based and image-based PDFs
- ✅ **OCR Support**: Extracts text from scanned documents
- ✅ **AI Analysis**: Uses LLM for intelligent data extraction
- ✅ **Structured Output**: Returns organized candidate information
- ✅ **Skills Assessment**: Identifies technical and soft skills
- ✅ **Experience Calculation**: Determines total years of experience
- ✅ **Leadership Evaluation**: Assesses leadership potential
- ✅ **Eligibility Analysis**: Evaluates candidate fit for the specific saved job

---

### 2. Save Job Description

**POST** `/save-job-description/`

Saves job description text to `jsons/job_description.json`. This job description will be automatically used by the `/upload-resume/` endpoint for dynamic analysis.

#### Request
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "job_description": "We are seeking a Python Developer with 3+ years of experience in FastAPI, React, and database systems. Must have AI/ML knowledge and leadership experience. Remote work available."
}
```

#### Response Format

**Success (200):**
```json
{
  "message": "Job description saved successfully"
}
```

**Error (500):**
```json
{
  "error": "Failed to save job description: [error details]"
}
```

#### File Storage
- **Location**: `jsons/job_description.json`
- **Format**: JSON with single key `job_description`
- **Behavior**: Overwrites existing file each time
- **Auto-Creation**: Creates `jsons/` directory automatically if it doesn't exist

**Example saved file:**
```json
{
  "job_description": "We are seeking a Python Developer with 3+ years of experience in FastAPI, React, and database systems. Must have AI/ML knowledge and leadership experience. Remote work available."
}
```

#### Impact on Resume Analysis
- **Dynamic Integration**: Any resume uploaded after saving will be analyzed against this job description
- **Eligibility Matching**: AI will determine if candidates meet the specific requirements
- **Fit Analysis**: Candidate summaries will be tailored to this role
- **Update Anytime**: Change job description anytime to update analysis criteria

## 🚀 Usage Examples

### Upload Resume Analysis

#### Using curl:
```bash
curl -X POST "http://localhost:8000/upload-resume/" \
  -F "file=@/path/to/your/resume.pdf"
```

#### Using Python requests:
```python
import requests

with open('resume.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post("http://localhost:8000/upload-resume/", files=files)
    result = response.json()
    print(result)
```

#### Using JavaScript fetch:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8000/upload-resume/', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### Save Job Description

#### Using curl:
```bash
curl -X POST "http://localhost:8000/save-job-description/" \
  -H "Content-Type: application/json" \
  -d '{"job_description": "Senior Full Stack Developer needed for startup"}'
```

#### Using Python requests:
```python
import requests

data = {
    "job_description": "Senior Full Stack Developer needed for startup"
}

response = requests.post("http://localhost:8000/save-job-description/", json=data)
print(response.json())
```

#### Using JavaScript fetch:
```javascript
fetch('http://localhost:8000/save-job-description/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    job_description: 'Senior Full Stack Developer needed for startup'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🧪 Testing & Development

### Start the Backend Server
```bash
cd backend
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

### Test Resume Upload
```bash
# Test with a sample PDF
curl -X POST "http://localhost:8000/upload-resume/" \
  -F "file=@sample_resume.pdf"
```

### Test Job Description Saving
```bash
python test_api.py
```

### Check Saved Files
```bash
# View the saved job description
cat jsons/job_description.json

# View resume analysis outputs (if generated)
ls outputs/
```

### Interactive API Documentation
FastAPI provides automatic interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set custom configurations
export API_HOST=0.0.0.0
export API_PORT=8000
```

### CORS Configuration
Currently configured to allow all origins (`*`) for development. For production, update the `allow_origins` setting in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Data Models

### Resume Analysis Response Model
```python
{
  "full_name": str,
  "email": str,
  "phone_number": str,
  "total_experience_years": int,
  "roles": [
    {
      "title": str,
      "company": str,
      "years": int
    }
  ],
  "skills": {
    "skill_name": {
      "source": str,
      "years": str
    }
  },
  "projects": [
    {
      "name": str,
      "tech_stack": str | list,
      "description": str
    }
  ],
  "leadership_signals": bool,
  "leadership_justification": str,
  "candidate_fit_summary": str,
  "eligibility_status": str,
  "eligibility_reason": str
}
```

### Job Description Request Model
```python
{
  "job_description": str  # Required field
}
```

## 🔍 Features & Capabilities

### Resume Analysis Features
- ✅ **PDF Processing**: Handles both text-based and image-based PDFs
- ✅ **OCR Support**: Extracts text from scanned documents
- ✅ **AI Analysis**: Uses LLM for intelligent data extraction
- ✅ **Structured Output**: Returns organized candidate information
- ✅ **Skills Assessment**: Identifies technical and soft skills
- ✅ **Experience Calculation**: Determines total years of experience
- ✅ **Leadership Evaluation**: Assesses leadership potential
- ✅ **Fit Analysis**: Evaluates candidate suitability

### Job Description Features
- ✅ **Simple Storage**: Single JSON file for easy management
- ✅ **UTF-8 Encoding**: Supports international characters
- ✅ **Automatic Overwrite**: Updates existing job descriptions
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **File Management**: Auto-creates directories and files

## 🚨 Error Handling

### Common Error Codes
- **400**: Bad Request (invalid file type, missing parameters)
- **422**: Validation Error (invalid JSON structure)
- **500**: Internal Server Error (processing failures, file system errors)

### Error Response Format
```json
{
  "error": "Descriptive error message",
  "detail": "Additional error details (if available)"
}
```

## 📝 Notes & Best Practices

### File Handling
- Only PDF files are accepted for resume upload
- Temporary files are automatically cleaned up after processing
- The `jsons/` directory is created automatically if it doesn't exist

### Performance
- Resume analysis may take 10-30 seconds depending on file size and complexity
- Large PDF files (>10MB) may timeout - consider file size limits

### Security
- CORS is currently open for development
- Consider adding authentication for production use
- Validate file types and sizes to prevent abuse

### Monitoring
- Check server logs for processing errors
- Monitor the `outputs/` directory for generated files
- Review API response times for performance optimization

## 🔄 API Versioning

Current version: **v1** (implicit)

Future versions may include:
- `/v2/upload-resume/` with enhanced features
- `/v2/save-job-description/` with multiple job support
- Authentication endpoints
- Batch processing endpoints
