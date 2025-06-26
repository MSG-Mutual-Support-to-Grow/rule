import pdfplumber
import re
import os

def extract_text_from_pdf(pdf_path: str) -> str:
    full_text = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            cleaned = clean_pdf_text(page_text)
            full_text += cleaned + "\n"

    merged = merge_wrapped_lines(full_text)
    return merged.strip()


def clean_pdf_text(text: str) -> str:
    """
    Cleans common PDF junk like (cid:xxx), bullet icons, bad encoding artifacts, etc.
    """
    lines = text.split("\n")
    cleaned_lines = []

    for line in lines:
        # Remove (cid:123) and similar encoding artifacts
        line = re.sub(r"\(cid:\d+\)", "", line)

        # Replace fancy bullet symbols with •
        line = re.sub(r"[▪■●∙◦•❖➤➢→]", "•", line)

        # Remove empty space-only lines or stray underscores
        line = line.strip().replace("_", "")

        # Fix multiple spaces
        line = re.sub(r"\s{2,}", " ", line)

        # Normalize special quotes/dashes
        line = line.replace("–", "-").replace("“", "\"").replace("”", "\"")

        # Add cleaned line if not empty
        if line:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


def merge_wrapped_lines(text: str) -> str:
    """
    Merge lines that are probably wrapped (based on ending with lowercase/word characters).
    Keeps bullet points as separate lines.
    """
    lines = text.split("\n")
    merged_lines = []
    buffer = ""

    for line in lines:
        stripped = line.strip()

        # If it's a bullet point or starts with • or number, flush buffer
        if re.match(r"^(\•|\d+\.)", stripped):
            if buffer:
                merged_lines.append(buffer.strip())
                buffer = ""
            merged_lines.append(stripped)
        else:
            if buffer and re.search(r"[a-zA-Z0-9,\)]$", buffer):  # line wrap likely
                buffer += " " + stripped
            else:
                if buffer:
                    merged_lines.append(buffer.strip())
                buffer = stripped

    if buffer:
        merged_lines.append(buffer.strip())

    return "\n".join(merged_lines)


if __name__ == "__main__":
    path = "../resumes/Franz_Kingstein.pdf"
    if os.path.exists(path):
        final_text = extract_text_from_pdf(path)
        print("\n🧾 Cleaned Resume Text:\n")
        print(final_text)  # Preview top 1500 characters
    else:
        print("❌ PDF not found at:", path)
