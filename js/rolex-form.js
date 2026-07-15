// ════════════════════════════════════════════════════════════
// rolex-form.js — Xử lí form đăng ký tài khoản
// Validate phía client, kiểm tra trùng username, lưu vào localStorage
// ════════════════════════════════════════════════════════════

// Tham chiếu form và vùng thông báo trạng thái
const registerForm = document.getElementById("registerForm");
const formStatus = document.getElementById("formStatus");
// Key localStorage phải nhất quán với auth-ui.js và login.js
const accountsStorageKey = "rolex_accounts_v1";

// ════════════════════════════════════════════════════════════
// TIỆN ÍCH VALIDATE
// ════════════════════════════════════════════════════════════

// Thêm/xóa class "invalid" để CSS hiển thị viền đỏ trên trường lỗi
function setFieldState(field, valid) {
    if (valid) {
        field.classList.remove("invalid");
    } else {
        field.classList.add("invalid");
    }
}

// Kiểm tra email có đúng định dạng user@domain.ext không
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Kiểm tra số điện thoại Việt Nam: bắt đầu bằng 0, tổng 10-11 chữ số
function validatePhone(phone) {
    return /^0\d{9,10}$/.test(phone);
}

// ════════════════════════════════════════════════════════════
// XỬ LÍ SUBMIT FORM ĐĂNG KÝ
// ════════════════════════════════════════════════════════════
if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Ngăn submit mặc định để validate trước

        // Lấy tham chiếu tất cả các trường trong form
        const fullName = document.getElementById("fullName");
        const email    = document.getElementById("email");
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const phone    = document.getElementById("phone");
        const interest = document.getElementById("interest");
        const agree    = document.getElementById("agree"); // Checkbox đồng ý điều khoản

        // Định nghĩa luật validate cho từng trường
        const checks = [
            { field: fullName, valid: fullName.value.trim().length >= 3 },          // Tên ≥ 3 ký tự
            { field: email,    valid: validateEmail(email.value.trim()) },           // Email hợp lệ
            { field: username, valid: username.value.trim().length >= 4 },           // Username ≥ 4 ký tự
            { field: password, valid: password.value.trim().length >= 5 },           // Mật khẩu ≥ 5 ký tự
            { field: phone,    valid: validatePhone(phone.value.trim()) },            // SĐT Việt Nam hợp lệ
            { field: interest, valid: interest.value.trim() !== "" }                  // Phải chọn sở thích
        ];

        // Áp dụng trạng thái hợp lệ/không hợp lệ cho từng trường
        checks.forEach((item) => setFieldState(item.field, item.valid));

        // Tất cả trường phải hợp lệ VÀ checkbox phải được chọn
        const allValid = checks.every((item) => item.valid) && agree.checked;

        if (!allValid) {
            formStatus.className = "form-status error";
            formStatus.textContent = "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.";
            return;
        }

        // ── Kiểm tra trùng tên với tài khoản hệ thống cố định ──
        // Các tài khoản này được hard-code, không lưu trong localStorage
        const baseAccounts = ["admin", "vinhdinh1"];
        const userNameValue = username.value.trim().toLowerCase();

        if (baseAccounts.includes(userNameValue)) {
            formStatus.className = "form-status error";
            formStatus.textContent = "Tài khoản này đã tồn tại. Vui lòng chọn tên khác.";
            return;
        }

        // ── Kiểm tra trùng tên với tài khoản đã đăng ký trong localStorage ──
        let accounts = [];
        try {
            const raw = localStorage.getItem(accountsStorageKey);
            accounts = raw ? JSON.parse(raw) : [];
        } catch (error) {
            accounts = []; // Nếu dữ liệu localStorage bị hỏng thì bỏ qua
        }

        const existed = accounts.some(
            (account) => account.username.toLowerCase() === userNameValue
        );
        if (existed) {
            formStatus.className = "form-status error";
            formStatus.textContent = "Tài khoản này đã tồn tại. Vui lòng chọn tên khác.";
            return;
        }

        // ── Lưu tài khoản mới vào localStorage ──
        // Tài khoản mới mặc định có role "user"; admin phải được cấp thủ công
        accounts.push({
            username: username.value.trim(),
            password: password.value.trim(),
            role: "user",
            fullName: fullName.value.trim(),
            email: email.value.trim()
        });
        localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));

        // Thông báo thành công, reset form và xóa các class invalid
        formStatus.className = "form-status success";
        formStatus.textContent = "Đăng ký thành công! Tài khoản mặc định là user và có thể đăng nhập ngay.";
        registerForm.reset();
        checks.forEach((item) => item.field.classList.remove("invalid"));
    });
}
