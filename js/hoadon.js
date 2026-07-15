(function () {
    'use strict';

    const ROWS_PER_PAGE = 10;
    let currentPage = 1;
    let filteredRows = [];

    const allRows = () => Array.from(document.querySelectorAll('#hdTableBody .hd-row'));

    /* ── Tìm kiếm & lọc ─────────────────────────────────── */
    function applyFilters() {
        const q       = (document.getElementById('hdSearch').value || '').toLowerCase().trim();
        const status  = document.getElementById('hdFilterStatus').value;
        const payment = document.getElementById('hdFilterPayment').value;
        const from    = document.getElementById('hdFilterDateFrom').value;
        const to      = document.getElementById('hdFilterDateTo').value;

        filteredRows = allRows().filter(row => {
            const name    = row.dataset.name  || '';
            const phone   = row.dataset.phone || '';
            const id      = row.querySelector('.hd-code').textContent.toLowerCase();
            const rowStat = row.dataset.status;
            const rowPay  = row.dataset.payment;
            const rowDate = row.dataset.date;

            if (q && !name.includes(q) && !phone.includes(q) && !id.includes(q)) return false;
            if (status  && rowStat !== status)  return false;
            if (payment && rowPay  !== payment) return false;
            if (from    && rowDate < from)       return false;
            if (to      && rowDate > to)         return false;
            return true;
        });

        currentPage = 1;
        renderPage();
    }

    function renderPage() {
        const rows = allRows();
        rows.forEach(r => (r.style.display = 'none'));

        const noResult = document.getElementById('hdNoResult');
        if (filteredRows.length === 0) {
            noResult.style.display = 'block';
        } else {
            noResult.style.display = 'none';
            const start = (currentPage - 1) * ROWS_PER_PAGE;
            filteredRows.slice(start, start + ROWS_PER_PAGE).forEach(r => (r.style.display = ''));
        }

        renderPagination();
    }

    function renderPagination() {
        const container = document.getElementById('hdPagination');
        const total = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
        container.innerHTML = '';
        if (total <= 1) return;

        for (let i = 1; i <= total; i++) {
            const btn = document.createElement('button');
            btn.className = 'hd-page-btn' + (i === currentPage ? ' active' : '');
            btn.textContent = i;
            btn.addEventListener('click', () => { currentPage = i; renderPage(); });
            container.appendChild(btn);
        }
    }

    /* ── Modal xuất hóa đơn ─────────────────────────────── */
    function openPrintModal(btn) {
        const id      = btn.dataset.id;
        const name    = btn.dataset.name;
        const phone   = btn.dataset.phone;
        const email   = btn.dataset.email;
        const address = btn.dataset.address;
        const status  = btn.dataset.status;
        const payment = btn.dataset.payment;
        const total   = btn.dataset.total;
        const date    = btn.dataset.date;
        const items   = JSON.parse(btn.dataset.items || '[]');

        const statusMap   = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };
        const payMap      = { cod: 'COD (Thanh toán khi nhận hàng)', vnpay: 'QR / Ví điện tử', bank: 'Chuyển khoản ngân hàng' };
        const statusColor = { pending: '#856404', approved: '#047857', rejected: '#842029' };
        const statusBg    = { pending: '#fff3cd', approved: '#d1fae5', rejected: '#f8d7da' };

        const itemRows = items.map(it =>
            `<tr>
                <td>${it.name}</td>
                <td style="text-align:center">${it.qty}</td>
                <td style="text-align:right">${Number(it.price).toLocaleString('vi-VN')} VND</td>
                <td style="text-align:right">${Number(it.lineTotal || it.price * it.qty).toLocaleString('vi-VN')} VND</td>
            </tr>`
        ).join('');

        document.getElementById('hdPrintArea').innerHTML = `
            <div class="hd-inv-header">
                <div>
                    <div class="hd-inv-brand">ROLEX BOUTIQUE<small>Vũ Nhật Tuấn Anh — Việt Nam</small></div>
                </div>
                <div class="hd-inv-meta">
                    <div><strong>HÓA ĐƠN</strong></div>
                    <div>Mã: #${id.slice(-8).toUpperCase()}</div>
                    <div>Ngày: ${date}</div>
                    <div style="margin-top:6px">
                        <span class="hd-inv-status-badge" style="background:${statusBg[status]};color:${statusColor[status]}">
                            ${statusMap[status] || status}
                        </span>
                    </div>
                </div>
            </div>
            <div class="hd-inv-grid">
                <div class="hd-inv-block">
                    <h4>Thông tin khách hàng</h4>
                    <p><strong>${name}</strong></p>
                    <p>${phone}</p>
                    <p>${email}</p>
                </div>
                <div class="hd-inv-block">
                    <h4>Thông tin giao hàng</h4>
                    <p>${address || '—'}</p>
                    <h4 style="margin-top:10px">Thanh toán</h4>
                    <p>${payMap[payment] || payment}</p>
                </div>
            </div>
            <table class="hd-inv-items">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th style="text-align:center">SL</th>
                        <th style="text-align:right">Đơn giá</th>
                        <th style="text-align:right">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>${itemRows}</tbody>
            </table>
            <div class="hd-inv-total-row">
                <span>Tổng cộng</span>
                <span>${Number(total).toLocaleString('vi-VN')} VND</span>
            </div>
            <div class="hd-inv-footer">
                Cảm ơn quý khách đã tin tưởng Rolex Boutique Vietnam. &nbsp;|&nbsp; Hotline: 1800 xxxx
            </div>
        `;

        document.getElementById('hdPrintModal').classList.add('open');
        document.getElementById('hdPrintOverlay').classList.add('show');
    }

    document.getElementById('hdDoPrint').addEventListener('click', () => window.print());

    document.getElementById('hdClosePrintModal').addEventListener('click', closePrintModal);
    document.getElementById('hdPrintOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('hdPrintOverlay')) closePrintModal();
    });

    function closePrintModal() {
        document.getElementById('hdPrintModal').classList.remove('open');
        document.getElementById('hdPrintOverlay').classList.remove('show');
    }

    /* ── Event delegation on table ──────────────────────── */
    document.getElementById('hdTableBody').addEventListener('click', function (e) {
        const exportBtn = e.target.closest('.hd-btn-export');
        if (exportBtn) openPrintModal(exportBtn);
    });

    /* ── Filter bindings ────────────────────────────────── */
    ['hdSearch', 'hdFilterStatus', 'hdFilterPayment', 'hdFilterDateFrom', 'hdFilterDateTo']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', applyFilters);
        });

    document.getElementById('hdResetFilter').addEventListener('click', () => {
        document.getElementById('hdSearch').value         = '';
        document.getElementById('hdFilterStatus').value   = '';
        document.getElementById('hdFilterPayment').value  = '';
        document.getElementById('hdFilterDateFrom').value = '';
        document.getElementById('hdFilterDateTo').value   = '';
        applyFilters();
    });

    /* ── Init ───────────────────────────────────────────── */
    filteredRows = allRows();
    renderPage();

    (function scaleChart() {
        const bars = document.querySelectorAll('.hd-chart__bar');
        if (bars.length === 0) return;
        let maxH = 0;
        bars.forEach(b => { const v = parseFloat(b.dataset.value) || 0; if (v > maxH) maxH = v; });
        bars.forEach(b => {
            const v = parseFloat(b.dataset.value) || 0;
            b.style.height = Math.max((maxH > 0 ? v / maxH : 0) * 160, 4) + 'px';
        });
    })();

})();
