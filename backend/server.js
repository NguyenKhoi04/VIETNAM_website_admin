// backend/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Cấu hình thông tin tài khoản MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'luyenviet_chinhta_vietnam',
});

// 2. Kiểm tra kết nối Database
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err.message);
    return;
  }
  console.log('Đã kết nối MySQL thành công!');
});

// 3. API kiểm tra server hoạt động
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend đang hoạt động tốt!' });
});

// 4. API đăng nhập
app.post('/api/login', (req, res) => {
  // Nhận linh hoạt cả 2 kiểu đặt tên key từ frontend
  const ten_dang_nhap = req.body.ten_dang_nhap || req.body.username;
  const mat_khau = req.body.mat_khau || req.body.password;

  const sql = 'SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ? AND mat_khau = ?';

  db.query(sql, [ten_dang_nhap, mat_khau], (err, results) => {
    if (err) {
      console.error('Lỗi SQL chi tiết:', err);
      return res.status(500).json({ message: err.message || 'Lỗi truy vấn server' });
    }

    if (results.length > 0) {
      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: {
          id: results[0].id,
          ten_dang_nhap: results[0].ten_dang_nhap,
          ho_ten: results[0].ho_ten,
          doi_tuong: results[0].doi_tuong,
        },
      });
    } else {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  });
});

// 6. API đăng ký
app.post('/api/register', (req, res) => {
  const { ten_dang_nhap, mat_khau } = req.body;

  const sql = 'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau) VALUES (?, ?)';
  db.query(sql, [ten_dang_nhap, mat_khau], (err, results) => {
    if (err) {
      console.error('Lỗi SQL chi tiết:', err);
      return res.status(500).json({ message: err.message || 'Lỗi truy vấn server' });
    }
    return res.status(200).json({ message: 'Đăng ký thành công!' });
  });
});

// 7. API lấy vai trò người dùng
app.get('/api/roles', (req, res) => {
  const sql = 'SELECT DISTINCT doi_tuong FROM nguoi_dung';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 8. API lấy thông tin người dùng (tìm theo ten_dang_nhap HOẶC ho_ten)
app.get('/api/user-info/:identifier', (req, res) => {
  const { identifier } = req.params;

  const sql = `
    SELECT id_nguoi_dung, ho_ten, ten_dang_nhap, doi_tuong 
    FROM nguoi_dung 
    WHERE ten_dang_nhap = ? OR ho_ten = ? 
    LIMIT 1
  `;

  db.query(sql, [identifier, identifier], (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    return res.json(results[0]);
  });
});

// 9. API lấy tên lớp trong bảng chuong_trinh
app.get('/api/classes', (req, res) => {
  const sql = 'SELECT DISTINCT lop FROM chuong_trinh WHERE lop IN (1, 2, 3) ORDER BY lop ASC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 10. API lấy tên chương trình dựa trên lớp
app.get('/api/program-name', (req, res) => {
  const lop = req.query.lop;

  const sql = 'SELECT ten_chuong_trinh FROM chuong_trinh WHERE lop = ?';

  db.query(sql, [lop], (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 11. API lấy danh sách kỹ năng theo lớp
app.get('/api/skills', (req, res) => {
  const { lop } = req.query;

  let sql = `
    SELECT 
      ky_nang.id_ky_nang,
      ky_nang.ma_ky_nang,
      ky_nang.ten_ky_nang,
      ky_nang.mo_ta,
      ky_nang.icon,
      ky_nang.lop,
      ky_nang.url_link,
      chuong_trinh.ten_chuong_trinh
    FROM ky_nang
    JOIN chuong_trinh ON ky_nang.lop = chuong_trinh.id_chuong_trinh
  `;
  const params = [];

  if (lop) {
    sql += ` WHERE ky_nang.lop = ?`;
    params.push(lop);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API lấy danh sách người dùng (dùng cho trang admin - bảng Users)
app.get('/api/users', (req, res) => {
  const sql = 'SELECT id_nguoi_dung, ten_dang_nhap, ho_ten, mat_khau, email, lop, ngay_tao, trang_thai, doi_tuong FROM nguoi_dung ORDER BY id_nguoi_dung ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// API lấy danh sách người dùng (cũ - chỉ trả id + ten_dang_nhap)
app.get('/api/data', (req, res) => {
  const sql = 'SELECT id_nguoi_dung, ten_dang_nhap FROM nguoi_dung';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Khởi chạy server tại cổng 5000
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server backend đang chạy tại http://localhost:${PORT}`);
});
