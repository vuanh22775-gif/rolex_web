// ════════════════════════════════════════════════════════════
// login.js — Xử lí đăng nhập bằng AJAX (không reload trang)
// ════════════════════════════════════════════════════════════

// Tham chiếu form và vùng hiển thị thông báo trạng thái
const loginForm   = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");

// ── Kiểm tra nếu đã đăng nhập (non-blocking) ────────────────
// Chạy ngay khi trang load; nếu có session hợp lệ thì chuyển hướng luôn
(async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('/api/auth/check', {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.authenticated) {
            // Ưu tiên redirect URL từ query string (VD: /dangnhap?redirect=/thanhtoan)
            const redirect = new URLSearchParams(window.location.search).get('redirect');
            if (redirect) {
                window.location.href = redirect;
            } else {
                // Admin → trang quản lí, user thường → trang chủ
                window.location.href = data.user.role === 'admin' ? '/quanli' : '/';
            }
        }
    } catch (error) {
        // Lỗi request không block page load — trang đăng nhập vẫn hiển thị bình thường
        console.debug('Auth check skipped or timed out');
    }
})();

// ── Xử lý submit form đăng nhập ─────────────────────────────
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Ngăn form submit theo cách truyền thống

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        // Giữ lại redirect nếu người dùng được dẫn tới trang đăng nhập từ trang khác
        const redirect = new URLSearchParams(window.location.search).get('redirect');

        // Validate phía client trước khi gửi lên server
        if (!username || !password) {
            loginStatus.className = "form-status error";
            loginStatus.textContent = "Vui lòng nhập tài khoản và mật khẩu.";
            return;
        }

        try {
            // Hiện trạng thái "đang xử lý"
            loginStatus.className = "form-status loading";
            loginStatus.textContent = "Đang đăng nhập...";

            // Gửi thông tin đăng nhập lên server dưới dạng JSON
            const response = await fetch('/dangnhap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    redirect: redirect
                })
            });

            const result = await response.json();

            if (result.success) {
                // Đăng nhập thành công: hiện thông báo rồi chuyển hướng sau 500ms
                loginStatus.className = "form-status success";
                loginStatus.textContent = result.message;

                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 500);
            } else {
                // Đăng nhập thất bại: hiện lỗi và xóa mật khẩu để người dùng nhập lại
                loginStatus.className = "form-status error";
                loginStatus.textContent = result.message || "Lỗi đăng nhập. Vui lòng thử lại.";

                document.getElementById("password").value = '';
            }
        } catch (error) {
            // Lỗi mạng hoặc server không phản hồi
            console.error('Lỗi:', error);
            loginStatus.className = "form-status error";
            loginStatus.textContent = "Lỗi hệ thống. Vui lòng thử lại.";
        }
    });
}
