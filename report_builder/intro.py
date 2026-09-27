from report_builder.common import add_body_p, add_bullet_p, add_heading_1, add_heading_2, setup_page_numbering

def render_introduction(doc):
    # Add new section for page numbering starting at 1
    new_section = doc.add_section()
    setup_page_numbering(new_section)
    
    add_heading_1(doc, "MỞ ĐẦU", page_break=False)
    
    add_body_p(
        doc,
        "Trong kỷ nguyên chuyển đổi số và sự bùng nổ của cuộc Cách mạng Công nghiệp lần thứ tư, thương mại điện tử (E-Commerce) đã trở thành một hạ tầng giao thương tất yếu, làm thay đổi sâu sắc hành vi tiêu dùng và phương thức vận hành doanh nghiệp trên toàn cầu. Tại Việt Nam, theo Báo cáo Chỉ số Thương mại điện tử (EBI) và các khảo sát thị trường những năm gần đây, tốc độ tăng trưởng của thị trường mua sắm trực tuyến duy trì ở mức trên 20% mỗi năm. Không chỉ dừng lại ở các mặt hàng tiêu dùng thiết yếu, ngành hàng cao cấp, xa xỉ phẩm (Luxury Goods) – đặc biệt là phân khúc đồng hồ cơ khí chính hãng – đang chứng kiến sự chuyển dịch mạnh mẽ lên không gian số.",
        bold_prefix="1. Bối cảnh và tính cấp thiết của đề tài: "
    )
    
    add_body_p(
        doc,
        "Đồng hồ cao cấp, với đại diện tiêu biểu là thương hiệu Rolex, không đơn thuần là một công cụ đo đếm thời gian mà là biểu tượng của nghệ thuật chế tác thủ công tinh xảo, địa vị xã hội và tài sản tích lũy có giá trị gia tăng theo năm tháng. Tuy nhiên, việc kinh doanh các sản phẩm có giá trị từ vài trăm triệu đến hàng tỷ đồng trên nền tảng trực tuyến đặt ra những bài toán vô cùng phức tạp về công nghệ: đòi hỏi giao diện số hóa phải thể hiện được sự đẳng cấp, sang trọng của thương hiệu; dữ liệu sản phẩm phải có độ chính xác tuyệt đối; cơ chế quản lý tồn kho phải hoạt động theo thời gian thực để ngăn chặn tình trạng bán vượt tồn kho (overselling); đồng thời luồng thông tin đơn hàng và tài khoản người dùng phải được bảo vệ an toàn nghiêm ngặt."
    )
    
    add_body_p(
        doc,
        "Hiện nay, nhiều mô hình kinh doanh truyền thống vẫn quản lý đơn hàng và tồn kho một cách thủ công, dựa vào sổ sách rời rạc hoặc các công cụ văn phòng đơn giản, dẫn đến việc cập nhật tình trạng hàng hóa chậm trễ, khó kiểm soát tranh chấp khi nhiều khách hàng cùng đặt mua một phiên bản giới hạn, và thiếu hụt các công cụ phân tích dữ liệu kinh doanh tổng thể. Xuất phát từ thực tiễn đó, việc nghiên cứu, thiết kế và phát triển một hệ thống ứng dụng web chuyên nghiệp cho hoạt động kinh doanh trực tuyến đồng hồ cao cấp là một đòi hỏi vô cùng cấp thiết, vừa có ý nghĩa thực tiễn kinh doanh, vừa mang tính học thuật cao trong ngành Công nghệ thông tin.",
        bold_prefix="2. Bài toán thực tiễn cần giải quyết: "
    )

    add_body_p(
        doc,
        "Mục tiêu cốt lõi của đề tài là ứng dụng các công nghệ web hiện đại để thiết kế và xây dựng hoàn chỉnh hệ thống website kinh doanh đồng hồ Rolex (Rolex Boutique). Hệ thống phải đáp ứng hai mục tiêu lớn: (1) Cung cấp cho khách hàng một không gian mua sắm trực tuyến đẳng cấp, trực quan, hỗ trợ tra cứu thông số kỹ thuật, quản lý giỏ hàng, đặt hàng chuẩn xác và theo dõi đơn hàng minh bạch; (2) Trang bị cho đội ngũ quản trị viên cửa hàng một bảng điều khiển điều hành tập trung (Admin Dashboard) hoạt động mượt mà, hỗ trợ quản lý danh mục sản phẩm, kiểm soát trạng thái đơn hàng, tương tác hỗ trợ khách hàng và trực quan hóa doanh thu theo thời gian.",
        bold_prefix="3. Mục tiêu nghiên cứu và xây dựng sản phẩm: "
    )

    add_body_p(
        doc,
        "Hệ thống hướng tới ba nhóm đối tượng người dùng chính trong môi trường thương mại điện tử:",
        bold_prefix="4. Đối tượng sử dụng, phạm vi và giới hạn của đề tài: "
    )
    add_bullet_p(doc, "người dùng truy cập website để tìm hiểu thông tin thương hiệu, chiêm ngưỡng các bộ sưu tập đồng hồ Rolex, tra cứu thông số kỹ thuật và gửi biểu mẫu đăng ký tư vấn.", bold_prefix="Khách vãng lai (Guest): ")
    add_bullet_p(doc, "người dùng đã đăng ký tài khoản định danh, có khả năng quản lý giỏ hàng cá nhân, tiến hành quy trình đặt hàng, lựa chọn phương thức thanh toán, quản lý thông tin hồ sơ và theo dõi lịch sử trạng thái đơn hàng.", bold_prefix="Khách hàng thành viên (Member/Customer): ")
    add_bullet_p(doc, "nhân sự quản lý có đặc quyền truy cập phân hệ quản trị để cập nhật giá cả, quản lý tồn kho, duyệt hoặc từ chối đơn hàng, quản lý danh sách tài khoản và phân tích số liệu tài chính.", bold_prefix="Quản trị viên (Administrator): ")

    add_body_p(
        doc,
        "Về phạm vi chức năng, đề tài tập trung hoàn thiện trọn vẹn chu trình mua bán cốt lõi từ duyệt sản phẩm, thêm giỏ hàng, khấu trừ tồn kho an toàn đến quản lý hóa đơn. Về mặt giới hạn kỹ thuật, trong khuôn khổ đồ án kỳ, hệ thống chưa tích hợp cổng thanh toán trực tuyến bên thứ ba (như VNPAY hay MoMo thông qua Webhook đối soát tự động) mà ghi nhận phương thức thanh toán (COD, Chuyển khoản, VNPAY) như một phân loại nghiệp vụ trên đơn hàng để phục vụ đối soát; đồng thời hệ thống được thiết kế để vận hành trên môi trường CSDL MongoDB Standalone cục bộ với cơ chế hoàn tác bù trừ (Compensating Rollback) thay thế cho distributed transactions."
    )

    add_body_p(
        doc,
        "Để hoàn thành đồ án một cách khoa học, tác giả đã vận dụng kết hợp các phương pháp nghiên cứu và phát triển phần mềm chuẩn mực:",
        bold_prefix="5. Phương pháp nghiên cứu và thực hiện: "
    )
    add_bullet_p(doc, "tìm hiểu tài liệu chuyên ngành về thương mại điện tử, các nguyên tắc thiết kế giao diện lấy người dùng làm trung tâm (User-Centered Design), và khảo sát trực tiếp các website đồng hồ xa xỉ tiêu biểu.", bold_prefix="Phương pháp khảo sát hiện trạng: ")
    add_bullet_p(doc, "sử dụng ngôn ngữ mô hình hóa thống nhất UML (Use Case, Activity, Sequence, Class Diagram) để đặc tả tường minh các luồng nghiệp vụ và cấu trúc thực thể.", bold_prefix="Phương pháp phân tích và thiết kế hệ thống: ")
    add_bullet_p(doc, "áp dụng mô hình kiến trúc lai (Hybrid Architecture), kết hợp Server-Side Rendering (EJS) cho phía khách hàng và Single Page Application (React 18, TypeScript, Vite) cho phía quản trị viên trên nền tảng Node.js/Express và MongoDB.", bold_prefix="Phương pháp xây dựng phần mềm: ")
    add_bullet_p(doc, "thực hiện kiểm thử chức năng theo phương pháp hộp đen (Black-box Testing) với các kịch bản kiểm thử biên, kiểm tra toàn vẹn dữ liệu và kiểm tra xử lý tranh chấp kho.", bold_prefix="Phương pháp kiểm thử và đánh giá: ")

    add_body_p(
        doc,
        "Báo cáo Đồ án kỳ được tổ chức theo cấu trúc chuẩn gồm 03 chương nội dung chính bám sát tiến trình kỹ thuật của dự án:",
        bold_prefix="6. Ý nghĩa thực tiễn và bố cục quyển báo cáo: "
    )
    add_bullet_p(doc, "Trình bày chi tiết bối cảnh, bài toán thực tiễn, mục tiêu, phạm vi, dữ liệu vào/ra, các ràng buộc nghiệp vụ và cơ sở lý thuyết, công nghệ sử dụng trong đề tài.", bold_prefix="Chương 1 – Tổng quan đề tài và cơ sở thực hiện: ")
    add_bullet_p(doc, "Tập trung phân tích các yêu cầu chức năng và phi chức năng, xây dựng các sơ đồ Use case, sơ đồ hoạt động, sơ đồ tuần tự, thiết kế kiến trúc hệ thống, thiết kế mô hình CSDL MongoDB và đặc tả chi tiết giao diện, danh mục RESTful API.", bold_prefix="Chương 2 – Phân tích và thiết kế giải pháp: ")
    add_bullet_p(doc, "Mô tả môi trường triển khai, cấu trúc mã nguồn, hiện thực các chức năng cốt lõi, trình bày ma trận kết quả kiểm thử, phân tích sâu hai giải pháp cải tiến kỹ thuật nổi bật, báo cáo quá trình tự học cá nhân, và đối chiếu đánh giá kết quả đạt được.", bold_prefix="Chương 3 – Xây dựng sản phẩm, kiểm thử và đánh giá: ")
    add_bullet_p(doc, "Tổng kết toàn bộ kết quả đạt được, chỉ ra các hạn chế kỹ thuật hiện tại và vạch ra định hướng nâng cấp, phát triển hệ thống trong tương lai.", bold_prefix="Phần Kết luận: ")
