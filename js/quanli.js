// ════════════════════════════════════════════════════════════
// quanli.js — Trang quản lí (chỉ dành cho admin)
// Gồm hai phần: quản lí sản phẩm và quản lí tài khoản
// ════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════
// PHẦN 1 — QUẢN LÍ SẢN PHẨM
// ════════════════════════════════════════════════════════════

// Dữ liệu sản phẩm được server inject qua window.ROLEX_PRODUCTS_SERVER
let products  = window.ROLEX_PRODUCTS_SERVER ? [...window.ROLEX_PRODUCTS_SERVER] : [];
// ID sản phẩm đang được chỉnh sửa; null khi thêm mới
let editingId = null;

// ── Tham chiếu DOM — sản phẩm ───────────────────────────────
const addProductBtn    = document.getElementById("addProductBtn");
const closeModalBtn    = document.getElementById("closeModalBtn");
const cancelBtn        = document.getElementById("cancelBtn");
const productModal     = document.getElementById("productModal");
const modalOverlay     = document.getElementById("modalOverlay");
const productForm      = document.getElementById("productForm");
const modalTitle       = document.getElementById("modalTitle");
const productsList     = document.getElementById("productsList");
const searchProducts   = document.getElementById("searchProducts");
// Ô hiển thị tổng số sản phẩm trên stat card đầu tiên
const productCountStat = document.querySelector(".stat-card:first-child .stat-value");

// ════════════════════════════════════════════════════════════
// TIỆN ÍCH
// ════════════════════════════════════════════════════════════

// Định dạng số tiền không có đơn vị (dùng trong bảng)
function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN").format(value);
}

// Định dạng ngày tháng theo locale Việt Nam
function formatDate(dateString) {
    if (!dateString) return "N/A";
    try { return new Date(dateString).toLocaleDateString("vi-VN"); }
    catch { return dateString; }
}

// Chuyển mã bộ sưu tập thành tên hiển thị
function getCollectionLabel(c) {
    return { classic: "Classic", sport: "Sport", diving: "Diving", luxury: "Luxury" }[c] || c;
}

// Chuyển mã vai trò thành tên hiển thị
function getRoleLabel(role) {
    return { user: "Người dùng", admin: "Quản trị viên" }[role] || role;
}

// ════════════════════════════════════════════════════════════
// MODAL SẢN PHẨM — Mở/đóng form thêm/sửa sản phẩm
// ════════════════════════════════════════════════════════════

// Mở modal; nếu truyền product thì điền dữ liệu để sửa, ngược lại là thêm mới
function openProductModal(product = null) {
    editingId = product ? product.id : null;
    if (product) {
        // Chế độ sửa: điền thông tin hiện tại vào form và khóa trường ID
        modalTitle.textContent = "Chỉnh sửa sản phẩm";
        document.getElementById("productName").value       = product.name;
        document.getElementById("productId").value         = product.id;
        document.getElementById("productModel").value      = product.model;
        document.getElementById("productPrice").value      = product.price;
        document.getElementById("productCollection").value = product.collection;
        document.getElementById("productImage").value      = product.image || "";
        document.getElementById("productId").disabled      = true; // Không cho đổi ID
    } else {
        // Chế độ thêm mới: reset form và mở khóa trường ID
        modalTitle.textContent = "Thêm sản phẩm mới";
        productForm.reset();
        document.getElementById("productId").disabled = false;
    }
    productModal.classList.add("open");
    modalOverlay.classList.add("show");
}

// Đóng modal và reset về trạng thái ban đầu
function closeProductModal() {
    productModal.classList.remove("open");
    modalOverlay.classList.remove("show");
    editingId = null;
    productForm.reset();
    document.getElementById("productId").disabled = false;
}

// ════════════════════════════════════════════════════════════
// RENDER DANH SÁCH SẢN PHẨM
// ════════════════════════════════════════════════════════════

// Vẽ bảng sản phẩm, lọc theo từ khóa nếu có
function renderProducts(filter = "") {
    const term = filter.toLowerCase();
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
    if (filtered.length === 0) {
        productsList.innerHTML = '<tr class="empty-row"><td colspan="6">Không tìm thấy sản phẩm nào.</td></tr>';
        return;
    }
    // Render từng hàng trong bảng, gắn data-id vào nút để nhận diện khi click
    productsList.innerHTML = filtered.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.id}</td>
            <td>${p.model}</td>
            <td>${formatVnd(p.price)}</td>
            <td><span class="collection-badge collection-${p.collection}">${getCollectionLabel(p.collection)}</span></td>
            <td class="action-buttons">
                <button class="edit-btn" data-id="${p.id}">Sửa</button>
                <button class="delete-btn" data-id="${p.id}">Xóa</button>
            </td>
        </tr>
    `).join("");
    // Cập nhật số liệu thống kê tổng sản phẩm
    if (productCountStat) productCountStat.textContent = products.length;
}

// ════════════════════════════════════════════════════════════
// LƯU SẢN PHẨM (thêm mới hoặc cập nhật)
// ════════════════════════════════════════════════════════════
async function saveProduct(formData) {
    // Thu thập dữ liệu từ form
    const productData = {
        id:         editingId || (formData.get("productId") || "").trim(),
        name:       (formData.get("productName")       || "").trim(),
        model:      (formData.get("productModel")      || "").trim(),
        price:      parseInt(formData.get("productPrice") || "0", 10),
        collection: (formData.get("productCollection") || "").trim(),
        image:      (formData.get("productImage")      || "").trim()
    };

    // Validate các trường bắt buộc
    if (!productData.id || !productData.name || !productData.model || !productData.collection) {
        showNotice("Vui lòng điền đầy đủ các trường bắt buộc!", "error");
        return;
    }
    if (isNaN(productData.price) || productData.price < 0) {
        showNotice("Giá sản phẩm không hợp lệ!", "error");
        return;
    }

    try {
        let res, result;
        if (editingId) {
            // Cập nhật sản phẩm đã có — PUT /api/products/:id
            res = await fetch(`/api/products/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData)
            });
        } else {
            // Thêm sản phẩm mới — POST /api/products
            res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData)
            });
        }

        result = await res.json();
        if (!result.success) {
            showNotice(result.message || "Lỗi xử lý!", "error");
            return;
        }

        if (editingId) {
            // Cập nhật bản ghi trong mảng local để khỏi reload trang
            const idx = products.findIndex(p => p.id === editingId);
            if (idx !== -1) products[idx] = { ...products[idx], ...productData };
            showNotice("Cập nhật sản phẩm thành công!");
        } else {
            products.push(productData);
            showNotice("Thêm sản phẩm thành công!");
        }

        renderProducts(searchProducts ? searchProducts.value : "");
        closeProductModal();
    } catch (err) {
        showNotice("Lỗi kết nối server!", "error");
    }
}

// ════════════════════════════════════════════════════════════
// XÓA SẢN PHẨM
// ════════════════════════════════════════════════════════════
async function deleteProduct(productId) {
    // Xác nhận trước khi xóa để tránh thao tác nhầm
    if (!confirm(`Bạn chắc chắn muốn xóa sản phẩm "${productId}"?`)) return;
    try {
        const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
        const result = await res.json();
        if (!result.success) {
            showNotice(result.message || "Lỗi xóa sản phẩm!", "error");
            return;
        }
        // Xóa khỏi mảng local và cập nhật bảng
        products = products.filter(p => p.id !== productId);
        renderProducts(searchProducts ? searchProducts.value : "");
        showNotice("Đã xóa sản phẩm.");
    } catch (err) {
        showNotice("Lỗi kết nối server!", "error");
    }
}

// ── Event listeners — sản phẩm ───────────────────────────────
if (addProductBtn) addProductBtn.addEventListener("click", () => openProductModal());
if (closeModalBtn) closeModalBtn.addEventListener("click", closeProductModal);
if (cancelBtn)     cancelBtn.addEventListener("click", closeProductModal);

// Đóng modal khi click vào phần overlay (ngoài modal)
if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeProductModal();
    });
}

if (productForm) {
    productForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveProduct(new FormData(productForm));
    });
}

// Lọc danh sách theo từ khóa khi gõ vào ô tìm kiếm
if (searchProducts) {
    searchProducts.addEventListener("input", (e) => renderProducts(e.target.value));
}

// Event delegation: xử lý click nút Sửa/Xóa trong bảng sản phẩm
if (productsList) {
    productsList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.classList.contains("edit-btn")) {
            const p = products.find(p => p.id === id);
            if (p) openProductModal(p);
        } else if (btn.classList.contains("delete-btn")) {
            deleteProduct(id);
        }
    });
}

// ════════════════════════════════════════════════════════════
// PHẦN 2 — QUẢN LÍ TÀI KHOẢN
// ════════════════════════════════════════════════════════════

// Dữ liệu tài khoản được server inject qua window.ROLEX_ACCOUNTS_SERVER
let accounts               = window.ROLEX_ACCOUNTS_SERVER ? [...window.ROLEX_ACCOUNTS_SERVER] : [];
// Username đang được chỉnh sửa; null khi thêm mới
let editingAccountUsername = null;

// ── Tham chiếu DOM — tài khoản ──────────────────────────────
const addAccountBtn        = document.getElementById("addAccountBtn");
const closeAccountModalBtn = document.getElementById("closeAccountModalBtn");
const cancelAccountBtn     = document.getElementById("cancelAccountBtn");
const accountModal         = document.getElementById("accountModal");
const accountModalOverlay  = document.getElementById("accountModalOverlay");
const accountForm          = document.getElementById("accountForm");
const accountModalTitle    = document.getElementById("accountModalTitle");
const accountsList         = document.getElementById("accountsList");
const searchAccounts       = document.getElementById("searchAccounts");
const passwordNote         = document.getElementById("passwordNote"); // Ghi chú "để trống = giữ nguyên mật khẩu"
const accountPasswordInput = document.getElementById("accountPassword");

// ════════════════════════════════════════════════════════════
// MODAL TÀI KHOẢN — Mở/đóng form thêm/sửa tài khoản
// ════════════════════════════════════════════════════════════

// Mở modal; nếu truyền account thì điền dữ liệu để sửa, ngược lại là thêm mới
function openAccountModal(account = null) {
    editingAccountUsername = account ? account.username : null;
    if (account) {
        // Chế độ sửa: khóa username, bỏ bắt buộc mật khẩu (để trống = giữ nguyên)
        accountModalTitle.textContent = "Chỉnh sửa tài khoản";
        document.getElementById("accountUsername").value    = account.username;
        document.getElementById("accountUsername").disabled = true;
        document.getElementById("accountPassword").value    = "";
        document.getElementById("accountRole").value        = account.role;
        if (passwordNote)         passwordNote.style.display = "block";
        if (accountPasswordInput) accountPasswordInput.required = false;
    } else {
        // Chế độ thêm mới: reset form, mật khẩu là bắt buộc
        accountModalTitle.textContent = "Thêm tài khoản mới";
        accountForm.reset();
        document.getElementById("accountUsername").disabled = false;
        if (passwordNote)         passwordNote.style.display = "none";
        if (accountPasswordInput) accountPasswordInput.required = true;
    }
    accountModal.classList.add("open");
    if (accountModalOverlay) accountModalOverlay.classList.add("show");
}

// Đóng modal tài khoản và reset về trạng thái ban đầu
function closeAccountModal() {
    accountModal.classList.remove("open");
    if (accountModalOverlay) accountModalOverlay.classList.remove("show");
    editingAccountUsername = null;
    accountForm.reset();
    document.getElementById("accountUsername").disabled = false;
    if (passwordNote)         passwordNote.style.display = "none";
    if (accountPasswordInput) accountPasswordInput.required = true;
}

// ════════════════════════════════════════════════════════════
// RENDER DANH SÁCH TÀI KHOẢN
// ════════════════════════════════════════════════════════════

// Vẽ bảng tài khoản, lọc theo username hoặc role nếu có từ khóa
function renderAccounts(filter = "") {
    const term = filter.toLowerCase();
    const filtered = accounts.filter(a =>
        a.username.toLowerCase().includes(term) ||
        (a.role || "").toLowerCase().includes(term)
    );
    if (filtered.length === 0) {
        accountsList.innerHTML = '<tr class="empty-row"><td colspan="5">Không tìm thấy tài khoản nào.</td></tr>';
        return;
    }
    // Gắn data-username vào nút để nhận diện khi click (thay vì data-id)
    accountsList.innerHTML = filtered.map(a => `
        <tr>
            <td>${a.username}</td>
            <td>${getRoleLabel(a.role)}</td>
            <td><span class="status-badge status-active">Hoạt động</span></td>
            <td>${formatDate(a.createdAt)}</td>
            <td class="action-buttons">
                <button class="edit-btn" data-username="${a.username}">Sửa</button>
                <button class="delete-btn" data-username="${a.username}">Xóa</button>
            </td>
        </tr>
    `).join("");
}

// ════════════════════════════════════════════════════════════
// LƯU TÀI KHOẢN (thêm mới hoặc cập nhật)
// ════════════════════════════════════════════════════════════
async function saveAccount(formData) {
    const username = editingAccountUsername || (formData.get("accountUsername") || "").trim();
    const password = (formData.get("accountPassword") || "").trim();
    const role     = (formData.get("accountRole")     || "").trim();

    if (!username || !role) {
        showNotice("Vui lòng điền đầy đủ các trường bắt buộc!", "error");
        return;
    }

    try {
        let res, result;
        if (editingAccountUsername) {
            // Cập nhật tài khoản: chỉ gửi mật khẩu nếu người dùng nhập mới
            const body = { role };
            if (password) body.password = password;
            res = await fetch(`/api/accounts/${editingAccountUsername}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        } else {
            // Thêm tài khoản mới: mật khẩu là bắt buộc
            if (!password) {
                showNotice("Vui lòng nhập mật khẩu!", "error");
                return;
            }
            res = await fetch("/api/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, role })
            });
        }

        result = await res.json();
        if (!result.success) {
            showNotice(result.message || "Lỗi xử lý!", "error");
            return;
        }

        if (editingAccountUsername) {
            // Chỉ cập nhật role trong mảng local (password không lưu ở client)
            const idx = accounts.findIndex(a => a.username === editingAccountUsername);
            if (idx !== -1) accounts[idx].role = role;
            showNotice("Cập nhật tài khoản thành công!");
        } else {
            // Thêm tài khoản mới vào mảng local với ngày tạo hiện tại
            accounts.push({ username, role, createdAt: new Date().toISOString() });
            showNotice("Thêm tài khoản thành công!");
        }

        renderAccounts(searchAccounts ? searchAccounts.value : "");
        closeAccountModal();
    } catch (err) {
        showNotice("Lỗi kết nối server!", "error");
    }
}

// ════════════════════════════════════════════════════════════
// XÓA TÀI KHOẢN
// ════════════════════════════════════════════════════════════
async function deleteAccount(username) {
    // Bảo vệ tài khoản admin gốc khỏi bị xóa nhầm
    if (username === "admin") {
        showNotice("Không thể xóa tài khoản admin!", "error");
        return;
    }
    if (!confirm(`Bạn chắc chắn muốn xóa tài khoản "${username}"?`)) return;
    try {
        const res = await fetch(`/api/accounts/${username}`, { method: "DELETE" });
        const result = await res.json();
        if (!result.success) {
            showNotice(result.message || "Lỗi xóa tài khoản!", "error");
            return;
        }
        accounts = accounts.filter(a => a.username !== username);
        renderAccounts(searchAccounts ? searchAccounts.value : "");
        showNotice("Đã xóa tài khoản.");
    } catch (err) {
        showNotice("Lỗi kết nối server!", "error");
    }
}

// ── Event listeners — tài khoản ─────────────────────────────
if (addAccountBtn)        addAccountBtn.addEventListener("click", () => openAccountModal());
if (closeAccountModalBtn) closeAccountModalBtn.addEventListener("click", closeAccountModal);
if (cancelAccountBtn)     cancelAccountBtn.addEventListener("click", closeAccountModal);

// Đóng modal khi click vào overlay
if (accountModalOverlay) {
    accountModalOverlay.addEventListener("click", (e) => {
        if (e.target === accountModalOverlay) closeAccountModal();
    });
}

if (accountForm) {
    accountForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveAccount(new FormData(accountForm));
    });
}

if (searchAccounts) {
    searchAccounts.addEventListener("input", (e) => renderAccounts(e.target.value));
}

// Event delegation: xử lý click nút Sửa/Xóa trong bảng tài khoản
if (accountsList) {
    accountsList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const username = btn.dataset.username;
        if (btn.classList.contains("edit-btn")) {
            const a = accounts.find(a => a.username === username);
            if (a) openAccountModal(a);
        } else if (btn.classList.contains("delete-btn")) {
            deleteAccount(username);
        }
    });
}

// ════════════════════════════════════════════════════════════
// THÔNG BÁO INLINE — Toast nhỏ góc phải màn hình
// ════════════════════════════════════════════════════════════

// Hiện thông báo thành công/lỗi, tự ẩn sau 3 giây
function showNotice(message, type = "success") {
    // Tái dùng phần tử đã có nếu đang hiện để tránh tạo nhiều toast
    let notice = document.getElementById("rlx-notice");
    if (!notice) {
        notice = document.createElement("div");
        notice.id = "rlx-notice";
        notice.style.cssText = `
            position: fixed; top: 88px; right: 24px; z-index: 200;
            padding: 14px 22px; font-size: 0.88rem; font-family: inherit;
            border-left: 3px solid; max-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        `;
        document.body.appendChild(notice);
    }
    notice.textContent = message;
    // Màu đỏ cho lỗi, màu xanh Rolex cho thành công
    if (type === "error") {
        notice.style.background  = "#fff8f8";
        notice.style.borderColor = "#c0392b";
        notice.style.color       = "#c0392b";
    } else {
        notice.style.background  = "#f0faf4";
        notice.style.borderColor = "#006039";
        notice.style.color       = "#006039";
    }
    notice.style.display = "block";
    // Hủy timer cũ nếu thông báo mới xuất hiện trước khi hết 3 giây
    clearTimeout(notice._timer);
    notice._timer = setTimeout(() => { notice.style.display = "none"; }, 3000);
}

// ════════════════════════════════════════════════════════════
// KHỞI TẠO TRANG
// ════════════════════════════════════════════════════════════
renderProducts();  // Hiển thị bảng sản phẩm ngay khi tải trang
renderAccounts();  // Hiển thị bảng tài khoản ngay khi tải trang
