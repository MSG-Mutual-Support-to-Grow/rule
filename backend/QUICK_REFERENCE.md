# Backend API Quick Reference

## 🎯 Current Status (v1.0)

**✅ Production Ready** - The backend API is fully functional with comprehensive resume analysis capabilities.

### 🔥 Latest Features (Updated Aug 2025)

- **✨ Enhanced Dual Processing**: Both individual and batch processing modes
- **📊 Advanced Scoring System**: AI-powered fit scoring with detailed reasoning
- **🤖 Multi-LLM Support**: Ollama, OpenRouter with easy provider switching
- **📄 Smart Text Extraction**: Native PDF + OCR fallback
- **🔧 Job Description Management**: Save/retrieve job descriptions via API
- **📈 Comprehensive Analytics**: Detailed candidate analysis and ranking

## 🚀 Quick Start Commands

```bash
# 1. Start the backend server
cd backend
python api/main.py

# 2. Test the API
curl http://localhost:8000/docs

# 3. Upload a resume
curl -X POST -F "file=@resume.pdf" http://localhost:8000/api/upload-resume/

# 4. Get job description
curl http://localhost:8000/api/get-job-description/
```

## 📋 Core API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `POST` | `/api/upload-resume/` | Single resume analysis | ✅ Active |
| `POST` | `/api/upload-resume-batch/` | Batch processing | ✅ Active |
| `POST` | `/api/save-job-description/` | Save job description | ✅ Active |
| `GET` | `/api/get-job-description/` | Get job description | ✅ New |
| `GET` | `/api/get-analysis/{id}` | Get specific analysis | ✅ Active |
| `GET` | `/api/llm/config` | LLM configuration | ✅ Active |
| `POST` | `/api/llm/config` | Update LLM settings | ✅ Active |

## 🧠 AI Processing Pipeline

```
PDF Upload → Text Extraction → LLM Analysis → Scoring → Response
     ↓              ↓             ↓         ↓        ↓
   Validate    Native/OCR    AI Prompts  Fit Score  JSON
```

### Sample Analysis Output

```json
{
  "full_name": "Jane Doe",
  "fit_score": 8,
  "fit_score_reason": "Strong Python and FastAPI experience matches requirements",
  "candidate_fit_summary": "Excellent technical match with leadership experience",
  "skills": {"Python": {"years": 5}, "FastAPI": {"years": 2}},
  "total_experience_years": 5,
  "leadership_signals": true
}
```

## 🔧 Configuration Files

- **`llm_config.json`** - LLM provider settings
- **`jd_jsons/job_description.json`** - Current job description
- **`outputs/*.json`** - Analysis results storage

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| LLM connection failed | Check `GET /api/llm/providers` status |
| PDF processing error | Ensure PDF is text-based or use OCR fallback |
| Import errors | Run `pip install -r requirements.txt` |
| CORS issues | Verify frontend URL in CORS settings |

## 📊 Performance Metrics

- **Individual Processing**: ~5-7 seconds per resume
- **Batch Processing**: ~40-55 seconds for 10 resumes
- **Text Extraction**: ~2 seconds (native), ~5 seconds (OCR)
- **LLM Analysis**: ~3-5 seconds per candidate

## 🎯 Next Development Priorities

1. **Frontend Integration** - Connect with React/Vue frontend
2. **Enhanced Filtering** - Advanced search and filter options
3. **Real-time Updates** - WebSocket support for live processing
4. **Export Features** - PDF reports and CSV exports
5. **User Management** - Authentication and user profiles

---

**💡 Tip**: Use the interactive docs at `http://localhost:8000/docs` to test all endpoints!
