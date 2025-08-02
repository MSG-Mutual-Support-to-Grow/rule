# Backend API Documentation

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009639.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

## 🚀 Overview

This backend provides a powerful FastAPI-based REST API for **intelligent resume analysis and candidate evaluation**. It combines multiple AI providers, advanced text extraction, and sophisticated scoring algorithms to help recruiters and HR professionals efficiently process and rank candidates.

### ✨ Key Features

- **🤖 Multi-LLM Support**: Ollama, OpenRouter, and extensible provider system
- **📄 Smart Text Extraction**: Native PDF text extraction with OCR fallback
- **⚡ Dual Processing Modes**: Individual detailed analysis and batch processing
- **🎯 Intelligent Scoring**: AI-powered fit scoring with detailed reasoning
- **🔧 Flexible Configuration**: Dynamic LLM provider switching and configuration
- **📊 Comprehensive Analysis**: Skills extraction, experience calculation, project analysis
- **🌐 CORS Enabled**: Ready for web frontend integration

## 🏗️ Architecture

```
backend/
├── api/                    # FastAPI application and routes
│   ├── main.py            # Main application with all endpoints
│   └── README.md          # API-specific documentation
├── modules/               # Core business logic modules
│   ├── llm/              # LLM provider management
│   │   ├── llm_automation.py     # LLM automation system
│   │   ├── provider_router.py    # Provider routing and registration
│   │   ├── base_provider.py      # Base provider interface
│   │   ├── utils.py              # LLM utilities
│   │   └── handlers/             # Specific LLM provider implementations
│   │       ├── ollama_handler.py     # Ollama integration
│   │       └── openrouter_handler.py # OpenRouter integration
│   ├── llm_prompts/      # AI prompt engineering
│   │   └── parse_resume_llm.py   # Resume analysis prompts
│   └── text_extract/     # Document processing
│       ├── extract_native_pdf.py # Native PDF text extraction
│       └── extract_ocr_pdf.py    # OCR-based extraction
├── pipelines/            # Processing workflows
│   └── analyze_resume.py # Main resume analysis pipeline
└── llm_config.json      # LLM configuration storage
```

## 🚦 Quick Start

### Prerequisites

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
