# 🔍 Smart Resume Intelligence Tool using Mistral (OpenRouter)

This tool analyzes and understands resumes intelligently using a powerful local LLM (Mistral 7B via OpenRouter API). Unlike traditional resume parsers that just extract text, this system understands skills, projects, and experience depth — helping recruiters shortlist ideal candidates faster.

---

## 🚀 Features

- ✅ Extracts detailed candidate info from plain resume text
- ✅ Understands and links skills to projects/experience
- ✅ Detects project contributions and tech stack
- ✅ Suggests best-fit roles for candidates
- ✅ Returns structured, clean JSON
- ✅ Secure: uses your own OpenRouter API key
- ✅ Fully open-source and customizable

---

## 🧠 Tech Stack

| Component         | Tool / Library        | Purpose                          |
|------------------|------------------------|----------------------------------|
| Programming      | Python                 | Scripting language               |
| LLM Inference    | Mistral (via OpenRouter) | Understand resumes contextually |
| API Access       | requests               | To communicate with OpenRouter   |
| Env Management   | python-dotenv          | Store API keys securely          |

---

## 📁 Project Structure

```

resume-analyzer/
├── smart\_resume\_parser.py       # Main code to parse resume
├── .env                         # Contains your OpenRouter API key
├── README.md                    # This documentation

````

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer
````

2. Install dependencies:

```bash
pip install -r requirements.txt
```

or manually:

```bash
pip install requests python-dotenv
```

3. Create a .env file and paste your API key:

.env

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

## 🧪 Usage

Run the parser:

```bash
python smart_resume_parser.py
```

You can replace the resume\_text inside the script with real extracted data (from PDF or OCR).

---

## ✅ Output Format (Example)

```json
{
  "full_name": "Ronnie A Jeffrey",
  "email": "ronnieallen2005@gmail.com",
  "phone_number": "+91 99528 60468",
  "total_experience_years": 2,
  "roles": [
    { "title": "Mobile App Developer Intern", "company": "Nandha Infotech", "years": 0.2 },
    { "title": "Full Stack and Mobile App Trainee", "company": "KIDS", "years": 0.7 }
  ],
  "skills": {
    "Flutter": { "source": "Nandha Infotech + KIDS", "years": 1 },
    "React.js": { "source": "KIDS", "years": 0.7 },
    "Django": { "source": "projects", "years": null }
  },
  "projects": [
    {
      "name": "CropAI",
      "tech_stack": ["Django", "React.js", "Scikit-learn"],
      "description": "ML API to recommend best crops based on soil and climate data"
    }
  ],
  "leadership_signals": true,
  "candidate_fit_summary": "Well-suited for roles involving full-stack or Flutter-based mobile app development. Shows initiative and end-to-end project ownership."
}
```

---

## 🔐 API Source

* Model: mistral / mistral-7b-instruct
* Provider: [OpenRouter.ai](https://openrouter.ai/)

---

## 🔧 Coming Soon

* 📄 Resume PDF text extractor
* 🧮 Candidate scoring engine
* 🌐 Streamlit/Gradio UI
* 📂 Batch resume folder parser
* ☁️ Export to Airtable / Google Sheets

---

## 👨‍💻 Author

Built with ❤️ by [Ronnie A Jeffrey](https://github.com/yourusername)

---