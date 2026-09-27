import { useEffect, useState, type FormEvent } from 'react';
import { BellRing, ChevronRight, LockKeyhole, SunMoon, UserRound } from 'lucide-react';
import { Button, FormField, PageTitle } from '../components/common/ui';
import { api } from '../lib/axios';
import { useAdminStore } from '../store/useAdminStore';
import type { Theme } from '../types';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'appearance';
type AdminProfile = { username: string; fullName: string; email: string; phone: string };
type Preferences = { order: boolean; stock: boolean; marketing: boolean; weekly: boolean };
const preferenceDefaults: Preferences = { order: true, stock: true, marketing: false, weekly: true };
const tabs: { id: SettingsTab; label: string; icon: typeof UserRound }[] = [
  { id: 'profile', label: 'Hồ sơ', icon: UserRound },
  { id: 'security', label: 'Bảo mật', icon: LockKeyhole },
  { id: 'notifications', label: 'Thông báo', icon: BellRing },
  { id: 'appearance', label: 'Giao diện', icon: SunMoon },
];

function loadPreferences(): Preferences {
  try { return { ...preferenceDefaults, ...JSON.parse(localStorage.getItem('atelier-admin-notifications') || '{}') }; }
  catch { return preferenceDefaults; }
}

export function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState<AdminProfile>({ username: '', fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);
  const [error, setError] = useState('');
  const theme = useAdminStore((state) => state.theme);
  const setTheme = useAdminStore((state) => state.setTheme);
  const setAdminUser = useAdminStore((state) => state.setAdminUser);
  const notify = useAdminStore((state) => state.notify);

  useEffect(() => {
    api.get('/admin/profile').then(({ data }) => setProfile(data.data)).catch((requestError) => {
      setError(requestError.response?.data?.message || 'Không tải được hồ sơ quản trị.');
    }).finally(() => setLoading(false));
  }, []);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await api.put('/admin/profile', profile);
      setProfile(data.data);
      setAdminUser({ username: data.data.username, fullName: data.data.fullName });
      setError('');
      notify({ title: 'Đã cập nhật hồ sơ', tone: 'success' });
    } catch (requestError) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể lưu hồ sơ.';
      setError(message);
      notify({ title: 'Lưu hồ sơ thất bại', description: message, tone: 'error' });
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const { data } = await api.put('/admin/profile/password', Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      setError('');
      notify({ title: data.message || 'Đã cập nhật mật khẩu', tone: 'success' });
    } catch (requestError) {
      const message = (requestError as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật mật khẩu.';
      setError(message);
      notify({ title: 'Cập nhật mật khẩu thất bại', description: message, tone: 'error' });
    }
  };

  const togglePreference = (key: keyof Preferences) => {
    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] };
      localStorage.setItem('atelier-admin-notifications', JSON.stringify(next));
      return next;
    });
  };

  const chooseTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    notify({ title: 'Đã lưu giao diện', description: 'Tùy chọn được lưu trên thiết bị này.', tone: 'success' });
  };

  if (loading) return <div className="route-loading">Đang tải hồ sơ quản trị...</div>;

  return <div className="page-stack">
    <PageTitle title="Cài đặt" description="Quản lý hồ sơ, bảo mật và tùy chọn cá nhân." />
    {error && <div className="admin-access-error" role="alert">{error}</div>}
    <div className="settings-layout">
      <nav className="settings-nav panel" aria-label="Danh mục cài đặt">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={tab === id ? 'settings-tab active' : 'settings-tab'} onClick={() => setTab(id)}><Icon size={17} /><span>{label}</span>{tab === id && <ChevronRight size={15} />}</button>)}
      </nav>
      <section className="panel settings-content">
        {tab === 'profile' && <form onSubmit={saveProfile}>
          <div className="settings-section-heading"><div className="panel-kicker">TÀI KHOẢN QUẢN TRỊ</div><h2>Hồ sơ cá nhân</h2><p>Thông tin được lưu trên tài khoản MongoDB của bạn.</p></div>
          <div className="settings-fields">
            <FormField label="Tên đăng nhập"><input value={profile.username} readOnly /></FormField>
            <FormField label="Họ và tên"><input value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} minLength={3} required /></FormField>
            <FormField label="Email"><input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></FormField>
            <FormField label="Số điện thoại"><input type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></FormField>
          </div>
          <div className="settings-save"><span>Thay đổi đồng bộ với hồ sơ tài khoản.</span><Button type="submit">Lưu hồ sơ</Button></div>
        </form>}
        {tab === 'security' && <form onSubmit={changePassword}>
          <div className="settings-section-heading"><div className="panel-kicker">BẢO VỆ TÀI KHOẢN</div><h2>Đổi mật khẩu</h2><p>Mật khẩu mới cần ít nhất 8 ký tự.</p></div>
          <div className="settings-fields single-column">
            <FormField label="Mật khẩu hiện tại"><input name="currentPassword" type="password" autoComplete="current-password" required /></FormField>
            <FormField label="Mật khẩu mới"><input name="newPassword" type="password" autoComplete="new-password" minLength={8} required /></FormField>
            <FormField label="Xác nhận mật khẩu mới"><input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></FormField>
          </div>
          <div className="settings-save"><span>Yêu cầu mật khẩu hiện tại để xác nhận thay đổi.</span><Button type="submit">Cập nhật mật khẩu</Button></div>
        </form>}
        {tab === 'notifications' && <div>
          <div className="settings-section-heading"><div className="panel-kicker">TÙY CHỌN TRÊN THIẾT BỊ</div><h2>Thông báo</h2><p>Các tùy chọn này chỉ được lưu trong trình duyệt hiện tại.</p></div>
          <div className="preference-list">{([
            { key: 'order', title: 'Cập nhật đơn hàng', description: 'Đơn hàng mới và thay đổi trạng thái.' },
            { key: 'stock', title: 'Cảnh báo tồn kho', description: 'Sản phẩm còn từ ba chiếc trở xuống.' },
            { key: 'marketing', title: 'Tin tức & ưu đãi', description: 'Thông tin bộ sưu tập và chương trình đặc biệt.' },
            { key: 'weekly', title: 'Báo cáo hàng tuần', description: 'Tóm tắt hoạt động cửa hàng.' },
          ] as const).map(({ key, title, description }) => <div className="setting-toggle-row" key={key}><div><strong>{title}</strong><span>{description}</span></div><button type="button" className={`toggle ${preferences[key] ? 'toggle-on' : ''}`} aria-label={`${preferences[key] ? 'Tắt' : 'Bật'} ${title}`} aria-pressed={preferences[key]} onClick={() => togglePreference(key)}><i /></button></div>)}</div>
        </div>}
        {tab === 'appearance' && <div>
          <div className="settings-section-heading"><div className="panel-kicker">CÁ NHÂN HÓA</div><h2>Giao diện</h2><p>Chế độ hiển thị được lưu trong trình duyệt hiện tại.</p></div>
          <div className="appearance-options">
            <button type="button" className={`theme-choice ${theme === 'light' ? 'theme-choice-active' : ''}`} onClick={() => chooseTheme('light')}><span className="theme-preview light-preview"><i /><i /><i /></span><strong>Giao diện sáng</strong><span>Dễ đọc trong môi trường nhiều ánh sáng.</span><i className="theme-radio" /></button>
            <button type="button" className={`theme-choice ${theme === 'dark' ? 'theme-choice-active' : ''}`} onClick={() => chooseTheme('dark')}><span className="theme-preview dark-preview"><i /><i /><i /></span><strong>Giao diện tối</strong><span>Thoải mái cho mắt trong không gian tối.</span><i className="theme-radio" /></button>
          </div>
        </div>}
      </section>
    </div>
  </div>;
}
