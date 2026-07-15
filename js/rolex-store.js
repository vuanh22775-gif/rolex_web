// ════════════════════════════════════════════════════════════
// rolex-store.js — Trang sản phẩm: lọc, sắp xếp, giỏ hàng
// ════════════════════════════════════════════════════════════

// ── Dữ liệu sản phẩm mặc định (fallback khi không có server/localStorage) ──
const defaultProducts = [
    {
        id: "126234",
        name: "Datejust 36",
        model: "Oyster 36 mm - Oystersteel & white gold",
        price: 246787000,
        collection: "classic",
        image: "media/datejust 36.avif"
    },
    {
        id: "126334",
        name: "Datejust 41",
        model: "Oyster 41 mm - Fluted bezel Everose",
        price: 287918000,
        collection: "classic",
        image: "media/116234.avif"
    },
    {
        id: "279135RBR",
        name: "Lady-Datejust",
        model: "Oyster 28 mm - Everose gold & diamonds",
        price: 1236676000,
        collection: "luxury",
        image: "media/day-date 40.avif"
    },
    {
        id: "126610LN",
        name: "Submariner Date",
        model: "Oyster 41 mm - Black ceramic bezel gold",
        price: 340000000,
        collection: "diving",
        image: "media/submariner.avif"
    },
    {
        id: "126660",
        name: "Deepsea",
        model: "Oyster 44 mm - D-blue dial",
        price: 580000000,
        collection: "diving",
        image: "media/deepsea.avif"
    },
    {
        id: "126710BLRO",
        name: "GMT-Master II",
        model: "Oyster 40 mm - Dual color bezel",
        price: 420000000,
        collection: "sport",
        image: "media/11610lv.avif"
    },
    {
        id: "116508",
        name: "Cosmograph Daytona",
        model: "Oyster 40 mm - 18 ct yellow gold",
        price: 1150000000,
        collection: "sport",
        image: "media/sky-dweller.avif"
    },
    {
        id: "50535",
        name: "Cellini Moonphase",
        model: "39 mm - Everose 18 ct",
        price: 890000000,
        collection: "luxury",
        image: "media/Land-Dweller.avif"
    },
    {
        id: "126600",
        name: "Sea-Dweller",
        model: "Oyster 43 mm - Oystersteel",
        price: 520000000,
        collection: "diving",
        image: "media/sea.avif"
    }
];

// ── Tải danh sách sản phẩm ───────────────────────────────────
// Ưu tiên: dữ liệu server (ROLEX_PRODUCTS_SERVER) > localStorage > defaultProducts
const productsStorageKey = "rolex_products_db";
let products = loadStoredProducts();

function loadStoredProducts() {
    // Nếu server đã inject dữ liệu vào window, dùng ngay
    if (window.ROLEX_PRODUCTS_SERVER && window.ROLEX_PRODUCTS_SERVER.length > 0) {
        return window.ROLEX_PRODUCTS_SERVER;
    }
    // Thử tải từ localStorage (admin có thể đã lưu thay đổi trước đó)
    try {
        const stored = localStorage.getItem(productsStorageKey);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.warn("Lỗi khi tải sản phẩm từ localStorage, sử dụng mặc định:", error);
    }
    return defaultProducts;
}

// ── Tham chiếu DOM ──────────────────────────────────────────
const cartStorageKey = "rolex_cart_v1";
const searchInput       = document.getElementById("searchInput");
const collectionFilter  = document.getElementById("collectionFilter");
const priceFilter       = document.getElementById("priceFilter");
const sortBy            = document.getElementById("sortBy");
const productGrid       = document.getElementById("productGrid");
const cartCount         = document.getElementById("cartCount");
const cartItems         = document.getElementById("cartItems");
const cartSubtotal      = document.getElementById("cartSubtotal");
const cartDrawer        = document.getElementById("cartDrawer");
const overlay           = document.getElementById("overlay");
const openCartBtn       = document.getElementById("openCartBtn");
const closeCartBtn      = document.getElementById("closeCartBtn");
const clearCartBtn      = document.getElementById("clearCartBtn");
const checkoutBtn       = document.getElementById("checkoutBtn");

// Các key dự phòng (hiện chưa dùng trong logic chính)
const cartAuthStateKey      = "rolex_manager_auth";
const checkoutGateKey       = "rolex_checkout_from_cart";
const checkoutRedirectKey   = "rolex_after_login_redirect";

// Tải giỏ hàng từ localStorage khi trang khởi động
let cart = loadCart();

// ════════════════════════════════════════════════════════════
// TIỆN ÍCH
// ════════════════════════════════════════════════════════════

// Định dạng số tiền theo kiểu Việt Nam (VD: 246.787.000 VND)
function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + " VND";
}

// ════════════════════════════════════════════════════════════
// GIỎ HÀNG — Lưu/tải giỏ hàng qua localStorage
// ════════════════════════════════════════════════════════════

// Tải giỏ hàng: { productId: quantity, ... }
function loadCart() {
    try {
        const raw = localStorage.getItem(cartStorageKey);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        return {};
    }
}

// Lưu trạng thái giỏ hàng hiện tại vào localStorage
function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

// Xóa các mục không hợp lệ trong giỏ (sản phẩm không còn tồn tại, số lượng ≤ 0)
function normalizeCart() {
    const validIds = new Set(products.map((item) => item.id));
    let changed = false;

    Object.keys(cart).forEach((id) => {
        if (!validIds.has(id) || !Number.isFinite(Number(cart[id])) || Number(cart[id]) <= 0) {
            delete cart[id];
            changed = true;
        }
    });

    // Chỉ lưu lại nếu có thay đổi để tránh ghi localStorage không cần thiết
    if (changed) {
        saveCart();
    }
}

// ════════════════════════════════════════════════════════════
// LỌC & SẮP XẾP SẢN PHẨM
// ════════════════════════════════════════════════════════════

// Trả về danh sách sản phẩm đã lọc theo từ khóa, bộ sưu tập, mức giá và sắp xếp
function filteredProducts() {
    const term        = searchInput.value.trim().toLowerCase();
    const collection  = collectionFilter.value;
    const priceRange  = priceFilter.value;
    const sortValue   = sortBy.value;

    let result = products.filter((item) => {
        // Tìm kiếm theo tên hoặc mã sản phẩm
        const matchTerm =
            item.name.toLowerCase().includes(term) ||
            item.id.toLowerCase().includes(term);

        // Lọc theo bộ sưu tập
        const matchCollection = collection === "all" || item.collection === collection;

        // Lọc theo khoảng giá
        let matchPrice = true;
        if (priceRange === "under-300") {
            matchPrice = item.price < 300000000;
        } else if (priceRange === "300-700") {
            matchPrice = item.price >= 300000000 && item.price <= 700000000;
        } else if (priceRange === "over-700") {
            matchPrice = item.price > 700000000;
        }

        return matchTerm && matchCollection && matchPrice;
    });

    // Sắp xếp kết quả
    if (sortValue === "price-asc") {
        result = result.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
        result = result.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
        result = result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
}

// ════════════════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════════════════

// Vẽ lại lưới sản phẩm dựa trên kết quả lọc hiện tại
function renderProducts() {
    const items = filteredProducts();
    if (items.length === 0) {
        productGrid.innerHTML = "<p class='empty-state'>Không tìm thấy mẫu đồng hồ phù hợp.</p>";
        return;
    }

    // Tạo HTML cho từng sản phẩm, data-id dùng để nhận diện khi click "Thêm vào giỏ"
    productGrid.innerHTML = items
        .map(
            (item) => `
            <article class="product-card">
                <img src="${item.image}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.model}</p>
                    <p class="ref">Ref: ${item.id}</p>
                    <p class="price">${formatVnd(item.price)}</p>
                    <button class="add-btn" data-id="${item.id}">Thêm vào giỏ</button>
                </div>
            </article>
            `
        )
        .join("");
}

// Vẽ lại nội dung giỏ hàng và cập nhật tổng tiền
function renderCart() {
    const entries = Object.entries(cart);
    // Tổng số lượng tất cả mặt hàng trong giỏ
    const totalQty = entries.reduce((sum, [, qty]) => sum + qty, 0);
    cartCount.textContent = String(totalQty);

    if (entries.length === 0) {
        cartItems.innerHTML = "<p class='qty'>Giỏ hàng đang trống.</p>";
        cartSubtotal.textContent = "0 VND";
        return;
    }

    let subtotal = 0;

    cartItems.innerHTML = entries
        .map(([id, qty]) => {
            const product = products.find((item) => item.id === id);
            if (!product) {
                return ""; // Bỏ qua sản phẩm không tìm thấy (đã bị xóa)
            }

            subtotal += product.price * qty;
            return `
                <div class="cart-item">
                    <div class="cart-item-row">
                        <strong>${product.name}</strong>
                        <button class="remove-btn" data-remove-id="${product.id}">Xóa</button>
                    </div>
                    <p class="qty">Số lượng: ${qty}</p>
                    <p class="qty">${formatVnd(product.price)} / chiếc</p>
                </div>
            `;
        })
        .join("");

    cartSubtotal.textContent = formatVnd(subtotal);
}

// ════════════════════════════════════════════════════════════
// THAO TÁC GIỎ HÀNG
// ════════════════════════════════════════════════════════════

// Thêm 1 sản phẩm vào giỏ, nếu đã có thì tăng số lượng
function addToCart(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    renderCart();
}

// Xóa hoàn toàn một sản phẩm khỏi giỏ
function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
    renderCart();
}

// Mở drawer giỏ hàng từ phải màn hình
function openCart() {
    cartDrawer.classList.add("open");
    overlay.classList.add("show");
    cartDrawer.setAttribute("aria-hidden", "false");
}

// Đóng drawer giỏ hàng
function closeCart() {
    cartDrawer.classList.remove("open");
    overlay.classList.remove("show");
    cartDrawer.setAttribute("aria-hidden", "true");
}

// ════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ════════════════════════════════════════════════════════════

// Lọc/sắp xếp lại danh sách khi thay đổi bộ lọc
searchInput.addEventListener("input", renderProducts);
collectionFilter.addEventListener("change", renderProducts);
priceFilter.addEventListener("change", renderProducts);
sortBy.addEventListener("change", renderProducts);

// Click vào nút "Thêm vào giỏ" trong lưới sản phẩm (event delegation)
productGrid.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    const productId = target.dataset.id;
    if (productId) {
        addToCart(productId);
    }
});

// Click vào nút "Xóa" trong drawer giỏ hàng (event delegation)
cartItems.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    const removeId = target.dataset.removeId;
    if (removeId) {
        removeFromCart(removeId);
    }
});

// Mở/đóng drawer và overlay
openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Xóa toàn bộ giỏ hàng
clearCartBtn.addEventListener("click", () => {
    cart = {};
    saveCart();
    renderCart();
});

// Chuyển tới trang thanh toán nếu giỏ không trống
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        normalizeCart(); // Dọn dẹp các mục không hợp lệ trước khi chuyển trang
        if (Object.keys(cart).length === 0) {
            return;
        }
        window.location.href = "/thanhtoan";
    });
}

// ════════════════════════════════════════════════════════════
// KHỞI TẠO TRANG
// ════════════════════════════════════════════════════════════
normalizeCart();   // Làm sạch giỏ hàng cũ (có thể chứa sản phẩm đã bị xóa)
renderProducts();  // Hiển thị danh sách sản phẩm ban đầu
renderCart();      // Hiển thị trạng thái giỏ hàng ban đầu
