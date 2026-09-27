import { useEffect, type FormEvent, type ReactNode } from 'react';
import { Check, CircleAlert, Info, X } from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow ?? 'ATELIER / COMMERCE'}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

export function Button({ children, variant = 'primary', className = '', type = 'button', onClick, disabled }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; className?: string; type?: 'button' | 'submit' | 'reset'; onClick?: () => void; disabled?: boolean }) {
  return <button type={type} className={`button button-${variant} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function IconButton({ children, label, onClick, className = '' }: { children: ReactNode; label: string; onClick: () => void; className?: string }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>;
}

export function StatusPill({ children, tone }: { children: ReactNode; tone?: string }) {
  const normalized = tone ?? String(children).toLowerCase().replace(/ /g, '-');
  return <span className={`status-pill tone-${normalized}`}>{children}</span>;
}

export function Modal({ title, description, children, onClose, size = 'regular' }: { title: string; description?: string; children: ReactNode; onClose: () => void; size?: 'regular' | 'wide' }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`modal modal-${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><header className="modal-header"><div><h2 id="modal-title">{title}</h2>{description && <p>{description}</p>}</div><IconButton label="Đóng" onClick={onClose}><X size={18} /></IconButton></header>{children}</section></div>;
}

export function ToastViewport() {
  const toasts = useAdminStore((state) => state.toasts);
  const dismiss = useAdminStore((state) => state.dismissToast);
  const symbols = { success: Check, error: CircleAlert, info: Info };
  return <div className="toast-viewport" aria-live="polite">{toasts.map((toast) => {
    const Symbol = symbols[toast.tone];
    return <div className={`toast toast-${toast.tone}`} key={toast.id}><span className="toast-symbol"><Symbol size={17} /></span><div><strong>{toast.title}</strong>{toast.description && <p>{toast.description}</p>}</div><button type="button" className="toast-close" aria-label="Đóng thông báo" onClick={() => dismiss(toast.id)}><X size={15} /></button></div>;
  })}</div>;
}

export function SearchField({ value, onChange, placeholder = 'Tìm kiếm...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="search-field"><span className="sr-only">{placeholder}</span><span className="search-symbol">⌕</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function Pagination({ page, pages, onPage, total, pageSize }: { page: number; pages: number; onPage: (page: number) => void; total: number; pageSize: number }) {
  if (total === 0) return null;
  return <div className="pagination"><span>Hiển thị <b>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}</b> trong <b>{total}</b></span><div><button type="button" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1}>Trước</button><span className="pagination-current">{page} / {pages}</span><button type="button" onClick={() => onPage(Math.min(pages, page + 1))} disabled={page >= pages}>Sau</button></div></div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><div className="empty-mark">—</div><strong>{title}</strong><p>{description}</p></div>;
}

export function FormField({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="form-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

export function preventSubmit(event: FormEvent<HTMLFormElement>, submit: () => void) {
  event.preventDefault();
  if (event.currentTarget.reportValidity()) submit();
}