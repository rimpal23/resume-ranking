from pdfminer.high_level import extract_text
from docx import Document

def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

def extract_text_from_docx(docx_path):
    doc = Document(docx_path) #load the file
    return "\n".join([para.text for para in doc.paragraphs])#extract text from every para











