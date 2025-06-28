import os
import json
from dotenv import load_dotenv
from pypdf import PdfReader
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from scripts.modules.text_extract.extract_native_pdf import extract_lines_from_pdf
from scripts.modules.llm_prompts.parse_resume_llm import call_mistral_resume_analyzer
from scripts.modules.text_extract.extract_ocr_pdf import extract_text_easyocr_from_pdf

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

def is_pdf_text_based(pdf_path: str) -> bool:
    try:
        print(f"[DEBUG] Checking if PDF is text-based: {pdf_path}")
        reader = PdfReader(pdf_path)
        for i, page in enumerate(reader.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                print(f"[DEBUG] Page {i}: Extracted {len(text.strip())} characters.")
                return True
            else:
                print(f"[DEBUG] Page {i}: No extractable text.")
        return False
    except Exception as e:
        print(f"[ERROR] PDF read failed: {e}")
        return False

def get_output_dir() -> str:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    output_dir = os.path.join(root, "outputs")
    os.makedirs(output_dir, exist_ok=True)
    return output_dir

def save_result_to_json(result: dict, pdf_path: str):
    if not result:
        print("❌ No result to save.")
        return

    output_dir = get_output_dir()
    base_name = os.path.basename(pdf_path)
    base_name = os.path.splitext(base_name)[0].replace(" ", "").replace("_", "").lower()
    json_name = base_name + ".json"
    json_path = os.path.join(output_dir, json_name)

    try:
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        print(f"✅ Result saved to {json_path}")
    except Exception as e:
        print(f"[ERROR] Failed to save JSON: {e}")

def process_resume(pdf_path: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return

    print(f"[DEBUG] Extracting resume from: {pdf_path}")
    resume_text = extract_lines_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted text is empty!")
        return

    print("[DEBUG] Calling Mistral LLM for analysis...")
    result = call_mistral_resume_analyzer(resume_text, api_key)

    try:
        if isinstance(result, str):
            try:
                result = json.loads(result)
            except json.JSONDecodeError:
                print("[WARNING] Mistral returned malformed JSON string.")
                print("Raw result:", result)
                return None
        if result:
            save_result_to_json(result, pdf_path)
            return result
        else:
            print("❌ AI analysis failed.")
    except Exception as e:
        print(f"[ERROR] Unexpected result error: {e}")
        print("Raw result:", result)

def process_resume_ocr(pdf_path: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return

    print(f"[DEBUG] Extracting OCR text from: {pdf_path}")
    resume_text = extract_text_easyocr_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted OCR text is empty!")
        return

    print("[DEBUG] Calling Mistral LLM for OCR analysis...")
    result = call_mistral_resume_analyzer(resume_text, api_key)

    try:
        if isinstance(result, str):
            result = json.loads(result)
        if result:
            save_result_to_json(result, pdf_path)
            return result
        else:
            print("❌ AI OCR analysis failed.")
    except Exception as e:
        print(f"[ERROR] Unexpected OCR result error: {e}")
        print("Raw result:", result)
