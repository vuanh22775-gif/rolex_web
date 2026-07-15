// ════════════════════════════════════════════════════════════
// home-scroll-effects.js — Hiệu ứng cuộn trang chủ
// Thêm/xóa class "scrolling" trên body khi người dùng cuộn,
// dùng để kích hoạt animation CSS trong khi đang scroll
// ════════════════════════════════════════════════════════════

// Chỉ chạy trên trang chủ (có class .home-page)
const homeBody = document.querySelector(".home-page");

// Timer để xóa class "scrolling" sau khi dừng cuộn
let scrollTimer = null;

if (homeBody) {
    // { passive: true } — không gọi preventDefault, giúp trình duyệt tối ưu hiệu năng cuộn
    window.addEventListener("scroll", () => {
        // Đánh dấu đang cuộn để CSS có thể áp dụng hiệu ứng
        homeBody.classList.add("scrolling");

        // Hủy timer cũ nếu người dùng vẫn đang cuộn
        if (scrollTimer) {
            window.clearTimeout(scrollTimer);
        }

        // Sau 140ms không cuộn nữa thì xóa class để kết thúc hiệu ứng
        scrollTimer = window.setTimeout(() => {
            homeBody.classList.remove("scrolling");
        }, 140);
    }, { passive: true });
}
