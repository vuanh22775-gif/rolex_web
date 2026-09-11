const express    = require('express');
const path       = require('path');
const session    = require('express-session');
const MongoStore = require('connect-mongo');

const connect      = require('./connect');
const Product      = require('./models/productModel');
const User         = require('./models/userModel');
const Registration = require('./models/registrationModel');
const Order        = require('./models/orderModel');

const app = express();

// ── View engine ──────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ─────────────────────────────────────────────
app.use('/css',    express.static(path.join(__dirname, 'css')));
app.use('/js',     express.static(path.join(__dirname, 'js')));
app.use('/media',  express.static(path.join(__dirname, 'media')));
app.use('/fontawesome-free-6.7.2-web', express.static(path.join(__dirname, 'fontawesome-free-6.7.2-web')));

// ── Body parser ───────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Session ──────────────────────────────────────────────────
app.use(session({
    secret: 'rolex_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/rolex_boutique',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60
    }),
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

// ── Pass user vào views ──────────────────────────────────────
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// ── Middleware quyền ─────────────────────────────────────────
function requireAuth(req, res, next) {
    if (!req.session.user)
        return res.redirect('/dangnhap?redirect=' + encodeURIComponent(req.originalUrl));
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'admin')
        return res.status(403).render('404', {
            activePage: '404',
            title: 'Lỗi 403 - Truy cập bị từ chối',
            message: 'Bạn không có quyền truy cập trang này.'
        });
    next();
}

// ── Validation helpers ───────────────────────────────────────
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone)  { return /^0\d{9,10}$/.test(phone); }

// ════════════════════════════════════════════════════════════
// ROUTES — GET
// ════════════════════════════════════════════════════════════

app.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.find().sort({ createdAt: 1 }).limit(6);
        res.render('trangchu', { activePage: 'trangchu', title: 'Rolex Vu Nhat Tuan Anh Vietnam — Trang chủ', featuredProducts });
    } catch (err) {
        res.status(500).render('error', { message: 'Lỗi tải trang chủ', error: err.message });
    }
});

app.get('/sanphammoi', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });
        res.render('sanphammoi', { activePage: 'sanphammoi', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Bộ sưu tập', products });
    } catch (err) {
        res.status(500).render('error', { message: 'Lỗi tải sản phẩm', error: err.message });
    }
});

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

app.get('/thanhtoan', async (req, res) => {
    const products = await Product.find().sort({ createdAt: 1 });
    res.render('thanhtoan', { activePage: 'thanhtoan', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thanh toán', message: null, products });
});

app.get('/don-hang', requireAuth, async (req, res) => {
    const orders = await Order.find({ username: req.session.user.username }).sort({ createdAt: -1 });
    res.render('don-hang', {
        activePage: 'don-hang',
        title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đơn hàng của tôi',
        orders,
        success: req.query.success === '1'
    });
});

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
    res.json(req.session.user ? { authenticated: true, user: req.session.user } : { authenticated: false });
});

// ════════════════════════════════════════════════════════════
// ROUTES — POST
// ════════════════════════════════════════════════════════════

app.post('/form', async (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === 'admin' ? '/quanli' : '/don-hang');
    }
    const { fullName, email, username, password, phone, interest, message } = req.body;
    const fail = (msg) => res.render('form', { activePage: 'form', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đăng ký tư vấn', message: { success: false, message: msg } });

    if (!fullName || fullName.trim().length < 3)   return fail('Họ tên phải có ít nhất 3 ký tự.');
    if (!validateEmail(email))                      return fail('Email không hợp lệ.');
    if (!username || username.trim().length < 4)    return fail('Tên tài khoản phải có ít nhất 4 ký tự.');
    if (!password || password.trim().length < 5)    return fail('Mật khẩu phải có ít nhất 5 ký tự.');
    if (!validatePhone(phone))                      return fail('Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 số).');
    if (!interest)                                  return fail('Vui lòng chọn dòng đồng hồ quan tâm.');

    try {
        const exists = await User.findOne({ username: username.trim() });
        if (exists) return fail('Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.');

        await User.create({ username: username.trim(), password: password.trim(), role: 'user', fullName: fullName.trim(), email: email.trim() });
        await Registration.create({ fullName: fullName.trim(), email: email.trim(), username: username.trim(), phone: phone.trim(), interest, message: message || '' });

        res.render('form', {
            activePage: 'form',
            title: 'Rolex Vu Nhat Tuan Anh Vietnam - Đăng ký tư vấn',
            message: { success: true, message: 'Đăng ký thành công! Tài khoản đã được tạo, bạn có thể đăng nhập ngay.' }
        });
    } catch (err) {
        fail('Lỗi hệ thống: ' + err.message);
    }
});

app.post('/dangnhap', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu.' });

        req.session.user = { username: user.username, role: user.role, fullName: user.fullName, userId: user._id };

        let redirect = user.role === 'admin' ? '/quanli' : '/';
        if (req.body.redirect && req.body.redirect.trim()) redirect = req.body.redirect.trim();

        res.json({
            success: true,
            message: user.role === 'admin' ? 'Đăng nhập admin thành công.' : 'Đăng nhập thành công.',
            redirect
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống.' });
    }
});

app.post('/dangxuat', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.json({ success: false, message: 'Lỗi đăng xuất.' });
        res.json({ success: true, redirect: '/' });
    });
});

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
        await Order.create({
            username: req.session.user.username,
            fullName, email, phone,
            address:  orderNote,
            note:     address || '',
            paymentMethod: paymentMethod || 'cod',
            items: snapshot.items,
            total: snapshot.total
        });
        res.redirect('/don-hang?success=1');
    } catch (err) {
        fail('Lỗi hệ thống: ' + err.message);
    }
});

// Xử lý form thêm sản phẩm mới (trang /quanli/them-san-pham)
// Xử lý form thêm sản phẩm mới (trang /quanli/them-san-pham)
app.post('/quanli/them-san-pham', requireAuth, requireAdmin, async (req, res) => {
    // Lấy từng trường từ body form gửi lên
    const { productId, productName, productModel, productPrice, productCollection, productImage } = req.body;
    // Chuyển giá từ chuỗi sang số nguyên (hệ 10)
    const price = parseInt(productPrice, 10);
    // Hàm tiện ích: render lại trang với thông báo lỗi và giữ nguyên dữ liệu đã nhập
    const fail = (msg) => res.render('them-san-pham', {
        activePage: 'quanli', title: 'Rolex Vu Nhat Tuan Anh Vietnam - Thêm sản phẩm',
        message: { success: false, message: msg }, form: req.body
    });

    // Kiểm tra các trường bắt buộc và giá hợp lệ (> 0)
    if (!productId || !productName || !productModel || !productCollection || isNaN(price) || price <= 0)
        return fail('Vui lòng điền đầy đủ và hợp lệ các trường bắt buộc (*).');
    // Kiểm tra mã tham chiếu chưa tồn tại trong database
    if (await Product.findOne({ id: productId.trim() })) return fail('Mã tham chiếu đã tồn tại!');

    // Tạo sản phẩm mới trong MongoDB với các trường đã được trim khoảng trắng
    await Product.create({ id: productId.trim(), name: productName.trim(), model: productModel.trim(), price, collection: productCollection.trim(), image: (productImage || '').trim() });
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
    const { fullName, phone, email, address, status, paymentMethod } = req.body;
    const update = {};
    if (fullName      !== undefined) update.fullName      = fullName;
    if (phone         !== undefined) update.phone         = phone;
    if (email         !== undefined) update.email         = email;
    if (address       !== undefined) update.address       = address;
    if (status        !== undefined) update.status        = status;
    if (paymentMethod !== undefined) update.paymentMethod = paymentMethod;
    await Order.findByIdAndUpdate(req.params.id, update);
    res.json({ success: true });
});

app.delete('/api/orders/:id', requireAuth, requireAdmin, async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.post('/api/orders/:id/duyet', requireAuth, requireAdmin, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.redirect('/quanli');
});

app.post('/api/orders/:id/tuchoi', requireAuth, requireAdmin, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.redirect('/quanli');
});

// THÊM sản phẩm — nhận dữ liệu JSON từ modal trong trang quản lí
app.post('/api/products', requireAuth, requireAdmin, async (req, res) => {
    // Nếu mã tham chiếu đã có trong DB thì báo lỗi, không cho thêm trùng
    if (await Product.findOne({ id: req.body.id })) return res.json({ success: false, message: 'Mã tham chiếu đã tồn tại!' });
    // Lưu sản phẩm mới vào MongoDB với toàn bộ dữ liệu từ body
    await Product.create(req.body);
    // Trả về JSON báo thành công để frontend cập nhật giao diện
    res.json({ success: true });
});

// SỬA sản phẩm — cập nhật theo mã tham chiếu trên URL
app.put('/api/products/:id', requireAuth, requireAdmin, async (req, res) => {
    // Tìm sản phẩm theo id trên URL rồi ghi đè bằng dữ liệu mới từ body
    await Product.findOneAndUpdate({ id: req.params.id }, req.body);
    // Trả về JSON báo thành công để frontend cập nhật giao diện
    res.json({ success: true });
});

// XÓA sản phẩm — xóa theo mã tham chiếu trên URL
app.delete('/api/products/:id', requireAuth, requireAdmin, async (req, res) => {
    // Tìm và xóa sản phẩm có id khớp với tham số trên URL
    await Product.findOneAndDelete({ id: req.params.id });
    // Trả về JSON báo thành công để frontend xóa hàng khỏi bảng
    res.json({ success: true });
});

// THÊM tài khoản — nhận dữ liệu JSON từ modal trong trang quản lí
app.post('/api/accounts', requireAuth, requireAdmin, async (req, res) => {
    // Nếu username đã tồn tại trong DB thì báo lỗi, không cho đăng ký trùng
    if (await User.findOne({ username: req.body.username })) return res.json({ success: false, message: 'Tài khoản đã tồn tại!' });
    // Tạo tài khoản mới (password tự động được hash bởi pre-save hook trong userModel)
    await User.create(req.body);
    // Trả về JSON báo thành công để frontend cập nhật giao diện
    res.json({ success: true });
});

// SỬA tài khoản — cập nhật theo username trên URL
app.put('/api/accounts/:username', requireAuth, requireAdmin, async (req, res) => {
    // Tìm tài khoản cần sửa theo username trên URL
    const user = await User.findOne({ username: req.params.username });
    // Chỉ cập nhật từng trường nếu frontend có gửi lên (để trống = giữ nguyên)
    if (req.body.password) user.password = req.body.password; // password mới sẽ được hash lại qua pre-save hook
    if (req.body.role)     user.role     = req.body.role;     // vai trò: 'admin' hoặc 'user'
    if (req.body.fullName) user.fullName = req.body.fullName; // họ tên đầy đủ
    if (req.body.email)    user.email    = req.body.email;    // địa chỉ email
    // Lưu lại — dùng .save() thay vì findOneAndUpdate để kích hoạt pre-save hook hash password
    await user.save();
    // Trả về JSON báo thành công để frontend cập nhật giao diện
    res.json({ success: true });
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
    { id: '279135RBR',  name: 'Lady-Datejust',      model: 'Oyster 28 mm - Everose gold & diamonds',   price: 1236676000, collection: 'luxury',  image: 'media/day-date 40.avif' },
    { id: '126610LN',   name: 'Submariner Date',    model: 'Oyster 41 mm - Black ceramic bezel gold',  price: 340000000,  collection: 'diving',  image: 'media/submariner.avif' },
    { id: '126660',     name: 'Deepsea',            model: 'Oyster 44 mm - D-blue dial',               price: 580000000,  collection: 'diving',  image: 'media/deepsea.avif' },
    { id: '126710BLRO', name: 'GMT-Master II',      model: 'Oyster 40 mm - Dual color bezel',          price: 420000000,  collection: 'sport',   image: 'media/11610lv.avif' },
    { id: '116508',     name: 'Cosmograph Daytona', model: 'Oyster 40 mm - 18 ct yellow gold',         price: 1150000000, collection: 'sport',   image: 'media/sky-dweller.avif' },
    { id: '50535',      name: 'Cellini Moonphase',  model: '39 mm - Everose 18 ct',                    price: 890000000,  collection: 'luxury',  image: 'media/Land-Dweller.avif' },
    { id: '126600',     name: 'Sea-Dweller',        model: 'Oyster 43 mm - Oystersteel',               price: 520000000,  collection: 'diving',  image: 'media/sea.avif' }
];

async function main() {
    try {
        await connect();

        // Seed tài khoản mặc định
        const defaultAccounts = [
            { username: 'admin', password: 'admin123', role: 'admin', fullName: 'Administrator', email: 'admin@rolex.com' },
            { username: 'user1', password: 'user123',  role: 'user',  fullName: 'Test User',     email: 'user1@rolex.com' }
        ];
        for (const acc of defaultAccounts) {
            const exists = await User.findOne({ username: acc.username });
            if (!exists) {
                await User.create(acc);
                console.log(`✓ Tài khoản ${acc.username} đã được tạo`);
            }
        }

        // Seed sản phẩm mặc định
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(defaultProducts);
            console.log(`✓ Đã thêm ${defaultProducts.length} sản phẩm mặc định`);
        } else {
            console.log(`✓ Đã có ${count} sản phẩm trong MongoDB`);
        }

        app.listen(3000, () => console.log('Server: http://localhost:3000'));
    } catch (err) {
        console.error('Lỗi kết nối:', err);
    }
}
module.exports = app;


main();
