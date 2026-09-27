// ════════════════════════════════════════════════════════════
// checkout.js — Xử lí trang thanh toán
// Đọc giỏ hàng từ localStorage, validate form, rồi submit lên server
// ════════════════════════════════════════════════════════════

// Key localStorage phải trùng với rolex-store.js để đọc đúng giỏ hàng
const cartStorageKey = 'rolex_cart_v1';

// ── Tham chiếu DOM ──────────────────────────────────────────
const checkoutForm   = document.getElementById('checkoutForm');
const checkoutStatus = document.getElementById('checkoutStatus');
const fullNameInput  = document.getElementById('fullName');
const emailInput     = document.getElementById('email');
const phoneInput     = document.getElementById('phone');
// Hidden field chứa JSON snapshot giỏ hàng, sẽ được server đọc khi submit
const cartItemsInput = document.getElementById('cartItems');

// ════════════════════════════════════════════════════════════
// TIỆN ÍCH
// ════════════════════════════════════════════════════════════

// Định dạng số tiền theo kiểu Việt Nam
function formatVnd(value) {
    return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
}

// Tải giỏ hàng từ localStorage; trả về {} nếu lỗi hoặc trống
function loadCart() {
    try {
        const raw = localStorage.getItem(cartStorageKey);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

// ════════════════════════════════════════════════════════════
// XÂY DỰNG SNAPSHOT GIỎ HÀNG
// ════════════════════════════════════════════════════════════

// Tạo snapshot từ giỏ hàng + danh sách sản phẩm server để gửi lên server
// window.ROLEX_PRODUCTS_SERVER được server inject vào trang qua EJS
function buildSnapshot() {
    const cart   = loadCart();
    const stored = window.ROLEX_PRODUCTS_SERVER || []; // Danh sách sản phẩm từ server
    const items  = [];
    let total    = 0;

    Object.entries(cart).forEach(([id, qty]) => {
        const numericQty = Number(qty);
        // Bỏ qua mục có số lượng không hợp lệ
        if (!Number.isFinite(numericQty) || numericQty <= 0) return;
        const product = stored.find(p => p.id === id);
        // Bỏ qua sản phẩm không tìm thấy trong danh sách server
        if (!product) return;
        const lineTotal = product.price * numericQty;
        total += lineTotal;
        items.push({ id: product.id, name: product.name, price: product.price, qty: numericQty, lineTotal });
    });

    return { items, total };
}

// ════════════════════════════════════════════════════════════
// HIỂN THỊ LỖI
// ════════════════════════════════════════════════════════════

// Hiện thông báo lỗi ngay dưới form
function showError(msg) {
    checkoutStatus.textContent = msg;
    checkoutStatus.className   = 'form-status error';
    checkoutStatus.style.display = 'block';
}

// ════════════════════════════════════════════════════════════
// XỬ LÍ SUBMIT
// ════════════════════════════════════════════════════════════
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn submit mặc định để validate trước

    const fullName = fullNameInput.value.trim();
    const email    = emailInput.value.trim();
    const phone    = phoneInput.value.trim();

    // Validate các trường bắt buộc
    if (!fullName || !email || !phone) {
        showError('Vui lòng nhập đầy đủ họ tên, email và số điện thoại.');
        return;
    }

    // Kiểm tra giỏ hàng có sản phẩm hợp lệ không
    const snapshot = buildSnapshot();
    if (snapshot.items.length === 0) {
        showError('Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán.');
        return;
    }

    // The server remains authoritative for price and stock; preserve the cart if submission fails.
    cartItemsInput.value = JSON.stringify(snapshot);
    checkoutForm.submit();
});
