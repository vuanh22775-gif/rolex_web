import { useMemo, useState, type FormEvent } from 'react';
import { ArrowUpDown, Download, Eye, Filter, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, EmptyState, FormField, IconButton, Modal, PageTitle, Pagination, SearchField, StatusPill } from '../components/common/ui';
import { useAdminStore } from '../store/useAdminStore';
import { formatCurrency } from '../lib/utils';
import type { Customer, Order, Product } from '../types';

const pageSize = 6;

function Pager({ page, setPage, total }: { page: number; setPage: (page: number) => void; total: number }) {
  return <Pagination page={page} pages={Math.max(1, Math.ceil(total / pageSize))} onPage={setPage} total={total} pageSize={pageSize} />;
}

export function ProductsPage() {
  const products = useAdminStore((state) => state.products);
  const categories = useAdminStore((state) => state.categories);
  const addProduct = useAdminStore((state) => state.addProduct);
  const updateProduct = useAdminStore((state) => state.updateProduct);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);
  const notify = useAdminStore((state) => state.notify);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortByPrice, setSortByPrice] = useState<'none' | 'asc' | 'desc'>('none');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const filtered = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All' || product.status === status) && (category === 'All' || product.category === category);
  }).sort((a, b) => sortByPrice === 'asc' ? a.price - b.price : sortByPrice === 'desc' ? b.price - a.price : 0), [products, query, status, category, sortByPrice]);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const openAdd = () => { setEditing(null); setAdding(true); };
  const closeModal = () => { setAdding(false); setEditing(null); };
  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const form = new FormData(event.currentTarget);
    const values = { name: String(form.get('name')).trim(), model: String(form.get('model')).trim(), sku: String(form.get('sku')).trim(), category: String(form.get('category')), price: Number(form.get('price')), stock: Number(form.get('stock')), status: String(form.get('status')) as Product['status'], image: String(form.get('image') || '').trim() };
    try {
      if (editing) await updateProduct({ ...values, id: editing.id });
      else await addProduct(values);
      notify({ title: editing ? 'Đã cập nhật sản phẩm' : 'Đã thêm sản phẩm', description: values.name, tone: 'success' });
      closeModal();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể lưu sản phẩm.';
      notify({ title: 'Lưu sản phẩm thất bại', description: message, tone: 'error' });
    }
  };
  const removeProduct = async (product: Product) => {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”?`)) return;
    try { await deleteProduct(product.id); notify({ title: 'Đã xóa sản phẩm', description: product.name, tone: 'info' }); }
    catch (error) { const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xóa sản phẩm.'; notify({ title: 'Xóa sản phẩm thất bại', description: message, tone: 'error' }); }
  };

  return <div className="page-stack"><PageTitle title="Sản phẩm" description="Quản lý bộ sưu tập và tình trạng tồn kho." action={<Button onClick={openAdd}><Plus size={16} /> Thêm sản phẩm</Button>} />
    <div className="toolbar panel"><SearchField value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Tìm theo tên, SKU..." /><div className="toolbar-filters"><label className="select-wrap"><Filter size={15} /><select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="All">Tất cả danh mục</option>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label className="select-wrap"><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="All">Tất cả trạng thái</option><option>Active</option><option>Draft</option><option>Archived</option></select></label><Button variant="secondary" onClick={() => setSortByPrice((current) => current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none')}><ArrowUpDown size={15} /> {sortByPrice === 'asc' ? 'Giá tăng' : sortByPrice === 'desc' ? 'Giá giảm' : 'Sắp xếp'}</Button></div></div>
    <section className="panel table-panel"><div className="table-title-row"><div><strong>Tất cả sản phẩm</strong><span>{filtered.length} mặt hàng</span></div><button type="button" className="view-options" onClick={() => { setQuery(''); setCategory('All'); setStatus('All'); setSortByPrice('none'); setPage(1); }}>Đặt lại bộ lọc</button></div><div className="table-scroll"><table><thead><tr><th>SẢN PHẨM</th><th>SKU</th><th>DANH MỤC</th><th>GIÁ</th><th>TỒN KHO</th><th>TRẠNG THÁI</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{visible.map((product) => <tr key={product.id}><td><div className="product-cell"><img src={product.image} alt="" /><div><strong>{product.name}</strong><span>{product.id}</span></div></div></td><td className="mono-cell">{product.sku}</td><td>{product.category}</td><td className="strong-cell">{formatCurrency(product.price)}</td><td><span className={product.stock < 4 ? 'low-stock' : ''}>{product.stock} chiếc</span></td><td><StatusPill>{product.status}</StatusPill></td><td><div className="row-actions"><IconButton label={`Chỉnh sửa ${product.name}`} onClick={() => { setEditing(product); setAdding(false); }}><Pencil size={15} /></IconButton><IconButton label={`Xóa ${product.name}`} onClick={() => removeProduct(product)}><Trash2 size={15} /></IconButton></div></td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState title="Không tìm thấy sản phẩm" description="Thử thay đổi từ khóa hoặc bộ lọc." />}</div><Pager page={page} setPage={setPage} total={filtered.length} /></section>
    {(adding || editing) && <Modal title={editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'} description="Thông tin sẽ được lưu vào danh mục cửa hàng." onClose={closeModal}><form className="modal-form" onSubmit={saveProduct}><div className="form-grid"><FormField label="Tên sản phẩm"><input name="name" defaultValue={editing?.name} required minLength={3} placeholder="Ví dụ: Submariner Date" /></FormField><FormField label="Mô tả kỹ thuật"><input name="model" defaultValue={editing?.model} required placeholder="Kích thước, vật liệu, mặt số..." /></FormField><FormField label="SKU"><input name="sku" defaultValue={editing?.sku} required minLength={4} placeholder="126610LN" /></FormField><FormField label="Danh mục"><select name="category" defaultValue={editing?.category ?? categories[0]?.name} required>{categories.map((item) => <option key={item.id}>{item.name}</option>)}</select></FormField><FormField label="Trạng thái"><select name="status" defaultValue={editing?.status ?? 'Active'}><option>Active</option><option>Draft</option><option>Archived</option></select></FormField><FormField label="Giá bán (₫)"><input name="price" type="number" min="1000000" step="1000000" required defaultValue={editing?.price} placeholder="368000000" /></FormField><FormField label="Tồn kho"><input name="stock" type="number" min="0" step="1" required defaultValue={editing?.stock ?? 0} /></FormField><FormField label="Đường dẫn ảnh"><input name="image" defaultValue={editing?.image} placeholder="media/submariner.avif" /></FormField></div><div className="modal-actions"><Button variant="secondary" onClick={closeModal}>Hủy</Button><Button type="submit">{editing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</Button></div></form></Modal>}
  </div>;
}

export function CategoriesPage() {
  const categories = useAdminStore((state) => state.categories);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const filtered = categories.filter((item) => `${item.name} ${item.slug}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All' || item.status === status));

  return <div className="page-stack"><PageTitle title="Danh mục" description="Các nhóm bộ sưu tập đang có trong danh mục sản phẩm." /><div className="toolbar panel"><SearchField value={query} onChange={setQuery} placeholder="Tìm danh mục..." /><div className="toolbar-filters"><label className="select-wrap"><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="All">Mọi trạng thái</option><option>Active</option><option>Hidden</option></select></label></div></div>
    <section className="panel table-panel"><div className="table-title-row"><div><strong>Danh mục từ dữ liệu sản phẩm</strong><span>{filtered.length} danh mục</span></div></div><div className="table-scroll"><table><thead><tr><th>TÊN DANH MỤC</th><th>ĐƯỜNG DẪN</th><th>SẢN PHẨM</th><th>TRẠNG THÁI</th></tr></thead><tbody>{filtered.map((item, index) => <tr key={item.id}><td><div className="category-cell"><span className={`category-mark category-mark-${index % 4}`}>{item.name.slice(0, 1)}</span><div><strong>{item.name}</strong><span>{item.id}</span></div></div></td><td className="mono-cell">/{item.slug}</td><td>{item.products} sản phẩm</td><td><StatusPill>{item.status}</StatusPill></td></tr>)}</tbody></table>{filtered.length === 0 && <EmptyState title="Danh mục trống" description="Không có danh mục khớp với bộ lọc." />}</div></section>
  </div>;
}

export function OrdersPage() {
  const orders = useAdminStore((state) => state.orders);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);
  const notify = useAdminStore((state) => state.notify);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [dateWindow, setDateWindow] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const filtered = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customer} ${order.email}`.toLowerCase().includes(query.toLowerCase());
    const age = (Date.now() - new Date(order.date).getTime()) / 86400000;
    return matchesSearch && (status === 'All' || order.status === status) && (dateWindow === 'all' || age <= Number(dateWindow));
  });
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const exportOrders = () => {
    const rows = [['Order ID', 'Customer', 'Date', 'Status', 'Total'], ...filtered.map((order) => [order.id, order.customer, order.date, order.status, String(order.total)])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'atelier-orders.csv'; anchor.click(); URL.revokeObjectURL(url);
    notify({ title: 'Đã xuất dữ liệu đơn hàng', description: `${filtered.length} đơn hàng trong tệp CSV.`, tone: 'success' });
  };
  const changeStatus = async (order: Order, nextStatus: Order['status']) => {
    try {
      const saved = await updateOrderStatus(order.id, nextStatus);
      setSelected(saved);
      notify({ title: 'Đã cập nhật trạng thái', description: `${order.id} · ${nextStatus}`, tone: 'success' });
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng.';
      notify({ title: 'Cập nhật thất bại', description: message, tone: 'error' });
    }
  };

  return <div className="page-stack"><PageTitle title="Đơn hàng" description="Theo dõi và xử lý tất cả đơn hàng của cửa hàng." action={<Button variant="secondary" onClick={exportOrders}><Download size={16} /> Xuất CSV</Button>} /><div className="order-summary-strip"><div><span>Tất cả đơn</span><strong>{orders.length}</strong></div><div><span>Đang xử lý</span><strong>{orders.filter((item) => item.status === 'Processing').length}</strong></div><div><span>Đang giao</span><strong>{orders.filter((item) => item.status === 'Shipped').length}</strong></div><div><span>Đã hoàn tất</span><strong>{orders.filter((item) => item.status === 'Delivered').length}</strong></div></div><div className="toolbar panel"><SearchField value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Tìm mã đơn, khách hàng..." /><div className="toolbar-filters"><label className="select-wrap"><Filter size={15} /><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="All">Tất cả trạng thái</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></label><label className="select-wrap"><select value={dateWindow} onChange={(event) => { setDateWindow(event.target.value); setPage(1); }}><option value="all">Mọi thời gian</option><option value="7">7 ngày qua</option><option value="30">30 ngày qua</option><option value="90">90 ngày qua</option></select></label></div></div><section className="panel table-panel"><div className="table-title-row"><div><strong>Tất cả đơn hàng</strong><span>{filtered.length} đơn</span></div></div><div className="table-scroll"><table><thead><tr><th>MÃ ĐƠN</th><th>KHÁCH HÀNG</th><th>NGÀY ĐẶT</th><th>SẢN PHẨM</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th><th><span className="sr-only">Chi tiết</span></th></tr></thead><tbody>{visible.map((order) => <tr key={order.id}><td className="mono-cell">{order.id}</td><td><div className="customer-cell"><strong>{order.customer}</strong><span>{order.email}</span></div></td><td>{new Date(order.date).toLocaleDateString('vi-VN')}</td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</td><td className="strong-cell">{formatCurrency(order.total)}</td><td><StatusPill>{order.status}</StatusPill></td><td><IconButton label={`Xem chi tiết ${order.id}`} onClick={() => setSelected(order)}><Eye size={16} /></IconButton></td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState title="Không có đơn hàng" description="Thử xóa bớt bộ lọc để xem thêm kết quả." />}</div><Pager page={page} setPage={setPage} total={filtered.length} /></section>
    {selected && <Modal title={`Đơn hàng ${selected.id}`} description={`Đặt ngày ${new Date(selected.date).toLocaleDateString('vi-VN')}`} onClose={() => setSelected(null)}><div className="order-detail"><div className="detail-customer"><div className="user-avatar avatar-blue">{selected.customer.split(' ').slice(-2).map((word) => word[0]).join('')}</div><div><strong>{selected.customer}</strong><span>{selected.email}</span></div><StatusPill>{selected.status}</StatusPill></div><div className="detail-list-heading"><strong>Sản phẩm</strong><span>{selected.items.reduce((sum, item) => sum + item.quantity, 0)} mặt hàng</span></div>{selected.items.map((item) => <div className="detail-line" key={item.product}><span>{item.product} <small>× {item.quantity}</small></span><strong>{formatCurrency(item.price * item.quantity)}</strong></div>)}<div className="detail-total"><span>Tổng thanh toán</span><strong>{formatCurrency(selected.total)}</strong></div><FormField label="Cập nhật trạng thái"><select value={selected.status} onChange={(event) => changeStatus(selected, event.target.value as Order['status'])}><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></FormField></div></Modal>}
  </div>;
}

export function CustomersPage() {
  const customers = useAdminStore((state) => state.customers);
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState<'All' | 'Loyal' | 'New'>('All');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);
  const filtered = customers.filter((customer) => {
    const matches = `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase());
    const segmentMatches = segment === 'All' || (segment === 'Loyal' ? customer.orders >= 5 : customer.orders <= 2);
    return matches && segmentMatches;
  });
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return <div className="page-stack"><PageTitle title="Khách hàng" description="Hiểu rõ hơn về cộng đồng khách hàng của bạn." /><section className="customer-metrics"><div><span>Tổng khách hàng</span><strong>{customers.length.toLocaleString('vi-VN')}</strong><small className="positive-note">+12,5% tháng này</small></div><div><span>Khách hàng thân thiết</span><strong>{customers.filter((item) => item.orders >= 5).length}</strong><small>từ 5 đơn trở lên</small></div><div><span>Chi tiêu trung bình</span><strong>{formatCurrency(Math.round(customers.reduce((sum, item) => sum + item.spent, 0) / customers.length))}</strong><small>trọn đời</small></div></section><div className="toolbar panel"><SearchField value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Tìm tên, email, số điện thoại..." /><div className="toolbar-filters"><div className="segmented-control"><button type="button" className={segment === 'All' ? 'selected' : ''} onClick={() => { setSegment('All'); setPage(1); }}>Tất cả</button><button type="button" className={segment === 'Loyal' ? 'selected' : ''} onClick={() => { setSegment('Loyal'); setPage(1); }}>Thân thiết</button><button type="button" className={segment === 'New' ? 'selected' : ''} onClick={() => { setSegment('New'); setPage(1); }}>Mới</button></div></div></div><section className="panel table-panel"><div className="table-title-row"><div><strong>Danh sách khách hàng</strong><span>{filtered.length} khách hàng</span></div><button type="button" className="view-options" onClick={() => { setQuery(''); setSegment('All'); setPage(1); }}>Đặt lại bộ lọc</button></div><div className="table-scroll"><table><thead><tr><th>KHÁCH HÀNG</th><th>ĐIỆN THOẠI</th><th>NGÀY THAM GIA</th><th>ĐƠN HÀNG</th><th>TỔNG CHI TIÊU</th><th><span className="sr-only">Chi tiết</span></th></tr></thead><tbody>{visible.map((customer, index) => <tr key={customer.id}><td><div className="customer-cell customer-primary"><span className={`user-avatar avatar-${['green', 'blue', 'rose', 'amber'][index % 4]}`}>{customer.initials}</span><div><strong>{customer.name}</strong><span>{customer.email}</span></div></div></td><td>{customer.phone}</td><td>{new Date(customer.joined).toLocaleDateString('vi-VN')}</td><td>{customer.orders}</td><td className="strong-cell">{formatCurrency(customer.spent)}</td><td><IconButton label={`Xem hồ sơ ${customer.name}`} onClick={() => setSelected(customer)}><Eye size={16} /></IconButton></td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState title="Chưa có khách hàng phù hợp" description="Thử một từ khóa hoặc phân khúc khác." />}</div><Pager page={page} setPage={setPage} total={filtered.length} /></section>
    {selected && <Modal title="Hồ sơ khách hàng" description={selected.id} onClose={() => setSelected(null)}><div className="customer-profile"><span className="user-avatar avatar-green profile-large">{selected.initials}</span><h3>{selected.name}</h3><span>{selected.email}</span><div className="profile-stat-grid"><div><span>Tổng chi tiêu</span><strong>{formatCurrency(selected.spent)}</strong></div><div><span>Đơn hàng</span><strong>{selected.orders}</strong></div></div><div className="profile-contact"><span>{selected.phone}</span><span>Thành viên từ {new Date(selected.joined).toLocaleDateString('vi-VN')}</span></div></div></Modal>}
  </div>;
}