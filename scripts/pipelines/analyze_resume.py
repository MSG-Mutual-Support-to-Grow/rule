# run_pipeline.py
import os
import json
from dotenv import load_dotenv
from pypdf import PdfReader

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from scripts.modules.text_extract.extract_native_pdf import extract_lines_from_pdf
from scripts.modules.llm_prompts.parse_resume_llm import call_mistral_resume_analyzer
from scripts.modules.text_extract.extract_ocr_pdf import extract_text_easyocr_from_pdf

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")  # or OPENROUTER_API_KEY

def is_pdf_text_based(pdf_path: str) -> bool:
    """Detect if the PDF contains extractable text on any page, with debug prints."""
    try:
        print(f"📄 Checking if PDF is text-based: {pdf_path}")
        reader = PdfReader(pdf_path)
        for i, page in enumerate(reader.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                print(f"Page {i}: Extracted {len(text.strip())} characters of text.")
                return True
            else:
                print(f"Page {i}: No extractable text found.")
        return False
    except Exception as e:
        print(f"❌ Error reading PDF for text detection: {e}")
        return False

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

def process_resume_ocr(pdf_path: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return

    print(f"\n📄 Extracting resume text via OCR from: {pdf_path}")
    resume_text = extract_text_easyocr_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted OCR text is empty!")
        return

    print("\n🤖 Analyzing OCR-extracted resume using Mistral...")
    result = call_mistral_resume_analyzer(resume_text, api_key)

    try:
        if result:
            print("\n✅ Candidate Summary (AI-generated from OCR):")
            print(json.dumps(result, indent=2))
        else:
            print("❌ AI analysis failed. Response was None or empty.")
    except Exception as e:
        print("🚨 Unexpected error while printing OCR analysis result:")
        print(f"{type(e).__name__}: {e}")
        print("Raw result object:", result)


if __name__ == "__main__":
    pdf_file = "/home/danish/Desktop/projects/Resume_Parser/resumes/DanishPrabhu_Resume.pdf"

    if not os.path.exists(pdf_file):
        print(f"❌ File not found: {pdf_file}")
    else:
        print(f"Detecting if PDF is text or image based...")
        if is_pdf_text_based(pdf_file):
            print("✅ Detected PDF as text-based.")
            process_resume(pdf_file)
        else:
            print("⚠️ Detected PDF as image-based (OCR required).")
            process_resume_ocr(pdf_file)