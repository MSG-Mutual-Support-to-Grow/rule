import easyocr
from pdf2image import convert_from_path
from PIL import Image
import os

def extract_text_easyocr_from_pdf(pdf_path: str, dpi: int = 300) -> str:
    print(f"\n📄 OCR with EasyOCR: {pdf_path}")
    
    try:
        images = convert_from_path(pdf_path, dpi=dpi)
    except Exception as e:
        print("❌ Failed to convert PDF to images:", e)
        return ""

    reader = easyocr.Reader(['en'])
    all_text = ""
    
    for i, img in enumerate(images):
        print(f"📸 Processing Page {i+1}...")

        # EasyOCR only works with file or numpy array, so convert
        img_path = f'temp_page_{i}.png'
        img.save(img_path)

        result = reader.readtext(img_path, detail=0, paragraph=True)
        os.remove(img_path)

        page_text = "\n".join(result)
        print(f"✅ OCR Page {i + 1}: {len(page_text)} characters extracted")
        all_text += f"\n--- Page {i + 1} ---\n{page_text}\n"

    return all_text.strip()

if __name__ == "__main__":
    pdf_path = "../resumes/ocr/Sam_Resume.pdf"  # change to your file
    if os.path.exists(pdf_path):
        output = extract_text_easyocr_from_pdf(pdf_path)
        print("\n🧾 Final OCR Output:\n")
        print(output[:2000])  # preview first 2000 characters
    else:
        print("❌ File not found at:", pdf_path)
