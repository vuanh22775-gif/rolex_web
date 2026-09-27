import os
from report_builder.common import add_body_p, add_bullet_p, add_heading_1, add_heading_2, add_heading_3, add_table, add_table_title, add_figure

def render_chapter_2(doc, media_dir):
    add_heading_1(doc, "CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ GIẢI PHÁP")
    
    # ── 2.1. PHÂN TÍCH YÊU CẦU VÀ CHỨC NĂNG CỐT LÕI ───────────
    add_heading_2(doc, "2.1. Phân tích yêu cầu và chức năng cốt lõi")
    add_body_p(
        doc,
        "Phân tích yêu cầu là bước khởi đầu mang tính quyết định trong quy trình phát triển phần mềm, nhằm xác lập các chuẩn mực nghiệp vụ và kỹ thuật mà hệ thống phải đáp ứng. Dựa trên quá trình khảo sát thực tế thói quen của người dùng mua sắm trực tuyến và yêu cầu nghiệp vụ quản trị tại cửa hàng đồng hồ cao cấp, các yêu cầu của hệ thống Rolex Boutique được phân loại tường minh thành hai nhóm: Yêu cầu chức năng (Functional Requirements) và Yêu cầu phi chức năng (Non-functional Requirements)."
    )

    add_heading_3(doc, "2.1.1. Yêu cầu chức năng (Functional Requirements)")
    add_body_p(
        doc,
        "Hệ thống bao gồm 16 yêu cầu chức năng nghiệp vụ cốt lõi, được phân chia theo từng tác nhân và đánh số định danh từ FR-01 đến FR-16 như tổng hợp tại Bảng 2.1:"
    )
    
    add_table_title(doc, "Bảng 2.1: Bảng phân tích yêu cầu chức năng hệ thống (Functional Requirements)")
    fr_headers = ["Mã YC", "Phân hệ / Nhóm", "Mô tả yêu cầu chức năng chi tiết", "Tác nhân", "Mức ưu tiên"]
    fr_data = [
        ["FR-01", "Duyệt sản phẩm", "Hiển thị trang chủ với 6 mẫu nổi bật, danh sách toàn bộ sản phẩm và lọc theo 4 bộ sưu tập ('classic', 'luxury', 'diving', 'sport').", "Khách vãng lai, Khách hàng", "Bắt buộc (Cao)"],
        ["FR-02", "Chi tiết sản phẩm", "Xem thông tin kỹ thuật chi tiết của đồng hồ (mã tham chiếu, vật liệu, kích thước mặt, bộ máy, vành Bezel, giá niêm yết, tình trạng kho).", "Khách vãng lai, Khách hàng", "Bắt buộc (Cao)"],
        ["FR-03", "Đăng ký tài khoản", "Cho phép người dùng tạo tài khoản mới qua form tư vấn, kiểm tra tính hợp lệ của họ tên, email, username, phone, băm mật khẩu bảo mật.", "Khách vãng lai", "Bắt buộc (Cao)"],
        ["FR-04", "Đăng nhập / Thoát", "Xác thực danh tính bằng username/password, cấp session an toàn, điều hướng đúng phân hệ theo vai trò (User/Admin). Hỗ trợ đăng xuất.", "Tất cả tác nhân", "Bắt buộc (Cao)"],
        ["FR-05", "Quản lý giỏ hàng", "Cho phép thêm sản phẩm vào giỏ, cập nhật số lượng, xóa mặt hàng, tự động tính tổng tiền, lưu trữ giỏ hàng qua LocalStorage.", "Khách hàng", "Bắt buộc (Cao)"],
        ["FR-06", "Đặt hàng & Kho", "Thu nhận thông tin người nhận, kiểm tra tồn kho nguyên tử, trừ kho tức thì, tạo hóa đơn Order mới (pending), hoàn kho nếu có lỗi.", "Khách hàng", "Bắt buộc (Cao)"],
        ["FR-07", "Xem lịch sử đơn", "Hiển thị danh sách các đơn hàng đã đặt của tài khoản kèm chi tiết các sản phẩm, tổng giá trị, hình thức thanh toán và trạng thái hiện tại.", "Khách hàng", "Bắt buộc (Cao)"],
        ["FR-08", "Hồ sơ cá nhân", "Xem và cập nhật thông tin cá nhân (họ tên, email, số điện thoại), đổi mật khẩu tài khoản.", "Khách hàng", "Trung bình"],
        ["FR-09", "Chat CSKH", "Gửi tin nhắn yêu cầu hỗ trợ tới ban quản trị, tự động cập nhật hội thoại qua cơ chế polling.", "Khách hàng", "Trung bình"],
        ["FR-10", "Tổng quan điều hành", "Hiển thị Dashboard quản trị với các chỉ số doanh thu, đơn hàng, khách hàng, cảnh báo hàng sắp hết và biểu đồ biến động Recharts.", "Quản trị viên", "Bắt buộc (Cao)"],
        ["FR-11", "Quản lý sản phẩm", "Thực hiện CRUD sản phẩm: thêm mới, cập nhật giá, chỉnh sửa tồn kho, thay đổi trạng thái ('Active', 'Draft', 'Archived'), xóa sản phẩm.", "Quản trị viên", "Bắt buộc (Cao)"],
        ["FR-12", "Quản lý danh mục", "Liệt kê và thống kê số lượng sản phẩm thực tế theo từng nhóm danh mục bộ sưu tập.", "Quản trị viên", "Trung bình"],
        ["FR-13", "Quản lý đơn hàng", "Xem danh sách toàn bộ đơn hàng, lọc theo trạng thái, xem chi tiết mặt hàng, xuất tệp CSV, chuyển đổi trạng thái đơn hàng.", "Quản trị viên", "Bắt buộc (Cao)"],
        ["FR-14", "Duyệt / Từ chối đơn", "Phê duyệt đơn hàng hợp lệ hoặc từ chối đơn hàng; khi từ chối bắt buộc kích hoạt cơ chế hoàn lại số lượng tồn kho cho sản phẩm.", "Quản trị viên", "Bắt buộc (Cao)"],
        ["FR-15", "Quản lý khách hàng", "Tổng hợp danh sách khách hàng từ đơn hàng, tính tổng chi tiêu tích lũy, phân loại nhóm khách hàng mới và thân thiết.", "Quản trị viên", "Trung bình"],
        ["FR-16", "Hộp thư quản trị", "Theo dõi danh sách các cuộc hội thoại của khách hàng, đếm tin nhắn chưa đọc, gửi tin nhắn phản hồi hỗ trợ khách hàng.", "Quản trị viên", "Trung bình"]
    ]
    add_table(doc, fr_headers, fr_data, [1.6, 2.8, 6.4, 3.2, 2.0])

    add_heading_3(doc, "2.1.2. Yêu cầu phi chức năng (Non-functional Requirements)")
    add_body_p(
        doc,
        "Yêu cầu phi chức năng quy định các tiêu chuẩn về chất lượng vận hành, độ an toàn, hiệu năng và tính dùng được của phần mềm theo tiêu chuẩn quốc tế ISO/IEC 25010 [10]. Chi tiết được đặc tả tại Bảng 2.2:"
    )

    add_table_title(doc, "Bảng 2.2: Bảng phân tích yêu cầu phi chức năng hệ thống (Non-functional Requirements)")
    nfr_headers = ["Mã NFR", "Thuộc tính chất lượng", "Tiêu chuẩn kỹ thuật và Tiêu chí đo lường cụ thể", "Mức độ quan trọng"]
    nfr_data = [
        ["NFR-01", "Tính bảo mật (Security)", "Mật khẩu băm 1 chiều bằng Bcrypt salt 10 vòng; Cookie phiên httpOnly, sameSite 'lax'; Phân quyền RBAC 2 lớp qua Middleware; Ngăn chặn NoSQL Injection.", "Tối quan trọng"],
        ["NFR-02", "Toàn vẹn dữ liệu (Integrity)", "Bảo đảm tính nguyên tử khi trừ kho; Kiểm tra số lượng tồn kho khả dụng; Hoàn tác bù trừ nếu gián đoạn; Khôi phục kho chính xác 1 lần khi hủy đơn.", "Tối quan trọng"],
        ["NFR-03", "Hiệu năng (Performance)", "Thời gian phản hồi các truy vấn API đọc (Read) < 200ms; Thời gian xử lý giao dịch đặt hàng < 500ms; Tối ưu truy vấn bằng Mongoose Indexing.", "Quan trọng"],
        ["NFR-04", "Tính dùng được (Usability)", "Giao diện tuân thủ quy tắc Luxury Design, bố cục lưới rõ ràng, tỷ lệ tương phản đạt chuẩn WCAG 2.1 AA, phản hồi trạng thái tức thì qua Toast/Notification.", "Quan trọng"],
        ["NFR-05", "Độ tin cậy & Sẵn sàng", "Hệ thống hoạt động ổn định, bắt giữ và xử lý lỗi tập trung qua Error Middleware, không làm sập tiến trình máy chủ khi có ngoại lệ bất thường.", "Quan trọng"],
        ["NFR-06", "Tương thích (Compatibility)", "Tương thích tốt trên các trình duyệt hiện đại (Chrome, Edge, Safari, Firefox); Giao diện phản hồi linh hoạt (Responsive) trên Desktop, Tablet, Mobile.", "Quan trọng"],
        ["NFR-07", "Khả năng mở rộng (Scalability)", "Kiến trúc mã nguồn tách biệt phân tầng rõ ràng (Model, View, Controller/Route, Store); Dễ dàng tích hợp thêm cổng thanh toán Webhook hoặc WebSocket.", "Trung bình"],
        ["NFR-08", "Quản lý cấu hình", "Tách bạch mã nguồn và thông tin nhạy cảm qua biến môi trường (.env); Cung cấp cơ chế Bootstrap tự động khởi tạo admin và seed data khi triển khai mới.", "Quan trọng"]
    ]
    add_table(doc, nfr_headers, nfr_data, [1.8, 3.2, 8.5, 2.5])

    # ── 2.2. USE CASE VÀ CÁC LUỒNG XỬ LÝ CHÍNH ───────────────
    add_heading_2(doc, "2.2. Use case hoặc các luồng xử lý chính")
    
    add_heading_3(doc, "2.2.1. Sơ đồ Use Case tổng quát và danh sách tác nhân hệ thống")
    add_body_p(
        doc,
        "Sơ đồ Use Case tổng quát phản ánh trực quan mối tương tác giữa 3 tác nhân chính (Khách vãng lai, Khách hàng thành viên, Quản trị viên) với các nhóm chức năng nghiệp vụ của hệ thống Rolex Boutique. Sơ đồ được xây dựng dựa trên bản phân tích thiết kế sơ bộ đã được phê duyệt tại Checkpoint 2 (CP2):"
    )

    uc_img = os.path.join(media_dir, "cp2_image1.png")
    add_figure(doc, uc_img, "Hình 2.1: Sơ đồ Use Case tổng quát hệ thống website kinh doanh Rolex Boutique (Nguồn: Checkpoint 2 - CP2)")

    add_body_p(
        doc,
        "Qua Hình 2.1, ranh giới và quyền hạn giữa các tác nhân được phân định rõ ràng: Khách vãng lai chỉ tương tác với các Use Case đọc dữ liệu công khai và Đăng ký/Đăng nhập. Khách hàng thành viên mở rộng thêm các Use Case mang tính giao dịch (Thêm giỏ hàng, Đặt hàng, Xem đơn của tôi, Chat CSKH). Quản trị viên quản lý toàn bộ các Use Case nghiệp vụ lõi (Quản lý sản phẩm, Quản lý tài khoản, Quản lý hóa đơn đơn hàng, Xem báo cáo thống kê, Cài đặt hệ thống)."
    )

    add_heading_3(doc, "2.2.2. Đặc tả chi tiết Use Case cốt lõi: Đặt hàng và xử lý thanh toán (UC-04)")
    add_body_p(
        doc,
        "Trong toàn bộ hệ thống, Use Case Đặt hàng và xử lý thanh toán là quy trình phức tạp và có yêu cầu kỹ thuật khắt khe nhất, bảo đảm tính chính xác giữa nhu cầu của khách hàng và số lượng hàng hóa thực tế trong kho. Bản đặc tả chi tiết được trình bày tại Bảng 2.3:"
    )

    add_table_title(doc, "Bảng 2.3: Đặc tả chi tiết Use Case Đặt hàng và xử lý thanh toán (UC-04)")
    uc_spec_headers = ["Thuộc tính Use Case", "Nội dung đặc tả chi tiết"]
    uc_spec_data = [
        ["Tên Use Case", "Đặt hàng và Thanh toán giỏ hàng (Place Order & Checkout)"],
        ["Tác nhân chính", "Khách hàng thành viên (Customer)"],
        ["Mục tiêu nghiệp vụ", "Khấu trừ tồn kho an toàn cho các mặt hàng trong giỏ, tạo bản ghi đơn hàng Order hợp lệ và xác nhận thông tin đơn hàng với khách hàng."],
        ["Tiền điều kiện (Pre-conditions)", "1. Khách hàng đã đăng nhập thành công vào hệ thống (phiên session hợp lệ).\n2. Giỏ hàng có tối thiểu 01 sản phẩm hợp lệ."],
        ["Hậu điều kiện (Post-conditions)", "1. Đơn hàng mới được tạo trong CSDL với trạng thái 'pending' và cờ stockDeducted = true.\n2. Số lượng tồn kho (stock) của các sản phẩm tương ứng trong kho giảm đúng bằng số lượng đặt.\n3. Khách hàng được chuyển hướng sang trang chi tiết đơn hàng."],
        ["Luồng sự kiện chính (Basic Flow)", "1. Khách hàng truy cập trang thanh toán (/thanhtoan) từ giỏ hàng.\n2. Hệ thống hiển thị danh sách mặt hàng, đơn giá, tổng tiền tạm tính và form nhập thông tin.\n3. Khách hàng điền họ tên, email, số điện thoại, địa chỉ nhận hàng, ghi chú và chọn phương thức thanh toán (COD, Chuyển khoản, VNPAY).\n4. Khách hàng nhấn nút 'Xác nhận đặt hàng'.\n5. Hệ thống kiểm tra dữ liệu đầu vào: họ tên >= 3 ký tự, regex email, regex SĐT, địa chỉ >= 5 ký tự.\n6. Hệ thống duyệt từng mặt hàng, thực hiện trừ kho nguyên tử bằng Product.findOneAndUpdate với điều kiện stock >= qty.\n7. Hệ thống tạo tài liệu Order mới trong MongoDB.\n8. Hệ thống xóa giỏ hàng phía Client và chuyển hướng về trang /don-hang kèm mã đơn hàng."],
        ["Luồng ngoại lệ (Alternative Flow)", "5a. Thông tin người nhận không hợp lệ: Hệ thống dừng xử lý, hiển thị thông báo lỗi yêu cầu kiểm tra lại.\n6a. Một sản phẩm trong giỏ bị hết hàng hoặc không đủ tồn kho: Hệ thống kích hoạt cơ chế hoàn tác bù trừ (Compensating Rollback), cộng hoàn trả lại toàn bộ số lượng tồn kho của các sản phẩm đã trừ trước đó, trả về mã lỗi 409 Conflict với thông báo 'Sản phẩm [Tên/ID] không còn đủ số lượng trong kho'."]
    ]
    add_table(doc, uc_spec_headers, uc_spec_data, [4.0, 12.0])

    add_heading_3(doc, "2.2.3. Sơ đồ hoạt động (Activity Diagram) luồng Đặt hàng và xử lý tồn kho")
    add_body_p(
        doc,
        "Sơ đồ hoạt động mô tả trình tự các bước thực thi thuật toán từ thời điểm khách hàng gửi dữ liệu thanh toán đến khi hoàn tất đơn hàng, làm nổi bật rẽ nhánh kiểm tra tồn kho và cơ chế hoàn tác tự động:"
    )

    act_img = os.path.join(media_dir, "cp2_image3.png")
    add_figure(doc, act_img, "Hình 2.2: Sơ đồ hoạt động (Activity Diagram) luồng Đặt hàng và xử lý tồn kho (Nguồn: Checkpoint 2 - CP2)")

    add_heading_3(doc, "2.2.4. Sơ đồ tuần tự (Sequence Diagram) xác thực phiên và phân quyền quản trị")
    add_body_p(
        doc,
        "Sơ đồ tuần tự minh họa dòng thông điệp trao đổi giữa Trình duyệt (Client), Bộ định tuyến Express (Router), Lớp Middleware bảo mật (requireAuth, requireAdmin) và Cơ sở dữ liệu MongoDB trong quá trình truy cập tài nguyên quản trị:"
    )

    seq_img = os.path.join(media_dir, "cp2_image4.png")
    add_figure(doc, seq_img, "Hình 2.3: Sơ đồ tuần tự (Sequence Diagram) luồng xác thực phiên và phân quyền quản trị (Nguồn: Checkpoint 2 - CP2)")

    add_heading_3(doc, "2.2.5. Sơ đồ lớp phân tích (Class Diagram) các thực thể nghiệp vụ cốt lõi")
    add_body_p(
        doc,
        "Sơ đồ lớp phân tích biểu diễn cấu trúc thuộc tính, phương thức và các mối quan hệ kết tập, phụ thuộc giữa các đối tượng chính trong hệ thống:"
    )

    cls_img = os.path.join(media_dir, "cp2_image2.png")
    add_figure(doc, cls_img, "Hình 2.4: Sơ đồ lớp phân tích (Class Diagram) các thực thể nghiệp vụ cốt lõi (Nguồn: Checkpoint 2 - CP2)")

    # ── 2.3. KIẾN TRÚC HỆ THỐNG VÀ LUỒNG DỮ LIỆU ──────────────
    add_heading_2(doc, "2.3. Kiến trúc hệ thống, các thành phần và luồng trao đổi dữ liệu")
    
    add_heading_3(doc, "2.3.1. Mô hình kiến trúc phân tầng kết hợp (Hybrid 3-Tier Architecture)")
    add_body_p(
        doc,
        "Hệ thống Rolex Boutique được thiết kế theo mô hình kiến trúc phân tầng kết hợp (Hybrid 3-Tier Architecture), phân tách độc lập giữa Tầng trình diễn (Presentation Layer), Tầng logic ứng dụng (Application Layer) và Tầng dữ liệu (Data Persistence Layer):"
    )
    add_bullet_p(
        doc,
        "Bao gồm hai thành phần độc lập: (1) Giao diện Storefront sử dụng EJS Template Engine, HTML5, CSS3, JavaScript thuần và FontAwesome để tối ưu SEO và tốc độ tải trang; (2) Giao diện Quản trị xây dựng dưới dạng ứng dụng trang đơn React 18, TypeScript, Tailwind CSS và Recharts để tối ưu tương tác điều hành phức tạp.",
        bold_prefix="Tầng trình diễn (Presentation Layer): "
    )
    add_bullet_p(
        doc,
        "Được xây dựng trên nền tảng Node.js và Express. Đảm nhiệm việc định tuyến yêu cầu, quản lý Middleware bảo vệ, kiểm soát phiên làm việc bằng express-session, xử lý các quy tắc nghiệp vụ đặt hàng, khấu trừ kho, thống kê doanh thu và cung cấp giao diện RESTful API chuẩn.",
        bold_prefix="Tầng logic nghiệp vụ (Application Layer): "
    )
    add_bullet_p(
        doc,
        "Sử dụng hệ quản trị CSDL MongoDB, giao tiếp qua thư viện Mongoose ODM. Lưu trữ bền vững 5 tập hợp thực thể chính (Users, Products, Orders, ChatMessages, Registrations) và tập hợp lưu phiên làm việc (Sessions).",
        bold_prefix="Tầng cơ sở dữ liệu (Data Layer): "
    )

    add_heading_3(doc, "2.3.2. Luồng giao tiếp dữ liệu giữa Client và Server")
    add_body_p(
        doc,
        "Đối với khách hàng duyệt web, trình duyệt gửi yêu cầu HTTP GET, máy chủ Express đọc dữ liệu từ MongoDB qua Mongoose, nhúng vào mẫu EJS và trả về tài liệu HTML hoàn chỉnh. Đối với phân hệ quản trị, khi người dùng thao tác (ví dụ đổi trạng thái đơn, lọc sản phẩm), React Client gửi yêu cầu AJAX bất đồng bộ (thông qua thư viện Axios kèm cookie phiên) đến các endpoint REST API dạng `/api/*`. Máy chủ xử lý logic nghiệp vụ và phản hồi gói tin JSON chuẩn (`{ success: true, data: ... }`). Thư viện Zustand tiếp nhận dữ liệu phản hồi, cập nhật State cục bộ và kích hoạt React re-render giao diện mà không hề làm mới toàn bộ trang web."
    )

    # ── 2.4. THIẾT KẾ CƠ SỞ DỮ LIỆU ───────────────────────────
    add_heading_2(doc, "2.4. Thiết kế cơ sở dữ liệu")
    
    add_heading_3(doc, "2.4.1. Sơ đồ mô hình quan hệ dữ liệu Document trong MongoDB")
    add_body_p(
        doc,
        "Mô hình dữ liệu của Rolex Boutique được thiết kế theo hướng Document Database của MongoDB, tận dụng tối đa khả năng nhúng (Embedded Document) để giảm thiểu thao tác nối bảng, đồng thời thiết lập các liên kết mềm (Reference) thông qua các trường định danh duy nhất (username, sku). Sơ đồ thiết kế CSDL được mô tả tại Hình 2.5:"
    )

    db_img = os.path.join(media_dir, "cp3_image2.png")
    add_figure(doc, db_img, "Hình 2.5: Sơ đồ mô hình quan hệ dữ liệu Document trong MongoDB (Nguồn: Checkpoint 3 - CP3)")

    add_heading_3(doc, "2.4.2. Đặc tả chi tiết cấu trúc các Collections trong MongoDB")
    add_body_p(
        doc,
        "Hệ thống hiện thực 05 Collection chính trong mã nguồn tại thư mục `models/`:"
    )
    
    # Product Table
    add_table_title(doc, "Bảng 2.4: Đặc tả chi tiết Schema thực thể Product trong MongoDB (models/productModel.js)")
    prod_headers = ["Tên trường (Field)", "Kiểu dữ liệu (BSON)", "Ràng buộc & Quy tắc (Constraints)", "Ý nghĩa và Mô tả nghiệp vụ"]
    prod_data = [
        ["id", "String", "required, unique: true, trim", "Mã tham chiếu SKU duy nhất của đồng hồ (ví dụ: '126610LN')."],
        ["name", "String", "required, trim", "Tên thương mại của dòng sản phẩm (ví dụ: 'Submariner Date')."],
        ["model", "String", "required, trim", "Mô tả kỹ thuật: kích thước mặt, loại vỏ, vành bezel, mặt số."],
        ["price", "Number", "required, min: 0", "Giá niêm yết chính hãng bằng đồng Việt Nam (VNĐ)."],
        ["stock", "Number", "required, min: 0, default: 0", "Số lượng sản phẩm còn thực tế trong kho sẵn sàng bán."],
        ["collection", "String", "required, enum: ['classic', 'luxury', 'diving', 'sport']", "Phân loại bộ sưu tập phục vụ hiển thị và phân loại."],
        ["image", "String", "default: ''", "Đường dẫn tệp hình ảnh sản phẩm (media/...)."],
        ["status", "String", "enum: ['Active', 'Draft', 'Archived'], default: 'Active'", "Trạng thái kinh doanh của sản phẩm trong hệ thống."],
        ["createdAt, updatedAt", "Date", "Tự động quản lý (timestamps: true)", "Dấu vết thời gian tạo và cập nhật bản ghi."]
    ]
    add_table(doc, prod_headers, prod_data, [3.0, 2.5, 5.0, 5.5])

    # Order Table
    add_table_title(doc, "Bảng 2.5: Đặc tả chi tiết Schema thực thể Order trong MongoDB (models/orderModel.js)")
    ord_headers = ["Tên trường (Field)", "Kiểu dữ liệu (BSON)", "Ràng buộc & Quy tắc (Constraints)", "Ý nghĩa và Mô tả nghiệp vụ"]
    ord_data = [
        ["_id", "ObjectId", "Tự động sinh (Primary Key)", "Mã định danh duy nhất của đơn hàng trong MongoDB."],
        ["username", "String", "required", "Tên đăng nhập của tài khoản khách hàng thực hiện đặt đơn."],
        ["fullName", "String", "required, trim", "Họ và tên đầy đủ của người nhận hàng."],
        ["email", "String", "required, lowercase, trim", "Địa chỉ email nhận thông tin xác nhận hóa đơn."],
        ["phone", "String", "required, trim", "Số điện thoại liên hệ giao hàng của khách."],
        ["address", "String", "required, trim", "Địa chỉ nhận hàng chi tiết."],
        ["note", "String", "default: ''", "Ghi chú thêm về thời gian giao hàng hoặc yêu cầu riêng."],
        ["paymentMethod", "String", "default: 'cod'", "Phương thức thanh toán đã chọn: 'cod', 'bank', 'vnpay'."],
        ["items", "Array [Object]", "Mảng nhúng các mặt hàng", "Danh sách chi tiết các sản phẩm: {id, name, price, qty, lineTotal}."],
        ["total", "Number", "default: 0", "Tổng giá trị thanh toán của toàn bộ đơn hàng (VNĐ)."],
        ["stockDeducted", "Boolean", "default: false", "Cờ nguyên tử đánh dấu đơn hàng đã được trừ kho thành công hay chưa."],
        ["status", "String", "enum: ['pending', 'approved', 'rejected', 'confirmed', 'shipping', 'completed', 'cancelled']", "Trạng thái tiến trình của đơn hàng (mặc định: 'pending')."],
        ["createdAt, updatedAt", "Date", "timestamps: true", "Thời gian đặt hàng và thời gian cập nhật trạng thái gần nhất."]
    ]
    add_table(doc, ord_headers, ord_data, [3.0, 2.5, 5.0, 5.5])

    # User Table
    add_table_title(doc, "Bảng 2.6: Đặc tả chi tiết Schema thực thể User trong MongoDB (models/userModel.js)")
    usr_headers = ["Tên trường (Field)", "Kiểu dữ liệu (BSON)", "Ràng buộc & Quy tắc (Constraints)", "Ý nghĩa và Mô tả nghiệp vụ"]
    usr_data = [
        ["_id", "ObjectId", "Tự động sinh (Primary Key)", "Mã định danh duy nhất của người dùng."],
        ["username", "String", "required, unique: true, minlength: 3", "Tên đăng nhập tài khoản dùng để định danh duy nhất."],
        ["password", "String", "required, minlength: 5", "Mật khẩu người dùng (đã được băm an toàn bằng Bcrypt)."],
        ["role", "String", "enum: ['admin', 'user'], default: 'user'", "Vai trò phân quyền truy cập trong hệ thống."],
        ["fullName", "String", "default: ''", "Họ và tên đầy đủ của chủ tài khoản."],
        ["email", "String", "default: '', lowercase, trim", "Địa chỉ thư điện tử cá nhân."],
        ["phone", "String", "default: ''", "Số điện thoại liên hệ cá nhân."],
        ["createdAt, updatedAt", "Date", "timestamps: true", "Dấu vết thời gian tạo tài khoản và sửa đổi."]
    ]
    add_table(doc, usr_headers, usr_data, [3.0, 2.5, 5.0, 5.5])

    add_body_p(
        doc,
        "Ngoài ra, hệ thống quản lý 02 Collection bổ trợ: (1) `ChatMessage` (`models/chatMessageModel.js`) gồm các trường `username`, `senderRole` ('user'|'admin'), nội dung `text` (max 1000 ký tự), `readByAdmin`, `readByUser`; (2) `Registration` (`models/registrationModel.js`) lưu thông tin tư vấn khách hàng gồm `fullName`, `email`, `username`, `phone`, `interest`, `message`."
    )

    add_heading_3(doc, "2.4.3. Chiến lược lập chỉ mục (Indexing) và toàn vẹn dữ liệu")
    add_body_p(
        doc,
        "Nhằm tăng tốc tối đa tốc độ tìm kiếm và bảo đảm tính duy nhất của dữ liệu, hệ thống thiết lập các chỉ mục trọng yếu:"
    )
    add_bullet_p(doc, "Thiết lập chỉ mục duy nhất trên trường `id` của Product và trường `username` của User, bảo đảm tốc độ truy xuất $O(1)$ và ngăn chặn triệt để dữ liệu trùng lặp ở tầng CSDL.", bold_prefix="Chỉ mục Unique: ")
    add_bullet_p(doc, "Trên Collection `ChatMessage`, thiết lập chỉ mục kép (Compound Index) `{ username: 1, createdAt: 1 }`. Chỉ mục này giúp các truy vấn tải lịch sử hội thoại theo người dùng và sắp xếp theo trình tự thời gian diễn ra với chi phí quét tài liệu tối thiểu.", bold_prefix="Chỉ mục phức hợp (Compound Index): ")

    # ── 2.5. THIẾT KẾ GIAO DIỆN VÀ ĐẶC TẢ API ────────────────
    add_heading_2(doc, "2.5. Thiết kế giao diện, API và các thành phần kỹ thuật cần thiết")
    
    add_heading_3(doc, "2.5.1. Thiết kế Wireframe và Mockup giao diện người dùng trên Figma")
    add_body_p(
        doc,
        "Để bảo đảm tính thẩm mỹ và sự đồng nhất về trải nghiệm thương hiệu xa xỉ, toàn bộ các màn hình giao diện từ trang chủ, danh mục sản phẩm, trang thanh toán đến trang chi tiết đơn hàng đều được thiết kế phác thảo (Wireframe) và tạo bản mẫu trực quan (Mockup) trên công cụ Figma trước khi tiến hành viết mã nguồn. Bản thiết kế Figma được lưu giữ tại Checkpoint 3 (CP3) được minh họa tại Hình 2.6:"
    )

    figma_img = os.path.join(media_dir, "cp3_image1.png")
    add_figure(doc, figma_img, "Hình 2.6: Bản thiết kế giao diện người dùng trên Figma (Nguồn: Checkpoint 3 - CP3)")

    add_heading_3(doc, "2.5.2. Nguyên lý thiết kế giao diện sang trọng (Luxury UX/UI Principles)")
    add_body_p(
        doc,
        "Giao diện Rolex Boutique tuân thủ chặt chẽ 4 nguyên lý thiết kế đặc thù của ngành hàng cao cấp:"
    )
    add_bullet_p(doc, "Sử dụng màu xanh lục hoàng gia Rolex Green (#006039) kết hợp màu vàng cát Everose Gold (#A37E2C) trên nền trắng tinh khiết hoặc xám than (#1C2833), tạo cảm giác lịch lãm và quý phái.", bold_prefix="Bảng màu đặc trưng (Signature Palette): ")
    add_bullet_p(doc, "Hình ảnh đồng hồ được trình bày với kích thước lớn, độ sắc nét cao, loại bỏ các chi tiết đồ họa rườm rà, tạo không gian thoáng đãng (White Space) để cỗ máy cơ khí trở thành tâm điểm của sự chú ý.", bold_prefix="Tôn vinh hình ảnh sản phẩm: ")
    add_bullet_p(doc, "Sử dụng phông chữ có chân thanh lịch cho tiêu đề lớn kết hợp phông không chân chuẩn mực cho văn bản nội dung, bảo đảm tính dễ đọc (Readability) tuyệt đối.", bold_prefix="Kiểu chữ chuẩn mực (Typography): ")
    add_bullet_p(doc, "Tích hợp hiệu ứng lướt cuộn nhẹ nhàng (Parallax scroll), viền thẻ bo góc tinh tế, chuyển động hover mượt mà và thông báo phản hồi dạng Toast kín đáo, không gây gián đoạn luồng thao tác của khách hàng.", bold_prefix="Vi tương tác tinh tế (Micro-interactions): ")

    add_heading_3(doc, "2.5.3. Đặc tả chi tiết danh mục RESTful API của hệ thống")
    add_body_p(
        doc,
        "Hệ thống cung cấp danh mục hơn 25 API chuẩn RESTful, phục vụ giao tiếp giữa React Admin SPA, EJS client và Backend. Bảng 2.7 tổng hợp các API chính được xác minh trực tiếp từ tệp `index.js`:"
    )

    add_table_title(doc, "Bảng 2.7: Danh mục tổng hợp các RESTful API chính của hệ thống Rolex Boutique (index.js)")
    api_headers = ["Phương thức (Method)", "Đường dẫn API (Endpoint)", "Quyền truy cập", "Mô tả chức năng & Xử lý nghiệp vụ chính", "Mã phản hồi HTTP"]
    api_data = [
        ["GET", "/api/auth/check", "Công khai", "Kiểm tra trạng thái phiên đăng nhập, trả về thông tin user nếu hợp lệ.", "200 OK"],
        ["POST", "/api/auth/login", "Công khai", "Xác thực tài khoản (username/password), cấp session cookie rolex.sid.", "200 OK, 401 Unauthorized"],
        ["POST", "/api/auth/logout", "Đã đăng nhập", "Hủy phiên session trên máy chủ, xóa cookie phiên tại trình duyệt client.", "200 OK"],
        ["GET", "/api/products", "Công khai", "Lấy danh sách tất cả sản phẩm đang lưu kho phục vụ hiển thị cửa hàng.", "200 OK"],
        ["GET", "/api/products/:id", "Công khai", "Lấy chi tiết một sản phẩm theo mã tham chiếu id hoặc MongoDB _id.", "200 OK, 404 Not Found"],
        ["POST", "/api/orders", "User đăng nhập", "Tạo đơn hàng mới: kiểm tra hợp lệ, trừ tồn kho nguyên tử, rollback nếu lỗi.", "201 Created, 400, 409"],
        ["GET", "/api/orders", "Admin", "Lấy danh sách toàn bộ các đơn hàng đã đặt trong hệ thống.", "200 OK, 401, 403"],
        ["GET", "/api/orders/:id", "Admin", "Lấy chi tiết mặt hàng, người nhận, tổng tiền của một đơn hàng cụ thể.", "200 OK, 404 Not Found"],
        ["PATCH", "/api/orders/:id/status", "Admin", "Cập nhật trạng thái đơn (Processing, Shipped, Delivered, Cancelled); hoàn kho nếu Cancelled.", "200 OK, 400, 409"],
        ["POST", "/api/orders/:id/tuchoi", "Admin", "Từ chối đơn hàng, tự động khôi phục số lượng tồn kho của các mặt hàng.", "302 Redirect, 401, 403"],
        ["GET", "/api/admin/products", "Admin", "Lấy danh sách sản phẩm kèm trạng thái quản trị phục vụ bảng điều khiển.", "200 OK, 401, 403"],
        ["POST", "/api/products", "Admin", "Tạo sản phẩm mới, kiểm tra trùng mã SKU, lưu vào MongoDB.", "201 Created, 409 Conflict"],
        ["PUT", "/api/products/:id", "Admin", "Cập nhật thông tin, giá bán, tồn kho, bộ sưu tập của sản phẩm theo id.", "200 OK, 404, 409"],
        ["DELETE", "/api/products/:id", "Admin", "Xóa sản phẩm ra khỏi danh mục theo mã tham chiếu id.", "200 OK, 404 Not Found"],
        ["GET", "/api/admin/categories", "Admin", "Tổng hợp danh sách các bộ sưu tập và đếm số lượng sản phẩm mỗi nhóm.", "200 OK, 401, 403"],
        ["GET", "/api/admin/customers", "Admin", "Tổng hợp thông tin khách hàng từ đơn hàng, tính tổng chi tiêu tích lũy.", "200 OK, 401, 403"],
        ["GET", "/api/admin/statistics", "Admin", "Tính toán số liệu điều hành, doanh thu, hàng sắp hết và chuỗi biểu đồ thời gian.", "200 OK, 401, 403"],
        ["GET", "/api/admin/chat/conversations", "Admin", "Lấy danh sách các cuộc hội thoại CSKH, đếm số lượng tin nhắn chưa đọc.", "200 OK, 401, 403"],
        ["GET", "/api/admin/chat/:username", "Admin", "Lấy toàn bộ tin nhắn trao đổi với một khách hàng, đánh dấu đã đọc.", "200 OK, 401, 403"],
        ["POST", "/api/admin/chat/:username", "Admin", "Quản trị viên gửi tin nhắn phản hồi tới khách hàng.", "200 OK, 400 Bad Request"],
        ["GET", "/api/chat/messages", "User đăng nhập", "Khách hàng lấy danh sách tin nhắn hỗ trợ của chính mình.", "200 OK, 401 Unauthorized"],
        ["POST", "/api/chat/messages", "User đăng nhập", "Khách hàng gửi tin nhắn yêu cầu hỗ trợ mới tới quản trị viên.", "200 OK, 400 Bad Request"],
        ["GET", "/api/admin/profile", "Admin", "Lấy thông tin hồ sơ tài khoản quản trị viên hiện tại.", "200 OK, 401 Unauthorized"],
        ["PUT", "/api/admin/profile", "Admin", "Cập nhật họ tên, email, số điện thoại của quản trị viên.", "200 OK, 400 Bad Request"],
        ["PUT", "/api/admin/profile/password", "Admin", "Đổi mật khẩu tài khoản quản trị (xác thực mật khẩu cũ bằng Bcrypt).", "200 OK, 400, 401"]
    ]
    add_table(doc, api_headers, api_data, [1.8, 3.5, 2.2, 6.5, 2.0])

    doc.add_page_break()
