import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os

def extract_text_from_scanned_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    Converts each page of a scanned/image PDF to an image and uses Tesseract OCR to extract text.
    """
    print(f"\n📄 OCR-only parsing: {pdf_path}")
    
    try:
        images = convert_from_path(pdf_path, dpi=dpi)
    except Exception as e:
        print("❌ Failed to convert PDF to images:", e)
        return ""

    all_text = ""
    for i, img in enumerate(images):
        gray = img.convert("L")  # convert to grayscale for better OCR
        page_text = pytesseract.image_to_string(gray)
        print(f"📸 OCR Page {i + 1}: {len(page_text)} chars")
        all_text += page_text + "\n"

    return all_text.strip()


if __name__ == "__main__":
    path = "../resumes/Sam_Resume.pdf"  # ← change to your scanned resume
    if os.path.exists(path):
        text = extract_text_from_scanned_pdf(path)
        print("\n🧾 OCR Text Preview:\n")
        print(text[:1500])  # preview top 1500 chars
    else:
        print("❌ File not found at:", path)
