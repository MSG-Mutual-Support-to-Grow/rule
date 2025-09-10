import os
import json
from dotenv import load_dotenv
from pypdf import PdfReader
import sys
import warnings

# Suppress DeprecationWarning from cryptography (optional)
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Add project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.modules.text_extract.extract_native_pdf import extract_lines_from_pdf
from backend.modules.llm_prompts.parse_resume_llm import call_mistral_resume_analyzer
from backend.modules.text_extract.extract_ocr_pdf import extract_text_easyocr_from_pdf
from backend.modules.llm.response_validator import validate_llm_response, response_validator

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")


def clean_ai_response(raw_response: str) -> str:
    """
    Remove markdown triple backticks and optional language specifier from AI response.
    """
    if not raw_response:
        return ""

    cleaned = raw_response.strip()

    # Remove starting ```
    if cleaned.startswith("```"):
        first_newline = cleaned.find('\n')
        if first_newline != -1:
            cleaned = cleaned[first_newline + 1:]
        else:
            cleaned = cleaned[3:]

    # Remove ending ```
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    return cleaned.strip()


def is_pdf_text_based(pdf_path: str, min_text_length: int = 20) -> bool:
    """
    Checks if the PDF contains extractable text.
    Returns True if total extractable text length across pages exceeds min_text_length.
    """
    try:
        print(f"[DEBUG] Checking if PDF is text-based: {pdf_path}")
        reader = PdfReader(pdf_path)
        total_text = ""
        for i, page in enumerate(reader.pages, start=1):
            text = page.extract_text()
            if text:
                total_text += text.strip()
            else:
                print(f"[DEBUG] Page {i}: No extractable text.")
        if len(total_text) >= min_text_length:
            print(f"[DEBUG] Total extracted text length: {len(total_text)} characters.")
            return True
        else:
            print(f"[DEBUG] Total extracted text length too short ({len(total_text)} chars). Treating as image-based PDF.")
            return False
    except Exception as e:
        print(f"[ERROR] PDF read failed: {e}")
        return False


def get_output_dir() -> str:
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    output_dir = os.path.join(root, "outputs")
    os.makedirs(output_dir, exist_ok=True)
    return output_dir


def save_result_to_json(result: dict, resume_id: str):
    output_dir = get_output_dir()
    json_name = f"{resume_id}.json"
    json_path = os.path.join(output_dir, json_name)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"✅ Result saved to {json_path}")

def process_resume(pdf_path: str, job_description: str, resume_id: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return None

    print(f"[DEBUG] Extracting resume from: {pdf_path}")
    resume_text = extract_lines_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted text is empty!")
        return None

    print("[DEBUG] Calling Mistral LLM for analysis...")
    raw_result = call_mistral_resume_analyzer(resume_text, job_description, api_key)

    if raw_result is None:
        print("❌ AI analysis returned None.")
        fallback = response_validator.create_fallback_response(job_description, "AI returned None")
        save_result_to_json(fallback.dict(), resume_id)
        return fallback.dict()

    # Validate and extract structured data using Pydantic AI
    validation_result = validate_llm_response(raw_result, job_description)

    if validation_result.is_valid and validation_result.validated_data:
        print("✅ LLM response validation successful")
        result_dict = validation_result.validated_data.dict()
        save_result_to_json(result_dict, resume_id)
        return result_dict
    else:
        print(f"❌ LLM response validation failed: {validation_result.errors}")
        # Create fallback response with validation errors
        fallback = response_validator.create_fallback_response(
            job_description,
            f"Validation failed: {', '.join(validation_result.errors)}"
        )
        save_result_to_json(fallback.dict(), resume_id)
        return fallback.dict()


def process_resume_ocr(pdf_path: str, job_description: str, resume_id: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return None

    print(f"[DEBUG] Extracting OCR text from: {pdf_path}")
    resume_text = extract_text_easyocr_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted OCR text is empty!")
        return None

    print("[DEBUG] Calling Mistral LLM for OCR analysis...")
    raw_result = call_mistral_resume_analyzer(resume_text, job_description, api_key)

    if raw_result is None:
        print("❌ AI OCR analysis returned None.")
        fallback = response_validator.create_fallback_response(job_description, "AI OCR returned None")
        save_result_to_json(fallback.dict(), resume_id)
        return fallback.dict()

    # Validate and extract structured data using Pydantic AI
    validation_result = validate_llm_response(raw_result, job_description)

    if validation_result.is_valid and validation_result.validated_data:
        print("✅ LLM OCR response validation successful")
        result_dict = validation_result.validated_data.dict()
        save_result_to_json(result_dict, resume_id)
        return result_dict
    else:
        print(f"❌ LLM OCR response validation failed: {validation_result.errors}")
        # Create fallback response with validation errors
        fallback = response_validator.create_fallback_response(
            job_description,
            f"OCR validation failed: {', '.join(validation_result.errors)}"
        )
        save_result_to_json(fallback.dict(), resume_id)
        return fallback.dict()
