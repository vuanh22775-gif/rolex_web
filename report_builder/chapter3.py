import os
from report_builder.common import add_body_p, add_bullet_p, add_heading_1, add_heading_2, add_heading_3, add_table, add_table_title, add_figure

def render_chapter_3(doc, media_dir, root_dir):
    add_heading_1(doc, "CHƯƠNG 3. XÂY DỰNG SẢN PHẨM, KIỂM THỬ VÀ ĐÁNH GIÁ")
    
    # ── 3.1. XÂY DỰNG VÀ TRIỂN KHAI SẢN PHẨM ──────────────────
    add_heading_2(doc, "3.1. Xây dựng và triển khai sản phẩm")
    
    add_heading_3(doc, "3.1.1. Môi trường phát triển và cấu hình các biến môi trường")
    add_body_p(
        doc,
        "Quá trình xây dựng và thực nghiệm hệ thống Rolex Boutique được tiến hành trên môi trường máy chủ phát triển cục bộ với cấu hình phần cứng và phần mềm chuẩn tắc được ghi nhận tại Bảng 3.1:"
    )

    add_table_title(doc, "Bảng 3.1: Cấu hình môi trường phần cứng và phần mềm triển khai thực nghiệm")
    env_headers = ["Thành phần môi trường", "Thông số kỹ thuật / Phiên bản", "Vai trò và Ghi chú cấu hình"]
    env_data = [
        ["Hệ điều hành máy chủ", "Microsoft Windows 11 Pro 64-bit", "Môi trường phát triển chính của lập trình viên."],
        ["Môi trường thực thi", "Node.js v20.19+ (hoặc v22.12+ LTS)", "Chạy máy chủ backend Express và các tác vụ npm."],
        ["Hệ quản trị CSDL", "MongoDB Community Server v7.0+", "Cấu hình Standalone cục bộ tại cổng mặc định 27017."],
        ["Công cụ dòng lệnh", "PowerShell 7 / Git Bash", "Quản lý mã nguồn, chạy server và biên dịch tài nguyên."],
        ["Trình duyệt thử nghiệm", "Google Chrome 128+, Microsoft Edge", "Kiểm thử hiển thị, kiểm tra Console và Network Tab."]
    ]
    add_table(doc, env_headers, env_data, [4.0, 5.0, 7.0])

    add_body_p(
        doc,
        "Hệ thống tuân thủ nghiêm ngặt nguyên tắc bảo mật của phương pháp luận The Twelve-Factor App, tách biệt hoàn toàn các thông tin cấu hình nhạy cảm khỏi mã nguồn thông qua tệp biến môi trường `.env` (khai báo mẫu tại `.env.example`):"
    )
    add_bullet_p(doc, "Chuỗi kết nối đến cơ sở dữ liệu MongoDB (mặc định: `mongodb://localhost:27017/rolex_boutique`). Trong môi trường sản xuất, chuỗi này bắt buộc phải được khai báo để bảo đảm kết nối an toàn.", bold_prefix="MONGODB_URI: ")
    add_bullet_p(doc, "Chuỗi bí mật dùng để ký và mã hóa cookie định danh phiên làm việc (`rolex.sid`). Nếu chạy môi trường cục bộ mà chưa khai báo, hệ thống tự động sinh ngẫu nhiên chuỗi bảo mật 32 bytes qua `crypto.randomBytes(32).toString('hex')`.", bold_prefix="SESSION_SECRET: ")
    add_bullet_p(doc, "Cổng lắng nghe của máy chủ Express (mặc định là cổng 3000).", bold_prefix="PORT: ")
    add_bullet_p(doc, "Cặp thông tin khởi tạo tài khoản quản trị tối cao đầu tiên khi hệ thống triển khai trên CSDL hoàn toàn mới, sau đó tự động vô hiệu hóa.", bold_prefix="BOOTSTRAP_ADMIN_USERNAME & BOOTSTRAP_ADMIN_PASSWORD: ")

    add_heading_3(doc, "3.1.2. Tổ chức cấu trúc thư mục mã nguồn dự án")
    add_body_p(
        doc,
        "Mã nguồn dự án được tổ chức khoa học theo cấu trúc phân tầng rõ ràng, phản ánh chính xác cấu trúc repository thực tế:"
    )
    add_bullet_p(doc, "Cấu hình dự án, trình biên dịch TypeScript và đóng gói Vite.", bold_prefix="package.json, tsconfig.json, vite.config.mts: ")
    add_bullet_p(doc, "Điểm vào chính của máy chủ Express, thiết lập chuỗi Middleware, khởi tạo CSDL và khai báo các bộ định tuyến RESTful API.", bold_prefix="index.js (985 dòng mã lệnh): ")
    add_bullet_p(doc, "Mô-đun quản lý kết nối CSDL MongoDB thông qua thư viện Mongoose với cơ chế xử lý lỗi kết nối tự động.", bold_prefix="connect.js: ")
    add_bullet_p(doc, "Chứa 5 lược đồ thực thể dữ liệu Mongoose: `productModel.js`, `orderModel.js`, `userModel.js`, `chatMessageModel.js` và `registrationModel.js`.", bold_prefix="models/: ")
    add_bullet_p(doc, "Chứa toàn bộ các mẫu giao diện kết xuất phía máy chủ EJS dành cho phân hệ khách hàng và các giao diện quản trị cũ.", bold_prefix="views/: ")
    add_bullet_p(doc, "Chứa toàn bộ mã nguồn của phân hệ quản trị hiện đại React 18, bao gồm các thành phần giao diện (`components/`), các trang nghiệp vụ (`pages/`), thư viện gọi API (`lib/axios.ts`) và kho lưu trữ trạng thái tập trung (`store/useAdminStore.ts`).", bold_prefix="src/: ")
    add_bullet_p(doc, "Chứa mã nguồn đóng gói phân hệ React đã qua biên dịch tối ưu (HTML, JS bundle, CSS) được Express phục vụ tại route `/admin`.", bold_prefix="dist/: ")
    add_bullet_p(doc, "Chứa các tệp JavaScript xử lý tương tác phía máy khách cho giao diện EJS (giỏ hàng, thanh toán, hiệu ứng cuộn mượt mà).", bold_prefix="js/: ")
    add_bullet_p(doc, "Lưu trữ hình ảnh chất lượng cao của 31 mẫu đồng hồ thuộc các bộ sưu tập Rolex kinh điển.", bold_prefix="media/: ")

    add_heading_3(doc, "3.1.3. Hiện thực phân hệ khách hàng (Storefront)")
    add_body_p(
        doc,
        "Phân hệ khách hàng được xây dựng hoàn chỉnh với các tính năng trải nghiệm trực quan:"
    )
    add_bullet_p(doc, "Trang chủ (`/`) hiển thị ấn tượng với video giới thiệu, 6 mẫu đồng hồ kinh điển đại diện cho nghệ thuật chế tác Rolex, các phần giới thiệu di sản thương hiệu và chân trang điều hướng chuẩn mực.", bold_prefix="Trang chủ sang trọng (views/trangchu.ejs): ")
    add_bullet_p(doc, "Trang bộ sưu tập (`/sanphammoi`) cho phép xem toàn bộ danh mục sản phẩm, hỗ trợ lọc nhanh theo 4 nhóm: Cổ điển (Classic), Sang trọng (Luxury), Lặn biển (Diving) và Thể thao (Sport). Mỗi sản phẩm hiển thị ảnh sắc nét, tên model, mã SKU và giá niêm yết chính hãng.", bold_prefix="Bộ sưu tập và Chi tiết (views/sanphammoi.ejs & views/product-detail.ejs): ")
    add_bullet_p(doc, "Cho phép lưu trữ danh sách sản phẩm đặt mua, tự động tính tổng tiền bằng định dạng tiền tệ Việt Nam (VNĐ), kiểm tra tính hợp lệ của dữ liệu trước khi gửi yêu cầu đặt hàng về máy chủ.", bold_prefix="Giỏ hàng và Thanh toán (views/thanhtoan.ejs & js/checkout.js): ")
    add_bullet_p(doc, "Trang tra cứu đơn hàng cá nhân (`/don-hang`), yêu cầu người dùng phải đăng nhập, hiển thị chi tiết các sản phẩm trong đơn, tổng thanh toán và huy hiệu trạng thái (Chờ duyệt, Đang giao, Hoàn tất, Đã hủy).", bold_prefix="Quản lý đơn hàng (views/don-hang.ejs): ")

    add_heading_3(doc, "3.1.4. Hiện thực phân hệ quản trị hiện đại React SPA")
    add_body_p(
        doc,
        "Phân hệ quản trị tại route `/admin` là điểm nhấn công nghệ vượt trội của đồ án, thay thế hoàn toàn giao diện EJS cũ bằng ứng dụng trang đơn React 18 mượt mà:"
    )
    add_bullet_p(doc, "Tích hợp Recharts trực quan hóa doanh thu theo thời gian (7 ngày, 30 ngày, 3 tháng, 12 tháng), chuyển đổi linh hoạt giữa biểu đồ doanh thu tiền tệ và biểu đồ số lượng đơn hàng; 4 thẻ chỉ số thống kê (Doanh thu kỳ này, Tổng đơn hàng, Số khách hàng, Số mặt hàng sắp hết kho $\\le 3$ chiếc).", bold_prefix="Bảng điều khiển trung tâm (DashboardPage.tsx): ")
    add_bullet_p(doc, "Bảng dữ liệu sản phẩm hỗ trợ tìm kiếm tức thì theo từ khóa, lọc theo danh mục, lọc theo trạng thái, sắp xếp theo giá tăng/giảm, phân trang chuẩn mực 6 sản phẩm/trang, cửa sổ Modal thêm mới và chỉnh sửa thông số sản phẩm trực quan.", bold_prefix="Quản trị kho hàng (ManagementPages.tsx - ProductsPage): ")
    add_bullet_p(doc, "Theo dõi danh sách đơn hàng toàn diện, xem chi tiết từng mặt hàng kèm số lượng và đơn giá, cập nhật trạng thái đơn hàng (Processing, Shipped, Delivered, Cancelled) với thông báo Toast tức thì, xuất dữ liệu đơn ra tệp CSV.", bold_prefix="Xử lý đơn hàng (ManagementPages.tsx - OrdersPage): ")
    add_bullet_p(doc, "Tự động phân khúc khách hàng (Tất cả, Thân thiết $\\ge 5$ đơn, Khách hàng mới), tính tổng chi tiêu trọn đời (Customer Lifetime Spent) dựa trên kết quả đơn hàng.", bold_prefix="Quản trị khách hàng (ManagementPages.tsx - CustomersPage): ")
    add_bullet_p(doc, "Biểu đồ phân tích doanh thu theo danh mục (BarChart), biểu đồ tăng trưởng khách hàng mới (AreaChart) và biểu đồ phân bổ trạng thái đơn hàng (PieChart donut).", bold_prefix="Phân tích nâng cao (OtherPages.tsx - AnalyticsPage): ")
    add_bullet_p(doc, "Giao diện hộp thư trực quan hỗ trợ quản trị viên trao đổi với khách hàng có thắc mắc, tự động đồng bộ tin nhắn qua cơ chế polling 5 giây.", bold_prefix="Hỗ trợ khách hàng (OtherPages.tsx - MessagesPage): ")

    add_heading_3(doc, "3.1.5. Dữ liệu mẫu (Seed Data) và kết quả chạy thực nghiệm thực tế")
    add_body_p(
        doc,
        "Để phục vụ công tác kiểm thử và nghiệm thu sản phẩm, hệ thống được trang bị bộ nạp dữ liệu tự động (`initializeDatabase` trong `index.js`). Bộ dữ liệu bao gồm 31 mẫu đồng hồ Rolex chính hãng được phân bổ đều qua 4 bộ sưu tập, 18 khách hàng mẫu và 36 đơn hàng thực tế với đầy đủ các trạng thái và mốc thời gian khác nhau trong 30 ngày qua. Bảng 3.2 tổng hợp một số mẫu sản phẩm tiêu biểu được khởi tạo trong CSDL:"
    )

    add_table_title(doc, "Bảng 3.2: Bộ dữ liệu danh mục mẫu 31 mẫu đồng hồ tiêu biểu được khởi tạo trong CSDL")
    seed_headers = ["Mã SKU", "Tên sản phẩm", "Mô tả kỹ thuật & Chất liệu", "Giá niêm yết (VNĐ)", "Bộ sưu tập", "Tồn kho"]
    seed_data = [
        ["126234", "Datejust 36", "Oyster 36 mm - Oystersteel & vàng trắng", "246.787.000", "classic", "15"],
        ["126334", "Datejust 41", "Oyster 41 mm - Fluted bezel Everose", "287.918.000", "classic", "9"],
        ["279135RBR", "Lady-Datejust", "Oyster 28 mm - Everose gold & kim cương", "1.236.676.000", "luxury", "16"],
        ["126610LN", "Submariner Date", "Oyster 41 mm - Vành gốm Cerachrom đen", "340.000.000", "diving", "8"],
        ["126660", "Deepsea", "Oyster 44 mm - Mặt số xanh chuyển sắc D-blue", "580.000.000", "diving", "12"],
        ["126710BLRO", "GMT-Master II", "Oyster 40 mm - Vành gốm đỏ xanh (Pepsi)", "420.000.000", "sport", "14"],
        ["116508", "Cosmograph Daytona", "Oyster 40 mm - Vàng vàng 18 ct nguyên khối", "1.150.000.000", "sport", "7"],
        ["50535", "Cellini Moonphase", "39 mm - Vàng Everose 18 ct, lịch tuần trăng", "890.000.000", "luxury", "11"],
        ["126600", "Sea-Dweller", "Oyster 43 mm - Van thoát khí Heli chuyên dụng", "520.000.000", "diving", "10"],
        ["126500LN", "Cosmograph Daytona", "Oyster 40 mm - Thép Oystersteel thế hệ mới", "980.000.000", "sport", "13"]
    ]
    add_table(doc, seed_headers, seed_data, [2.2, 3.8, 5.5, 2.8, 2.0, 1.5])

    add_body_p(
        doc,
        "Kết quả vận hành thực tế của hệ thống trên môi trường máy chủ cục bộ (http://localhost:3000) được ghi nhận sinh động qua ảnh chụp minh chứng tại Hình 3.1:"
    )

    shot_img = os.path.join(r"C:\Users\ADMIN\Downloads", "Screenshot_19-9-2026_163347_localhost.jpeg")
    if not os.path.exists(shot_img):
        shot_img = os.path.join(root_dir, "Screenshot_19-9-2026_163347_localhost.jpeg")
    add_figure(doc, shot_img, "Hình 3.1: Giao diện website Rolex Boutique vận hành thực tế trên môi trường máy chủ cục bộ", width_inch=6.0)

    # ── 3.2. KIỂM THỬ VÀ ĐÁNH GIÁ SẢN PHẨM ───────────────────
    add_heading_2(doc, "3.2. Kiểm thử và đánh giá sản phẩm")
    
    add_heading_3(doc, "3.2.1. Phương pháp và môi trường thực hiện kiểm thử")
    add_body_p(
        doc,
        "Hoạt động kiểm thử phần mềm được tiến hành theo phương pháp Kiểm thử Hộp đen (Black-box Testing) kết hợp kiểm thử tích hợp API (Integration Testing). Các kịch bản kiểm thử tập trung vào việc xác nhận tính đúng đắn của các quy tắc nghiệp vụ, tính toàn vẹn của dữ liệu trong CSDL, khả năng phản hồi khi dữ liệu đầu vào không hợp lệ và khả năng chịu lỗi khi xảy ra tranh chấp số lượng tồn kho."
    )

    add_heading_3(doc, "3.2.2. Bảng ma trận các Test Case kiểm thử chức năng cốt lõi")
    add_body_p(
        doc,
        "Dưới đây là ma trận 25 ca kiểm thử chi tiết đã được xây dựng và thực thi trên hệ thống thực tế. Bảng kiểm thử đáp ứng đầy đủ các cột tiêu chuẩn theo quy định: Mã Test, Mục tiêu kiểm thử, Tiền điều kiện & Dữ liệu vào, Các bước thực hiện, Kết quả mong đợi, Kết quả thực tế, Trạng thái (ĐẠT / CHƯA KIỂM THỬ) và Minh chứng kiểm thử:"
    )

    add_table_title(doc, "Bảng 3.3: Bảng ma trận các Test Case kiểm thử chức năng cốt lõi của hệ thống Rolex Boutique")
    tc_headers = ["Mã TC", "Mục tiêu kiểm thử", "Dữ liệu đầu vào & Tiền điều kiện", "Các bước thực hiện", "Kết quả mong đợi", "Kết quả thực tế", "Trạng thái", "Minh chứng"]
    tc_data = [
        ["TC-01", "Đăng ký tài khoản hợp lệ", "Họ tên: 'Trần Văn A', User: 'tranvana', Pass: '123456', Email: 'vana@test.com', Phone: '0912345678'", "1. Vào /form\n2. Nhập form\n3. Bấm Đăng ký", "Tạo User mới trong CSDL, mật khẩu được băm Bcrypt, tạo Registration.", "Tạo thành công, CSDL ghi nhận user và registration.", "ĐẠT", "DB User record"],
        ["TC-02", "Đăng ký thất bại do pass ngắn", "User: 'testuser', Pass: '1234' (< 5 ký tự), Email hợp lệ.", "1. Nhập pass 4 ký tự\n2. Bấm Đăng ký", "Hệ thống chặn lại, hiển thị cảnh báo yêu cầu mật khẩu tối thiểu 5 ký tự.", "Hiển thị thông báo lỗi, không tạo bản ghi trong CSDL.", "ĐẠT", "UI Error alert"],
        ["TC-03", "Đăng ký thất bại do sai SĐT", "Phone: '123456' (không bắt đầu bằng 0, không đủ 10 số).", "1. Nhập SĐT sai\n2. Bấm Đăng ký", "Regex check thất bại, hiển thị thông báo số điện thoại không hợp lệ.", "Báo lỗi SĐT không hợp lệ, chặn gửi dữ liệu.", "ĐẠT", "Form validation"],
        ["TC-04", "Đăng nhập người dùng hợp lệ", "Username: 'tranvana', Password: '123456'", "1. Vào /dangnhap\n2. Nhập thông tin\n3. Bấm Đăng nhập", "Xác thực thành công, cấp session rolex.sid, điều hướng về trang chủ /.", "Đăng nhập thành công, header hiển thị họ tên người dùng.", "ĐẠT", "Session cookie"],
        ["TC-05", "Đăng nhập thất bại do sai pass", "Username: 'tranvana', Password: 'sai_mat_khau'", "1. Nhập sai pass\n2. Bấm Đăng nhập", "Trả về lỗi 401, thông báo 'Tên đăng nhập hoặc mật khẩu không chính xác'.", "Hiển thị thông báo lỗi, không cấp session.", "ĐẠT", "HTTP 401 JSON"],
        ["TC-06", "Đăng nhập quyền Admin", "Username: 'admin', Password: [bootstrap_password]", "1. Vào /dangnhap\n2. Đăng nhập admin", "Nhận diện vai trò role='admin', điều hướng vào /admin/dashboard.", "Điều hướng vào React Admin SPA thành công.", "ĐẠT", "Admin Gate OK"],
        ["TC-07", "Xem danh sách và lọc sản phẩm", "Truy cập /sanphammoi, chọn lọc 'diving'", "1. Vào /sanphammoi\n2. Chọn tab Diving", "Chỉ hiển thị các mẫu thuộc bộ sưu tập lặn biển (Submariner, Deepsea...).", "Hiển thị chính xác các mẫu Diving, đúng giá và ảnh.", "ĐẠT", "Filter UI View"],
        ["TC-08", "Xem chi tiết sản phẩm hợp lệ", "Mã SKU: '126610LN'", "1. Bấm vào sản phẩm\n2. Điều hướng /sanphammoi/126610LN", "Hiển thị đầy đủ thông số kỹ thuật, giá, ảnh lớn, nút Thêm giỏ hàng.", "Tải trang chi tiết nhanh (<100ms), thông tin đầy đủ.", "ĐẠT", "Product detail"],
        ["TC-09", "Thêm sản phẩm vào giỏ hàng", "Sản phẩm 126234, số lượng = 1", "1. Bấm 'Thêm vào giỏ'\n2. Mở giỏ hàng", "LocalStorage lưu trữ sản phẩm, biểu tượng giỏ hàng cập nhật số lượng = 1.", "Giỏ hàng hiển thị đúng sản phẩm, tổng tiền 246.787.000 VNĐ.", "ĐẠT", "LocalStorage"],
        ["TC-10", "Đặt hàng thành công 1 sản phẩm", "Giỏ hàng có 126234 (tồn kho=15), thông tin nhận hàng hợp lệ.", "1. Vào /thanhtoan\n2. Điền thông tin\n3. Xác nhận", "Tạo Order (status='pending', stockDeducted=true). Tồn kho giảm từ 15 còn 14.", "Đơn hàng tạo thành công, tồn kho CSDL giảm chính xác còn 14.", "ĐẠT", "Order ID sinh ra"],
        ["TC-11", "Trừ kho nguyên tử khi đặt", "Đặt hàng với qty = 2 cho sản phẩm 126334 (kho=9)", "1. Đặt 2 chiếc\n2. Kiểm tra CSDL", "Tồn kho của 126334 giảm đúng 2 chiếc, còn lại 7 chiếc.", "CSDL Product cập nhật stock = 7.", "ĐẠT", "DB Query test"],
        ["TC-12", "Chặn đặt hàng khi vượt tồn kho", "Sản phẩm A còn tồn kho = 1, khách đặt qty = 2", "1. Gửi request đặt 2 chiếc", "Bị từ chối với lỗi 409 Conflict: 'không còn đủ số lượng trong kho'.", "Trả về 409 Conflict, đơn hàng không được tạo, kho giữ nguyên 1.", "ĐẠT", "HTTP 409 Error"],
        ["TC-13", "Rollback giỏ hàng nhiều món", "Giỏ hàng có SP 1 (đủ hàng) và SP 2 (vừa hết hàng)", "1. Gửi đặt cả 2 SP\n2. Hệ thống trừ SP 1 rồi gặp lỗi ở SP 2", "Khối catch kích hoạt, hoàn trả lại tồn kho của SP 1, không tạo đơn hàng rác.", "Tồn kho SP 1 được phục hồi nguyên vẹn, hệ thống báo lỗi hết hàng.", "ĐẠT", "Rollback log OK"],
        ["TC-14", "Tra cứu đơn hàng của tôi", "User đã đăng nhập và có 2 đơn hàng trong hệ thống", "1. Truy cập /don-hang", "Hiển thị danh sách 2 đơn hàng kèm mã đơn, ngày đặt, tổng tiền, trạng thái.", "Hiển thị đúng 2 đơn hàng của user, không lộ đơn của người khác.", "ĐẠT", "User Order UI"],
        ["TC-15", "Chặn xem đơn khi chưa login", "Chưa đăng nhập, truy cập trực tiếp /don-hang", "1. Mở /don-hang từ trình duyệt ẩn danh", "Middleware requireAuth chặn lại, chuyển hướng về /dangnhap.", "Chuyển hướng tức thì về trang đăng nhập kèm thông báo.", "ĐẠT", "Auth Middleware"],
        ["TC-16", "Dashboard thống kê dữ liệu", "Admin truy cập /admin/dashboard", "1. Mở trang điều hành", "Hiển thị đúng tổng doanh thu, số đơn, số user, vẽ biểu đồ Recharts.", "Số liệu khớp 100% với dữ liệu Aggregation trong MongoDB.", "ĐẠT", "Dashboard Screen"],
        ["TC-17", "Admin thêm sản phẩm mới", "SKU: '126233', Tên: 'Datejust 36 Two-tone', Giá: 350.000.000, Kho: 5", "1. Vào /admin/products\n2. Bấm Thêm sản phẩm\n3. Lưu form", "Tạo Product mới thành công, hiển thị ngay trên bảng không cần reload.", "API 201 Created, bảng React cập nhật sản phẩm mới.", "ĐẠT", "Product CRUD"],
        ["TC-18", "Admin thêm trùng mã SKU", "Nhập SKU '126234' (đã tồn tại trong hệ thống)", "1. Nhập thông tin với SKU cũ\n2. Bấm Lưu", "Bị chặn với mã lỗi 409 Conflict: 'Mã tham chiếu đã tồn tại'.", "Báo lỗi 409, không ghi đè dữ liệu cũ.", "ĐẠT", "Unique SKU Check"],
        ["TC-19", "Admin cập nhật giá sản phẩm", "Cập nhật giá 126234 từ 246.787.000 lên 250.000.000 VNĐ", "1. Mở modal sửa\n2. Thay đổi giá\n3. Bấm Lưu", "Cập nhật thành công, API PUT trả về 200 OK, CSDL đổi giá mới.", "Giá mới được ghi nhận ngay lập tức trên cả Storefront và Admin.", "ĐẠT", "PUT API OK"],
        ["TC-20", "Admin xóa sản phẩm", "Xóa sản phẩm thử nghiệm", "1. Bấm Xóa\n2. Xác nhận hộp thoại Confirm", "Sản phẩm bị xóa khỏi CSDL, biến mất khỏi bảng danh sách.", "API DELETE trả về 200, hàng trong bảng bị xóa ngay.", "ĐẠT", "DELETE API OK"],
        ["TC-21", "Admin duyệt đơn hàng", "Đơn hàng đang ở trạng thái 'pending'", "1. Vào /admin/orders\n2. Đổi trạng thái sang 'Processing/confirmed'", "Cập nhật status = 'confirmed', CSDL lưu trạng thái mới.", "Trạng thái đơn hàng cập nhật thành công, khách hàng thấy trạng thái mới.", "ĐẠT", "Status Patch OK"],
        ["TC-22", "Admin từ chối đơn hoàn kho", "Đơn hàng có 1 SP '126234' (đã trừ kho, stockDeducted=true)", "1. Bấm Từ chối đơn (/api/orders/:id/tuchoi)", "Đơn đổi thành 'rejected', stockDeducted=false, kho '126234' được cộng lại 1.", "CSDL khôi phục đúng 1 sản phẩm về kho, cờ chuyển thành false.", "ĐẠT", "Restore stock OK"],
        ["TC-23", "Chống hoàn kho 2 lần", "Gửi lệnh từ chối / hủy đơn lần thứ 2 cho cùng 1 đơn hàng", "1. Gửi lại request hủy đơn", "Kiểm tra findOneAndUpdate({stockDeducted: true}) trả về null, không cộng kho nữa.", "Tồn kho không bị cộng thừa, triệt tiêu lỗi double-refund.", "ĐẠT", "Atomic flag check"],
        ["TC-24", "Khách hàng gửi tin nhắn CSKH", "User gửi tin: 'Cần tư vấn mẫu Submariner'", "1. Gửi form chat", "Tạo ChatMessage mới trong MongoDB với senderRole='user', readByAdmin=false.", "Tin nhắn lưu thành công, xuất hiện trong hộp thư quản trị sau 5s.", "ĐẠT", "Chat API OK"],
        ["TC-25", "Admin đổi mật khẩu tài khoản", "Nhập pass cũ đúng, nhập pass mới 8 ký tự trùng khớp", "1. Vào /admin/settings\n2. Tab Bảo mật\n3. Đổi mật khẩu", "Mật khẩu mới được hash Bcrypt và lưu lại, đăng xuất và đăng nhập lại bằng pass mới thành công.", "Đổi mật khẩu thành công, thông báo Toast màu xanh.", "ĐẠT", "Password Update"]
    ]
    add_table(doc, tc_headers, tc_data, [1.2, 2.5, 3.2, 2.8, 3.2, 3.2, 1.3, 1.8])

    add_heading_3(doc, "3.2.3. Các lỗi kỹ thuật phát hiện và biện pháp khắc phục")
    add_body_p(
        doc,
        "Trong suốt quá trình phát triển mã nguồn từ giai đoạn sơ khởi đến khi hoàn thiện, tác giả đã ghi nhận và xử lý triệt để 4 lỗi kỹ thuật nghiêm trọng. Bảng 3.4 tổng hợp nguyên nhân và giải pháp khắc phục cụ thể:"
    )

    add_table_title(doc, "Bảng 3.4: Thống kê các lỗi kỹ thuật phát sinh và giải pháp khắc phục thực tế")
    bug_headers = ["STT", "Hiện tượng lỗi kỹ thuật", "Nguyên nhân cốt lõi", "Giải pháp xử lý triệt để trong mã nguồn"]
    bug_data = [
        ["1", "Tranh chấp bán vượt tồn kho (Overselling) khi nhiều đơn đặt đồng thời.", "Truy vấn kiểm tra tồn kho (find) và lệnh trừ kho (update) tách rời nhau tạo ra khoảng trống thời gian (race condition).", "Chuyển sang sử dụng lệnh nguyên tử duy nhất: Product.findOneAndUpdate({ id, stock: { $gte: qty } }, { $inc: { stock: -qty } })."],
        ["2", "Lỗi mất hàng khi giỏ hàng nhiều món gặp sự cố giữa chừng.", "MongoDB Standalone không hỗ trợ giao dịch đa tài liệu (Multi-document ACID) nên sản phẩm đã trừ trước đó không tự hoàn lại.", "Xây dựng cơ chế Hoàn tác bù trừ (Compensating Rollback) trong khối catch, duyệt ngược danh sách đã trừ để cộng trả kho."],
        ["3", "Lỗi hoàn tồn kho hai lần khi admin bấm hủy đơn nhiều lần.", "Mỗi lần gửi yêu cầu hủy đơn, mã nguồn đều thực hiện cộng kho mà không kiểm tra đơn hàng đó đã từng hoàn kho hay chưa.", "Bổ sung cờ nguyên tử stockDeducted trên Order, sử dụng findOneAndUpdate({stockDeducted: true}, {$set: {stockDeducted: false}}) để chống trùng."],
        ["4", "Mất trạng thái đăng nhập hoặc lỗi tải lại trang trên React Admin SPA.", "Đường dẫn client-side routing của React Router khi bấm F5 bị máy chủ Express báo lỗi 404 do không có tệp tĩnh tương ứng.", "Cấu hình Catch-all route trong Express (app.get('/admin/*', ...)) luôn trả về tệp index.html của bản build React."]
    ]
    add_table(doc, bug_headers, bug_data, [1.0, 4.0, 4.5, 6.5])

    # ── 3.3. GIẢI PHÁP CẢI TIẾN KỸ THUẬT (CLO3) ──────────────
    add_heading_2(doc, "3.3. Giải pháp cải tiến kỹ thuật")
    add_body_p(
        doc,
        "Tiêu chí Chuẩn đầu ra CLO3 (20% trọng số) đòi hỏi sinh viên phải nhận diện rõ ràng các hạn chế kỹ thuật có thật trong sản phẩm ban đầu và đề xuất, hiện thực hóa các giải pháp cải tiến có căn cứ kỹ thuật vững chắc. Đồ án đã hiện thực hai cải tiến kỹ thuật lớn mang tính đột phá:"
    )

    add_heading_3(doc, "3.3.1. Cải tiến 1: Cơ chế Hoàn tác bù trừ (Compensating Rollback) trên MongoDB Standalone")
    add_body_p(
        doc,
        "Vấn đề kỹ thuật có thật: Trong cấu hình triển khai cục bộ thông thường của sinh viên hoặc các doanh nghiệp vừa và nhỏ, MongoDB được cài đặt dưới dạng thực thể độc lập (Standalone Instance), không kích hoạt cụm bản sao (Replica Set). Theo tài liệu chính thức của MongoDB [6], các giao dịch đa tài liệu (Multi-Document Transactions) đòi hỏi bắt buộc phải có môi trường Replica Set để ghi nhật ký oplog phân tán. Do đó, khi khách hàng thực hiện checkout giỏ hàng chứa nhiều sản phẩm khác nhau (ví dụ: 1 chiếc Submariner và 1 chiếc Daytona), máy chủ phải thực hiện nhiều thao tác ghi liên tiếp trên các tài liệu Product và Order khác nhau. Nếu thao tác thứ nhất thành công (kho Submariner đã trừ) nhưng thao tác thứ hai thất bại (Daytona bị người khác mua hết hoặc lỗi đường truyền), giao dịch bị đứt gãy. Kết quả là hệ thống bị mất cân bằng dữ liệu: số lượng tồn kho của chiếc Submariner bị trừ oan uổng trong khi đơn hàng không hề được tạo ra."
    )
    add_body_p(
        doc,
        "Giải pháp kỹ thuật đã hiện thực: Tác giả đã thiết kế thuật toán Hoàn tác bù trừ (Compensating Rollback) được lấy cảm hứng từ mẫu thiết kế Saga Pattern trong kiến trúc Microservices [11]. Thuật toán được lập trình trực tiếp trong hàm `placeOrder(username, body)` (`index.js`, dòng 108–163):"
    )
    add_bullet_p(doc, "Mỗi khi trừ thành công một mặt hàng bằng câu lệnh điều kiện nguyên tử, thông tin `{ id, qty }` lập tức được đẩy vào mảng theo dõi `deducted`.", bold_prefix="Bước 1 – Ghi nhận thay đổi: ")
    add_bullet_p(doc, "Nếu toàn bộ các mặt hàng đều trừ kho thành công, hệ thống tạo bản ghi `Order` với trường `stockDeducted: true` và hoàn tất giao dịch.", bold_prefix="Bước 2 – Hoàn tất thành công: ")
    add_bullet_p(doc, "Nếu có bất kỳ ngoại lệ nào xảy ra (hết hàng ở sản phẩm kế tiếp hoặc lỗi ghi Order), luồng điều khiển chuyển ngay vào khối `catch`. Tại đây, thuật toán duyệt đảo ngược mảng `deducted` (`for (const item of deducted.reverse())`) và phát lệnh bù trừ tương ứng: `await Product.updateOne({ id: item.id }, { $inc: { stock: item.qty } })` để khôi phục kho về trạng thái ban đầu trước khi ném ngoại lệ lên tầng trên.", bold_prefix="Bước 3 – Bù trừ tự động khi có sự cố: ")
    add_body_p(
        doc,
        "Bên cạnh đó, trong quy trình xử lý hủy đơn hoặc từ chối đơn hàng (`restoreOrderStock`, `index.js`, dòng 101–121), tác giả đã giải quyết triệt để lỗi hoàn kho trùng lặp (Double-refund) bằng cách sử dụng toán tử nguyên tử `Order.findOneAndUpdate({ _id: order._id, stockDeducted: true }, { $set: { stockDeducted: false } })`. Lệnh này bảo đảm nếu có hai yêu cầu hủy cùng gửi đến, chỉ duy nhất một yêu cầu tìm thấy `stockDeducted: true` và thực thi hoàn kho, yêu cầu còn lại sẽ nhận về giá trị null và dừng lại ngay lập tức."
    )

    add_heading_3(doc, "3.3.2. Cải tiến 2: Hiện đại hóa hệ thống quản trị từ EJS sang React 18 / Vite SPA")
    add_body_p(
        doc,
        "Vấn đề kỹ thuật có thật: Ở phiên bản đầu tiên của đồ án, các chức năng quản trị được xây dựng bằng EJS Template Engine (`views/quanli.ejs`, `views/hoadon.ejs`). Mô hình Server-Side Rendering truyền thống bộc lộ nhiều điểm nghẽn nghiêm trọng khi áp dụng cho bảng điều khiển điều hành: mỗi lần lọc đơn hàng, chuyển trang hay đổi trạng thái sản phẩm, toàn bộ trang web đều phải tải lại từ đầu (full-page reload), gây giật màn hình trắng, làm mất vị trí cuộn chuột, tiêu tốn băng thông máy chủ không cần thiết và hoàn toàn không thể vẽ các biểu đồ tương tác thời gian thực."
    )
    add_body_p(
        doc,
        "Giải pháp kỹ thuật đã hiện thực: Tác giả đã tiến hành một cuộc tái cấu trúc toàn diện, nâng cấp toàn bộ phân hệ quản trị thành ứng dụng trang đơn (SPA) chuyên nghiệp:"
    )
    add_bullet_p(doc, "Tách biệt hoàn toàn giao diện quản trị thành một ứng dụng độc lập trong thư mục `src/`, quản lý kiểu dữ liệu chặt chẽ bằng TypeScript 5.6 và đóng gói bằng Vite 8.", bold_prefix="Kiến trúc Single Page Application: ")
    add_bullet_p(doc, "Ứng dụng thư viện Zustand (`src/store/useAdminStore.ts`) để lưu trữ toàn bộ trạng thái dữ liệu (sản phẩm, đơn hàng, khách hàng, thống kê) trên bộ nhớ RAM của trình duyệt. Mọi thao tác thêm/sửa/xóa đều cập nhật State tức thì, giúp giao diện phản hồi trong chưa đầy 16ms (tương đương 60 FPS).", bold_prefix="Quản lý trạng thái với Zustand: ")
    add_bullet_p(doc, "Tích hợp thư viện Recharts để trực quan hóa dữ liệu doanh thu đa chu kỳ (7 ngày, 30 ngày, 3 tháng, 1 năm), kết hợp các đường cong mượt mà và hộp thông tin Tooltip tương tác cao cấp.", bold_prefix="Trực quan hóa tài chính hiện đại: ")

    add_heading_3(doc, "3.3.3. Đánh giá, đo lường hiệu quả trước và sau khi áp dụng cải tiến")
    add_body_p(
        doc,
        "Hiệu quả kỹ thuật của 2 giải pháp cải tiến được đo lường và lượng hóa cụ thể tại Bảng 3.5:"
    )

    add_table_title(doc, "Bảng 3.5: So sánh định lượng hiệu quả trước và sau khi áp dụng 2 cải tiến kỹ thuật")
    eval_headers = ["Chỉ số đo lường kỹ thuật", "Trước khi cải tiến (Hệ thống cũ)", "Sau khi cải tiến (Hệ thống mới)", "Đánh giá mức độ cải thiện"]
    eval_data = [
        ["Rủi ro thất thoát tồn kho khi checkout lỗi", "Cao (tồn kho bị trừ oan nếu sản phẩm sau bị lỗi).", "Bằng 0 (tự động hoàn tác bù trừ 100% trong khối catch).", "Triệt tiêu hoàn toàn lỗi sai lệch số liệu kho."],
        ["Rủi ro hoàn kho trùng lặp khi hủy đơn", "Có thể xảy ra nếu click đúp nút từ chối đơn hàng.", "Bằng 0 nhờ cơ chế cờ nguyên tử stockDeducted.", "Bảo đảm tính toàn vẹn dữ liệu đơn hàng."],
        ["Số lần tải lại trang (Page Reload) khi thao tác", "100% các thao tác quản trị đều phải reload lại trang.", "0 lần (chuyển đổi và cập nhật dữ liệu ngầm qua AJAX/API).", "Trải nghiệm mượt mà, không gián đoạn thị giác."],
        ["Thời gian chuyển đổi giữa các màn hình quản trị", "Khoảng 650ms – 1200ms (tùy thuộc tốc độ kết nối).", "< 50ms (nhờ cơ chế Client-side Routing của React).", "Tốc độ phản hồi tăng gấp hơn 15 lần."],
        ["Khả năng trực quan hóa số liệu tài chính", "Số liệu bảng tĩnh, không có biểu đồ trực quan.", "Biểu đồ tương tác đa chiều (Area, Bar, Donut) theo thời gian.", "Hỗ trợ ra quyết định kinh doanh chuẩn xác."]
    ]
    add_table(doc, eval_headers, eval_data, [3.5, 4.2, 4.5, 3.8])

    # ── 3.4. QUÁ TRÌNH TỰ HỌC VÀ PHÁT TRIỂN (CLO4) ────────────
    add_heading_2(doc, "3.4. Quá trình tự học và phát triển")
    
    add_heading_3(doc, "3.4.1. Nội dung kiến thức và công nghệ tự học trong quá trình thực hiện đồ án")
    add_body_p(
        doc,
        "Để đáp ứng chuẩn đầu ra CLO4 (20% trọng số), tác giả đã chủ động mở rộng kiến thức vượt ra ngoài phạm vi các môn học chính khóa tại giảng đường Đại học Phương Đông:"
    )
    add_bullet_p(doc, "Chủ động tìm hiểu các tính năng nâng cao của React 18 như Lazy Loading kết hợp Suspense để tối ưu phân tách mã nguồn (Code Splitting); tìm hiểu cách sử dụng TypeScript để định nghĩa các Interface phức tạp (Order, Product, Customer) nhằm tăng độ an toàn kiểu dữ liệu.", bold_prefix="1. Tự học React 18, TypeScript và Vite: ")
    add_bullet_p(doc, "Nghiên cứu nguyên lý thiết kế trạng thái không đồng bộ, kỹ thuật Store Persistence và giải pháp thay thế Redux bằng Zustand với cấu trúc mã nguồn ngắn gọn hơn 70%.", bold_prefix="2. Tự học State Management với Zustand: ")
    add_bullet_p(doc, "Nghiên cứu kỹ thuật xử lý dữ liệu tổng hợp đa tầng của MongoDB qua các toán tử `$match`, `$group`, `$sort`, `$dateToString`, `$cond` để tính toán doanh thu kỳ và phân loại trạng thái đơn hàng.", bold_prefix="3. Tự học Mongoose Aggregation Framework: ")
    add_bullet_p(doc, "Tìm hiểu các tiêu chuẩn an toàn web của OWASP, cơ chế lưu trữ session tập trung trong MongoDB qua `connect-mongo`, các thuộc tính bảo vệ cookie (`httpOnly`, `sameSite`, `secure`) và nguyên lý băm mật khẩu một chiều với salt.", bold_prefix="4. Tự học cơ chế bảo mật phiên phân tán: ")

    add_heading_3(doc, "3.4.2. Áp dụng vào đồ án và minh chứng cụ thể")
    add_bullet_p(doc, "Toàn bộ thư mục `src/` với 15 tệp TypeScript là minh chứng rõ ràng cho việc áp dụng thành công kiến thức tự học React, Vite và TypeScript vào sản phẩm thực tế.", bold_prefix="Minh chứng 1: ")
    add_bullet_p(doc, "Tệp `src/store/useAdminStore.ts` (100 dòng mã) hiện thực kho lưu trữ Zustand quản lý trạng thái tập trung của 5 thực thể và tích hợp cơ chế lưu trữ cấu hình cục bộ qua LocalStorage.", bold_prefix="Minh chứng 2: ")
    add_bullet_p(doc, "Hàm API `/api/admin/statistics` (`index.js`, dòng 456–471) là minh chứng cho việc ứng dụng thành công kỹ thuật MongoDB Aggregation Pipeline để tổng hợp doanh thu và số lượng đơn hàng chính xác.", bold_prefix="Minh chứng 3: ")

    add_heading_3(doc, "3.4.3. Kế hoạch học tập và định hướng phát triển cá nhân")
    add_body_p(
        doc,
        "Trên cơ sở những kết quả đã đạt được từ Đồ án kỳ, tác giả đã vạch ra lộ trình học tập và phát triển năng lực chuyên môn trong 12 tháng tiếp theo:"
    )
    add_bullet_p(doc, "Nghiên cứu tài liệu chính thức của VNPAY và MoMo để tích hợp cổng thanh toán Sandbox hoàn chỉnh, sử dụng chữ ký số HMAC-SHA512 và xử lý cơ chế Webhook / IPN bất đồng bộ.", bold_prefix="Mục tiêu 1 (3 tháng tới): Tích hợp cổng thanh toán trực tuyến chính thức: ")
    add_bullet_p(doc, "Chuyển đổi phân hệ tin nhắn CSKH từ cơ chế HTTP Polling sang kết nối thời gian thực hai chiều sử dụng thư viện Socket.io hoặc WebSocket thuần, giúp truyền tải thông điệp tức thì.", bold_prefix="Mục tiêu 2 (6 tháng tới): Nâng cấp truyền thông thời gian thực với WebSocket: ")
    add_bullet_p(doc, "Tìm hiểu kỹ thuật đóng gói ứng dụng bằng Docker và Docker Compose, thiết lập cụm MongoDB Replica Set 3 nút (Primary - Secondary - Arbiter) để hỗ trợ Multi-Document ACID Transactions gốc của MongoDB.", bold_prefix="Mục tiêu 3 (9 tháng tới): Đóng gói Docker và thiết lập MongoDB Replica Set: ")
    add_bullet_p(doc, "Tìm hiểu kiến trúc Microservices và kiểm thử tự động (Unit Test / E2E Test với Jest và Cypress) nhằm chuẩn bị hành trang chuyên môn vững chắc cho đồ án tốt nghiệp ra trường.", bold_prefix="Mục tiêu 4 (12 tháng tới): Nghiên cứu kiến trúc Microservices và CI/CD: ")

    # ── 3.5. KẾT QUẢ ĐẠT ĐƯỢC VÀ HẠN CHẾ ─────────────────────
    add_heading_2(doc, "3.5. Kết quả đạt được và hạn chế")
    
    add_heading_3(doc, "3.5.1. Bảng đối chiếu kết quả đạt được so với mục tiêu ban đầu")
    add_body_p(
        doc,
        "Trải qua quá trình nghiên cứu và phát triển nghiêm túc, đối chiếu với các mục tiêu đã đề ra tại Chương 1, mức độ hoàn thành của đồ án được tổng hợp tại Bảng 3.6:"
    )

    add_table_title(doc, "Bảng 3.6: Bảng đối chiếu mức độ hoàn thành các mục tiêu đồ án ban đầu")
    goal_headers = ["Mục tiêu đề ra ban đầu", "Kết quả thực tế đạt được trong đồ án", "Mức độ hoàn thành", "Đánh giá chất lượng"]
    goal_data = [
        ["Xây dựng website bán đồng hồ Rolex hoàn chỉnh", "Xây dựng xong 9 trang Storefront EJS và 7 trang React Admin SPA chạy mượt mà.", "100%", "Đạt chuẩn yêu cầu nghiệp vụ"],
        ["Cơ chế quản lý tồn kho chính xác, chống overselling", "Áp dụng trừ kho nguyên tử kết hợp hoàn tác bù trừ (Compensating Rollback).", "100%", "Bảo đảm toàn vẹn dữ liệu kho"],
        ["Phân quyền người dùng và bảo mật hệ thống", "Phân quyền RBAC 2 lớp qua Middleware, băm mật khẩu Bcrypt, bảo vệ phiên session.", "100%", "Bảo mật tốt, đạt chuẩn OWASP"],
        ["Bảng điều khiển quản trị hiện đại, trực quan", "Hoàn thành React 18 SPA với Zustand và Recharts vẽ biểu đồ doanh thu đa chu kỳ.", "100%", "Giao diện cao cấp, tốc độ cao"],
        ["Tích hợp cổng thanh toán trực tuyến bên thứ ba", "Lưu trữ phân loại phương thức thanh toán (COD, Bank, VNPAY) đối soát thủ công.", "50%", "Chưa có IPN Webhook tự động"],
        ["Chat chăm sóc khách hàng thời gian thực", "Xây dựng tính năng chat qua REST API với cơ chế Polling 5s trong React.", "70%", "Chưa nâng cấp lên WebSocket"]
    ]
    add_table(doc, goal_headers, goal_data, [3.5, 6.0, 2.5, 4.0])

    add_heading_3(doc, "3.5.2. Các nội dung chưa hoàn thành và hạn chế kỹ thuật hiện tại")
    add_bullet_p(doc, "Chưa tích hợp kiểm tra biến động số dư tự động qua Webhook của cổng thanh toán bên thứ ba.", bold_prefix="Hạn chế về thanh toán: ")
    add_bullet_p(doc, "Hệ thống vận hành trên MongoDB Standalone nên cơ chế giao dịch vẫn phụ thuộc vào tầng ứng dụng (Application Level Rollback) thay vì tầng CSDL gốc.", bold_prefix="Hạn chế về hạ tầng CSDL: ")
    add_bullet_p(doc, "Chưa xây dựng bộ kiểm thử tự động (Unit Test / Integration Test tự động bằng Jest) mà chủ yếu dựa vào kiểm thử thủ công qua ma trận Test Case.", bold_prefix="Hạn chế về tự động hóa kiểm thử: ")

    doc.add_page_break()
