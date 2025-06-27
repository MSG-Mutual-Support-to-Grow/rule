# Resume Parser

A powerful AI-powered resume parser that extracts structured information from resumes using both text extraction and OCR techniques, followed by intelligent analysis using the Mistral AI model.

## 📋 Overview

This project provides a comprehensive pipeline for parsing and analyzing resumes in PDF format. It can:

- Extract text from standard PDF documents using pdfplumber
- Process scanned PDFs using OCR (EasyOCR)
- Use Mistral AI to analyze and structure resume information
- Output standardized JSON with candidate details

## ✨ Features

- **Smart Text Extraction**: Supports both native PDF text extraction and OCR for scanned documents
- **AI-Powered Analysis**: Uses Mistral AI to intelligently parse resume content
- **Structured Output**: Generates standardized JSON with key candidate information:
  - Personal details (name, email, phone)
  - Work experience and roles
  - Skills with experience levels
  - Projects with descriptions and technologies
  - Leadership indicators
  - Candidate fit summary

## 🔧 Setup

### Prerequisites

- Python 3.8+
- PDF processing libraries
- OCR dependencies

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dharshan-kumarj/Resume_Parser.git
   cd Resume_Parser
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies using uv:
   ```bash
   uv pip install -r requirement.txt
   ```

4. Create a `.env` file in the project root with your API key:
   ```
   MISTRAL_API_KEY=your_api_key_here
   ```

## 📁 Project Structure

```
Resume_Parser/
├── .venv/                  # Python virtual environment
├── outputs/                # Output directory for parsed resumes
├── resumes/                # Input directory for resume PDFs
│   ├── ocr/                # PDFs requiring OCR processing
│   └── text/               # PDFs with extractable text
├── scripts/
│   ├── modules/
│   │   ├── llm_prompts/
│   │   │   └── parse_resume_llm.py
│   │   └── text_extract/
│   │       ├── extract_native_pdf.py
│   │       └── extract_ocr_pdf.py
│   └── pipelines/
│       └── analyze_resume.py
├── .env                    # Environment variables
├── .gitignore
├── main.py                 # Main entry point
├── pyproject.toml          # Project configuration
├── README.md               # Documentation
└── requirement.txt         # Dependencies
```

## 🚀 Usage

### Basic Usage

Run the main script to process a resume:

```bash
python main.py
```

### Customizing the Pipeline

You can process specific resumes by modifying the input path in `run_pipeline.py`:

```python
if __name__ == "__main__":
    pdf_file = "resumes/text/your_resume.pdf"
    process_resume(pdf_file)
```

## 🔍 How It Works

1. **Text Extraction**: 
   - For standard PDFs: Uses pdfplumber to extract text content
   - For scanned PDFs: Uses EasyOCR to perform optical character recognition

2. **AI Analysis**:
   - Sends extracted text to Mistral AI model
   - Uses structured prompting to extract key information

3. **Output**:
   - Returns structured JSON with parsed resume information

## 📝 Example Output

```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "123-456-7890",
  "total_experience_years": 5,
  "roles": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "years": 3
    },
    {
      "title": "Junior Developer",
      "company": "Startup Inc",
      "years": 2
    }
  ],
  "skills": {
    "Python": {"source": "professional", "years": 5},
    "React": {"source": "professional", "years": 3},
    "Docker": {"source": "project", "years": 2}
  },
  "projects": [
    {
      "name": "E-commerce Platform",
      "tech_stack": ["Python", "Django", "React"],
      "description": "Built scalable online shopping platform"
    }
  ],
  "leadership_signals": true,
  "leadership_justification": "Led team of 5 developers in project delivery",
  "candidate_fit_summary": "Experienced full-stack developer with strong Python skills and team leadership experience"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
