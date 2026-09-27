import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './lib/axios';
import { useAdminStore } from './store/useAdminStore';
import { Button } from './components/common/ui';
import { AppShell } from './components/layout/AppShell';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const ProductsPage = lazy(() => import('./pages/ManagementPages').then((module) => ({ default: module.ProductsPage })));
const CategoriesPage = lazy(() => import('./pages/ManagementPages').then((module) => ({ default: module.CategoriesPage })));
const OrdersPage = lazy(() => import('./pages/ManagementPages').then((module) => ({ default: module.OrdersPage })));
const CustomersPage = lazy(() => import('./pages/ManagementPages').then((module) => ({ default: module.CustomersPage })));
const AnalyticsPage = lazy(() => import('./pages/OtherPages').then((module) => ({ default: module.AnalyticsPage })));
const MessagesPage = lazy(() => import('./pages/OtherPages').then((module) => ({ default: module.MessagesPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="route-loading">Đang tải...</div>}>{children}</Suspense>;
}

export default function App() {
  return <AdminGate><Routes><Route element={<AppShell />}>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<LazyPage><DashboardPage /></LazyPage>} />
    <Route path="/products" element={<LazyPage><ProductsPage /></LazyPage>} />
    <Route path="/categories" element={<LazyPage><CategoriesPage /></LazyPage>} />
    <Route path="/orders" element={<LazyPage><OrdersPage /></LazyPage>} />
    <Route path="/customers" element={<LazyPage><CustomersPage /></LazyPage>} />
    <Route path="/analytics" element={<LazyPage><AnalyticsPage /></LazyPage>} />
    <Route path="/messages" element={<LazyPage><MessagesPage /></LazyPage>} />
    <Route path="/settings" element={<LazyPage><SettingsPage /></LazyPage>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route></Routes></AdminGate>;
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'checking' | 'login' | 'ready' | 'error'>('checking');
  const [message, setMessage] = useState('');
  const loadAdminData = useAdminStore((store) => store.loadAdminData);
  const setAdminUser = useAdminStore((store) => store.setAdminUser);

  const acceptSession = async (user: { username: string; fullName?: string; role: string }) => {
    if (user.role !== 'admin') {
      setMessage('Tài khoản này không có quyền quản trị.');
      setState('login');
      return;
    }
    setAdminUser({ username: user.username, fullName: user.fullName || user.username });
    try {
      await loadAdminData();
      setState('ready');
    } catch {
      setState('error');
    }
  };

  useEffect(() => {
    let active = true;
    api.get('/auth/check').then(async ({ data }) => {
      if (!active) return;
      if (data.authenticated && data.user) await acceptSession(data.user);
      else setState('login');
    }).catch(() => {
      if (active) { setMessage('Không thể kết nối máy chủ. Kiểm tra Express và MongoDB rồi thử lại.'); setState('error'); }
    });
    return () => { active = false; };
  }, []);

  if (state === 'checking') return <div className="route-loading">Đang xác thực phiên đăng nhập...</div>;
  if (state === 'login') return <AdminLogin initialMessage={message} onAuthenticated={acceptSession} />;
  if (state === 'error') return <main className="admin-access"><section className="admin-access-panel"><h1>Không tải được dữ liệu</h1><p>{message || 'Máy chủ chưa phản hồi dữ liệu quản trị.'}</p><Button onClick={() => window.location.reload()}>Thử lại</Button></section></main>;
  return children;
}

function AdminLogin({ initialMessage, onAuthenticated }: { initialMessage: string; onAuthenticated: (user: { username: string; fullName?: string; role: string }) => Promise<void> }) {
  const [error, setError] = useState(initialMessage);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const { data } = await api.post('/auth/login', { username: form.get('username'), password: form.get('password'), redirect: '/admin/dashboard' });
      const session = await api.get('/auth/check');
      if (!data.success || !session.data.user) throw new Error(data.message || 'Đăng nhập thất bại.');
      await onAuthenticated(session.data.user);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError((requestError as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (requestError as Error).message || 'Đăng nhập thất bại.');
    } finally { setSubmitting(false); }
  };

  return <main className="admin-access"><section className="admin-access-panel"><div className="admin-access-brand">R</div><p className="panel-kicker">ROLEX BOUTIQUE · ADMINISTRATION</p><h1>Đăng nhập quản trị</h1><p>Đăng nhập bằng tài khoản quản trị cửa hàng.</p>{error && <div className="admin-access-error" role="alert">{error}</div>}<form onSubmit={submit}><label>Tên đăng nhập<input name="username" autoComplete="username" required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label><Button type="submit" disabled={submitting}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button></form><a href="/dangnhap">Đăng nhập cửa hàng</a></section></main>;
}