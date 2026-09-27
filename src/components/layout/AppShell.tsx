import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, Bell, Boxes, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Command, LayoutDashboard, Menu, MessageCircle, Moon, Settings2, ShieldCheck, Sun, Users, Watch, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { api } from '../../lib/axios';
import { useAdminStore } from '../../store/useAdminStore';
import { ToastViewport } from '../common/ui';

type NavItem = { label: string; to: string; icon: LucideIcon; badge?: string };
const navigation: { label: string; items: NavItem[] }[] = [
  { label: 'WORKSPACE', items: [{ label: 'Tổng quan', to: '/dashboard', icon: LayoutDashboard }, { label: 'Phân tích', to: '/analytics', icon: BarChart3 }] },
  { label: 'QUẢN LÝ', items: [{ label: 'Sản phẩm', to: '/products', icon: Watch }, { label: 'Danh mục', to: '/categories', icon: Boxes }, { label: 'Đơn hàng', to: '/orders', icon: ClipboardList }, { label: 'Khách hàng', to: '/customers', icon: Users }] },
  { label: 'HỘI THOẠI', items: [{ label: 'Tin nhắn', to: '/messages', icon: MessageCircle }] },
];
const pageNames: Record<string, string> = { '/dashboard': 'Tổng quan', '/products': 'Sản phẩm', '/categories': 'Danh mục', '/orders': 'Đơn hàng', '/customers': 'Khách hàng', '/analytics': 'Phân tích', '/messages': 'Tin nhắn', '/settings': 'Cài đặt' };

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = useAdminStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const theme = useAdminStore((state) => state.theme);
  const setTheme = useAdminStore((state) => state.setTheme);
  const notify = useAdminStore((state) => state.notify);
  const adminUser = useAdminStore((state) => state.adminUser);
  const setAdminUser = useAdminStore((state) => state.setAdminUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const orders = useAdminStore((state) => state.orders);
  const products = useAdminStore((state) => state.products);
  const pendingOrders = orders.filter((order) => order.status === 'Processing');
  const lowStockProducts = products.filter((product) => product.stock <= 3).slice(0, 3);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setAdminUser(null);
      window.location.assign(window.location.pathname.startsWith('/admin') ? '/admin' : '/');
    } catch {
      notify({ title: 'Đăng xuất thất bại', description: 'Không thể kết thúc phiên làm việc.', tone: 'error' });
    }
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => { setMobileOpen(false); setNotificationsOpen(false); setProfileOpen(false); }, [location.pathname]);

  return <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    {mobileOpen && <button type="button" aria-label="Đóng menu" className="drawer-scrim" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      <div className="brand-row"><div className="brand-mark"><Watch size={18} strokeWidth={1.7} /></div><div className="brand-wordmark"><strong>ATELIER</strong><span>COMMERCE OS</span></div><button type="button" className="mobile-close" aria-label="Đóng menu" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
      <div className="workspace-switch"><div className="workspace-icon">R</div><div className="workspace-copy"><span>WORKSPACE</span><strong>Rolex Boutique</strong></div><ChevronDown size={15} /></div>
      <nav className="primary-nav">{navigation.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(({ label, to, icon: Icon, badge }) => <NavLink to={to} key={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} title={collapsed ? label : undefined}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{badge && <i>{badge}</i>}</NavLink>)}</div>)}</nav>
      <div className="sidebar-footer"><NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} title={collapsed ? 'Cài đặt' : undefined}><Settings2 size={18} /><span>Cài đặt</span></NavLink><button type="button" className="nav-link help-link" onClick={() => notify({ title: 'Trung tâm hỗ trợ', description: 'Đội ngũ Atelier sẽ phản hồi trong giờ làm việc.', tone: 'info' })}><CircleHelp size={18} /><span>Trợ giúp</span></button><div className="sidebar-user"><div className="user-avatar avatar-green">AT</div><div className="user-copy"><strong>{adminUser?.fullName || adminUser?.username || 'Quản trị viên'}</strong><span>Quản trị viên</span></div><button type="button" aria-label="Tùy chọn tài khoản" onClick={() => setProfileOpen(!profileOpen)}><ChevronDown size={15} /></button></div></div>
    </aside>
    <div className="main-column"><header className="topbar"><button type="button" className="mobile-menu" aria-label="Mở menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><button type="button" className="collapse-trigger" aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'} onClick={toggleSidebar}>{collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}</button><div className="topbar-crumb"><span>Atelier</span><span className="crumb-slash">/</span><strong>{pageNames[location.pathname] ?? 'Tổng quan'}</strong></div><div className="topbar-actions"><div className="topbar-date"><Activity size={15} /><span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div><div className="topbar-separator" /><button type="button" className="top-icon-button" title={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`} aria-label="Đổi giao diện" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button><div className="popover-anchor"><button type="button" className={`top-icon-button ${notificationsOpen ? 'top-icon-active' : ''}`} aria-label="Thông báo" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}><Bell size={18} /><span className="notification-dot" style={{ display: pendingOrders.length || lowStockProducts.length ? undefined : 'none' }} /></button>{notificationsOpen && <div className="header-popover notification-popover"><div className="popover-heading"><strong>Thông báo</strong><span>{pendingOrders.length + lowStockProducts.length} cảnh báo</span></div><div className="notification-item"><span className="notification-icon"><ClipboardList size={15} /></span><div><strong>{pendingOrders.length} đơn cần xử lý</strong><p>Mở danh sách đơn hàng để cập nhật trạng thái.</p></div><i /></div>{lowStockProducts.map((product) => <div className="notification-item" key={product.id}><span className="notification-icon muted"><Boxes size={15} /></span><div><strong>{product.name} sắp hết</strong><p>Còn {product.stock} chiếc trong kho.</p></div><i /></div>)}
{!pendingOrders.length && !lowStockProducts.length && <div className="notification-item"><div><strong>Không có cảnh báo mới</strong><p>Sản phẩm và đơn hàng đang được đồng bộ.</p></div></div>}
<button className="popover-footer" type="button" onClick={() => navigate('/orders')}>Xem đơn hàng <ChevronRight size={14} /></button></div>}</div><div className="popover-anchor"><button type="button" className="profile-trigger" aria-label="Mở hồ sơ" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}><span className="user-avatar avatar-green">AT</span><ChevronDown size={14} /></button>{profileOpen && <div className="header-popover profile-popover"><div className="profile-menu-head"><strong>{adminUser?.fullName || adminUser?.username || 'Quản trị viên'}</strong><span>{adminUser?.username}</span></div><button type="button" onClick={logout}><ShieldCheck size={16} /> Đăng xuất</button><button type="button" onClick={() => notify({ title: 'Phiên làm việc an toàn', description: 'Tài khoản đang đăng nhập trên thiết bị này.', tone: 'info' })}><Command size={16} /> Phiên làm việc</button></div>}</div></div></header><main className="page-content"><Outlet /></main><footer className="app-footer"><span>© 2026 Atelier Commerce</span><span>Hệ thống vận hành <i className="online-dot" /> ổn định</span></footer></div>
    <ToastViewport />
  </div>;
}