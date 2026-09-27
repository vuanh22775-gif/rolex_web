const express    = require('express');
require('express-async-errors');
const path       = require('path');
const crypto     = require('crypto');
const session    = require('express-session');
const MongoStore = require('connect-mongo');

const connect      = require('./connect');
const Product      = require('./models/productModel');
const User         = require('./models/userModel');
const Registration = require('./models/registrationModel');
const Order        = require('./models/orderModel');
const ChatMessage  = require('./models/chatMessageModel');

const app = express();
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/rolex_boutique');
const sessionSecret = process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? '' : crypto.randomBytes(32).toString('hex'));
let initializationPromise;
if (!mongoUri || !sessionSecret) throw new Error('MONGODB_URI and SESSION_SECRET must be configured in production.');
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

// ── View engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ─────────────────────────────────────────────
app.use('/css',    express.static(path.join(__dirname, 'css')));
app.use('/js',     express.static(path.join(__dirname, 'js')));
app.use('/media',  express.static(path.join(__dirname, 'media')));
app.use('/fontawesome-free-6.7.2-web', express.static(path.join(__dirname, 'fontawesome-free-6.7.2-web')));
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

app.use((req, res, next) => {
    res.locals.user = null;
    res.locals.isAuthenticated = false;
    res.locals.activePage = '';
    next();
});

// ── Body parser ───────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => initializeDatabase().then(() => next()).catch(next));

// ── Session ──────────────────────────────────────────────────
app.use(session({
    name: 'rolex.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    }),
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 }
}));

// ── Pass user vào views ──────────────────────────────────────
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// ── Middleware quyền ─────────────────────────────────────────
function requireAuth(req, res, next) {
    if (!req.session.user && req.originalUrl.startsWith('/api/'))
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục.' });
    if (!req.session.user)
        return res.redirect('/dangnhap?redirect=' + encodeURIComponent(req.originalUrl));
    next();
}

async function requireAdmin(req, res, next) {
    if (!req.session.user) {
        if (req.originalUrl.startsWith('/api/')) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập bằng tài khoản quản trị.' });
        return res.status(403).render('404', {
            activePage: '404',
            title: 'Lỗi 403 - Truy cập bị từ chối',
            message: 'Bạn không có quyền truy cập trang này.'
        });
    }
    const account = /^[a-f\d]{24}$/i.test(String(req.session.user.userId || ''))
        ? await User.findById(req.session.user.userId).select('role fullName')
        : await User.findOne({ username: req.session.user.username }).select('role fullName');
    if (!account || account.role !== 'admin') {
        if (req.originalUrl.startsWith('/api/')) return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này.' });
        return res.status(403).render('404', { activePage: '404', title: 'Lỗi 403 - Truy cập bị từ chối', message: 'Bạn không có quyền truy cập trang này.' });
    }
    req.session.user.role = account.role;
    req.session.user.fullName = account.fullName;
    next();
}

// ── Validation helpers ───────────────────────────────────────
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone)  { return /^0\d{9,10}$/.test(phone); }

async function restoreOrderStock(order) {
    if (!order) return;
    const claimed = await Order.findOneAndUpdate(
        { _id: order._id, stockDeducted: true },
        { $set: { stockDeducted: false } },
        { new: false }
    );
    if (!claimed) return;
    const restored = [];
    try {
        for (const item of claimed.items || []) {
            const qty = Number(item.qty) || 0;
            await Product.updateOne({ id: item.id }, { $inc: { stock: qty } });
            restored.push({ id: item.id, qty });
        }
    } catch (error) {
        for (const item of restored) await Product.updateOne({ id: item.id }, { $inc: { stock: -item.qty } });
        await Order.updateOne({ _id: claimed._id }, { $set: { stockDeducted: true } });
        throw error;
    }
}

function asyncRoute(handler) {
    return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function productDto(product) {
    const collectionLabels = { classic: 'Classic', luxury: 'Luxury', diving: 'Diving', sport: 'Sport' };
    return {
        id: String(product._id), sku: product.id, name: product.name,
        model: product.model, category: collectionLabels[product.collection] || product.collection, collection: product.collection,
        price: product.price, stock: product.stock, status: product.status || 'Active',
        image: product.image ? (product.image.startsWith('/') ? product.image : `/${product.image}`) : '',
        createdAt: product.createdAt
    };
}

function normalizeProductInput(body) {
    const id = String(body.sku || body.id || '').trim();
    const name = String(body.name || '').trim();
    const model = String(body.model || name).trim();
    const collection = String(body.collection || body.category || '').trim().toLowerCase();
    const price = Number(body.price);
    const stock = Number(body.stock);
    const status = body.status || 'Active';
    if (id.length < 3 || name.length < 2 || model.length < 2) throw Object.assign(new Error('Tên, mô tả và mã tham chiếu sản phẩm không hợp lệ.'), { status: 400 });
    if (!Number.isFinite(price) || price <= 0) throw Object.assign(new Error('Giá sản phẩm không hợp lệ.'), { status: 400 });
    if (!Number.isInteger(stock) || stock < 0) throw Object.assign(new Error('Số lượng tồn kho không hợp lệ.'), { status: 400 });
    if (!['classic', 'luxury', 'diving', 'sport'].includes(collection)) throw Object.assign(new Error('Bộ sưu tập không hợp lệ.'), { status: 400 });
    if (!['Active', 'Draft', 'Archived'].includes(status)) throw Object.assign(new Error('Trạng thái sản phẩm không hợp lệ.'), { status: 400 });
    return { id, name, model, collection, price, stock, status, image: String(body.image || '').trim() };
}

function toAdminOrder(order) {
    const status = ({ pending: 'Processing', confirmed: 'Processing', shipping: 'Shipped', approved: 'Delivered', completed: 'Delivered', rejected: 'Cancelled', cancelled: 'Cancelled' })[order.status] || 'Processing';
    return {
        id: String(order._id), customer: order.fullName, email: order.email, phone: order.phone,
        date: order.createdAt, total: order.total, status, address: order.address, note: order.note,
        username: order.username, items: (order.items || []).map((item) => ({ product: item.name, sku: item.id, quantity: item.qty, price: item.price }))
    };
}

async function placeOrder(username, body) {
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const address = String(body.address || '').trim();
    const note = String(body.note || '').trim();
    if (fullName.length < 3 || !validateEmail(email) || !validatePhone(phone) || address.length < 5) {
        const error = new Error('Thông tin người nhận hoặc địa chỉ giao hàng không hợp lệ.');
        error.status = 400;
        throw error;
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
        const error = new Error('Giỏ hàng trống hoặc không hợp lệ.');
        error.status = 400;
        throw error;
    }

    const requested = new Map();
    for (const item of body.items) {
        const id = String(item.id || '').trim();
        const qty = Number(item.qty ?? item.quantity);
        if (!id || !Number.isInteger(qty) || qty <= 0) {
            const error = new Error('Số lượng sản phẩm không hợp lệ.');
            error.status = 400;
            throw error;
        }
        requested.set(id, (requested.get(id) || 0) + qty);
    }

    const items = [];
    const deducted = [];
    let total = 0;
    try {
        for (const [id, qty] of requested) {
            const product = await Product.findOneAndUpdate({ id, stock: { $gte: qty }, $or: [{ status: 'Active' }, { status: { $exists: false } }] }, { $inc: { stock: -qty } }, { new: true });
            if (!product) {
                const error = new Error(`Sản phẩm ${id} không còn đủ số lượng trong kho.`);
                error.status = 409;
                throw error;
            }
            deducted.push({ id, qty });
            const lineTotal = product.price * qty;
            items.push({ id: product.id, name: product.name, price: product.price, qty, lineTotal });
            total += lineTotal;
        }
        const order = await Order.create({
            username, fullName, email, phone, address, note,
            paymentMethod: ['vnpay', 'cod', 'bank'].includes(body.paymentMethod) ? body.paymentMethod : 'cod',
            items, total, stockDeducted: true
        });
        return order;
    } catch (error) {
        for (const item of deducted.reverse()) await Product.updateOne({ id: item.id }, { $inc: { stock: item.qty } });
        throw error;
    }
}

// ════════════════════════════════════════════════════════════
// ROUTES — GET
// ════════════════════════════════════════════════════════════

app.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.find({ $or: [{ status: 'Active' }, { status: { $exists: false } }] }).sort({ createdAt: 1 }).limit(6);
        res.render('trangchu', { activePage: 'trangchu', title: 'Rolex Vu Nhat Tuan Anh Vietnam — Trang chủ', featuredProducts });
    } catch (err) {
        res.status(500).render('error', { message: 'Lỗi tải trang chủ', error: err.message });
    }
});

app.get('/sanphammoi', async (req, res) => {
    try {
        const products = await Product.find({ $or: [{ status: 'Active' }, { status: { $exists: false } }] }).sort({ createdAt: 1 });
        res.render('sanphammoi', { activePage: 'sanphammoi', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Bộ sưu tập', products });
    } catch (err) {
        res.status(500).render('error', { message: 'Lỗi tải sản phẩm', error: err.message });
    }
});

app.get('/sanphammoi/:id', asyncRoute(async (req, res) => {
    const product = await Product.findOne({ id: req.params.id, $or: [{ status: 'Active' }, { status: { $exists: false } }] });
    if (!product) return res.status(404).render('404', { activePage: '404', title: 'Không tìm thấy sản phẩm', message: 'Mẫu đồng hồ này không tồn tại hoặc đã được gỡ khỏi bộ sưu tập.' });
    res.render('product-detail', { activePage: 'sanphammoi', title: 'Rolex Boutique Vietnam', product });
}));

app.get('/dichvu', (req, res) => {
    res.render('dichvu', { activePage: 'dichvu', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Dịch vụ' });
});

app.get('/chamsockhachhang', (req, res) => {
    res.render('chamsockhachhang', { activePage: 'chamsockhachhang', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Chăm sóc khách hàng' });
});

app.get('/form', (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/quanli' : '/don-hang');
    }
    res.render('form', { activePage: 'form', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đăng ký tư vấn', message: null });
});

app.get('/dangnhap', (req, res) => {
    if (req.session.user)
        return res.redirect(req.session.user.role === 'admin' ? '/quanli' : '/');
    res.render('dangnhap', {
        activePage: 'dangnhap',
        title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đăng nhập',
        message: null,
        redirect: req.query.redirect || null
    });
});

app.get('/thanhtoan', requireAuth, async (req, res) => {
    const products = await Product.find().sort({ createdAt: 1 });
    res.render('thanhtoan', { activePage: 'thanhtoan', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thanh toán', message: null, products });
});

app.get('/don-hang', requireAuth, async (req, res) => {
    const orders = await Order.find({ username: req.session.user.username }).sort({ createdAt: -1 });
    const successOrder = req.query.order ? orders.find((order) => String(order._id) === String(req.query.order)) : null;
    res.render('don-hang', {
        activePage: 'don-hang',
        title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đơn hàng của tôi',
        orders,
        success: req.query.success === '1',
        successOrder
    });
});

app.get('/thong-tin-ca-nhan', requireAuth, asyncRoute(async (req, res) => {
    if (req.session.user.role === 'admin') return res.redirect('/admin/settings');
    const account = await User.findOne({ username: req.session.user.username }).select('username fullName email phone');
    if (!account) return res.status(404).render('404', { activePage: '404', title: 'Không tìm thấy tài khoản', message: 'Tài khoản khách hàng không tồn tại.' });
    res.render('thong-tin-ca-nhan', {
        activePage: 'thong-tin-ca-nhan',
        title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thông tin cá nhân',
        account,
        message: req.query.updated === '1' ? { success: true, message: 'Thông tin cá nhân đã được cập nhật.' } : null
    });
}));

app.post('/thong-tin-ca-nhan', requireAuth, asyncRoute(async (req, res) => {
    if (req.session.user.role === 'admin') return res.redirect('/admin/settings');
    const account = await User.findOne({ username: req.session.user.username });
    if (!account) return res.status(404).render('404', { activePage: '404', title: 'Không tìm thấy tài khoản', message: 'Tài khoản khách hàng không tồn tại.' });

    const profile = {
        username: account.username,
        fullName: String(req.body.fullName || '').trim(),
        email: String(req.body.email || '').trim().toLowerCase(),
        phone: String(req.body.phone || '').trim()
    };
    const renderProfile = (message) => res.status(400).render('thong-tin-ca-nhan', {
        activePage: 'thong-tin-ca-nhan',
        title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thông tin cá nhân',
        account: profile,
        message: { success: false, message }
    });

    if (profile.fullName.length < 3) return renderProfile('Họ tên phải có ít nhất 3 ký tự.');
    if (!validateEmail(profile.email)) return renderProfile('Email không hợp lệ.');
    if (!validatePhone(profile.phone)) return renderProfile('Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 số).');
    if (await User.exists({ email: profile.email, _id: { $ne: account._id } })) return renderProfile('Email đã được sử dụng bởi tài khoản khác.');

    account.fullName = profile.fullName;
    account.email = profile.email;
    account.phone = profile.phone;
    await account.save();
    req.session.user.fullName = account.fullName;
    res.redirect('/thong-tin-ca-nhan?updated=1');
}));

app.get('/quanli', requireAuth, requireAdmin, async (req, res) => {
    try {
        const [accounts, products, orders] = await Promise.all([
            User.find().select('-password'),
            Product.find().sort({ createdAt: 1 }),
            Order.find().sort({ createdAt: -1 })
        ]);
        res.render('quanli', {
            activePage: 'quanli',
            title: 'Rolex Vu Nhat Tuan Anh Vietnam - Quản lí',
            products,
            accounts,
            orders,
            added: req.query.added || null
        });
    } catch (err) {
        res.status(500).render('error', { message: 'Lỗi tải trang quản lí', error: err.message });
    }
});

app.get('/quanli/hoadon', requireAuth, requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        const tongHoaDon   = orders.length;
        const choDuyet     = orders.filter(o => o.status === 'pending').length;
        const daDuyet      = orders.filter(o => o.status === 'approved').length;
        const tongDoanhThu = orders
            .filter(o => o.status === 'approved')
            .reduce((sum, o) => sum + (o.total || 0), 0);

        // Doanh thu theo tháng (chỉ tính đơn đã duyệt)
        const thangMap = {};
        orders.filter(o => o.status === 'approved').forEach(o => {
            const d   = new Date(o.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            thangMap[key] = (thangMap[key] || 0) + (o.total || 0);
        });
        const doanhThuThang = Object.keys(thangMap).sort().map(k => ({
            year:    parseInt(k.split('-')[0]),
            month:   parseInt(k.split('-')[1]),
            revenue: thangMap[k]
        }));
        const maxThang = doanhThuThang.reduce((m, t) => Math.max(m, t.revenue), 1);

        res.render('hoadon', {
            activePage: 'quanli',
            title: 'Rolex Vu Nhat Tuan Anh Vietnam - Quản lý Hóa đơn',
            orders,
            tongHoaDon,
            choDuyet,
            daDuyet,
            tongDoanhThu,
            doanhThuThang,
            maxThang
        });
    } catch (err) {
        res.status(500).render('error', { message: 'Lỗi tải trang hóa đơn', error: err.message });
    }
});

app.get('/quanli/them-san-pham', requireAuth, requireAdmin, (req, res) => {
    res.render('them-san-pham', { activePage: 'quanli', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thêm sản phẩm', message: null, form: {} });
});

app.get('/quanli/them-tai-khoan', requireAuth, requireAdmin, (req, res) => {
    res.render('them-tai-khoan', { activePage: 'quanli', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thêm tài khoản', message: null, form: {} });
});

app.get('/api/auth/check', (req, res) => {
    res.json({ success: true, authenticated: !!req.session.user, user: req.session.user || null });
});

app.get('/api/products', asyncRoute(async (req, res) => {
    const products = await Product.find({ $or: [{ status: 'Active' }, { status: { $exists: false } }] }).sort({ createdAt: -1 });
    res.json({ success: true, data: products.map(productDto) });
}));

app.get('/api/products/:id', asyncRoute(async (req, res) => {
    const product = /^[a-f\d]{24}$/i.test(req.params.id)
        ? await Product.findById(req.params.id)
        : await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    res.json({ success: true, data: productDto(product) });
}));

app.get('/api/admin/categories', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const groups = await Product.aggregate([{ $group: { _id: '$collection', products: { $sum: 1 } } }, { $sort: { _id: 1 } }]);
    const labels = { classic: 'Classic', luxury: 'Luxury', diving: 'Diving', sport: 'Sport' };
    res.json({ success: true, data: groups.map((group) => ({ id: group._id, name: labels[group._id] || group._id, slug: group._id, products: group.products, status: 'Active' })) });
}));

app.get('/api/admin/products', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products.map(productDto) });
}));

app.get('/api/orders', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders.map(toAdminOrder) });
}));

app.get('/api/orders/:id', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ success: false, message: 'Mã đơn hàng không hợp lệ.' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    res.json({ success: true, data: toAdminOrder(order) });
}));

app.get('/api/admin/customers', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const [users, aggregates] = await Promise.all([
        User.find({ role: 'user' }).select('username fullName email phone createdAt').sort({ createdAt: -1 }),
        Order.aggregate([{ $match: { status: { $in: ['approved', 'completed'] } } }, { $group: { _id: '$username', orders: { $sum: 1 }, spent: { $sum: '$total' } } }])
    ]);
    const metrics = new Map(aggregates.map((item) => [item._id, item]));
    res.json({ success: true, data: users.map((user) => {
        const stats = metrics.get(user.username) || { orders: 0, spent: 0 };
        const name = user.fullName || user.username;
        return { id: String(user._id), name, email: user.email, phone: user.phone || '', joined: user.createdAt, orders: stats.orders, spent: stats.spent, initials: name.split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase() };
    }) });
}));

app.get('/api/admin/statistics', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const periodDays = Math.min(Math.max(Number(req.query.days) || 30, 7), 365);
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const [products, users, orders, revenue, lowStock, chart] = await Promise.all([
        Product.countDocuments(), User.countDocuments({ role: 'user' }), Order.countDocuments(),
        Order.aggregate([{ $match: { status: { $in: ['approved', 'completed'] } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
        Product.countDocuments({ stock: { $lte: 3 } }),
        Order.aggregate([
            { $match: { createdAt: { $gte: since }, status: { $in: ['approved', 'completed'] } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ])
    ]);
    const statusCounts = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    res.json({ success: true, data: { products, users, orders, revenue: revenue[0]?.total || 0, lowStock, chart: chart.map((item) => ({ label: item._id, revenue: item.revenue, orders: item.orders })), statuses: Object.fromEntries(statusCounts.map((item) => [item._id, item.count])) } });
}));

app.patch('/api/orders/:id/status', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) return res.status(400).json({ success: false, message: 'Mã đơn hàng không hợp lệ.' });
    const statusMap = { Processing: 'confirmed', Shipped: 'shipping', Delivered: 'completed', Cancelled: 'cancelled' };
    const status = statusMap[req.body.status] || req.body.status;
    const allowed = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ.' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    if (['rejected', 'cancelled', 'completed'].includes(order.status) && order.status !== status)
        return res.status(409).json({ success: false, message: 'Không thể thay đổi trạng thái của đơn đã kết thúc.' });
    if (status === 'cancelled' && order.status !== 'cancelled') await restoreOrderStock(order);
    order.status = status;
    await order.save();
    res.json({ success: true, data: toAdminOrder(order) });
}));

app.post('/api/orders', requireAuth, asyncRoute(async (req, res) => {
    const order = await placeOrder(req.session.user.username, req.body);
    res.status(201).json({ success: true, data: toAdminOrder(order) });
}));

app.get('/api/chat/messages', requireAuth, async (req, res) => {
    const messages = await ChatMessage.find({ username: req.session.user.username }).sort({ createdAt: 1 }).limit(100);
    await ChatMessage.updateMany({ username: req.session.user.username, senderRole: 'admin' }, { $set: { readByUser: true } });
    res.json({ success: true, messages });
});

app.post('/api/chat/messages', requireAuth, async (req, res) => {
    const text = String(req.body.text || '').trim();
    if (!text || text.length > 1000) return res.status(400).json({ success: false, message: 'Tin nhắn không hợp lệ.' });
    const message = await ChatMessage.create({ username: req.session.user.username, senderRole: 'user', text });
    res.json({ success: true, message });
});

app.get('/api/admin/chat/conversations', requireAuth, requireAdmin, async (req, res) => {
    const conversations = await ChatMessage.aggregate([
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$username', lastMessage: { $first: '$text' }, lastAt: { $first: '$createdAt' }, unread: { $sum: { $cond: [{ $and: [{ $eq: ['$senderRole', 'user'] }, { $eq: ['$readByAdmin', false] }] }, 1, 0] } } } },
        { $sort: { lastAt: -1 } }
    ]);
    res.json({ success: true, conversations });
});

app.get('/api/admin/chat/:username', requireAuth, requireAdmin, async (req, res) => {
    const messages = await ChatMessage.find({ username: req.params.username }).sort({ createdAt: 1 }).limit(100);
    await ChatMessage.updateMany({ username: req.params.username, senderRole: 'user' }, { $set: { readByAdmin: true } });
    res.json({ success: true, messages });
});

app.post('/api/admin/chat/:username', requireAuth, requireAdmin, async (req, res) => {
    const text = String(req.body.text || '').trim();
    if (!text || text.length > 1000) return res.status(400).json({ success: false, message: 'Tin nhắn không hợp lệ.' });
    const message = await ChatMessage.create({ username: req.params.username, senderRole: 'admin', text, readByUser: false });
    res.json({ success: true, message });
});

// ════════════════════════════════════════════════════════════
// ROUTES — POST
// ════════════════════════════════════════════════════════════

app.post('/form', async (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/quanli' : '/don-hang');
    }
    const { fullName, email, username, password, confirmPassword, phone, interest, message } = req.body;
    const fail = (msg) => res.render('form', { activePage: 'form', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đăng ký tư vấn', message: { success: false, message: msg } });

    if (!fullName || fullName.trim().length < 3)   return fail('Họ tên phải có ít nhất 3 ký tự.');
    if (!validateEmail(email))                      return fail('Email không hợp lệ.');
    if (!username || username.trim().length < 4)    return fail('Tên tài khoản phải có ít nhất 4 ký tự.');
    if (!password || password.trim().length < 8)    return fail('Mật khẩu phải có ít nhất 8 ký tự.');
    if (confirmPassword !== password)                return fail('Mật khẩu xác nhận không khớp.');
    if (!validatePhone(phone))                      return fail('Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 số).');
    if (!interest)                                  return fail('Vui lòng chọn dòng đồng hồ quan tâm.');
    if (!req.body.agree)                             return fail('Vui lòng đồng ý để chúng tôi liên hệ tư vấn.');

    try {
        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const exists = await User.findOne({ $or: [{ username: normalizedUsername }, { email: normalizedEmail }] });
        if (exists) return fail(exists.username === normalizedUsername ? 'Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.' : 'Email đã được sử dụng.');

        const user = await User.create({ username: normalizedUsername, password: password.trim(), role: 'user', fullName: fullName.trim(), email: normalizedEmail, phone: phone.trim() });
        try {
            await Registration.create({ fullName: fullName.trim(), email: normalizedEmail, username: normalizedUsername, phone: phone.trim(), interest, message: message || '' });
        } catch (error) {
            await User.deleteOne({ _id: user._id });
            throw error;
        }

        res.render('form', {
            activePage: 'form',
            title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đăng ký tư vấn',
            message: { success: true, message: 'Đăng ký thành công! Tài khoản đã được tạo, bạn có thể đăng nhập ngay.' }
        });
    } catch (err) {
        fail('Lỗi hệ thống: ' + err.message);
    }
});

const loginHandler = async (req, res) => {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu.' });

        const redirectCandidate = String(req.body.redirect || '');
        const redirect = redirectCandidate.startsWith('/') && !redirectCandidate.startsWith('//')
            ? redirectCandidate
            : user.role === 'admin' ? '/admin/dashboard' : '/';
        req.session.regenerate((error) => {
            if (error) return res.status(500).json({ success: false, message: 'Không thể tạo phiên đăng nhập.' });
            req.session.user = { username: user.username, role: user.role, fullName: user.fullName, userId: String(user._id) };
            req.session.save((saveError) => {
                if (saveError) return res.status(500).json({ success: false, message: 'Không thể lưu phiên đăng nhập.' });
                res.json({ success: true, message: user.role === 'admin' ? 'Đăng nhập admin thành công.' : 'Đăng nhập thành công.', redirect });
            });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
    }
};
app.post('/dangnhap', loginHandler);
app.post('/api/auth/login', loginHandler);

const logoutHandler = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.json({ success: false, message: 'Lỗi đăng xuất.' });
        res.clearCookie('rolex.sid', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
        res.json({ success: true, redirect: '/' });
    });
};
app.post('/dangxuat', logoutHandler);
app.post('/api/auth/logout', logoutHandler);

app.post('/thanhtoan', requireAuth, async (req, res) => {
    const { fullName, email, phone, orderNote, address, paymentMethod, cartItems } = req.body;

    const fail = async (msg) => {
        const products = await Product.find().sort({ createdAt: 1 });
        res.render('thanhtoan', {
            activePage: 'thanhtoan', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thanh toán',
            message: { success: false, message: msg }, products
        });
    };

    if (!fullName || !email || !phone || !orderNote) return fail('Vui lòng điền đầy đủ thông tin bắt buộc (*).');

    let snapshot;
    try { snapshot = JSON.parse(cartItems || '{}'); } catch { return fail('Dữ liệu giỏ hàng không hợp lệ.'); }
    if (!snapshot.items || snapshot.items.length === 0) return fail('Giỏ hàng trống, không thể đặt hàng.');

    try {
        const order = await placeOrder(req.session.user.username, {
            fullName, email, phone, address: orderNote, note: address || '', paymentMethod,
            items: snapshot.items
        });
        res.redirect(`/don-hang?success=1&order=${encodeURIComponent(order._id)}`);
    } catch (err) {
        if (err.status === 409) return fail('Một hoặc nhiều mẫu đồng hồ vừa hết hàng. Vui lòng cập nhật giỏ hàng và thử lại.');
        fail(err.status ? err.message : 'Lỗi hệ thống, vui lòng thử lại.');
    }
});

// Xử lý form thêm sản phẩm mới (trang /quanli/them-san-pham)
// Xử lý form thêm sản phẩm mới (trang /quanli/them-san-pham)
app.post('/quanli/them-san-pham', requireAuth, requireAdmin, async (req, res) => {
    // Lấy từng trường từ body form gửi lên
    const { productId, productName, productModel, productPrice, productStock, productCollection, productImage } = req.body;
    // Chuyển giá từ chuỗi sang số nguyên (hệ 10)
    const price = parseInt(productPrice, 10);
    const stock = parseInt(productStock, 10);
    // Hàm tiện ích: render lại trang với thông báo lỗi và giữ nguyên dữ liệu đã nhập
    const fail = (msg) => res.render('them-san-pham', {
        activePage: 'quanli', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thêm sản phẩm',
        message: { success: false, message: msg }, form: req.body
    });

    // Kiểm tra các trường bắt buộc và giá hợp lệ (> 0)
    if (!productId || !productName || !productModel || !productCollection || isNaN(price) || price <= 0 || !Number.isInteger(stock) || stock < 0)
        return fail('Vui lòng điền đầy đủ và hợp lệ các trường bắt buộc (*).');
    // Kiểm tra mã tham chiếu chưa tồn tại trong database
    if (await Product.findOne({ id: productId.trim() })) return fail('Mã tham chiếu đã tồn tại!');

    // Tạo sản phẩm mới trong MongoDB với các trường đã được trim khoảng trắng
    await Product.create({ id: productId.trim(), name: productName.trim(), model: productModel.trim(), price, stock, collection: productCollection.trim(), image: (productImage || '').trim() });
    // Chuyển về trang quản lí, kèm query báo hiệu vừa thêm sản phẩm thành công
    res.redirect('/quanli?added=product');
});

// Xử lý form thêm tài khoản mới (trang /quanli/them-tai-khoan)
app.post('/quanli/them-tai-khoan', requireAuth, requireAdmin, async (req, res) => {
    // Lấy từng trường từ body form gửi lên
    const { accountUsername, accountPassword, accountRole, accountFullName, accountEmail } = req.body;
    // Hàm tiện ích: render lại trang với thông báo lỗi và giữ nguyên dữ liệu đã nhập
    const fail = (msg) => res.render('them-tai-khoan', {
        activePage: 'quanli', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thêm tài khoản',
        message: { success: false, message: msg }, form: req.body
    });

    // Kiểm tra các trường bắt buộc: tên đăng nhập, mật khẩu, vai trò
    if (!accountUsername || !accountPassword || !accountRole)
        return fail('Vui lòng điền đầy đủ tên đăng nhập, mật khẩu và vai trò (*).');
    // Kiểm tra tên đăng nhập chưa tồn tại trong database
    if (await User.findOne({ username: accountUsername.trim() })) return fail('Tài khoản này đã tồn tại. Vui lòng chọn tên khác.');

    // Tạo tài khoản mới trong MongoDB (password sẽ được hash tự động qua pre-save hook)
    await User.create({ username: accountUsername.trim(), password: accountPassword.trim(), role: accountRole, fullName: (accountFullName || '').trim(), email: (accountEmail || '').trim() });
    // Chuyển về trang quản lí, kèm query báo hiệu vừa thêm tài khoản thành công
    res.redirect('/quanli?added=account');
});

// ════════════════════════════════════════════════════════════
// API ROUTES — AJAX từ quanli.js
// ════════════════════════════════════════════════════════════

app.put('/api/orders/:id', requireAuth, requireAdmin, async (req, res) => {
    const { fullName, phone, email, address, note, paymentMethod } = req.body;
    const update = {};
    if (fullName      !== undefined) update.fullName      = fullName;
    if (phone         !== undefined) update.phone         = phone;
    if (email         !== undefined) update.email         = email;
    if (address       !== undefined) update.address       = address;
    if (note          !== undefined) update.note          = note;
    if (paymentMethod !== undefined) update.paymentMethod = paymentMethod;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    res.json({ success: true, data: toAdminOrder(order) });
});

app.delete('/api/orders/:id', requireAuth, requireAdmin, async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order && ['pending', 'confirmed', 'rejected', 'cancelled'].includes(order.status)) await restoreOrderStock(order);
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.get('/api/accounts', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const accounts = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: accounts });
}));

app.get('/api/admin/profile', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const account = await User.findOne({ username: req.session.user.username }).select('username fullName email phone role');
    if (!account) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
    res.json({ success: true, data: account });
}));

app.put('/api/admin/profile', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const fullName = String(req.body.fullName || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    if (fullName.length < 3 || !validateEmail(email)) return res.status(400).json({ success: false, message: 'Họ tên hoặc email không hợp lệ.' });
    const account = await User.findOne({ username: req.session.user.username });
    if (!account) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
    const duplicate = await User.findOne({ email, _id: { $ne: account._id } });
    if (duplicate) return res.status(409).json({ success: false, message: 'Email đã được sử dụng.' });
    account.fullName = fullName;
    account.email = email;
    account.phone = phone;
    await account.save();
    req.session.user.fullName = account.fullName;
    req.session.save((error) => {
        if (error) return res.status(500).json({ success: false, message: 'Không thể lưu phiên đăng nhập.' });
        res.json({ success: true, data: { username: account.username, fullName: account.fullName, email: account.email, phone: account.phone, role: account.role } });
    });
}));

app.put('/api/admin/profile/password', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');
    if (newPassword.length < 8 || newPassword !== req.body.confirmPassword) return res.status(400).json({ success: false, message: 'Mật khẩu mới cần tối thiểu 8 ký tự và xác nhận phải trùng khớp.' });
    const account = await User.findOne({ username: req.session.user.username });
    if (!account || !(await account.comparePassword(currentPassword))) return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
    account.password = newPassword;
    await account.save();
    res.json({ success: true, message: 'Đã cập nhật mật khẩu.' });
}));

app.post('/api/orders/:id/duyet', requireAuth, requireAdmin, async (req, res) => {
    await Order.findOneAndUpdate({ _id: req.params.id, status: 'pending' }, { status: 'approved' });
    res.redirect('/quanli');
});

app.post('/api/orders/:id/tuchoi', requireAuth, requireAdmin, async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order && ['pending', 'confirmed'].includes(order.status)) {
        await restoreOrderStock(order);
        order.status = 'rejected';
        await order.save();
    }
    res.redirect('/quanli');
});

// THÊM sản phẩm — nhận dữ liệu JSON từ modal trong trang quản lí
app.post('/api/products', requireAuth, requireAdmin, async (req, res) => {
    try {
        const productData = normalizeProductInput(req.body);
        if (await Product.findOne({ id: productData.id })) return res.status(409).json({ success: false, message: 'Mã tham chiếu đã tồn tại.' });
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: productDto(product) });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ success: false, message: error.message });
        throw error;
    }
});

// SỬA sản phẩm — cập nhật theo mã tham chiếu trên URL
app.put('/api/products/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const productData = normalizeProductInput(req.body);
        const query = /^[a-f\d]{24}$/i.test(req.params.id) ? { _id: req.params.id } : { id: req.params.id };
        const currentProduct = await Product.findOne(query);
        if (!currentProduct) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
        const duplicate = await Product.findOne({ id: productData.id, _id: { $ne: currentProduct._id } });
        if (duplicate) return res.status(409).json({ success: false, message: 'Mã tham chiếu đã tồn tại.' });
        const product = await Product.findByIdAndUpdate(currentProduct._id, productData, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
        res.json({ success: true, data: productDto(product) });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ success: false, message: error.message });
        throw error;
    }
});

// XÓA sản phẩm — xóa theo mã tham chiếu trên URL
app.delete('/api/products/:id', requireAuth, requireAdmin, async (req, res) => {
    const query = /^[a-f\d]{24}$/i.test(req.params.id) ? { _id: req.params.id } : { id: req.params.id };
    const product = await Product.findOneAndDelete(query);
    if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });
    res.json({ success: true, data: productDto(product) });
});

// THÊM tài khoản — nhận dữ liệu JSON từ modal trong trang quản lí
app.post('/api/accounts', requireAuth, requireAdmin, async (req, res) => {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const role = req.body.role;
    if (username.length < 4 || password.length < 8 || !['admin', 'user'].includes(role)) return res.status(400).json({ success: false, message: 'Thông tin tài khoản không hợp lệ.' });
    if (await User.findOne({ $or: [{ username }, ...(req.body.email ? [{ email: String(req.body.email).trim().toLowerCase() }] : [])] }))
        return res.status(409).json({ success: false, message: 'Tên đăng nhập hoặc email đã tồn tại.' });
    const account = await User.create({ username, password, role, fullName: String(req.body.fullName || '').trim(), email: String(req.body.email || '').trim().toLowerCase(), phone: String(req.body.phone || '').trim() });
    res.status(201).json({ success: true, data: account.toObject({ transform: (_doc, ret) => { delete ret.password; return ret; } }) });
});

// SỬA tài khoản — cập nhật theo username trên URL
app.put('/api/accounts/:username', requireAuth, requireAdmin, async (req, res) => {
    // Tìm tài khoản cần sửa theo username trên URL
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản.' });
    // Chỉ cập nhật từng trường nếu frontend có gửi lên (để trống = giữ nguyên)
    if (req.body.password) user.password = req.body.password; // password mới sẽ được hash lại qua pre-save hook
    if (req.body.role)     user.role     = req.body.role;     // vai trò: 'admin' hoặc 'user'
    if (req.body.fullName) user.fullName = req.body.fullName; // họ tên đầy đủ
    if (req.body.email)    user.email    = req.body.email;    // địa chỉ email
    // Lưu lại — dùng .save() thay vì findOneAndUpdate để kích hoạt pre-save hook hash password
    await user.save();
    // Trả về JSON báo thành công để frontend cập nhật giao diện
    res.json({ success: true, data: { username: user.username, role: user.role, fullName: user.fullName, email: user.email, phone: user.phone } });
});

// XÓA tài khoản — xóa theo username trên URL
app.delete('/api/accounts/:username', requireAuth, requireAdmin, async (req, res) => {
    // Bảo vệ tài khoản 'admin' gốc, không cho phép xóa
    if (req.params.username === 'admin') return res.json({ success: false, message: 'Không thể xóa tài khoản admin!' });
    // Tìm và xóa tài khoản có username khớp với tham số trên URL
    await User.findOneAndDelete({ username: req.params.username });
    // Trả về JSON báo thành công để frontend xóa hàng khỏi bảng
    res.json({ success: true });
});

// ════════════════════════════════════════════════════════════
// KHỞI ĐỘNG SERVER
// ════════════════════════════════════════════════════════════

const defaultProducts = [
    { id: '126234',     name: 'Datejust 36',       model: 'Oyster 36 mm - Oystersteel & white gold',  price: 246787000,  collection: 'classic', image: 'media/datejust 36.avif' },
    { id: '126334',     name: 'Datejust 41',        model: 'Oyster 41 mm - Fluted bezel Everose',      price: 287918000,  collection: 'classic', image: 'media/116234.avif' },
    { id: '279135RBR',  name: 'Lady-Datejust',      model: 'Oyster 28 mm - Everose gold & diamonds',   price: 1236676000, collection: 'luxury',  image: '' },
    { id: '126610LN',   name: 'Submariner Date',    model: 'Oyster 41 mm - Black ceramic bezel gold',  price: 340000000,  collection: 'diving',  image: 'media/submariner.avif' },
    { id: '126660',     name: 'Deepsea',            model: 'Oyster 44 mm - D-blue dial',               price: 580000000,  collection: 'diving',  image: 'media/deepsea.avif' },
    { id: '126710BLRO', name: 'GMT-Master II',      model: 'Oyster 40 mm - Dual color bezel',          price: 420000000,  collection: 'sport',   image: 'media/11610lv.avif' },
    { id: '116508',     name: 'Cosmograph Daytona', model: 'Oyster 40 mm - 18 ct yellow gold',         price: 1150000000, collection: 'sport',   image: '' },
    { id: '50535',      name: 'Cellini Moonphase',  model: '39 mm - Everose 18 ct',                    price: 890000000,  collection: 'luxury',  image: '' },
    { id: '126600',     name: 'Sea-Dweller',        model: 'Oyster 43 mm - Oystersteel',               price: 520000000,  collection: 'diving',  image: 'media/sea.avif' },
    { id: '126231',     name: 'Datejust 36 Everose', model: 'Oyster 36 mm - Everose Rolesor, mặt số bạc', price: 338000000, collection: 'classic', image: 'media/datejust 36.avif' },
    { id: '126200',     name: 'Datejust 36 Blue',   model: 'Oyster 36 mm - Oystersteel, mặt số xanh',   price: 218000000, collection: 'classic', image: 'media/116234.avif' },
    { id: '126300',     name: 'Datejust 41 Blue',   model: 'Oyster 41 mm - Oystersteel, mặt số xanh',   price: 238000000, collection: 'classic', image: 'media/116234.avif' },
    { id: '126500LN',   name: 'Cosmograph Daytona', model: 'Oyster 40 mm - Oystersteel, vành Cerachrom', price: 980000000, collection: 'sport', image: 'media/submariner.avif' },
    { id: '126508',     name: 'Daytona Yellow Gold', model: 'Oyster 40 mm - Vàng vàng 18 ct',             price: 1680000000, collection: 'luxury', image: 'media/máy.avif' },
    { id: '126710BLNR', name: 'GMT-Master II Batman', model: 'Oyster 40 mm - Vành Cerachrom xanh đen',   price: 498000000, collection: 'sport', image: 'media/11610lv.avif' },
    { id: '126710GRNR', name: 'GMT-Master II',      model: 'Oyster 40 mm - Vành Cerachrom xám đen',      price: 512000000, collection: 'sport', image: 'media/11610lv.avif' },
    { id: '226570',    name: 'Explorer II',         model: 'Oyster 42 mm - Oystersteel, mặt số trắng',   price: 368000000, collection: 'sport', image: 'media/sky-dweller.avif' },
    { id: '124270',    name: 'Explorer 36',         model: 'Oyster 36 mm - Oystersteel, mặt số đen',     price: 248000000, collection: 'sport', image: 'media/submariner.avif' },
    { id: '126900',    name: 'Air-King',            model: 'Oyster 40 mm - Oystersteel, mặt số đen',     price: 286000000, collection: 'sport', image: 'media/sky-dweller.avif' },
    { id: '124060',    name: 'Submariner',          model: 'Oyster 41 mm - Oystersteel, vành đen',       price: 298000000, collection: 'diving', image: 'media/submariner.avif' },
    { id: '126618LB',  name: 'Submariner Date Gold', model: 'Oyster 41 mm - Vàng vàng 18 ct, mặt số xanh', price: 1480000000, collection: 'luxury', image: 'media/sub date.avif' },
    { id: '126622',    name: 'Yacht-Master 40',     model: 'Oyster 40 mm - Rolesium, mặt số xanh',       price: 568000000, collection: 'sport', image: 'media/sea.avif' },
    { id: '226659',    name: 'Yacht-Master 42',     model: 'Oyster 42 mm - Vàng trắng 18 ct',            price: 1320000000, collection: 'luxury', image: 'media/day-date 40.avif' },
    { id: '226627',    name: 'Yacht-Master Titanium', model: 'Oyster 42 mm - RLX titanium',              price: 628000000, collection: 'sport', image: 'media/sea.avif' },
    { id: '126603',    name: 'Sea-Dweller Rolesor', model: 'Oyster 43 mm - Oystersteel và vàng vàng',     price: 648000000, collection: 'diving', image: 'media/sea.avif' },
    { id: '136660',    name: 'Deepsea D-Blue',      model: 'Oyster 44 mm - Oystersteel, mặt số D-blue',  price: 598000000, collection: 'diving', image: 'media/deepsea.avif' },
    { id: '228235',    name: 'Day-Date 40 Everose', model: 'Oyster 40 mm - Vàng Everose 18 ct',          price: 1480000000, collection: 'luxury', image: 'media/day-date 40.avif' },
    { id: '128238',    name: 'Day-Date 36 Gold',    model: 'Oyster 36 mm - Vàng vàng 18 ct',             price: 1280000000, collection: 'luxury', image: 'media/day-date 40.avif' },
    { id: '126000',    name: 'Oyster Perpetual 36', model: 'Oyster 36 mm - Oystersteel, mặt số bạc',     price: 188000000, collection: 'classic', image: 'media/116234.avif' },
    { id: '124300',    name: 'Oyster Perpetual 41', model: 'Oyster 41 mm - Oystersteel, mặt số xanh',   price: 208000000, collection: 'classic', image: 'media/11610lv.avif' },
    { id: '1908',      name: 'Perpetual 1908',      model: '39 mm - Vàng vàng 18 ct, dây da',            price: 768000000, collection: 'luxury', image: 'media/máy2.avif' }
].map((product, index) => ({ ...product, stock: 2 + ((index * 7) % 17) }));

const defaultCustomers = [
    { username: 'demo-minhanh', fullName: 'Minh Anh Nguyễn', email: 'minhanh.nguyen@example.com', phone: '0908123456' },
    { username: 'demo-david', fullName: 'David Trần', email: 'david.tran@example.com', phone: '0912660889' },
    { username: 'demo-linh', fullName: 'Linh Phạm', email: 'linh.pham@example.com', phone: '0903441222' },
    { username: 'demo-hoang', fullName: 'Hoàng Lê', email: 'hoang.le@example.com', phone: '0987090128' },
    { username: 'demo-huong', fullName: 'Hương Đỗ', email: 'huong.do@example.com', phone: '0909881090' },
    { username: 'demo-quocbao', fullName: 'Quốc Bảo Vũ', email: 'quocbao.vu@example.com', phone: '0936772615' },
    { username: 'demo-thao', fullName: 'Thảo Võ', email: 'thao.vo@example.com', phone: '0916556201' },
    { username: 'demo-richard', fullName: 'Richard Nguyễn', email: 'richard.nguyen@example.com', phone: '0938441100' },
    { username: 'demo-mai', fullName: 'Mai Trương', email: 'mai.truong@example.com', phone: '0901882330' },
    { username: 'demo-tuan', fullName: 'Tuấn Phạm', email: 'tuan.pham@example.com', phone: '0905123410' },
    { username: 'demo-ngoc', fullName: 'Ngọc Bùi', email: 'ngoc.bui@example.com', phone: '0913557721' },
    { username: 'demo-khanh', fullName: 'Khánh Trần', email: 'khanh.tran@example.com', phone: '0988221456' },
    { username: 'demo-anhthu', fullName: 'Anh Thư Lê', email: 'anhthu.le@example.com', phone: '0906778142' },
    { username: 'demo-minhduc', fullName: 'Minh Đức Hoàng', email: 'minhduc.hoang@example.com', phone: '0932114678' },
    { username: 'demo-phuong', fullName: 'Phương Đặng', email: 'phuong.dang@example.com', phone: '0917440912' },
    { username: 'demo-baochau', fullName: 'Bảo Châu Nguyễn', email: 'baochau.nguyen@example.com', phone: '0903221788' },
    { username: 'demo-thanh', fullName: 'Thanh Võ', email: 'thanh.vo@example.com', phone: '0977332810' },
    { username: 'demo-huy', fullName: 'Huy Đinh', email: 'huy.dinh@example.com', phone: '0909336482' }
];

const demoOrderStatuses = ['pending', 'confirmed', 'shipping', 'approved', 'completed', 'rejected', 'cancelled'];
const defaultOrders = Array.from({ length: 36 }, (_, index) => {
    const customer = defaultCustomers[index % defaultCustomers.length];
    const product = defaultProducts[index % defaultProducts.length];
    const quantity = index % 3 === 0 ? 2 : 1;
    const items = [{ id: product.id, name: product.name, price: product.price, qty: quantity, lineTotal: product.price * quantity }];
    if (index % 5 === 0) {
        const secondProduct = defaultProducts[(index + 7) % defaultProducts.length];
        items.push({ id: secondProduct.id, name: secondProduct.name, price: secondProduct.price, qty: 1, lineTotal: secondProduct.price });
    }
    return {
        username: customer.username,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: `${20 + index} Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh`,
        note: '',
        paymentMethod: ['cod', 'bank', 'vnpay'][index % 3],
        items,
        total: items.reduce((sum, item) => sum + item.lineTotal, 0),
        status: demoOrderStatuses[index % demoOrderStatuses.length],
        createdAt: new Date(Date.now() - (index % 30) * 24 * 60 * 60 * 1000 - (index % 8) * 60 * 60 * 1000)
    };
});

async function initializeDatabase() {
    if (!initializationPromise) {
        initializationPromise = (async () => {
            await connect();
            const bootstrapUsername = process.env.BOOTSTRAP_ADMIN_USERNAME;
            const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
            if (bootstrapUsername && bootstrapPassword && !await User.exists({ username: bootstrapUsername })) {
                await User.create({ username: bootstrapUsername, password: bootstrapPassword, role: 'admin', fullName: 'Administrator' });
            }
            await Product.bulkWrite(defaultProducts.map((product) => ({
                updateOne: { filter: { id: product.id }, update: { $setOnInsert: product }, upsert: true }
            })));
            for (const customer of defaultCustomers) {
                if (!await User.exists({ username: customer.username })) {
                    await User.create({ ...customer, password: crypto.randomBytes(24).toString('hex'), role: 'user' });
                }
            }
            if (await Order.countDocuments() < defaultOrders.length) await Order.insertMany(defaultOrders);
            await Product.updateMany({ stock: { $exists: false } }, { $set: { stock: 1 } });
            await Product.updateOne({ id: '279135RBR', image: 'media/day-date 40.avif' }, { $set: { image: '' } });
            await Product.updateOne({ id: '116508', image: 'media/sky-dweller.avif' }, { $set: { image: '' } });
            await Product.updateOne({ id: '50535', image: 'media/Land-Dweller.avif' }, { $set: { image: '' } });
        })().catch((error) => {
            initializationPromise = null;
            throw error;
        });
    }
    return initializationPromise;
}

async function main() {
    try {
        await initializeDatabase();

        const port = Number(process.env.PORT) || 3000;
        return app.listen(port, () => console.log(`Server listening on port ${port}`));
    } catch (err) {
        console.error('Lỗi kết nối:', err);
    }
}
if (require.main === module) main();
module.exports = app;

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.get('/admin/*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api/')) return res.status(404).json({ success: false, message: 'Không tìm thấy API.' });
    res.status(404).render('404', { activePage: '404', title: 'Không tìm thấy trang', message: 'Trang bạn tìm không tồn tại.' });
});
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = Number(error.status) || 500;
    if (req.originalUrl.startsWith('/api/')) return res.status(status).json({ success: false, message: status >= 500 ? 'Lỗi máy chủ. Vui lòng thử lại.' : error.message });
    res.status(status).render('error', { title: 'Lỗi hệ thống', message: 'Không thể hoàn tất yêu cầu.', error: process.env.NODE_ENV === 'production' ? null : error.message });
});
