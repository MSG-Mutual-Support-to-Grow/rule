import easyocr
from pdf2image import convert_from_path
import os
import tempfile

def extract_text_easyocr_from_pdf(pdf_path: str, dpi: int = 300) -> str:
    """
    Extract text from PDF using EasyOCR, page by page.
    Returns concatenated text from all pages as a single string.
    Compatible with your existing pipeline and API usage.
    """
    print(f"\n📄 OCR with EasyOCR: {pdf_path}")

    try:
        images = convert_from_path(pdf_path, dpi=dpi)
    except Exception as e:
        print(f"❌ Failed to convert PDF to images: {e}")
        return ""

    reader = easyocr.Reader(['en'])  # Use English by default, adjust if needed
    all_text = ""

    for i, img in enumerate(images):
        print(f"📸 Processing Page {i + 1}...")

        # Save image to a temporary file to pass to EasyOCR
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
            temp_img_path = temp_file.name
            img.save(temp_img_path)

        try:
            # Run OCR on the temporary image file, paragraph mode for better text grouping
            ocr_result = reader.readtext(temp_img_path, detail=0, paragraph=True)
            page_text = "\n".join(ocr_result)
            print(f"✅ OCR Page {i + 1}: {len(page_text)} characters extracted")
            all_text += f"\n--- Page {i + 1} ---\n{page_text}\n"
        except Exception as ocr_error:
            print(f"❌ OCR failed on page {i + 1}: {ocr_error}")
        finally:
            # Clean up the temporary image file
            if os.path.exists(temp_img_path):
                os.remove(temp_img_path)

    return all_text.strip()


# # Example standalone test (optional)
# if __name__ == "__main__":
#     test_pdf = "../resumes/ocr/SolaiArulMurugan_Resume.pdf"
#     if os.path.exists(test_pdf):
#         extracted_text = extract_text_easyocr_from_pdf(test_pdf)
#         print("\n🧾 OCR Extracted Text Preview (first 2000 chars):\n")
#         print(extracted_text[:2000])
#     else:
#         print(f"❌ File not found: {test_pdf}")
