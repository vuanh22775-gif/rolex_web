import { useEffect, useState } from 'react';
import { ArrowUpRightFromSquare, ClipboardList, ShoppingBag, Users, Watch, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, PageTitle, StatusPill } from '../components/common/ui';
import { adminPath, formatCompactCurrency } from '../lib/utils';
import { useAdminStore } from '../store/useAdminStore';

const periods = [{ label: '7 ngày', days: 7 }, { label: '30 ngày', days: 30 }, { label: '3 tháng', days: 90 }, { label: '12 tháng', days: 365 }];

export function DashboardPage() {
  const [period, setPeriod] = useState(periods[1]);
  const [chartMode, setChartMode] = useState<'revenue' | 'orders'>('revenue');
  const products = useAdminStore((state) => state.products);
  const orders = useAdminStore((state) => state.orders);
  const customers = useAdminStore((state) => state.customers);
  const statistics = useAdminStore((state) => state.statistics);
  const adminUser = useAdminStore((state) => state.adminUser);
  const loadStatistics = useAdminStore((state) => state.loadStatistics);
  const notify = useAdminStore((state) => state.notify);

  useEffect(() => {
    loadStatistics(period.days).catch(() => notify({ title: 'Không tải được thống kê', description: 'Vui lòng thử tải lại dữ liệu.', tone: 'error' }));
  }, [period]);

  const periodRevenue = statistics.chart.reduce((sum, item) => sum + item.revenue, 0);
  const periodOrders = statistics.chart.reduce((sum, item) => sum + item.orders, 0);
  const pendingOrders = orders.filter((order) => order.status === 'Processing');
  const completedOrders = orders.filter((order) => order.status === 'Delivered');
  const averageOrder = completedOrders.length ? completedOrders.reduce((sum, order) => sum + order.total, 0) / completedOrders.length : 0;
  const soldCounts = new Map<string, number>();
  orders.filter((order) => order.status !== 'Cancelled').forEach((order) => order.items.forEach((item) => {
    const key = item.sku || item.product;
    soldCounts.set(key, (soldCounts.get(key) || 0) + item.quantity);
  }));
  const bestSellers = [...products].sort((a, b) => (soldCounts.get(b.sku) || 0) - (soldCounts.get(a.sku) || 0)).slice(0, 4);
  const chartData = statistics.chart.map((item) => ({ ...item, revenue: item.revenue / 1_000_000_000 }));
  const metricCards = [
    { label: 'Doanh thu kỳ này', value: formatCompactCurrency(periodRevenue), note: `${periodOrders} đơn trong kỳ`, icon: Wallet, tint: 'mint' },
    { label: 'Tổng đơn hàng', value: statistics.orders.toLocaleString('vi-VN'), note: `${pendingOrders.length} cần xử lý`, icon: ShoppingBag, tint: 'blue' },
    { label: 'Khách hàng', value: statistics.users.toLocaleString('vi-VN'), note: 'tài khoản trong MongoDB', icon: Users, tint: 'amber' },
    { label: 'Sản phẩm', value: String(statistics.products), note: `${statistics.lowStock} còn tối đa 3 chiếc`, icon: Watch, tint: 'rose' },
  ];

  return <div className="page-stack">
    <PageTitle eyebrow={new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()} title={`Chào buổi sáng, ${adminUser?.fullName || 'Quản trị viên'}`} description="Tổng quan hoạt động cửa hàng từ dữ liệu đã ghi nhận." action={<Button variant="secondary" onClick={() => window.print()}><ArrowUpRightFromSquare size={16} /> Xuất báo cáo</Button>} />
    <section className="stats-grid">{metricCards.map(({ label, value, note, icon: Icon, tint }) => <article className="stat-card" key={label}><div className="stat-top"><span>{label}</span><span className={`stat-icon icon-${tint}`}><Icon size={18} /></span></div><div className="stat-value">{value}</div><div className="stat-foot"><span className="stat-change">{note}</span><span>MongoDB</span></div></article>)}</section>
    <section className="dashboard-main-grid">
      <article className="panel revenue-panel">
        <div className="panel-heading"><div><div className="panel-kicker">HIỆU SUẤT</div><h2>Doanh thu theo thời gian</h2><p>Dữ liệu đã hoàn tất · {period.label}</p></div><div className="chart-tools"><div className="segmented-control">{periods.map((item) => <button type="button" key={item.days} onClick={() => setPeriod(item)} className={period.days === item.days ? 'selected' : ''}>{item.label}</button>)}</div><div className="chart-switch"><button className={chartMode === 'revenue' ? 'selected' : ''} type="button" onClick={() => setChartMode('revenue')} aria-label="Doanh thu">₫</button><button className={chartMode === 'orders' ? 'selected' : ''} type="button" onClick={() => setChartMode('orders')} aria-label="Số đơn">#</button></div></div></div>
        <div className="chart-summary"><strong>{chartMode === 'revenue' ? formatCompactCurrency(periodRevenue) : `${periodOrders} đơn`}</strong><small>{period.label} · dữ liệu MongoDB</small></div>
        <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 7, left: -20, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#398265" stopOpacity={0.19} /><stop offset="100%" stopColor="#398265" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} tickFormatter={(value: number) => chartMode === 'revenue' ? `${value} tỷ` : String(value)} /><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--text)', fontSize: 12 }} formatter={(value: number) => chartMode === 'revenue' ? [`${value.toLocaleString('vi-VN')} tỷ ₫`, 'Doanh thu'] : [value, 'Đơn hàng']} /><Area type="monotone" dataKey={chartMode} stroke="#2f7658" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, fill: '#2f7658', stroke: 'var(--surface)', strokeWidth: 3 }} /></AreaChart></ResponsiveContainer></div>
        <div className="chart-legend"><span><i /> {chartMode === 'revenue' ? 'Doanh thu hoàn tất' : 'Đơn hàng hoàn tất'}</span><span>Cập nhật {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span></div>
      </article>
      <article className="panel order-panel"><div className="panel-heading"><div><div className="panel-kicker">CẦN XỬ LÝ</div><h2>Đơn hàng gần đây</h2><p>{orders.length} đơn đã ghi nhận</p></div><button type="button" className="plain-link" onClick={() => window.location.assign(adminPath('/orders'))}>Tất cả <ArrowUpRightFromSquare size={14} /></button></div><div className="mini-order-list">{orders.slice(0, 5).map((order) => <div className="mini-order" key={order.id}><div className="order-initials">{order.customer.split(' ').slice(-2).map((word) => word[0]).join('')}</div><div className="mini-order-info"><strong>{order.customer}</strong><span>{order.id} · {new Date(order.date).toLocaleDateString('vi-VN')}</span></div><div className="mini-order-right"><b>{formatCompactCurrency(order.total)}</b><StatusPill>{order.status}</StatusPill></div></div>)}</div>{orders.length === 0 && <p className="chat-empty">Chưa có đơn hàng.</p>}</article>
    </section>
    <section className="dashboard-bottom-grid">
      <article className="panel top-products-panel"><div className="panel-heading"><div><div className="panel-kicker">ĐƯỢC ƯA CHUỘNG</div><h2>Sản phẩm nổi bật</h2></div><button type="button" className="plain-link" onClick={() => window.location.assign(adminPath('/products'))}>Xem tất cả <ArrowUpRightFromSquare size={14} /></button></div><div className="top-product-list">{bestSellers.map((product, index) => <div className="top-product-row" key={product.id}><span className="product-rank">0{index + 1}</span><img src={product.image} alt="" /><div className="top-product-copy"><strong>{product.name}</strong><span>{product.category} · {product.sku}</span></div><div className="top-product-amount"><strong>{formatCompactCurrency(product.price)}</strong><span>{soldCounts.get(product.sku) || 0} đã bán</span></div></div>)}</div>{bestSellers.length === 0 && <p className="chat-empty">Chưa có dữ liệu sản phẩm.</p>}</article>
      <article className="panel channel-panel"><div className="panel-heading"><div><div className="panel-kicker">TỔNG QUAN CỬA HÀNG</div><h2>Hiệu quả vận hành</h2></div><span className="live-indicator"><i /> ĐỒNG BỘ</span></div><div className="channel-rows"><div><span>Giá trị đơn hoàn tất trung bình</span><strong>{formatCompactCurrency(averageOrder)}</strong><small className="muted-note">{completedOrders.length} đơn hoàn tất</small></div><div><span>Đơn hàng đang xử lý</span><strong>{pendingOrders.length}</strong><small className="muted-note">cần theo dõi</small></div><div><span>Sản phẩm sắp hết</span><strong>{statistics.lowStock}</strong><small className="muted-note">còn tối đa 3 chiếc</small></div><div><span>Khách hàng thân thiết</span><strong>{customers.filter((customer) => customer.orders > 3).length}</strong><small className="muted-note">trên 3 đơn hoàn tất</small></div></div><Button variant="secondary" className="full-width" onClick={() => window.location.assign(adminPath('/analytics'))}><ClipboardList size={15} /> Mở phân tích</Button></article>
    </section>
  </div>;
}