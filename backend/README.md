# Rule Backend API

A powerful FastAPI-based backend service for parsing, analyzing, and matching resumes against job descriptions using advanced NLP and AI technologies.

## 🚀 Features

- **PDF Text Extraction**: Extract text from both text-based and image-based PDFs
- **OCR Support**: Advanced OCR capabilities using Tesseract and EasyOCR
- **AI-Powered Analysis**: Resume analysis using LLM providers (Ollama, OpenRouter)
- **Job Matching**: Intelligent resume-to-job description matching
- **RESTful API**: Clean FastAPI endpoints with automatic documentation
- **Batch Processing**: Support for multiple resume uploads
- **Multiple Formats**: Support for various resume formats

## 📋 Prerequisites

### System Requirements
- **Python**: 3.10 or higher
- **Operating System**: Linux, macOS, or Windows
- **Memory**: Minimum 4GB RAM (8GB+ recommended for OCR processing)

### System Dependencies (for non-Docker setup)
- **Tesseract OCR**: For image-based PDF text extraction
- **Poppler**: For PDF processing
- **OpenCV**: For computer vision tasks

## 🛠️ Installation & Setup

### Option 1: Docker Setup (Recommended)

Docker setup is the easiest way to get started as it handles all system dependencies automatically.

#### Prerequisites for Docker
- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

#### Quick Start with Docker
1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/MSG-Mutual-Support-to-Grow/rule
   cd rule
   ```

2. **Build and run the backend**:
   ```bash
   # From the project root directory
   docker-compose up --backendbuild
   ```

3. **Access the API**:
   - API Server: http://localhost:8000
   - Interactive API Documentation: http://localhost:8000/docs
   - Alternative API Documentation: http://localhost:8000/redoc

#### Manual Docker Build
If you prefer to build just the backend service:

```bash
# Build the Docker image
docker build -f backend/Dockerfile.backend -t rule_backend .

# Run the container
docker run -p 8000:8000 \
  -v $(pwd)/outputs:/app/outputs \
  -v $(pwd)/configs:/app/configs \
  rule_backend
```

### Option 2: Local Development Setup

#### Step 1: Install System Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libopencv-dev \
    pkg-config \
    python3.10 \
    python3.10-venv \
    python3-pip
```

**macOS:**
```bash
# Install Homebrew if you haven't already
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install tesseract poppler opencv python@3.10
```

**Windows:**
```powershell
# Install using Chocolatey (install Chocolatey first if needed)
choco install tesseract poppler python3

# Or download and install manually:
# - Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
# - Poppler: https://blog.alivate.com.au/poppler-windows/
# - Python 3.10+: https://www.python.org/downloads/
```

#### Step 2: Set Up Python Environment

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   uv venv 
   ```

3. **Activate the virtual environment**:
   
   **Linux/macOS:**
   ```bash
   source .venv/bin/activate
   ```
   
   **Windows:**
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

4. **Upgrade pip**:
   ```bash
   pip install --upgrade pip
   ```

#### Step 3: Install Python Dependencies

1. **Install requirements**:
   ```bash
   uv add -r requirements.txt
   ```

2. **Install spaCy language model**:
   ```bash
   # Install the bundled model
   pip install api/en_core_web_sm-3.7.1-py3-none-any.whl
   
   # Or download directly (alternative)
   python -m spacy download en_core_web_sm
   ```

#### Step 4: Environment Configuration

1. **Configure LLM settings** (optional):
   Edit `configs/llm_config.json` to customize your LLM provider:
   ```json
   {
     "provider": "ollama",
     "model": "qwen3:4b",
     "api_key": "",
     "base_url": "http://localhost:11434",
     "updated_at": "2024-01-01"
   }
   ```

#### Step 5: Run the Application

1. **Start the FastAPI server**:
   ```bash
   # From the backend directory
   uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Verify the installation**:
   - API Server: http://localhost:8000
   - Health Check: http://localhost:8000/api/llm/providers
   - API Documentation: http://localhost:8000/docs

## 📚 Detailed API Endpoints

All endpoints are prefixed with `/api` and return JSON responses.

### 📄 Resume Processing Endpoints

#### 1. Upload and Analyze Single Resume
```http
POST /api/upload-resume/
```

**Description**: Upload and analyze a single PDF resume against the current job description.

**Request**:
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file` (required): PDF file upload

**Response**:
```json
{
  "success": true,
  "resume_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "filename": "john_doe_resume.pdf",
  "full_name": "John Doe",
  "email": "john.doe@email.com",
  "phone_number": "+1-555-0123",
  "total_experience_years": 5,
  "fit_score": 8,
  "fit_score_reason": "Strong technical background matching Python and FastAPI requirements",
  "eligibility_status": "Eligible",
  "eligibility_reason": "Candidate has 5+ years of relevant experience",
  "candidate_fit_summary": "Excellent match with strong technical skills",
  "skills": {
    "Python": {"source": "Professional", "years": 5},
    "FastAPI": {"source": "Professional", "years": 2},
    "Docker": {"source": "Professional", "years": 3}
  },
  "projects": [
    {
      "name": "E-commerce API Platform",
      "tech_stack": "Python, FastAPI, PostgreSQL, Docker",
      "description": "Built scalable REST API serving 10,000+ concurrent users"
    }
  ],
  "education": "B.S. Computer Science, Stanford University, 2018",
  "leadership_signals": true,
  "leadership_justification": "Led development team of 5 engineers for 2 years",
  "work_experience_raw": "Software Engineer at TechCorp (2019-2024)...",
  "job_description": "We are seeking a Senior Backend Developer..."
}
```

**Error Response**:
```json
{
  "error": "Only PDF files are accepted",
  "resume_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "trace": "Detailed error traceback..."
}
```

#### 2. Batch Resume Processing
```http
POST /api/upload-resume-batch/
```

**Description**: Upload and process multiple PDF resumes simultaneously, returning a ranked list of candidates.

**Request**:
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `files[]` (required): Multiple PDF file uploads

**Response**:
```json
{
  "success": true,
  "total_processed": 5,
  "successful_analyses": 4,
  "failed_analyses": 1,
  "job_description": "We are seeking a Senior Backend Developer...",
  "ranked_resumes": [
    {
      "resume_id": "abc123",
      "filename": "candidate1.pdf",
      "candidate_name": "Jane Smith",
      "fit_score": 9,
      "fit_score_reason": "Perfect match for all technical requirements",
      "total_experience": "7 years",
      "key_skills": ["Python", "FastAPI", "AWS", "Docker"],
      "eligibility_status": "Highly Eligible"
    },
    {
      "resume_id": "def456",
      "filename": "candidate2.pdf",
      "candidate_name": "John Doe",
      "fit_score": 8,
      "fit_score_reason": "Strong technical background with minor gaps",
      "total_experience": "5 years",
      "key_skills": ["Python", "Django", "PostgreSQL"],
      "eligibility_status": "Eligible"
    }
  ],
  "failed_files": [
    {
      "filename": "corrupted_resume.pdf",
      "error": "Unable to extract text from PDF - file may be corrupted"
    }
  ]
}
```

#### 3. Get Analysis Results
```http
GET /api/get-analysis/{resume_id}
```

**Description**: Retrieve detailed analysis results for a specific resume by its ID.

**Parameters**:
- `resume_id` (path): UUID of the resume analysis

**Response**:
```json
{
  "success": true,
  "resume_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "analysis": {
    "full_name": "John Doe",
    "fit_score": 8,
    "detailed_analysis": "...",
    "processed_at": "2024-01-15T10:30:00Z"
  }
}
```

### 💼 Job Description Management

#### 4. Save Job Description
```http
POST /api/save-job-description/
```

**Description**: Save or update the job description that will be used for resume analysis.

**Request**:
```json
{
  "job_description": "We are seeking a Senior Backend Developer with 5+ years of experience in Python, FastAPI, and cloud technologies. The ideal candidate should have experience with microservices architecture, database design, and team leadership."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Job description saved successfully",
  "job_description": "We are seeking a Senior Backend Developer...",
  "saved_at": "2024-01-15T10:30:00Z"
}
```

#### 5. Get Current Job Description
```http
GET /api/get-job-description/
```

**Description**: Retrieve the currently configured job description.

**Response**:
```json
{
  "success": true,
  "job_description": "We are seeking a Senior Backend Developer with 5+ years of experience...",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### 🤖 LLM Provider Management

#### 6. Get Available Providers
```http
GET /api/llm/providers
```

**Description**: List all available LLM providers and their current status.

**Response**:
```json
{
  "available_providers": [
    {
      "name": "ollama",
      "status": "available",
      "models": ["llama3.2", "codellama", "mistral"],
      "base_url": "http://localhost:11434",
      "requires_api_key": false
    },
    {
      "name": "openrouter",
      "status": "configured",
      "models": ["gpt-4", "claude-3", "mixtral"],
      "base_url": "https://openrouter.ai/api/v1/chat/completions",
      "requires_api_key": true
    }
  ],
  "current_provider": "ollama"
}
```

#### 7. Get Current LLM Configuration
```http
GET /api/llm/config
```

**Description**: Get the current LLM provider configuration.

**Response**:
```json
{
  "provider": "ollama",
  "model": "llama3.2",
  "api_key": null,
  "base_url": "http://localhost:11434",
  "status": "connected",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

#### 8. Configure LLM Provider
```http
POST /api/llm/config
```

**Description**: Switch LLM provider or update configuration settings.

**Request**:
```json
{
  "provider": "openrouter",
  "model": "mistralai/mistral-7b-instruct",
  "api_key": "sk-or-v1-your-api-key-here",
  "base_url": "https://openrouter.ai/api/v1/chat/completions"
}
```

**Response**:
```json
{
  "success": true,
  "message": "LLM provider configured successfully",
  "config": {
    "provider": "openrouter",
    "model": "mistralai/mistral-7b-instruct",
    "api_key": "sk-or-v1-***",
    "base_url": "https://openrouter.ai/api/v1/chat/completions",
    "status": "connected"
  }
}
```

#### 9. Test LLM Connection
```http
POST /api/llm/prompt
```

**Description**: Send a test prompt to the current LLM provider to verify connection.

**Request**:
```json
{
  "prompt": "Hello, please respond with 'Connection successful' if you can process this message."
}
```

**Response**:
```json
{
  "success": true,
  "response": "Connection successful",
  "provider": "ollama",
  "model": "llama3.2",
  "response_time_ms": 1250
}
```

#### 10. Get Available Models for Provider
```http
GET /api/llm/models/{provider}
```

**Description**: Get list of available models for a specific provider.

**Parameters**:
- `provider` (path): Provider name (e.g., "ollama", "openrouter")

**Response**:
```json
{
  "provider": "ollama",
  "models": [
    {
      "name": "llama3.2",
      "size": "7B",
      "description": "Meta's latest Llama model"
    },
    {
      "name": "codellama",
      "size": "13B",
      "description": "Specialized for code generation"
    }
  ]
}
```

#### 11. Fix Configuration Issues
```http
POST /api/llm/fix-config
```

**Description**: Automatically attempt to fix common LLM configuration issues.

**Response**:
```json
{
  "success": true,
  "message": "Configuration issues resolved",
  "fixes_applied": [
    "Updated Ollama base URL to correct endpoint",
    "Validated API key format"
  ],
  "current_config": {
    "provider": "ollama",
    "status": "connected"
  }
}
```

#### 12. Validate Configuration
```http
POST /api/llm/validate-config
```

**Description**: Validate the current LLM configuration without making changes.

**Response**:
```json
{
  "valid": true,
  "provider": "ollama",
  "issues": [],
  "recommendations": [
    "Consider updating to latest model version"
  ]
}
```

#### 13. Reset LLM Configuration
```http
POST /api/llm/reset
```

**Description**: Reset LLM configuration to default settings.

**Response**:
```json
{
  "success": true,
  "message": "Configuration reset to defaults",
  "config": {
    "provider": "ollama",
    "model": "llama3.2",
    "base_url": "http://localhost:11434"
  }
}
```

## 🏗️ Project Structure

```
backend/
├── api/
│   ├── main.py                 # FastAPI application entry point
│   ├── en_core_web_sm-*.whl   # spaCy language model
│   └── README.md
├── modules/
│   ├── llm/                   # LLM integration modules
│   │   ├── base_provider.py   # Base LLM provider interface
│   │   ├── llm_automation.py  # LLM automation logic
│   │   ├── provider_router.py # LLM provider routing
│   │   └── handlers/          # Provider-specific handlers
│   │       ├── ollama_handler.py
│   │       └── openrouter_handler.py
│   ├── llm_prompts/           # LLM prompt templates
│   │   └── parse_resume_llm.py
│   └── text_extract/          # Text extraction modules
│       ├── extract_native_pdf.py  # Native PDF text extraction
│       └── extract_ocr_pdf.py     # OCR-based text extraction
├── pipelines/
│   └── analyze_resume.py      # Resume analysis pipeline
├── requirements.txt           # Python dependencies
├── pyproject.toml            # Project configuration
├── Dockerfile.backend        # Docker configuration
└── README.md                 # This file
```

## ⚙️ Configuration

### LLM Providers

The application supports multiple LLM providers:

1. **Ollama** (Local/Self-hosted):
   - No API key required
   - Runs locally or on specified server
   - Configure in `configs/llm_config.json`

2. **OpenRouter** (Cloud):
   - Requires API key
   - Set `OPENROUTER_API_KEY` in environment
   - Access to multiple models

### OCR Configuration

The application automatically detects PDF type:
- **Text-based PDFs**: Uses native text extraction
- **Image-based PDFs**: Falls back to OCR processing

## 🧪 Testing

1. **Test the health endpoint**:
   ```bash
   curl http://localhost:8000/api/llm/providers
   ```

2. **Test resume upload**:
   ```bash
   curl -X POST "http://localhost:8000/api/upload-resume/" \
     -H "accept: application/json" \
     -F "file=@path/to/resume.pdf"
   ```

3. **Access interactive documentation**:
   Visit http://localhost:8000/docs for interactive API testing.

## 🐛 Troubleshooting

### Common Issues

1. **Tesseract not found**:
   ```bash
   # Verify Tesseract installation
   tesseract --version
   
   # Install if missing (Ubuntu)
   sudo apt-get install tesseract-ocr tesseract-ocr-eng
   ```

2. **spaCy model not found**:
   ```bash
   # Install the language model
   python -m spacy download en_core_web_sm
   ```

3. **Permission errors on Windows**:
   - Run PowerShell as Administrator
   - Enable script execution: `Set-ExecutionPolicy RemoteSigned`

4. **Memory issues during OCR**:
   - Increase available memory
   - Process smaller batches of documents
   - Consider using lighter OCR models

5. **LLM connection issues**:
   - Check API keys in environment variables
   - Verify network connectivity
   - Check provider-specific endpoints

### Performance Optimization

1. **For better OCR performance**:
   - Use SSDs for faster file I/O
   - Increase available RAM
   - Consider GPU acceleration for EasyOCR

2. **For faster API responses**:
   - Use text-based PDFs when possible
   - Implement caching for repeated analyses
   - Consider async processing for large batches

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation at `/docs`
3. Check existing issues in the repository
4. Create a new issue with detailed information

---

**Happy coding! 🚀**
