import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronRight, LockKeyhole, Send, Shield, SlidersHorizontal, SunMoon, BellRing, UserRound, Globe2, Clock3 } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, FormField, PageTitle } from '../components/common/ui';
import { api } from '../lib/axios';
import { useAdminStore } from '../store/useAdminStore';
import { adminPath, formatCompactCurrency, formatCurrency } from '../lib/utils';

const statusColors = ['#3d8063', '#d6a94e', '#7098b1', '#c67a73'];

export function AnalyticsPage() {
  const [period, setPeriod] = useState('30 ngày');
  const products = useAdminStore((state) => state.products);
  const orders = useAdminStore((state) => state.orders);
  const customers = useAdminStore((state) => state.customers);
  const statistics = useAdminStore((state) => state.statistics);
  const loadStatistics = useAdminStore((state) => state.loadStatistics);
  const notify = useAdminStore((state) => state.notify);
  const periodDays: Record<string, number> = { '7 ngày': 7, '30 ngày': 30, '3 tháng': 90, '12 tháng': 365 };
  useEffect(() => { loadStatistics(periodDays[period]).catch(() => notify({ title: 'Không tải được phân tích', tone: 'error' })); }, [period]);
  const revenueSeries = statistics.chart.map((item) => ({ label: item.label, revenue: item.revenue / 1_000_000_000, orders: item.orders }));
  const categoryTotals = new Map<string, number>();
  const productCategories = new Map(products.map((product) => [product.sku, product.category]));
  orders.forEach((order) => order.items.forEach((item) => {
    const category = productCategories.get(item.sku || '') || 'Khác';
    categoryTotals.set(category, (categoryTotals.get(category) || 0) + item.price * item.quantity);
  }));
  const categoryPerformance = [...categoryTotals].map(([name, revenue]) => ({ name, revenue: revenue / 1_000_000_000 })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const growthByMonth = new Map<string, number>();
  customers.forEach((customer) => {
    const date = new Date(customer.joined);
    const label = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
    growthByMonth.set(label, (growthByMonth.get(label) || 0) + 1);
  });
  const customerGrowth = [...growthByMonth].sort(([left], [right]) => left.localeCompare(right)).slice(-6).map(([label, value]) => ({ label, value }));
  const statusLabels: Record<string, string> = { Delivered: 'Đã hoàn tất', Processing: 'Đang xử lý', Shipped: 'Đang giao', Cancelled: 'Đã hủy' };
  const statusCounts = orders.reduce<Record<string, number>>((counts, order) => { const label = statusLabels[order.status]; counts[label] = (counts[label] || 0) + 1; return counts; }, {});
  const statusDistribution = Object.entries(statusCounts).map(([name, value], index) => ({ name, value, color: statusColors[index % statusColors.length] }));
  const metrics = [
    { title: 'Doanh thu', value: formatCompactCurrency(revenueSeries.reduce((sum, point) => sum + point.revenue, 0) * 1_000_000_000), delta: period, up: true },
    { title: 'Đơn hàng', value: String(statistics.orders), delta: 'MongoDB', up: true },
    { title: 'Khách hàng', value: String(statistics.users), delta: 'tài khoản', up: true },
    { title: 'Sắp hết hàng', value: String(statistics.lowStock), delta: 'còn tối đa 3 chiếc', up: false },
  ];
  const tooltipStyle = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 9, color: 'var(--text)', fontSize: 12 };
  const soldCounts = new Map<string, number>();
  orders.forEach((order) => order.items.forEach((item) => soldCounts.set(item.sku || item.product, (soldCounts.get(item.sku || item.product) || 0) + item.quantity)));
  const topProducts = useMemo(() => [...products].sort((a, b) => (soldCounts.get(b.sku) || 0) - (soldCounts.get(a.sku) || 0)).slice(0, 5), [products, orders]);

  return <div className="page-stack"><PageTitle title="Phân tích" description="Theo dõi sức khỏe kinh doanh và xu hướng khách hàng." action={<label className="select-wrap analytics-period"><SlidersHorizontal size={15} /><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>7 ngày</option><option>30 ngày</option><option>3 tháng</option><option>12 tháng</option></select></label>} /><section className="analytics-metric-grid">{metrics.map((metric) => <article className="panel analytics-metric" key={metric.title}><span>{metric.title}</span><strong>{metric.value}</strong><small className={metric.up ? 'positive-note' : 'negative-note'}>{metric.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{metric.delta} so kỳ trước</small></article>)}</section><section className="analytics-chart-grid"><article className="panel analytics-revenue"><div className="panel-heading"><div><div className="panel-kicker">DOANH THU THUẦN · {period.toUpperCase()}</div><h2>Doanh thu & đơn hàng</h2></div><span className="chart-key"><i /> Doanh thu</span></div><div className="analytics-chart-large"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueSeries} margin={{ top: 12, right: 9, left: -19, bottom: 0 }}><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3c8264" stopOpacity={0.2} /><stop offset="100%" stopColor="#3c8264" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} tickFormatter={(value: number) => `${value} tỷ`} /><Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value} tỷ ₫`, 'Doanh thu']} /><Area dataKey="revenue" type="monotone" stroke="#3c8264" strokeWidth={2.5} fill="url(#analyticsFill)" /></AreaChart></ResponsiveContainer></div></article><article className="panel category-chart"><div className="panel-heading"><div><div className="panel-kicker">DOANH THU THEO DANH MỤC</div><h2>Danh mục bán chạy</h2></div></div><div className="category-chart-inner"><ResponsiveContainer width="100%" height={205}><BarChart data={categoryPerformance} layout="vertical" margin={{ top: 2, right: 8, left: 0, bottom: 0 }}><CartesianGrid horizontal={false} stroke="var(--line)" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={86} tick={{ fill: 'var(--muted)', fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value} tỷ ₫`, 'Doanh thu']} /><Bar dataKey="revenue" fill="#6f9d83" radius={[0, 5, 5, 0]} barSize={14} /></BarChart></ResponsiveContainer></div></article></section><section className="analytics-lower-grid"><article className="panel growth-panel"><div className="panel-heading"><div><div className="panel-kicker">CỘNG ĐỒNG</div><h2>Tăng trưởng khách hàng</h2></div><span className="positive-note"><ArrowUpRight size={13} /> 18,4%</span></div><div className="growth-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={customerGrowth} margin={{ top: 15, right: 2, left: -26, bottom: 0 }}><defs><linearGradient id="customerFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d1ad69" stopOpacity={0.24} /><stop offset="100%" stopColor="#d1ad69" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value} khách hàng`, 'Mới']} /><Area dataKey="value" type="monotone" stroke="#c89f55" strokeWidth={2} fill="url(#customerFill)" /></AreaChart></ResponsiveContainer></div><div className="growth-foot"><strong>186 khách hàng mới</strong><span>trong {period.toLowerCase()}</span></div></article><article className="panel status-panel"><div className="panel-heading"><div><div className="panel-kicker">HOÀN TẤT & VẬN CHUYỂN</div><h2>Trạng thái đơn hàng</h2></div><span className="status-total">{orders.length} mẫu</span></div><div className="status-chart-wrap"><div className="status-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusDistribution} dataKey="value" innerRadius={49} outerRadius={66} paddingAngle={3} stroke="none">{statusDistribution.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="donut-label"><strong>{orders.length}</strong><span>đơn hàng</span></div></div><div className="status-legend">{statusDistribution.map((item) => <div key={item.name}><i style={{ backgroundColor: item.color }} /><span>{item.name}</span><b>{item.value}%</b></div>)}</div></div></article><article className="panel analytics-top-products"><div className="panel-heading"><div><div className="panel-kicker">HIỆU SUẤT SẢN PHẨM</div><h2>Sản phẩm hàng đầu</h2></div></div><div className="analytics-products-list">{topProducts.map((product, index) => <div className="analytics-product-row" key={product.id}><span className="product-rank">0{index + 1}</span><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.sku}</span></div><b>{formatCurrency(product.price)}</b></div>)}</div><button className="analytics-link" type="button" onClick={() => window.location.assign(adminPath('/products'))}>Xem danh sách sản phẩm <ChevronRight size={15} /></button></article></section><div className="analytics-footnote"><span>{customers.length} khách hàng được phân tích</span><span>Cập nhật dữ liệu hôm nay lúc 09:41</span></div></div>;
}

interface Message { id: string; text: string; time: string; from: 'customer' | 'staff'; }
interface Conversation { id: string; name: string; initials: string; topic: string; time: string; unread: number; messages: Message[]; }

export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const notify = useAdminStore((state) => state.notify);
  const current = conversations.find((conversation) => conversation.id === selectedId);
  const filtered = conversations.filter((conversation) => `${conversation.name} ${conversation.topic}`.toLowerCase().includes(query.toLowerCase()));

  const loadConversations = async () => {
    const { data } = await api.get('/admin/chat/conversations');
    const next = (data.conversations || []).map((item: { _id: string; lastMessage: string; lastAt: string; unread: number }) => ({
      id: item._id,
      name: item._id,
      initials: item._id.split(/[._\s-]+/).slice(-2).map((part: string) => part[0]).join('').toUpperCase(),
      topic: item.lastMessage || 'Hội thoại hỗ trợ',
      time: new Date(item.lastAt).toLocaleString('vi-VN'),
      unread: item.unread,
      messages: [],
    } as Conversation));
    setConversations(next);
    setSelectedId((selected) => selected || next[0]?.id || '');
  };

  const loadThread = async (username: string) => {
    const { data } = await api.get(`/admin/chat/${encodeURIComponent(username)}`);
    const messages = (data.messages || []).map((item: { _id: string; text: string; senderRole: string; createdAt: string }) => ({
      id: item._id,
      text: item.text,
      time: new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      from: item.senderRole === 'admin' ? 'staff' : 'customer',
    } as Message));
    setConversations((items) => items.map((conversation) => conversation.id === username ? { ...conversation, messages, unread: 0 } : conversation));
  };

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        await loadConversations();
        setError('');
      } catch (requestError) {
        if (active) setError((requestError as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không tải được hộp thư.');
      }
    };
    void refresh();
    const timer = window.setInterval(() => { if (active) void refresh(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    const refreshThread = async () => {
      try { await loadThread(selectedId); }
      catch (requestError) { if (active) setError((requestError as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không tải được tin nhắn.'); }
    };
    void refreshThread();
    const timer = window.setInterval(() => { if (active) void refreshThread(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [selectedId]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !current || sending) return;
    setSending(true);
    try {
      await api.post(`/admin/chat/${encodeURIComponent(current.id)}`, { text });
      setDraft('');
      await loadThread(current.id);
      await loadConversations();
    } catch (requestError) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không gửi được tin nhắn.';
      setError(message);
      notify({ title: 'Gửi tin nhắn thất bại', description: message, tone: 'error' });
    } finally { setSending(false); }
  };

  return <div className="page-stack"><PageTitle title="Tin nhắn" description="Trao đổi trực tiếp cùng khách hàng." action={<span className="inbox-status"><i /> Hộp thư đang mở</span>} />{error && <div className="admin-access-error" role="alert">{error}</div>}<section className="inbox panel"><aside className="inbox-list"><div className="inbox-list-head"><strong>Hộp thư đến</strong><span>{conversations.reduce((sum, item) => sum + item.unread, 0)} chưa đọc</span></div><label className="inbox-search"><SearchIcon /><input placeholder="Tìm cuộc trò chuyện..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="conversation-list">{filtered.map((conversation, index) => <button type="button" className={`conversation-item ${selectedId === conversation.id ? 'conversation-selected' : ''}`} key={conversation.id} onClick={() => setSelectedId(conversation.id)}><span className={`user-avatar avatar-${['blue', 'green', 'amber', 'rose'][index % 4]}`}>{conversation.initials}</span><span className="conversation-copy"><strong>{conversation.name}</strong><span>Hỗ trợ khách hàng</span><small>{conversation.topic}</small></span><span className="conversation-meta"><small>{conversation.time}</small>{conversation.unread > 0 && <i>{conversation.unread}</i>}</span></button>)}{filtered.length === 0 && <div className="inbox-empty">{error ? 'Không thể tải hội thoại.' : 'Chưa có hội thoại.'}</div>}</div></aside><div className="conversation-panel">{current ? <><header className="conversation-header"><span className="user-avatar avatar-blue">{current.initials}</span><div><strong>{current.name}</strong><span>Hội thoại CSKH · cập nhật tự động</span></div></header><div className="message-thread">{current.messages.map((message) => <div className={`thread-message ${message.from === 'staff' ? 'message-outgoing' : 'message-incoming'}`} key={message.id}><p>{message.text}</p><time>{message.time}</time></div>)}</div><form className="message-composer" onSubmit={sendMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Viết phản hồi..." maxLength={1000} /><Button type="submit" disabled={sending || !draft.trim()}><Send size={16} />{sending ? 'Đang gửi' : 'Gửi'}</Button></form></> : <div className="inbox-empty">Chọn một cuộc hội thoại để xem tin nhắn.</div>}</div></section></div>;
}

function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>; }

const settingsTabs = [
  { id: 'general', label: 'Chung', icon: Globe2 }, { id: 'profile', label: 'Hồ sơ', icon: UserRound }, { id: 'security', label: 'Bảo mật', icon: LockKeyhole }, { id: 'notifications', label: 'Thông báo', icon: BellRing }, { id: 'appearance', label: 'Giao diện', icon: SunMoon },
] as const;
type SettingsTab = (typeof settingsTabs)[number]['id'];

export function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const theme = useAdminStore((state) => state.theme);
  const setTheme = useAdminStore((state) => state.setTheme);
  const notify = useAdminStore((state) => state.notify);
  const setAdminUser = useAdminStore((state) => state.setAdminUser);
  const [profile, setProfile] = useState({ username: '', fullName: '', email: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [preferences, setPreferences] = useState({ order: true, stock: true, marketing: false, weekly: true });
  useEffect(() => {
    api.get('/admin/profile').then(({ data }) => setProfile(data.data)).catch(() => notify({ title: 'Không tải được hồ sơ', tone: 'error' })).finally(() => setProfileLoading(false));
  }, []);
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      if (tab === 'profile') {
        const { data } = await api.put('/admin/profile', { fullName: form.get('fullName'), email: form.get('email'), phone: form.get('phone') });
        setProfile(data.data);
        setAdminUser({ username: data.data.username, fullName: data.data.fullName });
        notify({ title: 'Đã cập nhật hồ sơ', tone: 'success' });
      } else if (tab === 'security') {
        const { data } = await api.put('/admin/profile/password', { currentPassword: form.get('currentPassword'), newPassword: form.get('newPassword'), confirmPassword: form.get('confirmPassword') });
        event.currentTarget.reset();
        notify({ title: data.message || 'Đã cập nhật mật khẩu', tone: 'success' });
      } else if (tab === 'notifications') {
        localStorage.setItem('atelier-admin-notifications', JSON.stringify(preferences));
        notify({ title: 'Đã lưu tùy chọn trên thiết bị này', tone: 'success' });
      } else if (tab === 'appearance') {
        notify({ title: 'Đã lưu giao diện', description: 'Tùy chọn được lưu trên thiết bị này.', tone: 'success' });
      } else {
        notify({ title: 'Chưa thể lưu cài đặt cửa hàng', description: 'Cấu hình cửa hàng chưa được kết nối với MongoDB.', tone: 'error' });
      }
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể lưu thay đổi.';
      notify({ title: 'Lưu thất bại', description: message, tone: 'error' });
    }
  };
  const togglePreference = (key: keyof typeof preferences) => setPreferences((current) => ({ ...current, [key]: !current[key] }));
  if (profileLoading && tab === 'profile') return <div className="route-loading">Đang tải hồ sơ quản trị...</div>;
  return <div className="page-stack"><PageTitle title="Cài đặt" description="Quản lý không gian làm việc và tùy chọn cá nhân." /><div className="settings-layout"><nav className="settings-nav panel" aria-label="Danh mục cài đặt">{settingsTabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={tab === id ? 'settings-tab active' : 'settings-tab'} onClick={() => setTab(id)}><Icon size={17} /><span>{label}</span>{tab === id && <ChevronRight size={15} />}</button>)}</nav><section className="panel settings-content"><form onSubmit={save}>{tab === 'general' && <><div className="settings-section-heading"><div className="panel-kicker">KHÔNG GIAN LÀM VIỆC</div><h2>Cài đặt chung</h2><p>Thiết lập thông tin cửa hàng được sử dụng trong hệ thống.</p></div><div className="settings-fields"><FormField label="Tên cửa hàng"><input defaultValue="Rolex Boutique" required /></FormField><FormField label="Email liên hệ"><input type="email" defaultValue="contact@atelier.vn" required /></FormField><FormField label="Múi giờ"><select defaultValue="Asia/Ho_Chi_Minh"><option value="Asia/Ho_Chi_Minh">(GMT+07:00) Hà Nội, Bangkok</option><option value="Asia/Singapore">(GMT+08:00) Singapore</option></select></FormField><FormField label="Tiền tệ"><select defaultValue="VND"><option>VND — Việt Nam Đồng</option><option>USD — US Dollar</option></select></FormField></div><div className="settings-divider" /><div className="setting-toggle-row"><div><strong>Chế độ bảo trì</strong><span>Tạm ẩn cửa hàng với khách hàng trong khi cập nhật.</span></div><button type="button" className="toggle" aria-label="Chế độ bảo trì chưa khả dụng" aria-pressed="false" disabled><i /></button></div></>}
        {tab === 'profile' && <><div className="settings-section-heading"><div className="panel-kicker">TÀI KHOẢN CỦA BẠN</div><h2>Hồ sơ cá nhân</h2><p>Thông tin tài khoản quản trị viên.</p></div><div className="profile-edit-head"><span className="user-avatar avatar-green profile-large">{profile.fullName.split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase() || 'AD'}</span><div><strong>Hồ sơ quản trị</strong><span>{profile.username}</span></div></div><div className="settings-fields"><FormField label="Họ và tên"><input name="fullName" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} required minLength={3} /></FormField><FormField label="Email"><input name="email" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></FormField><FormField label="Số điện thoại"><input name="phone" type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></FormField></div></>}
        {tab === 'security' && <><div className="settings-section-heading"><div className="panel-kicker">BẢO VỆ TÀI KHOẢN</div><h2>Bảo mật</h2><p>Cập nhật mật khẩu và kiểm soát cách đăng nhập.</p></div><div className="settings-fields single-column"><FormField label="Mật khẩu hiện tại"><input name="currentPassword" type="password" required minLength={8} autoComplete="current-password" placeholder="Nhập mật khẩu hiện tại" /></FormField><FormField label="Mật khẩu mới"><input name="newPassword" type="password" required minLength={8} autoComplete="new-password" placeholder="Tối thiểu 8 ký tự" /></FormField><FormField label="Xác nhận mật khẩu mới"><input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" placeholder="Nhập lại mật khẩu mới" /></FormField></div><div className="security-callout"><Shield size={18} /><div><strong>Xác thực hai yếu tố</strong><span>Tăng cường bảo vệ khi đăng nhập.</span></div><Button variant="secondary" onClick={() => notify({ title: 'Đang chuẩn bị bảo mật', description: 'Xác thực hai yếu tố cần kết nối dịch vụ tài khoản.', tone: 'info' })}>Thiết lập</Button></div></>}
        {tab === 'notifications' && <><div className="settings-section-heading"><div className="panel-kicker">CẬP NHẬT QUA EMAIL</div><h2>Thông báo</h2><p>Chọn những cập nhật bạn muốn nhận từ Atelier.</p></div><div className="preference-list">{([{ key: 'order', title: 'Cập nhật đơn hàng', description: 'Đơn hàng mới, trạng thái và yêu cầu hoàn trả.' }, { key: 'stock', title: 'Cảnh báo tồn kho', description: 'Thông báo khi sản phẩm sắp hết hàng.' }, { key: 'marketing', title: 'Tin tức & ưu đãi', description: 'Sản phẩm mới, bộ sưu tập và chương trình đặc biệt.' }, { key: 'weekly', title: 'Báo cáo hàng tuần', description: 'Tổng hợp hoạt động cửa hàng mỗi thứ Hai.' }] as const).map(({ key, title, description }) => <div className="setting-toggle-row" key={key}><div><strong>{title}</strong><span>{description}</span></div><button type="button" className={`toggle ${preferences[key] ? 'toggle-on' : ''}`} aria-label={`${preferences[key] ? 'Tắt' : 'Bật'} ${title}`} aria-pressed={preferences[key]} onClick={() => togglePreference(key)}><i /></button></div>)}</div></>}
        {tab === 'appearance' && <><div className="settings-section-heading"><div className="panel-kicker">CÁ NHÂN HÓA</div><h2>Giao diện</h2><p>Điều chỉnh cách Atelier hiển thị trên thiết bị của bạn.</p></div><div className="appearance-options"><button type="button" className={`theme-choice ${theme === 'light' ? 'theme-choice-active' : ''}`} onClick={() => setTheme('light')}><span className="theme-preview light-preview"><i /><i /><i /></span><strong>Giao diện sáng</strong><span>Dễ đọc trong môi trường nhiều ánh sáng.</span><i className="theme-radio" /></button><button type="button" className={`theme-choice ${theme === 'dark' ? 'theme-choice-active' : ''}`} onClick={() => setTheme('dark')}><span className="theme-preview dark-preview"><i /><i /><i /></span><strong>Giao diện tối</strong><span>Thoải mái cho mắt trong không gian tối.</span><i className="theme-radio" /></button></div><div className="setting-hint"><Clock3 size={16} /><span>Chế độ giao diện được lưu trên thiết bị này.</span></div></>}
        <div className="settings-save"><span>Thay đổi được lưu trong không gian làm việc này.</span><Button type="submit">Lưu thay đổi</Button></div></form></section></div></div>;
}