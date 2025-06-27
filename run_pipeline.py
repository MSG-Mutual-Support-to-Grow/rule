# run_pipeline.py
import os
import json
from dotenv import load_dotenv
from scripts.extract_text import extract_lines_from_pdf
from scripts.llm_prompt import call_mistral_resume_analyzer

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")  # or OPENROUTER_API_KEY

def process_resume(pdf_path: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return

    print(f"\n📄 Extracting resume from: {pdf_path}")
    resume_text = extract_lines_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted text is empty!")
        return

    print("\n🤖 Analyzing resume using Mistral...")
    result = call_mistral_resume_analyzer(resume_text, api_key)

    try:
        if result:
            print("\n✅ Candidate Summary (AI-generated):")
            print(json.dumps(result, indent=2))
        else:
            print("❌ AI analysis failed. Response was None or empty.")
    except Exception as e:
        print("🚨 Unexpected error while printing result:")
        print(f"{type(e).__name__}: {e}")
        print("Raw result object:", result)


if __name__ == "__main__":
    pdf_file = "resumes/text/DanishPrabhu_Resume.pdf"
    process_resume(pdf_file)
