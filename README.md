# Rolex Boutique Vietnam - Backend

## Các sửa lỗi đã thực hiện

### 1. **Lỗi Đăng nhập không lưu trạng thái**
   - **Vấn đề**: Trước đây, thông tin đăng nhập chỉ lưu trong `localStorage` của client, khi refresh trang hoặc restart server thì bị mất
   - **Giải pháp**: 
     - Thêm `express-session` để quản lý session server-side
     - Dữ liệu đăng nhập giờ lưu ở session server (persistent)
     - Frontend kiểm tra session qua API `/api/auth/check`

### 2. **Kết nối MongoDB**
   - **Thêm**:
     - `mongoose` - ORM cho MongoDB
     - `connect-mongo` - Store session vào MongoDB (optional - hiện tại dùng memory store)
     - `bcryptjs` - Hash password an toàn

   - **MongoDB Connection**: `mongodb://localhost:27017/rolex_boutique`

### 3. **User Model - Lưu trữ trong Database**
   - Tất cả user giờ được lưu trong MongoDB (collection: `users`)
   - Password được hash bằng bcryptjs trước khi lưu
   - Tài khoản mặc định được tạo tự động:
     - **admin**: `admin / admin123`
     - **user1**: `user1 / user123`

## Cài đặt

```bash
# 1. Cài đặt dependencies
npm install

# 2. Đảm bảo MongoDB đang chạy
# Windows: MongoDB phải được cài sẵn
# Kiểm tra: mongod --version

# 3. Khởi động server
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/check` - Kiểm tra trạng thái đăng nhập (session)
- `POST /dangnhap` - Đăng nhập (body: `{username, password}`)
- `POST /dangxuat` - Đăng xuất

### Pages
- `/` - Trang chủ
- `/dangnhap` - Trang đăng nhập
- `/quanli` - Trang quản lí (admin only)
- `/form` - Đăng ký tư vấn
- `/thanhtoan` - Thanh toán

### Admin APIs
- `GET /quanli/them-tai-khoan` - Form thêm tài khoản
- `POST /quanli/them-tai-khoan` - Thêm tài khoản mới
- `POST /api/accounts` - Tạo account (JSON)
- `PUT /api/accounts/:username` - Cập nhật account
- `DELETE /api/accounts/:username` - Xóa account

## Test Đăng nhập

```bash
# Curl test
curl -X POST http://localhost:3000/dangnhap \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# Response (success):
# {"success":true,"message":"...","redirect":"/quanli"}
```

## Cấu trúc Project

```
├── index.js                    # Server chính
├── connect.js                  # Kết nối MongoDB
├── package.json
├── models/
│   ├── userModel.js           # User model với MongoDB
│   ├── productModel.js        # Product model
│   └── registrationModel.js   # Registration form
├── views/                      # EJS templates
│   ├── dangnhap.ejs          # Login page
│   ├── quanli.ejs            # Admin dashboard
│   └── ...
├── js/
│   ├── login.js              # Frontend login logic (gửi request tới server)
│   ├── auth-ui.js            # Kiểm tra session và hiển thị UI
│   └── ...
└── css/
    └── ... styles
```

## Session Handling

**Current**: Memory store (for development)  
**Production**: Recommend MongoDB store (`connect-mongo`)

Để sử dụng MongoDB store:

```javascript
// Uncomment trong index.js
const MongoStore = require('connect-mongo');

app.use(session({
    // ...
    store: new MongoStore({
        mongoUrl: 'mongodb://localhost:27017/rolex_boutique'
    })
}));
```

## Troubleshooting

### Session không persistent khi refresh
- Hiện tại dùng memory store, sẽ mất khi server restart
- Giải pháp: Uncomment MongoStore connection ở index.js

### Đăng nhập không thành công
- Kiểm tra MongoDB có đang chạy không: `mongosh` hoặc `mongo`
- Kiểm tra password đã được hash: Các tài khoản mặc định được tạo lại mỗi lần start

### 404 trên /quanli
- Kiểm tra đã đăng nhập chưa
- Kiểm tra user có role `admin` không
- Check server logs

## Người phát triển

Sử dụng `npm run dev` để chạy với nodemon (auto reload)

```bash
npm run dev
```
