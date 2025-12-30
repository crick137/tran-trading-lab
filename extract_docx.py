from docx import Document
import sys

doc = Document(r'D:\常用\tran-trading-lab\Howard_Marks_버블인가_한국어.docx')
with open('extracted_article.txt', 'w', encoding='utf-8') as f:
    for para in doc.paragraphs:
        f.write(para.text + '\n')
print("Content extracted to extracted_article.txt")
