import zipfile
import xml.etree.ElementTree as ET
import os
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            
            # The namespace for WordprocessingML
            WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
            PARA = WORD_NAMESPACE + 'p'
            TEXT = WORD_NAMESPACE + 't'
            
            paragraphs = []
            for paragraph in tree.iter(PARA):
                texts = [node.text for node in paragraph.iter(TEXT) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading {docx_path}: {e}"

files = [
    "About us.docx",
    "Privacy policy/Cancellation & Modification Policy.docx",
    "Privacy policy/Privacy Policy.docx",
    "Privacy policy/Refund policy.docx",
    "Privacy policy/Shipping & Delivery Policy.docx",
    "Privacy policy/Terms and Conditions.docx",
    "Privacy policy/Terms of service.docx"
]

for f in files:
    print(f"\n--- {f} ---")
    print(extract_text_from_docx(f))
