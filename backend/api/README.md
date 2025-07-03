# Resume Parser API Documentation

Complete API documentation for the Resume Parser application backend with **dynamic job description integration**.

## 🚀 Base URL
```
http://localhost:8000
```

## 📋 API Endpoints

### 1. Upload Resume Analysis (Dynamic)

**POST** `/upload-resume/`

Uploads a PDF resume file and performs AI-powered analysis using the **saved job description** for dynamic candidate evaluation.

#### How It Works
1. **Automatically reads** the job description from `jsons/job_description.json`
2. **Analyzes the resume** against the specific job requirements
3. **Returns eligibility status** and fit analysis for that particular role
4. **Saves results** to `outputs/` folder

#### Request
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file` (required): PDF file to analyze

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
  "eligibility_reason": "Meets all technical requirements"
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
- ✅ **Dynamic Job Matching**: Uses saved job description for targeted analysis
- ✅ **PDF Processing**: Handles both text-based and image-based PDFs
- ✅ **OCR Support**: Extracts text from scanned documents
- ✅ **AI Analysis**: Uses LLM for intelligent data extraction
- ✅ **Structured Output**: Returns organized candidate information
- ✅ **Skills Assessment**: Identifies technical and soft skills
- ✅ **Experience Calculation**: Determines total years of experience
- ✅ **Leadership Evaluation**: Assesses leadership potential
- ✅ **Eligibility Analysis**: Evaluates candidate fit for the specific job
- ✅ **Automatic Fallback**: Uses default if no job description is saved

---

### 2. Save Job Description

**POST** `/save-job-description/`

Saves job description text to a single JSON file that will be **automatically used** by the resume upload endpoint.

#### Request
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:
```json
{
  "job_description": "Your job description text here"
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

**Example saved file:**
```json
{
  "job_description": "We are looking for a skilled Python developer with 3+ years of experience. Must have knowledge of FastAPI, React, and database systems. Remote work available."
}
```

## 🚀 Usage Examples & Dynamic Workflow

### Complete Dynamic Workflow

#### Step 1: Save Job Description
```bash
curl -X POST "http://localhost:8000/save-job-description/" \
  -H "Content-Type: application/json" \
  -d '{"job_description": "Python developer with 3+ years experience in FastAPI and React"}'
```

#### Step 2: Upload Resume (automatically uses saved job description)
```bash
curl -X POST "http://localhost:8000/upload-resume/" \
  -F "file=@/path/to/your/resume.pdf"
```

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

### Test Dynamic Workflow
```bash
# 1. Save job description
curl -X POST "http://localhost:8000/save-job-description/" \
  -H "Content-Type: application/json" \
  -d '{"job_description": "Python developer with FastAPI experience"}'

# 2. Upload resume (uses saved job description automatically)
curl -X POST "http://localhost:8000/upload-resume/" \
  -F "file=@sample_resume.pdf"
```

### Test with Scripts
```bash
# Test the complete workflow
python test_api.py

# Show dynamic example
python dynamic_example.py
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
# Required: Set your Mistral API key
export MISTRAL_API_KEY=your_mistral_api_key_here

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

## 🔄 Dynamic Workflow

### How It Works
1. **Save Job Description** → API saves to `jsons/job_description.json`
2. **Upload Resume** → API automatically reads saved job description
3. **AI Analysis** → Resume analyzed against specific job requirements
4. **Dynamic Results** → Eligibility and fit analysis for that particular role

### Key Benefits
- ✅ **One-Time Setup**: Save job description once, analyze multiple resumes
- ✅ **Automatic Integration**: No need to send job description with each resume
- ✅ **Dynamic Analysis**: Change job description anytime, all analyses adapt
- ✅ **Consistent Evaluation**: All candidates evaluated against same criteria

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
- ✅ **Dynamic Job Matching**: Automatically uses saved job description
- ✅ **PDF Processing**: Handles both text-based and image-based PDFs
- ✅ **OCR Support**: Extracts text from scanned documents
- ✅ **AI Analysis**: Uses Mistral LLM for intelligent data extraction
- ✅ **Structured Output**: Returns organized candidate information
- ✅ **Skills Assessment**: Identifies technical and soft skills
- ✅ **Experience Calculation**: Determines total years of experience
- ✅ **Leadership Evaluation**: Assesses leadership potential
- ✅ **Eligibility Analysis**: Evaluates candidate fit for specific job
- ✅ **Automatic Fallback**: Uses default analysis if no job description saved

### Job Description Features
- ✅ **Dynamic Integration**: Automatically used by resume upload endpoint
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

### Dynamic Workflow
- **Save job description first** before uploading resumes for targeted analysis
- **Update job description anytime** to change evaluation criteria for all future uploads
- **Check `jsons/job_description.json`** to see current job description being used

### File Handling
- Only PDF files are accepted for resume upload
- Temporary files are automatically cleaned up after processing
- The `jsons/` directory is created automatically if it doesn't exist
- Resume analysis results are saved to `outputs/` folder

### Performance
- Resume analysis may take 10-30 seconds depending on file size and complexity
- Large PDF files (>10MB) may timeout - consider file size limits
- Job description reading adds minimal overhead (~1ms)

### Security
- CORS is currently open for development
- Consider adding authentication for production use
- Validate file types and sizes to prevent abuse
- **Required**: Set `MISTRAL_API_KEY` environment variable

### Monitoring
- Check server logs for processing errors
- Monitor the `outputs/` directory for generated files
- Review API response times for performance optimization
- Verify job description is being read correctly from saved file

## 🎯 Quick Start

1. **Set up environment:**
   ```bash
   export MISTRAL_API_KEY=your_api_key_here
   ```

2. **Start the server:**
   ```bash
   cd backend
   python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Save job description:**
   ```bash
   curl -X POST "http://localhost:8000/save-job-description/" \
     -H "Content-Type: application/json" \
     -d '{"job_description": "Your job requirements here"}'
   ```

4. **Upload resume:**
   ```bash
   curl -X POST "http://localhost:8000/upload-resume/" \
     -F "file=@your_resume.pdf"
   ```

5. **Check results:**
   - View API response for analysis results
   - Check `outputs/` folder for saved JSON files
   - Review `jsons/job_description.json` for current job description

## 🔄 Future Enhancements

Planned features for future versions:
- Multiple job description support
- Batch resume processing
- Resume-to-job matching scores
- Historical analysis tracking
- Authentication endpoints
- Batch processing endpoints
