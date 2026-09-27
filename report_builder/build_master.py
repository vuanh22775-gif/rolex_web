import os
import sys

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import docx
from report_builder.common import create_document
from report_builder.front_matter import render_front_matter
from report_builder.intro import render_introduction
from report_builder.chapter1 import render_chapter_1
from report_builder.chapter2 import render_chapter_2
from report_builder.chapter3 import render_chapter_3
from report_builder.back_matter import render_back_matter

def build_full_report():
    print("=" * 60)
    print("BẮT ĐẦU KHỞI TẠO BÁO CÁO ĐỒ ÁN KỲ - ĐẠI HỌC PHƯƠNG ĐÔNG")
    print("Đề tài: ỨNG DỤNG CÔNG NGHỆ WEB VÀO KINH DOANH ĐỒNG HỒ ROLEX TRỰC TUYẾN")
    print("Sinh viên: Vũ Nhật Tuấn Anh - MSV: 523100132 - Lớp: 523100C")
    print("=" * 60)
    
    doc = create_document()
    
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    media_dir = os.path.join(root_dir, "extracted_media")
    output_path = r"C:\Users\ADMIN\Downloads\Bao_Cao_Do_An_Ky_VuNhatTuanAnh_523100132.docx"
    
    print("1. Đang tạo Trang Bìa, Mục lục, Danh mục, Ma trận CLO...")
    render_front_matter(doc)
    
    print("2. Đang tạo Phần MỞ ĐẦU (đánh số trang từ 1)...")
    render_introduction(doc)
    
    print("3. Đang tạo CHƯƠNG 1 (Tổng quan đề tài & Cơ sở lý thuyết)...")
    render_chapter_1(doc)
    
    print("4. Đang tạo CHƯƠNG 2 (Phân tích, Thiết kế giải pháp & Sơ đồ UML)...")
    render_chapter_2(doc, media_dir)
    
    print("5. Đang tạo CHƯƠNG 3 (Xây dựng, 25 Test Cases, Cải tiến kỹ thuật, Tự học)...")
    render_chapter_3(doc, media_dir, root_dir)
    
    print("6. Đang tạo KẾT LUẬN, TÀI LIỆU THAM KHẢO & PHỤ LỤC...")
    render_back_matter(doc)
    
    print(f"7. Đang lưu tệp DOCX ra đĩa: {output_path}...")
    doc.save(output_path)
    
    file_size = os.path.getsize(output_path)
    print("=" * 60)
    print(f"XUẤT BÁO CÁO THÀNH CÔNG!")
    print(f"Đường dẫn tệp: {output_path}")
    print(f"Kích thước tệp: {file_size:,} bytes ({file_size / 1024 / 1024:.2f} MB)")
    print("=" * 60)

if __name__ == "__main__":
    build_full_report()
