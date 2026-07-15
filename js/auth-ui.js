// ════════════════════════════════════════════════════════════
// auth-ui.js — Quản lí giao diện xác thực & các thành phần UI
// Chạy trên mọi trang: tạo mega menu, chat CSKH, header auth
// ════════════════════════════════════════════════════════════

// ── Biến toàn cục ────────────────────────────────────────────
// Trạng thái đăng nhập và thông tin người dùng hiện tại
let isLoggedIn = false;
let currentUser = "";
let currentRole = "";

// Tham chiếu tới hai loại header: classic (.header) và lux (.lux-header)
const body = document.body;
const classicHeader = document.querySelector(".header");
const luxHeader = document.querySelector(".lux-header");

// ════════════════════════════════════════════════════════════
// KHỞI TẠO — Lấy trạng thái đăng nhập từ server
// ════════════════════════════════════════════════════════════

// Gọi API kiểm tra phiên đăng nhập; timeout 3 giây để không block trang
async function initAuthStatus() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/auth/check', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        // Nếu server xác nhận đã đăng nhập, lưu thông tin người dùng
        if (data.authenticated) {
            isLoggedIn = true;
            currentUser = data.user.username || "";
            currentRole = data.user.role || "";
        }
    } catch (error) {
        // Bỏ qua lỗi mạng hoặc timeout — trang vẫn hiển thị bình thường
        console.debug('Auth check skipped or timed out');
    }

    // Sau khi lấy thông tin (hoặc timeout), setup UI
    setupUI();
}

// ════════════════════════════════════════════════════════════
// SETUP UI — Gọi tuần tự các hàm khởi tạo thành phần giao diện
// ════════════════════════════════════════════════════════════
function setupUI() {
    createMegaMenu();        // Tạo menu danh mục kéo từ trái
    setupNavAuthLinks();     // Ẩn/hiện link đăng nhập/đăng ký tùy trạng thái
    highlightMegaQuickNav(); // Đánh dấu trang đang active trong mega menu
    createSupportChat();     // Tạo widget chat CSKH góc phải màn hình
    setupAuthHeader();       // Thêm nút đăng nhập / tên người dùng vào header
}

// ════════════════════════════════════════════════════════════
// MEGA MENU — Panel danh mục kéo từ bên trái
// ════════════════════════════════════════════════════════════
function createMegaMenu() {
    // Chỉ tạo một lần — nếu đã có overlay thì bỏ qua
    if (!body || body.querySelector(".mega-menu-overlay")) {
        return;
    }

    // Mega menu cần gắn vào một trong hai loại header
    const hostHeader = classicHeader || luxHeader;
    if (!hostHeader) {
        return;
    }

    // Tạo lớp nền tối phía sau drawer
    const overlay = document.createElement("div");
    overlay.className = "mega-menu-overlay";

    // Tạo drawer chứa toàn bộ nội dung menu
    const drawer = document.createElement("aside");
    drawer.className = "mega-menu-drawer";
    drawer.id = "rolexMegaDrawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML = `
        <div class="mega-menu-head">
            <h3>Danh mục Rolex</h3>
            <button type="button" class="mega-close-btn" aria-label="Đóng menu">×</button>
        </div>
        <div class="mega-menu-content">
            <!-- Cột trái: danh sách liên kết, mỗi link có data-image để preview -->
            <div class="mega-col-left">
                <a href="/sanphammoi" data-image="/media/Land-Dweller.avif" data-title="Đồng hồ và phụ kiện Rolex">Đồng hồ và phụ kiện Rolex</a>
                <a href="/" data-image="/media/máy2.jpg" data-title="Chế tác đồng hồ">Chế tác đồng hồ</a>
                <a href="/" data-image="/media/datejust 36.avif" data-title="Về Rolex">Về Rolex</a>
                <a href="/" data-image="/media/f1.jpg" data-title="Thể thao, Nghệ thuật và Hành tinh">Thể thao, Nghệ thuật và Hành tinh</a>
                <a href="/chamsockhachhang" data-image="/media/chungnhan.jpg" data-title="Chăm sóc khách hàng">Chăm sóc khách hàng</a>
                <a href="/form" data-image="/media/day-date 40.avif" data-title="Tư vấn cá nhân">Tư vấn cá nhân</a>
                <a href="/sanphammoi" data-image="/media/sky-dweller.avif" data-title="Đồng hồ mới 2026">Đồng hồ mới 2026</a>
            </div>
            <!-- Cột phải: hình ảnh preview thay đổi khi hover vào link bên trái -->
            <div class="mega-col-right">
                <a class="mega-card mega-preview" href="/sanphammoi">
                    <img src="/media/Land-Dweller.avif" alt="Danh mục Rolex" id="megaPreviewImage">
                    <span id="megaPreviewTitle">Đồng hồ và phụ kiện Rolex</span>
                </a>
            </div>
        </div>
        <!-- Thanh điều hướng nhanh ở phần dưới mega menu -->
        <nav class="mega-menu-quick" aria-label="Trang Rolex Boutique">
            <span class="mega-menu-quick-heading">Trang</span>
            <a href="/">Trang chủ</a>
            <a href="/dichvu">Dịch vụ</a>
            <a href="/chamsockhachhang">Chăm sóc KH</a>
            <a href="/sanphammoi">Sản phẩm</a>
            <a href="/form">Đăng ký</a>
            <a href="/dangnhap">Đăng nhập</a>
        </nav>
    `;

    body.appendChild(overlay);
    body.appendChild(drawer);

    // Lấy các phần tử cần tương tác trong drawer
    const closeBtn = drawer.querySelector(".mega-close-btn");
    const menuLinks = drawer.querySelectorAll(".mega-col-left a");
    const previewImage = drawer.querySelector("#megaPreviewImage");
    const previewTitle = drawer.querySelector("#megaPreviewTitle");

    // Khi hover vào link, cập nhật ảnh và tiêu đề preview bên phải
    menuLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const image = link.getAttribute("data-image");
            const title = link.getAttribute("data-title") || link.textContent || "";
            if (previewImage && image) {
                previewImage.src = image;
            }
            if (previewTitle) {
                previewTitle.textContent = title.trim();
            }
            // Xóa active của link cũ, thêm cho link đang hover
            menuLinks.forEach((item) => item.classList.remove("active-item"));
            link.classList.add("active-item");
        });
    });

    // Mặc định highlight link đầu tiên khi mở menu
    if (menuLinks[0]) {
        menuLinks[0].classList.add("active-item");
    }

    // Nút mở mega menu riêng của lux-header (nếu có)
    const luxMegaBtn = luxHeader?.querySelector(".lux-menu__mega-open");

    // Hàm mở/đóng drawer
    const openMenu = () => {
        overlay.classList.add("show");
        drawer.classList.add("open");
        drawer.setAttribute("aria-hidden", "false");
        if (luxMegaBtn) {
            luxMegaBtn.setAttribute("aria-expanded", "true");
        }
    };
    const closeMenu = () => {
        overlay.classList.remove("show");
        drawer.classList.remove("open");
        drawer.setAttribute("aria-hidden", "true");
        if (luxMegaBtn) {
            luxMegaBtn.setAttribute("aria-expanded", "false");
        }
    };

    // Với classic header: tạo nút hamburger và gắn vào đầu header
    if (classicHeader) {
        const openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.className = "hamburger-btn";
        openBtn.setAttribute("aria-label", "Mở danh mục");
        openBtn.innerHTML = "<span></span><span></span><span></span>";
        classicHeader.prepend(openBtn);
        openBtn.addEventListener("click", openMenu);
    } else if (luxMegaBtn) {
        // Với lux header: dùng nút mega-open sẵn có trong HTML
        luxMegaBtn.addEventListener("click", openMenu);
    }

    // Đóng menu khi bấm nút ×, click overlay, hoặc nhấn Escape
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}

// ════════════════════════════════════════════════════════════
// CHAT CSKH — Widget chat nổi góc phải màn hình
// ════════════════════════════════════════════════════════════
function createSupportChat() {
    // Chỉ tạo một lần — tránh trùng lặp khi script chạy lại
    if (!body || body.querySelector(".chat-widget")) {
        return;
    }

    // Tạo toàn bộ cấu trúc HTML của widget chat
    const widget = document.createElement("div");
    widget.className = "chat-widget";
    widget.innerHTML = `
        <button type="button" class="chat-toggle-btn" aria-label="Mở chat CSKH">CSKH</button>
        <section class="chat-box" aria-hidden="true">
            <header class="chat-header">
            <h4>Tư vấn CSKH</h4>
                <button type="button" class="chat-close-btn" aria-label="Đóng chat">×</button>
            </header>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot">Xin chào! Tôi có thể hỗ trợ giá, bảo hành, địa chỉ, hotline.</div>
            </div>
            <form class="chat-form" id="chatForm">
                <input id="chatInput" type="text" placeholder="Nhập nội dung cần hỗ trợ..." autocomplete="off">
                <button type="submit">Gửi</button>
            </form>
        </section>
    `;

    body.appendChild(widget);

    // Lấy tham chiếu các phần tử trong widget
    const toggleBtn = widget.querySelector(".chat-toggle-btn");
    const closeBtn = widget.querySelector(".chat-close-btn");
    const chatBox = widget.querySelector(".chat-box");
    const chatMessages = widget.querySelector("#chatMessages");
    const chatForm = widget.querySelector("#chatForm");
    const chatInput = widget.querySelector("#chatInput");

    // Mở chat box và focus vào ô nhập
    const openChat = () => {
        chatBox.classList.add("open");
        chatBox.setAttribute("aria-hidden", "false");
        chatInput.focus();
    };
    // Đóng chat box
    const closeChat = () => {
        chatBox.classList.remove("open");
        chatBox.setAttribute("aria-hidden", "true");
    };

    // Thêm tin nhắn vào khung chat và cuộn xuống cuối
    const addMessage = (text, role) => {
        const bubble = document.createElement("div");
        bubble.className = `chat-message ${role}`; // role: "user" hoặc "bot"
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Tra lời tự động dựa theo từ khóa trong tin nhắn người dùng
    const getBotReply = (message) => {
        const value = message.toLowerCase();
        if (value.includes("gia")) {
            return "Giá đồng hồ dao động từ 240 triệu đến trên 2 tỷ, tùy dòng và vật liệu.";
        }
        if (value.includes("bao hanh")) {
            return "Rolex bảo hành quốc tế 5 năm. Bạn có thể mang đồng hồ đến showroom để được kiểm tra.";
        }
        if (value.includes("dia chi")) {
            return "Showroom: 120 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.";
        }
        if (value.includes("hotline") || value.includes("so dien thoai")) {
            return "Hotline CSKH: 0909 123 456 - Tổng đài: 028 3939 8888.";
        }
        if (value.includes("cam on")) {
            return "Rất vui được hỗ trợ bạn. Nếu cần thêm thông tin, bạn cứ nhắn tin tiếp nhé.";
        }
        // Phản hồi mặc định khi không khớp từ khóa nào
        return "CSKH đã ghi nhận yêu cầu. Bạn vui lòng để lại SĐT hoặc email để chúng tôi liên hệ nhanh.";
    };

    toggleBtn.addEventListener("click", openChat);
    closeBtn.addEventListener("click", closeChat);

    // Xử lý gửi tin nhắn: hiện tin của user, sau 300ms hiện phản hồi bot
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = chatInput.value.trim();
        if (!text) {
            return;
        }

        addMessage(text, "user");
        chatInput.value = "";

        window.setTimeout(() => {
            addMessage(getBotReply(text), "bot");
        }, 300);
    });
}

// ════════════════════════════════════════════════════════════
// NAV AUTH LINKS — Ẩn/hiện link Đăng nhập / Đăng ký / Quản lí
// ════════════════════════════════════════════════════════════
function setupNavAuthLinks() {
    // Thu thập tất cả các nav block có thể tồn tại trên trang
    const navBlocks = [
        document.querySelector(".main-nav"),
        document.querySelector(".lux-menu__nav"),
        document.querySelector(".mega-menu-quick")
    ].filter(Boolean);

    navBlocks.forEach((navEl) => {
        // Luôn ẩn link /dangnhap (sẽ được thêm lại vào header bởi setupAuthHeader)
        navEl.querySelectorAll('a[href="/dangnhap"]').forEach((link) => link.remove());
        // Nếu đã đăng nhập thì ẩn luôn link /form (đăng ký)
        if (isLoggedIn) {
            navEl.querySelectorAll('a[href="/form"]').forEach((link) => link.remove());
        }
    });

    // Chỉ thêm link "Quản lí" nếu đã đăng nhập với role admin và chưa có link đó
    if (!isLoggedIn || currentRole !== "admin" || document.querySelector("[data-admin-link]")) {
        return;
    }

    const adminLink = document.createElement("a");
    adminLink.href = "/quanli";
    adminLink.textContent = "Quản lí";
    adminLink.setAttribute("data-admin-link", "1"); // Đánh dấu để tránh thêm trùng

    // Highlight nếu đang ở trang quản lí
    if (window.location.pathname === "/quanli") {
        adminLink.classList.add("active");
    }

    // Ưu tiên gắn vào mega-menu-quick, fallback sang nav chính
    const megaQuick = document.querySelector(".mega-menu-quick");
    if (megaQuick) {
        megaQuick.appendChild(adminLink);
        return;
    }

    const fallback = document.querySelector(".lux-menu__nav") || document.querySelector(".main-nav");
    if (fallback) {
        fallback.appendChild(adminLink);
    }
}

// ════════════════════════════════════════════════════════════
// HIGHLIGHT NAV — Đánh dấu trang hiện tại trong mega-menu-quick
// ════════════════════════════════════════════════════════════
function highlightMegaQuickNav() {
    const path = window.location.pathname || "";
    // So sánh cuối đường dẫn để hỗ trợ cả "/" và "/trang"
    document.querySelectorAll(".mega-menu-quick a[href]").forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (href && path.endsWith(href)) {
            a.classList.add("active");
        }
    });
}

// ════════════════════════════════════════════════════════════
// AUTH HEADER — Thêm khu vực đăng nhập/chào mừng vào header
// ════════════════════════════════════════════════════════════
function setupAuthHeader() {
    const header = classicHeader || luxHeader;

    // Không làm gì nếu không có header hoặc đã có .header-auth
    if (!header || document.querySelector(".header-auth")) {
        return;
    }

    const authWrap = document.createElement("div");
    authWrap.className = "header-auth";

    if (isLoggedIn && currentUser) {
        // Trường hợp đã đăng nhập: hiện tên và nút đăng xuất
        const welcome = document.createElement("span");
        welcome.className = "welcome-user";
        welcome.textContent = `Xin chào, ${currentUser}`;

        const logoutBtn = document.createElement("button");
        logoutBtn.type = "button";
        logoutBtn.className = "auth-btn logout";
        logoutBtn.textContent = "Đăng xuất";

        // Gửi POST tới /dangxuat, server trả về URL redirect sau khi xóa session
        logoutBtn.addEventListener("click", async () => {
            try {
                const response = await fetch('/dangxuat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();
                if (result.success) {
                    window.location.href = result.redirect;
                } else {
                    alert('Lỗi đăng xuất. Vui lòng thử lại.');
                }
            } catch (error) {
                console.error('Lỗi đăng xuất:', error);
                alert('Lỗi hệ thống. Vui lòng thử lại.');
            }
        });

        authWrap.appendChild(welcome);
        authWrap.appendChild(logoutBtn);
    } else {
        // Trường hợp chưa đăng nhập: hiện nút Đăng nhập
        const loginLink = document.createElement("a");
        loginLink.className = "auth-btn";
        loginLink.href = "/dangnhap";
        loginLink.textContent = "Đăng nhập";
        authWrap.appendChild(loginLink);
    }

    // Gắn vào đúng vị trí: lux-header dùng .lux-header__tools, classic dùng cuối header
    const tools = luxHeader?.querySelector(".lux-header__tools");

    if (luxHeader && tools) {
        tools.appendChild(authWrap);
    } else if (classicHeader) {
        classicHeader.appendChild(authWrap);
    }
}

// ════════════════════════════════════════════════════════════
// KHỞI CHẠY — Đợi DOM sẵn sàng rồi mới gọi initAuthStatus
// ════════════════════════════════════════════════════════════
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthStatus);
} else {
    // DOM đã sẵn sàng (script được defer hoặc đặt cuối body)
    initAuthStatus();
}
