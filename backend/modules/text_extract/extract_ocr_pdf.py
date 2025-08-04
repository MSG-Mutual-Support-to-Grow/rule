import os
import re
import cv2
import spacy
import pytesseract
import numpy as np
from spellchecker import SpellChecker
from pdf2image import convert_from_path
from PIL import Image
from datetime import datetime

# Load NLP model and spell checker
nlp = spacy.load("en_core_web_sm")
spell = SpellChecker()

# -------------------- Utilities -------------------- #

def extract_emails_names(text):
    emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    doc = nlp(text)
    names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    return set(emails), set(names)

def enhance_image(pil_img):
    img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)
    img = cv2.bilateralFilter(img, 9, 75, 75)
    img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                cv2.THRESH_BINARY, 11, 2)
    return img

def fix_common_ocr_errors(text):
    text = text.replace(" egmail.com", "@gmail.com")
    text = re.sub(r"\s+@\s*", "@", text)
    text = re.sub(r"\s+\.com", ".com", text)
    return text

def convert_dates(text):
    def date_replacer(match):
        try:
            return datetime.strptime(match.group(0), "%b %Y").strftime("%m/%Y")
        except:
            return match.group(0)

    return re.sub(
        r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b",
        date_replacer,
        text
    )

# -------------------- Cleaner -------------------- #

def clean_text(raw_text):
    raw_text = fix_common_ocr_errors(raw_text)
    emails, names = extract_emails_names(raw_text)
    doc = nlp(raw_text)
    corrected = []

    for token in doc:
        word = token.text

        if word in emails or word in names or re.match(r"^\d{1,2}/\d{4}$", word):
            corrected.append(word)
        elif token.is_punct:
            corrected.append(word)
        elif token.is_alpha:
            if (
                word.lower() not in spell
                and not (word.istitle() or word.isupper())
                and len(word) > 3
            ):
                corrected_word = spell.correction(word)
                corrected.append(corrected_word if corrected_word else word)
            else:
                corrected.append(word)
        else:
            corrected.append(word)

    clean = " ".join(corrected)
    clean = re.sub(r"\s([.,!?;:])", r"\1", clean)
    clean = re.sub(r"([.,!?;:])(?=\S)", r"\1 ", clean)
    clean = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", clean)
    clean = convert_dates(clean)

    return clean.strip()

# -------------------- OCR Pipeline -------------------- #

def extract_text_easyocr_from_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    Extract text from PDF using Tesseract OCR with enhanced cleaning, page by page.
    Returns concatenated text from all pages as a single string.
    Compatible with your existing pipeline and API usage.
    """
    print(f"\n📄 OCR with Tesseract: {pdf_path}")

    try:
        images = convert_from_path(pdf_path, dpi=dpi)
    except Exception as e:
        print(f"❌ Failed to convert PDF to images: {e}")
        return ""

    print(f"📦 {len(images)} pages loaded for OCR.")
    all_text = ""

    for i, img in enumerate(images):
        print(f"📸 Processing Page {i + 1}...")

        try:
            enhanced_img = enhance_image(img)
            pil_enhanced = Image.fromarray(enhanced_img)

            raw_text = pytesseract.image_to_string(pil_enhanced)
            print(f"\n🔍 Raw OCR output (Page {i + 1}):\n{raw_text[:500]}...\n")

            cleaned_text = clean_text(raw_text)
            print(f"✅ Page {i + 1}: {len(cleaned_text)} characters cleaned")

            all_text += f"\n--- Page {i + 1} ---\n{cleaned_text}\n"
        except Exception as ocr_error:
            print(f"❌ OCR failed on page {i + 1}: {ocr_error}")

    return all_text.strip()


# Alternative function name to match Tesseract implementation
def extract_text_tesseract_from_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    Extract text from PDF using Tesseract OCR with enhanced cleaning.
    This is an alias for extract_text_easyocr_from_pdf to maintain compatibility.
    """
    return extract_text_easyocr_from_pdf(pdf_path, dpi)


# # Example standalone test (optional)
# if __name__ == "__main__":
#     test_pdf = "../resumes/ocr/SolaiArulMurugan_Resume.pdf"
#     if os.path.exists(test_pdf):
#         extracted_text = extract_text_tesseract_from_pdf(test_pdf)
#         print("\n🧾 OCR Extracted Text Preview (first 2000 chars):\n")
#         print(extracted_text[:2000])
#     else:
#         print(f"❌ File not found: {test_pdf}")
