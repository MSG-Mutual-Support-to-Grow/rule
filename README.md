# Resume Understanding Language Engine (RULE)

**RULE**: AI-Powered Resume Parsing and Analysis Platform

![Landing Page](https://raw.githubusercontent.com/dharshan-kumarj/rule/main/docs/images/Landing_Page.png)

<div align="center">

Upload resumes individually. Let AI parse and export structured data instantly.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)

[📖 Documentation](https://rule-docs.onrender.com/) • [❓ FAQ](https://rule-docs.onrender.com/#faq) • [🚀 Quick Start](#quick-start)

</div>


Welcome to Resume Understanding Language Engine, a cutting-edge full-stack application that leverages AI to parse, analyze, and extract structured data from resumes instantly. Upload resumes individually or in bulk, and let our intelligent system provide comprehensive candidate analysis with eligibility assessments and detailed insights.

📖 **Documentation**: [Visit our comprehensive docs](https://rule-docs.onrender.com/)

🤔 **FAQ**: [Find answers to common questions](https://rule-docs.onrender.com/#faq)

<!-- 🎯 *Live Demo*: Experience the power of AI-driven resume analysis in action! -->

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Setup Options](#setup-options)
- [Docker Installation](#docker-installation)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributors](#contributors)
- [License](#license)

## Features

🤖 **AI-Powered Analysis**: Advanced LLM integration for intelligent resume parsing and candidate evaluation

📄 **Multi-Format Support**: Seamless processing of text-based and scanned PDF resumes using OCR technology

⚡ **Real-time Processing**: Instant resume analysis with structured data extraction

🎯 **Eligibility Assessment**: Smart candidate evaluation against job requirements with detailed feedback

📊 **Comprehensive Insights**: Extract candidate information, experience analysis, leadership assessment, and role fit analysis

📱 **Modern UI/UX**: Beautiful, responsive interface built with React, Tailwind CSS, and ShadCN UI

🚀 **Export Options**: Download analysis results in CSV or JSON formats

🐳 **Docker Ready**: Containerized application for easy deployment and development

🔧 **API-First Design**: RESTful API with comprehensive documentation

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** for modern styling
- **ShadCN UI** for accessible components
- **Framer Motion** for smooth animations
- **Lucide Icons** for beautiful iconography

### Backend
- **FastAPI** for high-performance API
- **Python 3.10+** with modern async/await patterns
- **PDFPlumber** and **PyPDF** for text extraction
- **EasyOCR** for scanned document processing

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **UV** for fast Python package management
- **CORS** enabled for cross-origin requests

## Quick Start

Get Resume Understanding Language Engine running on your machine in under 5 minutes!

### Prerequisites
- **Docker** and **Docker Compose** (Recommended)
- **Node.js 18+** (for manual setup)
- **Python 3.10+** (for manual setup)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/dharshan-kumarj/rule
   cd rule
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

That's it! 🎉 Your Resume Understanding Language Engine platform is now running!

## Setup Options

### Docker Installation

#### Quick Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Development Features
- **Hot Reload**: Changes to frontend/backend automatically reload
- **Volume Mounts**: Local development with instant updates
- **Isolated Environment**: No dependency conflicts

### Manual Installation

#### Backend Setup
1. **Navigate to project root**
   ```bash
   cd rule
   ```

2. **Install Python dependencies**
   ```bash
   # Using UV (recommended)
   uv add -r requirements.txt
   
   # Or using pip
   pip install -r requirements.txt
   ```

3. **Start the backend server**
   ```bash
   # Using UV
   uv run uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
   
   # Or direct uvicorn
   uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables
Create a .env file in the project root:

```env
# AI/LLM Configuration
MISTRAL_API_KEY="sk-or-v1-your-openrouter-mistral-api-key-here"
```

### Customizing Analysis Criteria
Modify the analysis prompts in `backend/modules/llm_prompts/parse_resume_llm.py` to customize:
- Job requirements
- Skill assessment criteria
- Experience evaluation parameters
- Eligibility thresholds

## API Documentation

### Main Endpoints

#### Upload Resume
```http
POST /upload-resume/
Content-Type: multipart/form-data

Parameters:
- file: PDF file (required)

Response:
{
  "candidate_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900"
  },
  "eligibility_status": "Eligible",
  "experience_analysis": {...},
  "role_fit_analysis": {...},
  "key_skills": [...]
}
```


## Project Structure

```
rule/
├── 📁 backend/
│   ├── 📁 api/
│   │   └── main.py                 # FastAPI application
│   ├── 📁 modules/
│   │   ├── 📁 llm_prompts/
│   │   │   └── parse_resume_llm.py # AI prompts and analysis
│   │   └── 📁 text_extract/
│   │       ├── extract_native_pdf.py  # Native PDF processing
│   │       └── extract_ocr_pdf.py     # OCR-based processing
│   └── 📁 pipelines/
│       └── analyze_resume.py       # Main processing pipeline
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 layout/
│   │   │   │   ├── UploadCard.tsx      # File upload interface
│   │   │   │   ├── OutputViewer.tsx    # Results display
│   │   │   │   └── Sidebar.tsx         # Navigation sidebar
│   │   │   └── 📁 ui/                  # Reusable UI components
│   │   ├── 📁 lib/
│   │   │   ├── api.ts              # API integration
│   │   │   └── utils.ts            # Utility functions
│   │   ├── 📁 pages/
│   │   │   └── LandingPage.tsx     # Main application page
│   │   └── App.tsx                 # Root component
│   ├── package.json                # Frontend dependencies
│   └── vite.config.ts             # Vite configuration
├── 📄 docker-compose.yml          # Docker orchestration
├── 📄 Dockerfile.backend          # Backend container
├── 📄 Dockerfile.frontend         # Frontend container
├── 📄 pyproject.toml              # Python project config
├── 📄 requirements.txt            # Python dependencies
└── 📄 README.md                   # This file
```


## Available Scripts

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
uv run uvicorn backend.api.main:app --reload    # Development server
uv run python -m backend.api.main               # Alternative start
```

### Docker Scripts
```bash
docker-compose up --build         # Build and start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # View backend logs
docker-compose logs -f frontend   # View frontend logs
```


## Contributing

We welcome contributions to Resume Understanding Language Engine! Here's how to get started:

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests** (when available)
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Standards
- **Frontend**: ESLint configuration with React/TypeScript best practices
- **Backend**: Black formatting with isort import sorting
- **Commits**: Conventional commit messages preferred

### Development Guidelines
- Follow existing code structure and patterns
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly

## Troubleshooting

### Common Issues

#### Port Conflicts
**Problem**: Port 5173 or 8000 already in use
**Solution**: 
```bash
# Kill processes using the ports
lsof -ti:5173 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Or change ports in docker-compose.yml
```

#### Docker Build Failures
**Problem**: Docker build fails
**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### PDF Processing Errors
**Problem**: Error processing PDF files
**Solutions**:
- Ensure PDF is not password protected
- Check if PDF contains extractable text
- For scanned PDFs, OCR processing may take longer

#### Python Dependencies
**Problem**: Module not found errors
**Solution**:
```bash
# Reinstall dependencies
uv add -r requirements.txt

# Or clear cache and reinstall
pip cache purge
pip install -r requirements.txt --force-reinstall
```


### Getting Help
- 📚 **Documentation**: [https://rule-docs.onrender.com/](https://rule-docs.onrender.com/)
- ❓ **FAQ**: [https://rule-docs.onrender.com/#faq](https://rule-docs.onrender.com/#faq)
- 🐛 **Issues**: Open a GitHub issue with detailed description

## FAQ

### General Questions

**Q: What file formats are supported?**
A: Currently, only PDF files are supported. The system handles both text-based PDFs and scanned documents using OCR.

**Q: Is there a file size limit?**
A: The default limit is 10MB per file. This can be configured in the FastAPI settings.

**Q: Can I process multiple resumes at once?**
A: Not currently, but we are implementing bulk upload functionality for future releases. Currently, each resume is processed individually.

### Technical Questions

**Q: Which AI models are used for analysis?**
A: Currently, we use OpenRouter's Mistral API for intelligent resume analysis. The system uses configurable LLM prompts that can be customized in the backend configuration.

**Q: How accurate is the OCR for scanned documents?**
A: The system uses EasyOCR which provides good accuracy for most documents. Quality depends on scan resolution and document clarity.

**Q: Can I customize the analysis criteria?**
A: Yes! Modify the prompts in `backend/modules/llm_prompts/parse_resume_llm.py` to adjust evaluation criteria.

### Deployment Questions

**Q: How do I deploy to production?**
A: Use the provided Docker configuration. For cloud deployment, consider platforms like AWS, Google Cloud, or Azure with container support.

**Q: Is the application secure?**
A: The application includes CORS configuration and input validation. For production, implement additional security measures like authentication, rate limiting, and HTTPS.

## Roadmap

### Current Features ✅
- PDF resume upload and processing
- Text extraction from native and scanned PDFs
- AI-powered candidate analysis
- Eligibility assessment based on job requirements
- Experience and leadership evaluation
- Skills extraction and categorization
- Modern React frontend with responsive design
- RESTful API with documentation
- Docker containerization
- Export functionality (CSV/JSON)

### Planned Features 🚧
- **Bulk Processing**: Enhanced bulk upload with progress tracking
- **Advanced Analytics**: Candidate comparison, ranking, and filtering
- **Custom Job Profiles**: Configurable evaluation criteria per role
- **Multi-LLM Support**: Integration with multiple AI providers (OpenAI, Anthropic, Groq, etc.) with custom API key configuration for local usage

## Contributors

- **Dharshan Kumar J** – Backend Software Developer  
- **Ronnie A. Jeffrey** – Systems Architect  
- **Danish Prabu** – Backend Developer  
- **Aparna** – UX Researcher  
- **Franz Kingstein N** – OCR & Data Engineer  


## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## Support

### Get Help
- 📖 **Documentation**: [https://rule-docs.onrender.com/](https://rule-docs.onrender.com/)
- ❓ **FAQ**: [https://rule-docs.onrender.com/#faq](https://rule-docs.onrender.com/#faq)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/dharshan-kumarj/rule/issues)

---

**Developed with ❤ by MSG - (Mutual Support to Grow) community**

Transform your hiring process with AI-powered resume analysis!
