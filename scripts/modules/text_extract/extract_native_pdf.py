# scripts/extract_text_lines.py

import pdfplumber
import os

def extract_lines_from_pdf(pdf_path: str) -> str:
    all_lines = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                lines = text.split('\n')
                all_lines.extend(lines)

    return "\n".join(all_lines)  # ✅ FIX: returns single string

# if __name__ == "__main__":
#     pdf_path = "../resumes/text/RonnieAJeffrey_Resume.pdf"  # Change if needed
#     if os.path.exists(pdf_path):
#         extract_lines_from_pdf(pdf_path)
#     else:
#         print("❌ File not found:", pdf_path)
