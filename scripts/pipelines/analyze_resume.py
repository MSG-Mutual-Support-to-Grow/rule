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

from scripts.modules.text_extract.extract_native_pdf import extract_lines_from_pdf
from scripts.modules.llm_prompts.parse_resume_llm import call_mistral_resume_analyzer
from scripts.modules.text_extract.extract_ocr_pdf import extract_text_easyocr_from_pdf

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


def save_result_to_json(result: dict, pdf_path: str):
    if not result:
        print("❌ No result to save.")
        return

    output_dir = get_output_dir()
    # Use the full_name from the result if available, else fallback to PDF filename
    full_name = result.get("full_name")
    if full_name:
        # Clean the name for filesystem safety
        safe_name = (
            full_name.replace(" ", "_")
            .replace("/", "-")
            .replace("\\", "-")
            .replace(".", "")
            .replace(",", "")
            .replace("'", "")
            .replace('"', "")
            .replace(":", "")
            .replace("|", "")
            .replace("?", "")
            .replace("*", "")
        )
        json_name = f"{safe_name}_Resume.json"
    else:
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
        return None

    print(f"[DEBUG] Extracting resume from: {pdf_path}")
    resume_text = extract_lines_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted text is empty!")
        return None

    print("[DEBUG] Calling Mistral LLM for analysis...")
    result = call_mistral_resume_analyzer(resume_text, api_key)

    if result is None:
        print("❌ AI analysis returned None.")
        return None

    try:
        if isinstance(result, str):
            cleaned_result = clean_ai_response(result)
            try:
                result = json.loads(cleaned_result)
            except json.JSONDecodeError:
                print("[WARNING] Mistral returned malformed JSON string.")
                print("Raw cleaned result:", cleaned_result)
                return None
        if result:
            save_result_to_json(result, pdf_path)
            return result
        else:
            print("❌ AI analysis failed.")
            return None
    except Exception as e:
        print(f"[ERROR] Unexpected result error: {e}")
        print("Raw result:", result)
        return None


def process_resume_ocr(pdf_path: str):
    if not os.path.exists(pdf_path):
        print("❌ Resume not found:", pdf_path)
        return None

    print(f"[DEBUG] Extracting OCR text from: {pdf_path}")
    resume_text = extract_text_easyocr_from_pdf(pdf_path)

    if not resume_text.strip():
        print("❌ Extracted OCR text is empty!")
        return None

    print("[DEBUG] Calling Mistral LLM for OCR analysis...")
    result = call_mistral_resume_analyzer(resume_text, api_key)

    if result is None:
        print("❌ AI OCR analysis returned None.")
        return None

    try:
        if isinstance(result, str):
            cleaned_result = clean_ai_response(result)
            try:
                result = json.loads(cleaned_result)
            except json.JSONDecodeError:
                print("[WARNING] Mistral returned malformed JSON string.")
                print("Raw cleaned result:", cleaned_result)
                return None
        if result:
            save_result_to_json(result, pdf_path)
            return result
        else:
            print("❌ AI analysis failed.")
            return None
    except Exception as e:
        print(f"[ERROR] Unexpected result error: {e}")
        print("Raw result:", result)
        return None
