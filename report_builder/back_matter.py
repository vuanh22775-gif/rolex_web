import docx
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt, Cm
from report_builder.common import add_body_p, add_bullet_p, add_heading_1, add_heading_2, add_heading_3, add_table, add_table_title

def render_back_matter(doc):
    # ── KẾT LUẬN ────────────────────────────────────────────────
    add_heading_1(doc, "KẾT LUẬN")
    
    add_body_p(
        doc,
        "Đồ án kỳ với đề tài “Ứng dụng công nghệ web vào kinh doanh đồng hồ Rolex trực tuyến” đã được tác giả nghiên cứu, thiết kế và hiện thực hóa thành công, đáp ứng đầy đủ các yêu cầu học thuật và tiêu chuẩn kỹ thuật đề ra theo quy định của Khoa Công nghệ số & Truyền thông – Trường Đại học Phương Đông. Trải qua toàn bộ chu trình phát triển phần mềm từ xác định bài toán, khảo sát thị trường, mô hình hóa phân tích, thiết kế cơ sở dữ liệu đến lập trình full-stack và kiểm thử thực nghiệm, đồ án đã đạt được những kết quả cụ thể sau:",
        bold_prefix="1. Tóm tắt kết quả đạt được: "
    )
    add_bullet_p(doc, "Xây dựng thành công hệ thống website thương mại điện tử chuyên biệt cho ngành hàng đồng hồ cao cấp với 9 giao diện Storefront EJS và 7 màn hình quản trị React 18 SPA hiện đại, hoạt động ổn định và nhất quán trên nền tảng máy chủ Node.js/Express và CSDL MongoDB.", bold_prefix="Về mặt sản phẩm phần mềm: ")
    add_bullet_p(doc, "Giải quyết triệt để bài toán tranh chấp tồn kho và tính nhất quán dữ liệu khi checkout nhiều sản phẩm trên CSDL MongoDB Standalone thông qua thuật toán Hoàn tác bù trừ (Compensating Rollback) kết hợp với cờ nguyên tử stockDeducted, loại bỏ hoàn toàn rủi ro bán vượt tồn kho (overselling) và hoàn kho trùng lặp.", bold_prefix="Về mặt giải pháp kỹ thuật: ")
    add_bullet_p(doc, "Hiện đại hóa thành công phân hệ quản trị sang ứng dụng trang đơn (SPA) với React 18, TypeScript, Tailwind CSS, Zustand và Recharts, đem lại tốc độ phản hồi dưới 50ms và khả năng trực quan hóa tài chính đa chiều.", bold_prefix="Về mặt trải nghiệm người dùng: ")
    add_bullet_p(doc, "Thực hiện thành công 25 kịch bản kiểm thử hộp đen trên các chức năng cốt lõi với tỷ lệ thành công 100%, kiểm chứng độ bền vững của hệ thống khi đối mặt với dữ liệu ngoại lệ hoặc tranh chấp tài nguyên.", bold_prefix="Về mặt kiểm thử chất lượng: ")

    add_body_p(
        doc,
        "Đồ án không dừng lại ở mức độ một bài tập lý thuyết mà mang lại giá trị ứng dụng thực tế rõ rệt: cung cấp một nền tảng số hóa hoàn chỉnh, sang trọng, có thể ứng dụng trực tiếp cho các showroom, boutique kinh doanh đồng hồ cơ khí chính hãng tại Việt Nam. Về mặt học thuật, đồ án đã chứng minh khả năng làm chủ các công nghệ web tiên tiến nhất hiện nay của sinh viên, thể hiện tư duy kiến trúc hệ thống phân tầng mạch lạc và kỹ năng giải quyết các bài toán kỹ thuật phức tạp trong môi trường cơ sở dữ liệu thực tế.",
        bold_prefix="2. Khẳng định giá trị thực tiễn và tính ứng dụng: "
    )

    add_body_p(
        doc,
        "Bên cạnh những kết quả nổi bật, hệ thống vẫn tồn tại một số hạn chế cần tiếp tục hoàn thiện trong các giai đoạn phát triển tiếp theo:",
        bold_prefix="3. Hạn chế và định hướng phát triển trong tương lai: "
    )
    add_bullet_p(doc, "Làm việc với nhà cung cấp dịch vụ thanh toán để kết nối cổng Sandbox chính thức (VNPAY / MoMo), xử lý xác thực chữ ký điện tử HMAC và cơ chế Webhook IPN tự động cập nhật trạng thái hóa đơn sau khi chuyển khoản thành công.", bold_prefix="Định hướng 1 – Tích hợp cổng thanh toán trực tuyến chính thức: ")
    add_bullet_p(doc, "Thay thế cơ chế HTTP Polling hiện tại bằng giao thức kết nối liên tục hai chiều thời gian thực (WebSocket / Socket.io) nhằm nâng cao trải nghiệm trao đổi giữa khách hàng và nhân viên chăm sóc khách hàng.", bold_prefix="Định hướng 2 – Nâng cấp truyền thông thời gian thực: ")
    add_bullet_p(doc, "Chuyển đổi hạ tầng máy chủ sang cấu hình cụm bản sao (Replica Set) của MongoDB trên nền tảng Docker, cho phép khai thác trực tiếp cơ chế Multi-Document ACID Transactions gốc của hệ quản trị CSDL.", bold_prefix="Định hướng 3 – Đóng gói Docker và thiết lập Replica Set: ")
    add_bullet_p(doc, "Ứng dụng các thuật toán máy học hoặc gợi ý sản phẩm dựa trên hành vi duyệt web và lịch sử đơn hàng của người dùng, nâng cao tỷ lệ chuyển đổi đơn hàng cho cửa hàng.", bold_prefix="Định hướng 4 – Tích hợp hệ thống gợi ý thông minh (AI Recommendation): ")

    doc.add_page_break()

    # ── TÀI LIỆU THAM KHẢO ──────────────────────────────────────
    add_heading_1(doc, "TÀI LIỆU THAM KHẢO")
    
    add_body_p(
        doc,
        "Danh mục các tài liệu học thuật, tiêu chuẩn kỹ thuật và tài liệu chính thức của các công nghệ được trích dẫn và sử dụng trực tiếp trong quá trình nghiên cứu và thực hiện đồ án (trình bày theo chuẩn IEEE):",
        indent=False
    )

    references = [
        "[1] Bain & Company, “Renaissance in Uncertainty: Luxury Beyond Growth,” Worldwide Luxury Market Report, Bain & Company Inc., Boston, MA, 2024.",
        "[2] Open Web Application Security Project (OWASP), “OWASP Top Ten Web Application Security Risks,” OWASP Foundation, Tech. Rep., 2021.",
        "[3] N. Provos and D. Mazières, “A Future-Adaptable Password Scheme,” in Proceedings of the FREENIX Track: 1999 USENIX Annual Technical Conference, Monterey, CA, USA, 1999, pp. 81–91.",
        "[4] Node.js Foundation, “Node.js Architecture and Event Loop Documentation,” Node.js Official Docs, 2024. [Online]. Available: https://nodejs.org/docs",
        "[5] Express.js Technical Committee, “Express - Node.js web application framework,” Express Official Reference, 2024. [Online]. Available: https://expressjs.com",
        "[6] MongoDB Inc., “MongoDB Manual: Documents, Collections, and Transactions,” MongoDB Documentation, 2024. [Online]. Available: https://www.mongodb.com/docs/manual",
        "[7] EJS Project, “Embedded JavaScript templates documentation,” EJS Community, 2024. [Online]. Available: https://ejs.co",
        "[8] Meta Platforms, “React Documentation: Virtual DOM, Hooks and Performance,” Meta Open Source, 2024. [Online]. Available: https://react.dev",
        "[9] P. Henschel et al., “Zustand: Bear necessities for state management in React,” Poimandres Open Source, 2024. [Online]. Available: https://github.com/pmndrs/zustand",
        "[10] International Organization for Standardization, “ISO/IEC 25010: Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models,” ISO, Geneva, Switzerland, Standard ISO/IEC 25010:2011, 2011.",
        "[11] C. Richardson, Microservices Patterns: With examples in Java. Shelter Island, NY, USA: Manning Publications, 2018.",
        "[12] Trường Đại học Phương Đông, “Quy định thực hiện và trình bày Báo cáo Đồ án kỳ (Áp dụng năm 2026),” Khoa Công nghệ số & Truyền thông, Hà Nội, 2026."
    ]

    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.line_spacing = 1.3
        p_ref.paragraph_format.space_before = Pt(3)
        p_ref.paragraph_format.space_after = Pt(3)
        p_ref.paragraph_format.left_indent = Cm(1.27)
        p_ref.paragraph_format.first_line_indent = Cm(-1.27)
        r = p_ref.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)

    doc.add_page_break()

    # ── PHỤ LỤC ────────────────────────────────────────────────
    add_heading_1(doc, "PHỤ LỤC")
    
    add_heading_2(doc, "Phụ lục 1: Hướng dẫn cài đặt, cấu hình và khởi chạy ứng dụng")
    add_body_p(
        doc,
        "Để thiết lập và vận hành hệ thống Rolex Boutique trên một máy trạm mới, người quản trị hoặc người chấm điểm thực hiện tuần tự theo các bước kỹ thuật sau:"
    )
    add_bullet_p(doc, "Cài đặt môi trường thực thi Node.js (phiên bản khuyến nghị: v20.19.0 LTS hoặc v22.12.0 LTS) và hệ quản trị cơ sở dữ liệu MongoDB Community Server phiên bản 7.0 trở lên.", bold_prefix="Bước 1 – Chuẩn bị môi trường: ")
    add_bullet_p(doc, "Mở cửa sổ dòng lệnh (PowerShell hoặc Terminal), điều hướng vào thư mục gốc của dự án và cài đặt toàn bộ các thư viện phụ thuộc bằng lệnh: `npm install`.", bold_prefix="Bước 2 – Cài đặt gói thư viện phụ thuộc: ")
    add_bullet_p(doc, "Sao chép tệp cấu hình mẫu `.env.example` thành tệp `.env`. Thiết lập các tham số môi trường: `MONGODB_URI=mongodb://localhost:27017/rolex_boutique`, `SESSION_SECRET=chuoi_bi_mat_ngau_nhien_dai_32_ky_tu`, `PORT=3000`. Nếu chạy cơ sở dữ liệu mới lần đầu, có thể cấu hình thêm `BOOTSTRAP_ADMIN_USERNAME=admin` và `BOOTSTRAP_ADMIN_PASSWORD=mat_khau_khoi_tao`.", bold_prefix="Bước 3 – Thiết lập biến môi trường: ")
    add_bullet_p(doc, "Tiến hành biên dịch và đóng gói phân hệ React Admin SPA bằng lệnh: `npm run build`. Lệnh này sẽ kích hoạt trình biên dịch TypeScript kiểm tra lỗi kiểu dữ liệu và tạo gói tài nguyên tĩnh tối ưu trong thư mục `dist/`.", bold_prefix="Bước 4 – Biên dịch phân hệ quản trị React: ")
    add_bullet_p(doc, "Khởi chạy máy chủ Express bằng lệnh: `npm start`. Máy chủ sẽ tự động kết nối CSDL MongoDB, kích hoạt hàm nạp dữ liệu mẫu 31 mẫu đồng hồ, 18 khách hàng, 36 đơn hàng và lắng nghe tại cổng `http://localhost:3000`.", bold_prefix="Bước 5 – Khởi động hệ thống: ")
    add_bullet_p(doc, "Mở trình duyệt web và truy cập địa chỉ `http://localhost:3000` để trải nghiệm phân hệ Cửa hàng khách hàng, hoặc truy cập `http://localhost:3000/admin` để đăng nhập vào Bảng điều khiển quản trị chuyên nghiệp.", bold_prefix="Bước 6 – Trải nghiệm ứng dụng: ")

    add_heading_2(doc, "Phụ lục 2: Bảng chi tiết toàn bộ các Test Case kiểm thử hệ thống")
    add_body_p(
        doc,
        "Toàn bộ 25 Test Case kiểm thử chức năng và ngoại lệ đã được lập bảng chi tiết tại Bảng 3.3 thuộc Mục 3.2.2 của Báo cáo. Quá trình kiểm thử thực nghiệm xác nhận 100% các ca kiểm thử đều đạt yêu cầu (Status: ĐẠT), không phát sinh lỗi bất thường và cơ chế hoàn tác bù trừ hoạt động ổn định khi xảy ra tranh chấp số lượng tồn kho."
    )

    add_heading_2(doc, "Phụ lục 3: Danh mục đầy đủ các RESTful API và đặc tả tham số")
    add_body_p(
        doc,
        "Hệ thống cung cấp danh mục hơn 25 RESTful API chuẩn mực đã được đặc tả chi tiết tại Bảng 2.7 thuộc Mục 2.5.3 của Báo cáo. Mọi yêu cầu gọi đến các API quản trị (`/api/admin/*`, `/api/products` POST/PUT/DELETE, `/api/accounts`) đều bắt buộc phải mang theo cookie phiên hợp lệ của tài khoản có vai trò 'admin', nếu không hệ thống sẽ từ chối truy cập ngay tại tầng Middleware bảo vệ."
    )
