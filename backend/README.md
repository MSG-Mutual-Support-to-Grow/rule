# Resume Analysis Backend API

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009639.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![Tesseract](https://img.shields.io/badge/OCR-Tesseract-blue.svg)](https://tesseract-ocr.github.io/)
[![OpenCV](https://img.shields.io/badge/CV-OpenCV-green.svg)](https://opencv.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

## 🚀 Overview

A production-ready FastAPI backend for **intelligent resume analysis and candidate evaluation**. This system combines advanced OCR, NLP, and AI technologies to provide comprehensive resume processing, candidate scoring, and automated recruitment workflows.

### ✨ Key Features

- **🤖 Multi-LLM Support**: Ollama, OpenRouter, OpenAI with automatic provider switching
- **📄 Advanced OCR**: Tesseract-based OCR with image enhancement and spell checking
- **🧠 Intelligent Text Processing**: spaCy NLP with entity recognition and text cleaning
- **⚡ Dual Processing Modes**: Individual detailed analysis and batch processing
- **🎯 Smart Scoring**: AI-powered candidate fit scoring with detailed reasoning
- **🔧 Flexible Configuration**: Dynamic LLM provider switching and auto-configuration
- **📊 Comprehensive Analysis**: Skills extraction, experience calculation, eligibility assessment
- **🌐 Production Ready**: CORS enabled, error handling, logging, and monitoring

## 🏗️ Architecture

```
backend/
├── api/                    # FastAPI application and routes
│   ├── main.py            # Main application with all endpoints
│   └── README.md          # API-specific documentation
├── modules/               # Core business logic modules
│   ├── llm/              # LLM provider management system
│   │   ├── llm_automation.py     # LLM automation and configuration
│   │   ├── provider_router.py    # Provider routing and registration
│   │   ├── base_provider.py      # Base provider interface
│   │   ├── utils.py              # LLM utilities and helpers
│   │   └── handlers/             # LLM provider implementations
│   │       ├── ollama_handler.py     # Ollama local LLM integration
│   │       └── openrouter_handler.py # OpenRouter cloud API integration
│   ├── llm_prompts/      # AI prompt engineering and templates
│   │   └── parse_resume_llm.py   # Resume analysis prompts and logic
│   └── text_extract/     # Document processing and OCR
│       ├── extract_native_pdf.py # Native PDF text extraction
│       └── extract_ocr_pdf.py    # Enhanced OCR with Tesseract
├── pipelines/            # Processing workflows and pipelines
│   └── analyze_resume.py # Main resume analysis pipeline
└── configs/              # Configuration files
    └── llm_config.json   # LLM provider configuration
```

## 🛠️ Installation

### System Requirements

- **Operating System**: Linux (Ubuntu 18+), macOS, or Windows with WSL
- **Python**: 3.8 or higher
- **Memory**: 4GB RAM minimum (8GB recommended for OCR processing)
- **Storage**: 2GB free space for dependencies and models

### Prerequisites

#### 1. System Dependencies (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Tesseract OCR engine
sudo apt install tesseract-ocr tesseract-ocr-eng

# Install PDF processing libraries
sudo apt install poppler-utils

# Install image processing dependencies
sudo apt install libgl1-mesa-glx libglib2.0-0

# Install build tools for Python packages
sudo apt install build-essential python3-dev

# Optional: Additional Tesseract language packs
sudo apt install tesseract-ocr-all
```

#### 2. System Dependencies (macOS)

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install tesseract
brew install poppler
```

#### 3. System Dependencies (Windows)

```powershell
# Install using Chocolatey
choco install tesseract
choco install poppler

# Or download and install manually:
# Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
# Poppler: https://blog.alivate.com.au/poppler-windows/
```

### Python Environment Setup

#### Option 1: Using UV (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd rule/backend

# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create and activate virtual environment
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
uv pip install -r requirements.txt

# Install spaCy English model
uv run python -m spacy download en_core_web_sm
```

#### Option 2: Using Pip

```bash
# Clone the repository
git clone <repository-url>
cd rule/backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Install spaCy English model
python -m spacy download en_core_web_sm
```

### Configuration

#### 1. Environment Variables

Create a `.env` file in the backend directory:

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configurations:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False

# OpenRouter API Key (optional)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# OpenAI API Key (optional)
OPENAI_API_KEY=your_openai_api_key_here

# File Upload Settings
MAX_FILE_SIZE_MB=10
ALLOWED_EXTENSIONS=pdf

# OCR Settings
TESSERACT_CMD=/usr/bin/tesseract  # Adjust path as needed
OCR_DPI=300
OCR_TIMEOUT=60

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/backend.log
```

#### 2. LLM Provider Configuration

The system will auto-configure LLM providers. For manual configuration:

```bash
# Configure Ollama (local)
curl -X POST http://localhost:8000/api/llm/config \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "ollama",
    "model": "llama3.2:latest",
    "base_url": "http://localhost:11434"
  }'

# Configure OpenRouter (cloud)
curl -X POST http://localhost:8000/api/llm/config \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openrouter",
    "model": "mistralai/mistral-7b-instruct",
    "api_key": "your_api_key"
  }'
```

### Verification

#### Test Installation

```bash
# Test Python imports
python -c "
import cv2
import spacy
import pytesseract
import numpy as np
from spellchecker import SpellChecker
from pdf2image import convert_from_path
print('✅ All Python packages imported successfully!')
"

# Test system dependencies
tesseract --version
pdftoppm -h

# Test spaCy model
python -c "
import spacy
nlp = spacy.load('en_core_web_sm')
print('✅ spaCy English model loaded successfully!')
"
```

#### Start the Server

```bash
# Development mode
python api/main.py

# Or with uvicorn
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

# Production mode
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Verify API

- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/llm/providers

## 📚 API Endpoints

### 📄 Resume Processing

#### Individual Resume Analysis
```http
POST /api/upload-resume/
Content-Type: multipart/form-data

file: resume.pdf
```

**Response**:
```json
{
  "success": true,
  "resume_id": "uuid",
  "filename": "resume.pdf",
  "fit_score": 8,
  "fit_score_reason": "Strong technical background...",
  "eligibility_status": "Eligible",
  "eligibility_reason": "Candidate has relevant experience...",
  "work_experience_raw": "Software Developer at TechCorp...",
  "job_description": "Full-stack developer position...",
  "skills": ["Python", "React", "AWS"],
  "total_experience": "3 years",
  "education": "B.S. Computer Science"
}
```

#### Batch Resume Processing
```http
POST /api/upload-resume-batch/
Content-Type: multipart/form-data

files[]: resume1.pdf
files[]: resume2.pdf
files[]: resume3.pdf
```

### 💼 Job Description Management

#### Save Job Description
```http
POST /api/save-job-description/
Content-Type: application/json

{
  "job_description": "We are looking for a full-stack developer..."
}
```

#### Get Job Description
```http
GET /api/get-job-description/
```

### 🤖 LLM Configuration

#### Get Available Providers
```http
GET /api/llm/providers
```

#### Configure LLM Provider
```http
POST /api/llm/config
Content-Type: application/json

{
  "provider": "ollama",
  "model": "llama3.2:latest",
  "api_key": "optional"
}
```

#### Get Current Configuration
```http
GET /api/llm/config
```

#### Fix Configuration Issues
```http
POST /api/llm/fix-config
```

#### Test LLM Connection
```http
POST /api/llm/prompt
Content-Type: application/json

{
  "prompt": "Test prompt"
}
```

## 🧠 LLM Provider System

### Supported Providers

| Provider | Models | Use Case | Cost |
|----------|--------|----------|------|
| **Ollama** | llama3.2, codellama, mistral, gemma | Local deployment, privacy | Free |
| **OpenRouter** | gpt-4, claude-3, mixtral | Cloud API, multiple models | Pay-per-use |
| **OpenAI** | gpt-4, gpt-3.5-turbo | High quality, reliable | Pay-per-use |

### Auto-Configuration

The system automatically configures correct endpoints:

- **Ollama**: `http://127.0.0.1:11434`
- **OpenRouter**: `https://openrouter.ai/api/v1/chat/completions`
- **OpenAI**: `https://api.openai.com/v1/chat/completions`

## 📄 Advanced OCR Pipeline

### Enhanced Text Extraction

The system uses a sophisticated OCR pipeline with:

1. **Image Enhancement**:
   - Bilateral filtering for noise reduction
   - Adaptive thresholding for better contrast
   - Grayscale conversion for optimal OCR

2. **Tesseract OCR**:
   - High-accuracy text recognition
   - Multiple language support
   - Configurable DPI and timeout settings

3. **Intelligent Text Cleaning**:
   - Common OCR error correction
   - Email and URL pattern fixing
   - Spell checking with exceptions for names
   - Date format normalization

4. **NLP Enhancement**:
   - spaCy entity recognition for names and organizations
   - Proper noun preservation during spell checking
   - Intelligent spacing and punctuation correction

### Processing Flow

```python
PDF → PDF2Image → Image Enhancement → Tesseract OCR → Text Cleaning → NLP Processing → Structured Output
```

## 🎯 Resume Analysis Features

### Comprehensive Data Extraction

- **Personal Information**: Name, email, phone, location
- **Professional Summary**: Experience level and focus areas
- **Skills Assessment**: Technical and soft skills identification
- **Experience Analysis**: Years of experience calculation
- **Education Background**: Degrees, institutions, graduation dates
- **Project Analysis**: Notable projects and achievements
- **Eligibility Assessment**: Job fit scoring with reasoning

### Intelligent Scoring System

The AI evaluates candidates based on:

1. **Technical Skills Match**: Alignment with job requirements
2. **Experience Relevance**: Industry and role experience
3. **Education Background**: Degree relevance and institution quality
4. **Project Portfolio**: Complexity and relevance of projects
5. **Career Progression**: Growth pattern and advancement
6. **Cultural Fit Indicators**: Soft skills and team collaboration

## 🚀 Production Deployment

### Docker Deployment

```dockerfile
# Dockerfile example
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application
COPY . /app
WORKDIR /app

# Run application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production

```env
# Production settings
DEBUG=False
API_HOST=0.0.0.0
API_PORT=8000

# Security
ALLOWED_HOSTS=["your-domain.com"]
CORS_ORIGINS=["https://your-frontend.com"]

# Performance
WORKER_COUNT=4
MAX_FILE_SIZE_MB=20
OCR_TIMEOUT=120

# Monitoring
LOG_LEVEL=INFO
SENTRY_DSN=your_sentry_dsn
```

### Health Checks

The API provides several health check endpoints:

- `GET /api/llm/providers` - LLM provider status
- `GET /api/llm/config` - Current configuration
- `POST /api/llm/validate-config` - Configuration validation

## 🛡️ Security Considerations

### File Upload Security

- File type validation (PDF only)
- File size limits (configurable)
- Virus scanning (recommended for production)
- Temporary file cleanup

### API Security

- CORS configuration for frontend domains
- Request rate limiting (recommended)
- API key validation for LLM providers
- Input sanitization and validation

### Data Privacy

- No permanent storage of uploaded files
- API keys stored securely
- Option for local LLM processing (Ollama)
- GDPR compliance considerations

## 🔧 Troubleshooting

### Common Issues

#### spaCy Model Download Fails
```bash
# Manual download
wget https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl
pip install ./en_core_web_sm-3.7.1-py3-none-any.whl
```

#### Tesseract Not Found
```bash
# Ubuntu/Debian
sudo apt install tesseract-ocr

# Set path in environment
export TESSERACT_CMD=/usr/bin/tesseract
```

#### PDF2Image Issues
```bash
# Install poppler
sudo apt install poppler-utils

# Verify installation
pdftoppm -h
```

#### OpenCV Import Error
```bash
# Install system dependencies
sudo apt install libgl1-mesa-glx libglib2.0-0

# Reinstall opencv
pip uninstall opencv-python
pip install opencv-python
```

### Performance Optimization

1. **Memory Usage**:
   - Process files in batches
   - Clear temporary files regularly
   - Use appropriate image DPI settings

2. **Processing Speed**:
   - Use local LLMs (Ollama) for faster response
   - Optimize OCR settings for your use case
   - Consider caching for repeated analyses

3. **Scalability**:
   - Use multiple workers with uvicorn
   - Implement async processing for large batches
   - Consider Redis for session management

## 📊 Monitoring and Logging

### Logging Configuration

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/backend.log'),
        logging.StreamHandler()
    ]
)
```

### Metrics to Monitor

- API response times
- OCR processing duration
- LLM provider response times
- Error rates and types
- Memory and CPU usage
- File processing success rates

## 🤝 Contributing

### Development Setup

```bash
# Install development dependencies
pip install black isort pytest

# Format code
black .
isort .

# Run tests
pytest tests/
```

### Adding New LLM Providers

1. Create handler in `modules/llm/handlers/`
2. Inherit from `BaseLLMProvider`
3. Implement required methods
4. Register in `provider_router.py`
5. Add tests and documentation

### Code Quality

- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write comprehensive docstrings
- Add unit tests for new features
- Update documentation for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For issues and questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with detailed information
4. Include system information and error logs

---

**Made with ❤️ for efficient recruitment and candidate evaluation**

- Python 3.8+
- pip or uv package manager
- Optional: Docker for containerized deployment

### Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   # or with uv
   uv pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the server**:
   ```bash
   python backend/api/main.py
   ```

4. **Access the API**:
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## 📚 API Endpoints

### 📄 Resume Processing

#### Individual Resume Analysis
```http
POST /api/upload-resume/
```
Upload and analyze a single resume with comprehensive scoring.

**Request**: Multipart form with PDF file
**Response**: Complete candidate analysis with fit score

#### Batch Resume Processing
```http
POST /api/upload-resume-batch/
```
Process multiple resumes and get ranked candidates list.

**Request**: Multiple PDF files
**Response**: Ranked candidate list sorted by fit score

### 💼 Job Description Management

#### Save Job Description
```http
POST /api/save-job-description/
```
Save job description for future resume comparisons.

#### Get Job Description
```http
GET /api/get-job-description/
```
Retrieve current job description configuration.

### 📊 Analysis Retrieval

#### Get Individual Analysis
```http
GET /api/get-analysis/{resume_id}
```
Retrieve detailed analysis for specific candidate.

### 🤖 LLM Configuration

#### Get Available Providers
```http
GET /api/llm/providers
```
List all available LLM providers and their status.

#### Configure LLM Provider
```http
POST /api/llm/config
```
Switch between LLM providers and configure settings.

#### Get Current Configuration
```http
GET /api/llm/config
```
Get current LLM provider configuration.

#### Test LLM Connection
```http
POST /api/llm/prompt
```
Send test prompt to current LLM provider.

## 🧠 LLM Provider System

The backend supports multiple LLM providers through a plugin-based architecture:

### Supported Providers

| Provider | Models | Features |
|----------|--------|----------|
| **Ollama** | llama3.2, codellama, mistral | Local deployment, privacy-focused |
| **OpenRouter** | gpt-4, claude-3, llama-2 | Cloud-based, multiple model access |

### Adding New Providers

1. Create a new handler in `modules/llm/handlers/`
2. Inherit from `BaseLLMProvider`
3. Implement required methods
4. Register in `provider_router.py`

```python
# Example: custom_handler.py
from ..base_provider import BaseLLMProvider

class CustomProvider(BaseLLMProvider):
    def send_prompt(self, prompt: str) -> dict:
        # Implementation here
        pass
```

## 📄 Text Extraction Pipeline

### Native PDF Processing
- Uses `pypdf` for text-based PDFs
- Maintains formatting and structure
- Fast and efficient for standard resumes

### OCR Fallback
- EasyOCR for image-based PDFs
- Handles scanned documents and images
- Automatic fallback when native extraction fails

### Smart Detection
```python
def is_pdf_text_based(pdf_path: str, min_text_length: int = 20) -> bool:
    """Auto-detect if PDF contains extractable text"""
```

## 🎯 Resume Analysis Features

### Comprehensive Data Extraction

- **Personal Information**: Name, email, phone, location
- **Professional Experience**: Roles, companies, duration
- **Skills Analysis**: Technical and soft skills identification
- **Project Portfolio**: Technology stack and descriptions
- **Education Background**: Degrees, institutions, certifications

### Intelligent Scoring

```json
{
  "fit_score": 8,
  "fit_score_reason": "Strong technical match with required Python and FastAPI skills",
  "candidate_fit_summary": "Excellent candidate with relevant experience",
  "leadership_signals": true,
  "leadership_justification": "Led development team of 5 engineers"
}
```

### Skills Assessment

- **Technology Matching**: Compares candidate skills with job requirements
- **Experience Validation**: Verifies claimed experience levels
- **Gap Analysis**: Identifies missing skills and training opportunities

## 🔧 Configuration

### Environment Variables

```bash
# LLM API Keys
MISTRAL_API_KEY=your_mistral_key
OPENROUTER_API_KEY=your_openrouter_key
OLLAMA_BASE_URL=http://localhost:11434

# Application Settings
DEBUG=false
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### LLM Configuration

The system uses `configs/llm_config.json` for provider settings:

```json
{
  "provider": "ollama",
  "model": "llama3.2",
  "api_key": null,
  "base_url": "http://localhost:11434"
}
```

## 🚀 Deployment

### Development
```bash
python backend/api/main.py
```

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn backend.api.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment
```bash
docker build -f Dockerfile.backend -t resume-analyzer-backend .
docker run -p 8000:8000 resume-analyzer-backend
```

## 🧪 Testing

### Run API Tests
```bash
python test_enhanced_backend.py
```

### Test Job Description Endpoint
```bash
python test_job_description_endpoint.py
```

### Manual Testing with curl
```bash
# Test health
curl http://localhost:8000/api/llm/providers

# Upload resume
curl -X POST -F "file=@resume.pdf" http://localhost:8000/api/upload-resume/

# Get job description
curl http://localhost:8000/api/get-job-description/
```

## 📈 Performance

### Optimization Features

- **Async Processing**: FastAPI async endpoints for better concurrency
- **Smart Caching**: Reuse extracted text for multiple analyses
- **Batch Processing**: Efficient handling of multiple resumes
- **Error Recovery**: Graceful degradation with OCR fallback

### Benchmarks

| Operation | Individual | Batch (10 files) |
|-----------|-----------|------------------|
| Text Extraction | ~2s | ~15s |
| LLM Analysis | ~3-5s | ~25-40s |
| Total Processing | ~5-7s | ~40-55s |

## 🔍 Troubleshooting

### Common Issues

1. **LLM Connection Failed**
   ```bash
   # Check provider status
   curl http://localhost:8000/api/llm/providers
   ```

2. **PDF Processing Error**
   - Ensure PDF is not password-protected
   - Check file size (<10MB recommended)
   - Verify PDF format compatibility

3. **Import Errors**
   ```bash
   # Install missing dependencies
   pip install -r requirements.txt
   ```

### Debug Mode

Enable debug logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Install development dependencies: `pip install -r requirements-dev.txt`
4. Make changes and test
5. Submit pull request

### Code Style

- Follow PEP 8 guidelines
- Use type hints where possible
- Add docstrings for public methods
- Format with Black: `black backend/`

## 📝 API Response Examples

### Individual Resume Analysis Response
```json
{
  "full_name": "John Doe",
  "email": "john.doe@email.com",
  "phone_number": "+1-555-0123",
  "total_experience_years": 5,
  "fit_score": 8,
  "fit_score_reason": "Strong match for Python and API development requirements",
  "candidate_fit_summary": "Experienced developer with relevant tech stack",
  "skills": {
    "Python": {"source": "Professional", "years": 5},
    "FastAPI": {"source": "Professional", "years": 2}
  },
  "projects": [
    {
      "name": "E-commerce API",
      "tech_stack": "Python, FastAPI, PostgreSQL",
      "description": "Built scalable REST API serving 10k+ users"
    }
  ],
  "resume_id": "uuid-here",
  "leadership_signals": true
}
```

### Batch Processing Response
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
      "candidate_name": "Jane Smith",
      "fit_score": 9,
      "fit_score_reason": "Perfect match for all requirements"
    }
  ],
  "failed_files": [
    {
      "filename": "corrupted.pdf",
      "error": "Unable to extract text from PDF"
    }
  ]
}
```

## 📊 Monitoring & Analytics

### Metrics Tracked

- Processing time per resume
- LLM provider response times
- Success/failure rates
- Popular skill combinations
- Fit score distributions

### Health Checks

```http
GET /api/llm/providers  # Check LLM provider status
GET /api/get-job-description/  # Verify configuration
```

## 🔒 Security

### API Security

- CORS configuration for web frontend
- Input validation and sanitization
- File type restrictions (PDF only)
- Size limits on uploads

### Data Privacy

- No persistent storage of resume content
- Temporary file cleanup after processing
- Configurable data retention policies

## 📞 Support

For issues and questions:

1. Check the [troubleshooting section](#🔍-troubleshooting)
2. Review API documentation at `/docs`
3. Submit GitHub issues for bugs
4. Join our Discord for community support

---

**Built with ❤️ using FastAPI, Python, and AI magic** ✨
