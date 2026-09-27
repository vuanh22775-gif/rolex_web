from report_builder.common import add_body_p, add_bullet_p, add_heading_1, add_heading_2, add_heading_3, add_table, add_table_title

def render_chapter_1(doc):
    add_heading_1(doc, "CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI VÀ CƠ SỞ THỰC HIỆN")
    
    # ── 1.1. BÀI TOÁN VÀ LÝ DO LỰA CHỌN ĐỀ TÀI ────────────────
    add_heading_2(doc, "1.1. Bài toán và lý do lựa chọn đề tài")
    
    add_heading_3(doc, "1.1.1. Thực trạng kinh doanh mặt hàng xa xỉ và xu thế thương mại điện tử")
    add_body_p(
        doc,
        "Thương mại điện tử toàn cầu đã trải qua nhiều thập kỷ phát triển mạnh mẽ và đang bước vào giai đoạn chuyên sâu, cá nhân hóa trải nghiệm người dùng cao cấp. Theo các báo cáo kinh tế của Bain & Company về thị trường xa xỉ phẩm toàn cầu, tỷ trọng doanh số bán hàng trực tuyến của các thương hiệu cao cấp đã tăng từ 12% vào năm 2019 lên gần 22% vào năm 2024 và dự báo sẽ vượt mốc 30% trước năm 2030 [1]. Sự chuyển dịch này phản ánh sự thay đổi lớn trong cơ cấu nhân khẩu học của nhóm khách hàng tiềm năng: thế hệ Millennials và Gen Z ngày càng chiếm tỷ lệ cao trong phân khúc người tiêu dùng hàng xa xỉ. Nhóm khách hàng này có thói quen tìm kiếm thông tin, đánh giá sản phẩm, chiêm ngưỡng hình ảnh độ phân giải cao và tham khảo giá cả minh bạch trên không gian số trước khi đưa ra quyết định sở hữu."
    )
    add_body_p(
        doc,
        "Tại thị trường Việt Nam, sự gia tăng nhanh chóng của tầng lớp trung lưu và thượng lưu đã tạo ra nhu cầu rất lớn đối với các sản phẩm đồng hồ Thụy Sĩ chính hãng. Các thương hiệu như Rolex, Patek Philippe, Audemars Piguet không chỉ mang giá trị sử dụng mà còn là biểu tượng thành đạt và kênh tài sản giá trị. Tuy nhiên, thị trường trong nước đang đối mặt với bài toán bất cân xứng thông tin trầm trọng: tình trạng hàng giả, hàng nhái tinh vi tràn lan; thông tin niêm yết không nhất quán; sự thiếu vắng các nền tảng trực tuyến chuyên nghiệp được đầu tư bài bản về mặt công nghệ, thị giác và quản lý chuỗi phân phối."
    )

    add_heading_3(doc, "1.1.2. Thách thức trong việc quản lý tồn kho và bảo mật thông tin đơn hàng")
    add_body_p(
        doc,
        "Kinh doanh đồng hồ xa xỉ trực tuyến đặt ra những rào cản kỹ thuật khắt khe hơn rất nhiều so với các mặt hàng tiêu dùng nhanh (FMCG). Những thách thức điển hình bao gồm:"
    )
    add_bullet_p(
        doc,
        "mỗi phiên bản đồng hồ Rolex (ví dụ dòng Submariner, Daytona, Datejust) có số lượng phát hành hạn chế, giá trị từ vài trăm triệu đến hàng tỷ đồng. Do đó, hệ thống phần mềm tuyệt đối không được để xảy ra hiện tượng vượt tồn kho (overselling). Nếu hai khách hàng cùng đặt mua chiếc đồng hồ duy nhất còn lại tại cùng một thời điểm, hệ thống phải bảo đảm tính nguyên tử (Atomicity), chỉ chấp nhận đơn hàng đầu tiên và thông báo hết hàng tức thì cho đơn hàng tiếp theo.",
        bold_prefix="Tính khan hiếm và kiểm soát tồn kho thời gian thực: "
    )
    add_bullet_p(
        doc,
        "khách hàng mua sản phẩm giá trị cao đặc biệt nhạy cảm với việc rò rỉ dữ liệu cá nhân (họ tên, số điện thoại, địa chỉ nhà riêng, giá trị đơn hàng). Bất kỳ lỗ hổng bảo mật nào để lộ thông tin đều có thể dẫn đến nguy cơ đe dọa an ninh tài sản của khách hàng. Do đó, hệ thống đòi hỏi các cơ chế xác thực phân quyền nghiêm ngặt, băm mật khẩu một chiều an toàn và bảo vệ phiên làm việc chống lại các hình thức tấn công Session Hijacking hay CSRF [2].",
        bold_prefix="Bảo mật thông tin khách hàng và lịch sử giao dịch: "
    )
    add_bullet_p(
        doc,
        "nhiều cửa hàng quy mô vừa và nhỏ vẫn duy trì quy trình ghi chép đơn hàng bằng sổ tay hoặc phần mềm bảng tính Excel rời rạc. Cách làm này gây chậm trễ trong luồng xử lý, dễ thất thoát dữ liệu khi nhân viên thay đổi, và hoàn toàn không có khả năng tổng hợp báo cáo doanh thu theo thời gian thực để người quản lý ra quyết định kinh doanh.",
        bold_prefix="Hạn chế của mô hình quản lý thủ công truyền thống: "
    )

    add_heading_3(doc, "1.1.3. Lý do lựa chọn thương hiệu đồng hồ Rolex làm bài toán nghiên cứu")
    add_body_p(
        doc,
        "Thương hiệu Rolex được lựa chọn làm đối tượng nghiên cứu và triển khai sản phẩm bởi tính điển hình và chuẩn mực của nó trong ngành công nghiệp đồng hồ cao cấp. Rolex sở hữu các dòng sản phẩm đa dạng chia theo 4 bộ sưu tập kinh điển: Classic (Datejust, Oyster Perpetual), Luxury (Day-Date, Lady-Datejust), Diving (Submariner, Sea-Dweller, Deepsea) và Sport (Cosmograph Daytona, GMT-Master II, Explorer). Việc số hóa một danh mục sản phẩm có tính thẩm mỹ và giá trị cao như vậy đòi hỏi người kỹ sư phần mềm phải kết hợp hài hòa giữa tư duy thiết kế giao diện sang trọng (Luxury UX/UI) và kỹ thuật lập trình backend vững chắc, xử lý tính toán số học lớn và quản lý trạng thái dữ liệu chính xác."
    )

    # ── 1.2. MỤC TIÊU CỦA ĐỀ TÀI ──────────────────────────────
    add_heading_2(doc, "1.2. Mục tiêu của đề tài")
    add_body_p(
        doc,
        "Đề tài hướng tới việc giải quyết trọn vẹn bài toán xây dựng phần mềm thương mại điện tử với các mục tiêu cụ thể được phân định rõ ràng trên ba phương diện:"
    )
    
    add_heading_3(doc, "1.2.1. Mục tiêu chức năng đối với khách hàng mua sắm")
    add_bullet_p(doc, "Trình bày danh mục sản phẩm trực quan, phân loại khoa học theo 4 bộ sưu tập, hỗ trợ hiển thị ảnh chất lượng cao và thông số kỹ thuật chi tiết của từng cỗ máy đồng hồ (kích thước mặt số, chất liệu vỏ, vành Bezel, bộ chuyển động).", bold_prefix="Khám phá và tra cứu sản phẩm: ")
    add_bullet_p(doc, "Cho phép khách hàng dễ dàng lưu trữ các mẫu đồng hồ yêu thích, tùy chỉnh số lượng, tự động tính tổng tiền theo thời gian thực và lưu trữ dữ liệu giỏ hàng trên trình duyệt.", bold_prefix="Quản lý giỏ hàng thông minh: ")
    add_bullet_p(doc, "Hỗ trợ khách hàng gửi yêu cầu tư vấn chuyên sâu, thực hiện quy trình đặt hàng nhanh chóng với các bước xác thực thông tin giao hàng chặt chẽ.", bold_prefix="Đặt hàng và tư vấn: ")
    add_bullet_p(doc, "Cung cấp trang quản lý đơn hàng cá nhân để khách hàng tra cứu tiến độ xử lý đơn hàng (Chờ duyệt, Đang giao, Đã hoàn tất, Đã hủy) một cách minh bạch.", bold_prefix="Theo dõi lịch sử đơn hàng: ")

    add_heading_3(doc, "1.2.2. Mục tiêu chức năng đối với quản trị viên vận hành")
    add_bullet_p(doc, "Cung cấp công cụ quản lý toàn diện vòng đời sản phẩm: thêm mới, cập nhật giá, chỉnh sửa thông số, điều chỉnh số lượng tồn kho và phân loại trạng thái hoạt động.", bold_prefix="Quản trị danh mục và kho hàng: ")
    add_bullet_p(doc, "Theo dõi danh sách đơn hàng tập trung, hỗ trợ phê duyệt đơn hàng hợp lệ, từ chối đơn hàng không đủ điều kiện và tự động hoàn trả số lượng tồn kho.", bold_prefix="Kiểm soát và xử lý đơn hàng: ")
    add_bullet_p(doc, "Phân quyền tài khoản chặt chẽ, tạo mới và quản lý tài khoản nhân viên/quản trị viên, cấm xóa tài khoản admin hệ thống gốc.", bold_prefix="Quản trị tài khoản và nhân sự: ")
    add_bullet_p(doc, "Trực quan hóa hoạt động kinh doanh bằng các chỉ số thống kê tổng hợp (tổng doanh thu, số lượng đơn hàng, số khách hàng, cảnh báo hàng sắp hết) và biểu đồ biến động doanh thu theo chu kỳ thời gian (7 ngày, 30 ngày, 90 ngày, 365 ngày).", bold_prefix="Thống kê và phân tích tài chính: ")

    add_heading_3(doc, "1.2.3. Mục tiêu về mặt kỹ thuật, kiến trúc và tính dùng được (Usability)")
    add_bullet_p(doc, "Ứng dụng mô hình kiến trúc lai hiện đại: Server-Side Rendering (EJS) tối ưu SEO và tốc độ tải trang ban đầu cho khách hàng, kết hợp Single Page Application (React 18, Vite, Zustand) đem lại trải nghiệm tương tác mượt mà, không giật lag cho quản trị viên.", bold_prefix="Kiến trúc linh hoạt và tối ưu hiệu năng: ")
    add_bullet_p(doc, "Thiết kế giải pháp khấu trừ kho nguyên tử kết hợp cơ chế hoàn tác bù trừ (Compensating Rollback) nhằm bảo đảm tính toàn vẹn dữ liệu tồn kho ngay cả trên môi trường cơ sở dữ liệu MongoDB Standalone.", bold_prefix="Toàn vẹn và nhất quán dữ liệu: ")
    add_bullet_p(doc, "Tuân thủ các nguyên tắc thiết kế sang trọng, tối giản, sử dụng tone màu xanh lục Rolex (#006039), màu vàng kim (#A37E2C) và xám than cao cấp, bảo đảm khả năng phản hồi co giãn tốt trên mọi độ phân giải màn hình.", bold_prefix="Chuẩn mực trải nghiệm người dùng (UX/UI): ")

    # ── 1.3. ĐỐI TƯỢNG SỬ DỤNG, PHẠM VI VÀ GIỚI HẠN ──────────
    add_heading_2(doc, "1.3. Đối tượng sử dụng, phạm vi và giới hạn của đề tài")
    
    add_heading_3(doc, "1.3.1. Đối tượng sử dụng hệ thống")
    add_body_p(
        doc,
        "Hệ thống phân định rành mạch quyền hạn và trách nhiệm của 3 nhóm tác nhân tham gia vào hoạt động vận hành của website:"
    )
    add_bullet_p(doc, "Người dùng chưa thực hiện đăng nhập vào hệ thống. Nhóm đối tượng này có quyền truy cập trang chủ, xem danh mục các bộ sưu tập, xem thông tin chi tiết từng mẫu đồng hồ, tra cứu các chính sách dịch vụ hậu mãi, gửi biểu mẫu đăng ký nhận tư vấn và tiến hành đăng ký/đăng nhập tài khoản.", bold_prefix="1. Khách vãng lai (Guest): ")
    add_bullet_p(doc, "Khách hàng đã sở hữu tài khoản thành viên hợp lệ và đăng nhập vào phiên làm việc. Kế thừa toàn bộ quyền của khách vãng lai, đồng thời có đặc quyền thêm sản phẩm vào giỏ hàng, cập nhật số lượng, nhập thông tin nhận hàng, chọn phương thức thanh toán, hoàn tất quy trình đặt hàng, xem danh sách đơn hàng đã mua và cập nhật hồ sơ cá nhân.", bold_prefix="2. Khách hàng thành viên (Customer): ")
    add_bullet_p(doc, "Cán bộ quản lý hoặc nhân viên bán hàng được cấp tài khoản với vai trò 'admin'. Tác nhân này có toàn quyền truy cập khu vực quản trị an toàn (`/admin`), thực hiện các tác vụ CRUD trên kho hàng, phê duyệt hoặc từ chối đơn hàng, quản lý danh sách khách hàng, theo dõi tin nhắn chăm sóc khách hàng và xem các biểu đồ phân tích kinh doanh.", bold_prefix="3. Quản trị viên (Administrator): ")

    add_heading_3(doc, "1.3.2. Phạm vi chức năng của sản phẩm")
    add_body_p(
        doc,
        "Sản phẩm được giới hạn trong phạm vi xây dựng một giải pháp phần mềm web hoàn chỉnh, tập trung chuyên biệt vào ngành hàng đồng hồ Rolex chính hãng. Hệ thống bao gồm 2 phân hệ lớn:"
    )
    add_bullet_p(doc, "Xây dựng bằng công nghệ EJS Template Engine, cung cấp 9 giao diện chính: Trang chủ (`/`), Bộ sưu tập sản phẩm (`/sanphammoi`), Chi tiết sản phẩm (`/sanphammoi/:id`), Giới thiệu dịch vụ (`/dichvu`), Chăm sóc khách hàng (`/chamsockhachhang`), Biểu mẫu đăng ký tư vấn (`/form`), Trang đăng nhập (`/dangnhap`), Thanh toán giỏ hàng (`/thanhtoan`) và Lịch sử đơn hàng (`/don-hang`).", bold_prefix="Phân hệ Cửa hàng trực tuyến (Storefront): ")
    add_bullet_p(doc, "Xây dựng bằng React 18 / TypeScript SPA, cung cấp 7 màn hình nghiệp vụ: Tổng quan điều hành (`/admin/dashboard`), Quản lý sản phẩm (`/admin/products`), Quản lý danh mục (`/admin/categories`), Xử lý đơn hàng (`/admin/orders`), Quản lý khách hàng (`/admin/customers`), Phân tích thống kê (`/admin/analytics`), Hộp thư tin nhắn (`/admin/messages`) và Thiết lập hệ thống (`/admin/settings`).", bold_prefix="Phân hệ Bảng điều khiển quản trị (Admin Dashboard): ")

    add_heading_3(doc, "1.3.3. Giới hạn của đề tài")
    add_body_p(
        doc,
        "Để bảo đảm tính trung thực học thuật và phản ánh chính xác mã nguồn thực tế đã xây dựng, tác giả khẳng định rõ các giới hạn hiện tại của đề tài như sau:"
    )
    add_bullet_p(doc, "Hệ thống hỗ trợ lưu trữ thông tin lựa chọn phương thức thanh toán gồm Thanh toán khi nhận hàng ('cod'), Chuyển khoản ngân hàng ('bank') và Cổng thanh toán trực tuyến ('vnpay'). Tuy nhiên, trong phạm vi đồ án kỳ, hệ thống chưa tích hợp cơ chế Webhook / IPN Callback tự động từ các cổng thanh toán bên thứ ba (như VNPAY Sandbox hay cổng thanh toán ngân hàng) để xác nhận biến động số dư thực tế. Các phương thức này đóng vai trò nhãn nghiệp vụ trên đơn hàng để phục vụ đối soát thủ công.", bold_prefix="Về tích hợp cổng thanh toán trực tuyến: ")
    add_bullet_p(doc, "Hệ thống được cấu hình chạy trên phiên bản cơ sở dữ liệu MongoDB Standalone cục bộ. Do cấu hình này không hỗ trợ Multi-Document Transactions theo chuẩn Replica Set, tác giả đã thiết kế và triển khai cơ chế hoàn tác bù trừ (Compensating Rollback) trên tầng ứng dụng để bảo đảm tính nhất quán khi đặt hàng nhiều sản phẩm, thay vì dựa vào cơ chế ACID phân tán của MongoDB.", bold_prefix="Về môi trường cơ sở dữ liệu: ")
    add_bullet_p(doc, "Tính năng trò chuyện trực tuyến giữa khách hàng và quản trị viên hiện đang được vận hành thông qua giao thức HTTP REST API định kỳ (Short Polling chu kỳ 5 giây trong React), chưa nâng cấp lên giao thức kết nối liên tục hai chiều thời gian thực (WebSocket / Socket.io).", bold_prefix="Về phương thức truyền thông tin nhắn: ")

    # ── 1.4. DỮ LIỆU ĐẦU VÀO, ĐẦU RA VÀ RÀNG BUỘC ────────────
    add_heading_2(doc, "1.4. Dữ liệu đầu vào, đầu ra và các yêu cầu/ràng buộc chính")
    
    add_heading_3(doc, "1.4.1. Luồng dữ liệu vào và dữ liệu ra của các phân hệ")
    add_body_p(
        doc,
        "Mỗi phân hệ chức năng trong hệ thống Rolex Boutique thực hiện thu nhận các luồng dữ liệu đầu vào xác định, thực hiện tính toán và kiểm tra nghiệp vụ, sau đó sản sinh dữ liệu đầu ra tương ứng. Chi tiết được tổng hợp tại Bảng 1.1:"
    )
    
    add_table_title(doc, "Bảng 1.1: Phân tích các yêu cầu dữ liệu vào và dữ liệu ra của các phân hệ")
    io_headers = ["Phân hệ / Chức năng", "Dữ liệu đầu vào (Input)", "Xử lý nghiệp vụ chính", "Dữ liệu đầu ra (Output)"]
    io_data = [
        ["Đăng ký & Đăng nhập", "Họ tên, email, username, password, phone, role.", "Kiểm tra định dạng, regex phone/email, băm mật khẩu bcrypt, kiểm tra trùng khóa.", "Bản ghi User trong CSDL, thiết lập session, cấp cookie xác thực."],
        ["Tra cứu sản phẩm", "Từ khóa tìm kiếm, bộ sưu tập ('classic', 'luxury', 'diving', 'sport').", "Truy vấn CSDL với toán tử lọc, sắp xếp theo giá, phân trang dữ liệu.", "Danh sách sản phẩm (JSON/HTML), hình ảnh, giá niêm yết, tình trạng tồn kho."],
        ["Giỏ hàng & Đặt hàng", "Danh sách mặt hàng [{id, qty}], họ tên người nhận, SĐT, địa chỉ, hình thức thanh toán.", "Gộp số lượng theo SKU, kiểm tra tồn kho nguyên tử, trừ kho, tính tổng tiền, rollback nếu lỗi.", "Bản ghi Order mới (status: 'pending'), mã đơn hàng duy nhất, cập nhật kho hàng."],
        ["Quản lý đơn hàng", "Mã đơn hàng (_id), trạng thái mới ('confirmed', 'shipping', 'completed', 'cancelled').", "Kiểm tra quyền admin, kiểm tra logic chuyển đổi trạng thái, hoàn kho nếu hủy/từ chối.", "Bản ghi Order cập nhật, hoàn tồn kho nếu hủy đơn, thông báo trạng thái."],
        ["Báo cáo & Thống kê", "Khoảng thời gian phân tích (7 ngày, 30 ngày, 90 ngày, 365 ngày).", "Thực hiện MongoDB Aggregation Pipeline, nhóm doanh thu theo ngày, đếm đơn theo trạng thái.", "Dữ liệu mảng biểu đồ ({label, revenue, orders}), tổng doanh thu, tỷ lệ hoàn tất."]
    ]
    add_table(doc, io_headers, io_data, [3.2, 4.2, 4.8, 3.8])

    add_heading_3(doc, "1.4.2. Các ràng buộc nghiệp vụ và tính toàn vẹn dữ liệu")
    add_bullet_p(doc, "Mã tham chiếu sản phẩm (id / SKU) phải là chuỗi định danh duy nhất trong toàn hệ thống. Không cho phép tạo mới hoặc chỉnh sửa trùng mã SKU với sản phẩm khác.", bold_prefix="Ràng buộc tính duy nhất của sản phẩm: ")
    add_bullet_p(doc, "Giá bán của đồng hồ bắt buộc phải là số nguyên dương lớn hơn 0 (tối thiểu 1.000.000 VNĐ trong giao diện quản trị). Số lượng tồn kho phải là số nguyên không âm ($stock \\ge 0$).", bold_prefix="Ràng buộc số học sản phẩm: ")
    add_bullet_p(doc, "Khách hàng chỉ được đặt mua số lượng sản phẩm nhỏ hơn hoặc bằng số lượng thực tế đang lưu kho. Nếu số lượng yêu cầu vượt quá tồn kho khả dụng, giao dịch bị từ chối với mã lỗi 409 Conflict.", bold_prefix="Ràng buộc tồn kho khi đặt hàng: ")
    add_bullet_p(doc, "Mỗi địa chỉ email và tên đăng nhập (username) chỉ được đăng ký một tài khoản duy nhất trong toàn hệ thống.", bold_prefix="Ràng buộc tài khoản người dùng: ")

    add_heading_3(doc, "1.4.3. Ràng buộc về kỹ thuật và bảo mật hệ thống")
    add_bullet_p(doc, "Mật khẩu người dùng tuyệt đối không được lưu dạng văn bản thuần (plain text). Mật khẩu phải được tự động mã hóa băm một chiều bằng thuật toán Bcrypt với hệ số salt 10 trước khi ghi vào CSDL [3].", bold_prefix="Ràng buộc mã hóa mật khẩu: ")
    add_bullet_p(doc, "Các tài nguyên API quản trị và màn hình quản lý bắt buộc phải được bảo vệ bởi 2 tầng kiểm tra trung gian: kiểm tra đăng nhập (`requireAuth`) và kiểm tra vai trò quản trị viên (`requireAdmin`).", bold_prefix="Ràng buộc phân quyền truy cập (RBAC): ")
    add_bullet_p(doc, "Cookie phiên làm việc (`rolex.sid`) bắt buộc phải thiết lập cờ `httpOnly: true` (ngăn JavaScript phía client đánh cắp cookie), `sameSite: 'lax'` (chống tấn công CSRF) và kích hoạt `secure: true` trên môi trường sản xuất.", bold_prefix="Ràng buộc an toàn phiên Session: ")

    # ── 1.5. CƠ SỞ LÝ THUYẾT, CÔNG NGHỆ VÀ CÔNG CỤ ────────────
    add_heading_2(doc, "1.5. Cơ sở lý thuyết, công nghệ và công cụ sử dụng")
    
    add_heading_3(doc, "1.5.1. Nền tảng thực thi Node.js và kiến trúc bất đồng bộ")
    add_body_p(
        doc,
        "Node.js là một môi trường thực thi mã JavaScript đa nền tảng, mã nguồn mở, hoạt động dựa trên bộ máy V8 JavaScript Engine hiệu năng cao của Google [4]. Đặc trưng cốt lõi của Node.js là mô hình hướng sự kiện và cơ chế vào/ra bất đồng bộ, không phong tỏa (Event-driven, Non-blocking I/O). Thay vì cấp phát một luồng (thread) riêng cho mỗi yêu cầu kết nối như các máy chủ truyền thống (Apache, Tomcat), Node.js sử dụng cơ chế Event Loop đơn luồng nhưng có khả năng ủy quyền các thao tác tốn thời gian (truy vấn CSDL, đọc/ghi tệp tin, giao tiếp mạng) cho hệ điều hành thông qua thư viện libuv. Cơ chế này giúp máy chủ duy trì khả năng phục vụ hàng nghìn kết nối đồng thời với mức tiêu hao tài nguyên bộ nhớ rất thấp, đặc biệt phù hợp với các ứng dụng thương mại điện tử có mật độ đọc/ghi dữ liệu thường xuyên."
    )

    add_heading_3(doc, "1.5.2. Express Framework và mô hình định tuyến RESTful API")
    add_body_p(
        doc,
        "Express là framework web tối giản và linh hoạt hàng đầu cho Node.js, cung cấp một hệ thống tính năng mạnh mẽ để xây dựng các ứng dụng web và giao diện lập trình ứng dụng RESTful API [5]. Trọng tâm kiến trúc của Express xoay quanh khái niệm Middleware – các hàm trung gian có quyền truy cập đối tượng yêu cầu (`req`), đối tượng phản hồi (`res`) và hàm điều khiển tiếp theo (`next`). Trong dự án Rolex Boutique, chuỗi Middleware được thiết lập chặt chẽ để thực hiện tuần tự các tác vụ: phân tích dữ liệu thân yêu cầu (Body Parsing qua `express.urlencoded` và `express.json`), quản lý phiên làm việc (`express-session`), xác thực danh tính người dùng (`requireAuth`), kiểm tra phân quyền quản trị (`requireAdmin`), và bắt giữ xử lý lỗi tập trung."
    )

    add_heading_3(doc, "1.5.3. Hệ quản trị CSDL NoSQL MongoDB và thư viện Mongoose ODM")
    add_body_p(
        doc,
        "MongoDB là hệ quản trị cơ sở dữ liệu hướng tài liệu (Document-oriented NoSQL Database) phổ biến nhất hiện nay, lưu trữ dữ liệu dưới định dạng BSON (Binary JSON) linh hoạt [6]. Khác với các hệ CSDL quan hệ truyền thống (RDBMS) đòi hỏi cấu trúc bảng biểu cố định và các thao tác JOIN phức tạp, MongoDB cho phép nhúng (embed) các tài liệu con – ví dụ nhúng trực tiếp danh sách mặt hàng `items` vào bên trong tài liệu đơn hàng `Order`. Cấu trúc này giúp tối ưu hóa đáng kể tốc độ truy vấn, do toàn bộ thông tin chi tiết của một hóa đơn có thể được truy xuất trong một lần đọc đĩa duy nhất."
    )
    add_body_p(
        doc,
        "Mongoose đóng vai trò là một thư viện mô hình hóa dữ liệu đối tượng (Object Data Modeling - ODM) cho Node.js và MongoDB. Mongoose cung cấp cơ chế định nghĩa lược đồ (Schema) chặt chẽ, kiểm tra tính hợp lệ của dữ liệu (Validation), thiết lập giá trị mặc định, quản lý chỉ mục (Indexes) và khai báo các hàm Middleware (Pre/Post hooks) giúp tự động hóa quy trình băm mật khẩu trước khi lưu trữ."
    )

    add_heading_3(doc, "1.5.4. Công nghệ giao diện kết hợp: EJS Template Engine và React 18 / TypeScript")
    add_body_p(
        doc,
        "Dự án tiên phong áp dụng mô hình giao diện kết hợp (Hybrid Frontend Architecture) nhằm phát huy tối đa thế mạnh của từng công nghệ cho từng đối tượng người dùng chuyên biệt:"
    )
    add_bullet_p(
        doc,
        "EJS được sử dụng để kết xuất HTML trực tiếp tại máy chủ cho phân hệ khách hàng. Khi người dùng truy cập trang sản phẩm, mã nguồn HTML hoàn chỉnh chứa đầy đủ nội dung, thẻ meta và dữ liệu SEO được máy chủ biên dịch và trả về ngay lập tức. Điều này giúp tối ưu hóa tốc độ tải trang ban đầu (First Contentful Paint) và nâng cao chỉ số thân thiện với các công cụ tìm kiếm của Google [7].",
        bold_prefix="Embedded JavaScript (EJS) cho Storefront: "
    )
    add_bullet_p(
        doc,
        "Phân hệ quản trị được xây dựng hoàn toàn dưới dạng Single Page Application bằng thư viện React 18 kết hợp ngôn ngữ định kiểu tĩnh TypeScript 5.6 [8]. React sử dụng cơ chế Virtual DOM giúp cập nhật giao diện cực nhanh mà không cần tải lại toàn bộ trang web. TypeScript bổ sung hệ thống kiểu dữ liệu tĩnh mạnh mẽ cho JavaScript, giúp phát hiện sớm các lỗi cú pháp và logic ngay trong quá trình biên dịch, nâng cao độ tin cậy và khả năng bảo trì mã nguồn dự án.",
        bold_prefix="React 18 & TypeScript cho Admin Dashboard: "
    )

    add_heading_3(doc, "1.5.5. Quản lý trạng thái với Zustand và trực quan hóa dữ liệu với Recharts")
    add_body_p(
        doc,
        "Zustand là một giải pháp quản lý trạng thái tập trung (State Management) nhỏ gọn, hiện đại cho ứng dụng React, hoạt động dựa trên các nguyên tắc bất biến (Immutability) mà không cần cấu trúc Boilerplate rườm rà như Redux [9]. Trong phân hệ quản trị, Zustand (`useAdminStore`) quản lý đồng bộ trạng thái danh mục sản phẩm, đơn hàng, khách hàng, thống kê và bộ đệm giao diện (theme sáng/tối). Recharts là thư viện biểu đồ được xây dựng riêng cho React dựa trên nền tảng SVG và D3.js, cung cấp các thành phần biểu đồ diện tích (AreaChart), biểu đồ cột (BarChart) và biểu đồ tròn (PieChart) giúp trực quan hóa doanh thu và phân bố đơn hàng một cách sinh động, mượt mà."
    )

    add_heading_3(doc, "1.5.6. Các công cụ phát triển và hỗ trợ dự án")
    add_body_p(
        doc,
        "Toàn bộ quy trình xây dựng dự án được chuẩn hóa thông qua các công cụ kỹ thuật phần mềm hiện đại:"
    )
    add_bullet_p(doc, "Công cụ phát triển frontend thế hệ mới, tận dụng Native ES Modules trên trình duyệt để khởi động máy chủ thử nghiệm tức thì và thay thế nóng mô-đun (HMR) cực nhanh.", bold_prefix="Vite: ")
    add_bullet_p(doc, "Hệ thống quản lý phiên bản phân tán, hỗ trợ theo dõi tiến trình thay đổi mã nguồn qua các commit rõ ràng và minh chứng cho các mốc checkpoint đồ án.", bold_prefix="Git & GitHub: ")
    add_bullet_p(doc, "Bộ phần mềm kiểm thử API chuyên dụng, hỗ trợ gửi yêu cầu HTTP và kiểm chứng dữ liệu phản hồi của hệ thống RESTful API.", bold_prefix="Postman / Thunder Client: ")

    add_table_title(doc, "Bảng 1.2: Tổng hợp các công nghệ và thư viện phần mềm sử dụng trong dự án")
    tech_headers = ["Thành phần", "Công nghệ / Thư viện", "Phiên bản", "Vai trò và Mục đích sử dụng"]
    tech_data = [
        ["Runtime Environment", "Node.js", "v20.x / v22.x", "Môi trường thực thi JavaScript phía máy chủ hiệu năng cao."],
        ["Backend Framework", "Express", "4.19.2", "Xây dựng máy chủ web, định tuyến URL và xử lý RESTful API."],
        ["Database Management", "MongoDB & Mongoose", "7.8.0", "Lưu trữ dữ liệu NoSQL, mô hình hóa lược đồ và truy vấn."],
        ["Session Management", "express-session, connect-mongo", "1.17.3 / 5.1.0", "Quản lý phiên làm việc tập trung, lưu trữ session trên MongoDB."],
        ["Security & Hashing", "bcryptjs", "2.4.3", "Băm mật khẩu người dùng một chiều bằng thuật toán Blowfish salt."],
        ["Storefront Template", "EJS", "3.1.10", "Render giao diện HTML phía máy chủ phục vụ khách hàng và SEO."],
        ["Admin Frontend", "React, TypeScript, Vite", "18.3 / 5.6 / 8.3", "Xây dựng giao diện ứng dụng trang đơn (SPA) cho quản trị viên."],
        ["State Management", "Zustand", "4.5.5", "Quản lý trạng thái ứng dụng React tập trung, đồng bộ dữ liệu."],
        ["Data Visualization", "Recharts", "2.12.7", "Vẽ biểu đồ phân tích doanh thu, tăng trưởng và trạng thái đơn."],
        ["CSS Styling", "Tailwind CSS, PostCSS", "3.4.12", "Hệ thống thiết kế giao diện tiện ích hiện đại, co giãn đa thiết bị."]
    ]
    add_table(doc, tech_headers, tech_data, [3.2, 4.0, 2.8, 6.0])

    doc.add_page_break()
