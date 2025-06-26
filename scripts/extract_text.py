# scripts/extract_text_lines.py

import pdfplumber
import os

def extract_lines_from_pdf(pdf_path: str) -> list[str]:
    all_lines = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if text:
                lines = text.split('\n')
                print(f"\n--- Page {page_num} ---")
                for line in lines:
                    print(line)
                    all_lines.append(line)

    return all_lines

if __name__ == "__main__":
    pdf_path = "../resumes/RonnieAJeffrey_Resume.pdf"  # Change if needed
    if os.path.exists(pdf_path):
        extract_lines_from_pdf(pdf_path)
    else:
        print("❌ File not found:", pdf_path)
