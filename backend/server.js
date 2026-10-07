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
  database: 'luyenviet_chinhta_vn_1thang10',
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
  const ten_dangnhap = req.body.ten_dangnhap || req.body.username;
  const mat_khau = req.body.mat_khau || req.body.password;

  const sql = 'SELECT * FROM nguoi_dung WHERE ten_dangnhap = ? AND mat_khau = ?';

  db.query(sql, [ten_dangnhap, mat_khau], (err, results) => {
    if (err) {
      console.error('Lỗi SQL chi tiết:', err);
      return res.status(500).json({ message: err.message || 'Lỗi truy vấn server' });
    }

    if (results.length > 0) {
      return res.status(200).json({
        message: 'Đăng nhập thành công!',
        user: {
          id: results[0].id_nguoi_dung || results[0].id,
          ten_dangnhap: results[0].ten_dangnhap,
          ho_ten: results[0].ho_ten,
        },
      });
    } else {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  });
});

// ============================================================
// API QUẢN LÝ NGƯỜI DÙNG (CRUD /api/users)
// ============================================================

// Lấy danh sách người dùng kèm mã vai trò
app.get('/api/users', (req, res) => {
  const sql = `
    SELECT 
      nd.id_nguoi_dung, 
      nd.ten_dangnhap, 
      nd.mat_khau,
      nd.ho_ten, 
      nd.email, 
      nd.ngay_tao, 
      nd.ngay_cap_nhat, 
      nd.trang_thai,
      vt.ma AS ma_vaitro
    FROM nguoi_dung nd
    LEFT JOIN nguoi_dung_vai_tro ndvt ON nd.id_nguoi_dung = ndvt.nguoi_dung_id
    LEFT JOIN vai_tro vt ON vt.id = ndvt.vai_tro_id
    ORDER BY nd.id_nguoi_dung DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Thêm người dùng mới
app.post('/api/users', (req, res) => {
  const {
    id_nguoi_dung,
    ten_dangnhap,
    email,
    mat_khau,
    ho_ten,
    ma_vaitro,
    trang_thai = 1,
    ngay_tao,
    ngay_cap_nhat,
  } = req.body;

  const now = new Date();
  const createdDate = ngay_tao || now;
  const updatedDate = ngay_cap_nhat || now;

  const sqlInsertUser = id_nguoi_dung
    ? `INSERT INTO nguoi_dung (id_nguoi_dung, ten_dangnhap, email, mat_khau, ho_ten, trang_thai, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    : `INSERT INTO nguoi_dung (ten_dangnhap, email, mat_khau, ho_ten, trang_thai, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const userParams = id_nguoi_dung
    ? [id_nguoi_dung, ten_dangnhap, email, mat_khau, ho_ten, trang_thai, createdDate, updatedDate]
    : [ten_dangnhap, email, mat_khau, ho_ten, trang_thai, createdDate, updatedDate];

  db.query(sqlInsertUser, userParams, (err, userResult) => {
    if (err) {
      console.error('Lỗi thêm người dùng:', err);
      return res.status(500).json({ error: err.message });
    }

    const newUserId = id_nguoi_dung || userResult.insertId;

    if (ma_vaitro) {
      db.query('SELECT id FROM vai_tro WHERE ma = ? LIMIT 1', [ma_vaitro], (errRole, roleRows) => {
        if (!errRole && roleRows.length > 0) {
          const roleId = roleRows[0].id;
          db.query(
            'INSERT INTO nguoi_dung_vai_tro (nguoi_dung_id, vai_tro_id) VALUES (?, ?)',
            [newUserId, roleId],
            (errLink) => {
              if (errLink) console.error('Lỗi gán vai trò:', errLink);
              return res.status(201).json({ message: 'Thêm người dùng thành công!', id_nguoi_dung: newUserId });
            }
          );
        } else {
          return res.status(201).json({ message: 'Thêm người dùng thành công!', id_nguoi_dung: newUserId });
        }
      });
    } else {
      return res.status(201).json({ message: 'Thêm người dùng thành công!', id_nguoi_dung: newUserId });
    }
  });
});

// Cập nhật người dùng theo ID (Khắc phục lỗi 404 PUT)
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const {
    ten_dangnhap,
    email,
    mat_khau,
    ho_ten,
    ma_vaitro,
    trang_thai,
    ngay_cap_nhat,
  } = req.body;

  const updatedDate = ngay_cap_nhat || new Date();

  let sqlUpdateUser = `
    UPDATE nguoi_dung 
    SET ten_dangnhap = ?, email = ?, ho_ten = ?, trang_thai = ?, ngay_cap_nhat = ?
  `;
  const updateParams = [ten_dangnhap, email, ho_ten, trang_thai, updatedDate];

  if (mat_khau) {
    sqlUpdateUser = `
      UPDATE nguoi_dung 
      SET ten_dangnhap = ?, email = ?, mat_khau = ?, ho_ten = ?, trang_thai = ?, ngay_cap_nhat = ?
    `;
    updateParams.splice(2, 0, mat_khau);
  }

  sqlUpdateUser += ` WHERE id_nguoi_dung = ?`;
  updateParams.push(id);

  db.query(sqlUpdateUser, updateParams, (err, userResult) => {
    if (err) {
      console.error('Lỗi cập nhật người dùng:', err);
      return res.status(500).json({ error: err.message });
    }

    if (userResult.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng cần cập nhật' });
    }

    if (ma_vaitro) {
      db.query('SELECT id FROM vai_tro WHERE ma = ? LIMIT 1', [ma_vaitro], (errRole, roleRows) => {
        if (!errRole && roleRows.length > 0) {
          const roleId = roleRows[0].id;
          db.query('DELETE FROM nguoi_dung_vai_tro WHERE nguoi_dung_id = ?', [id], () => {
            db.query(
              'INSERT INTO nguoi_dung_vai_tro (nguoi_dung_id, vai_tro_id) VALUES (?, ?)',
              [id, roleId],
              (errLink) => {
                if (errLink) console.error('Lỗi cập nhật vai trò:', errLink);
                return res.json({ message: 'Cập nhật người dùng thành công!' });
              }
            );
          });
        } else {
          return res.json({ message: 'Cập nhật người dùng thành công!' });
        }
      });
    } else {
      return res.json({ message: 'Cập nhật người dùng thành công!' });
    }
  });
});

// Xóa người dùng theo ID
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM nguoi_dung_vai_tro WHERE nguoi_dung_id = ?', [id], (errLink) => {
    if (errLink) {
      console.error('Lỗi xóa liên kết vai trò:', errLink);
      return res.status(500).json({ error: errLink.message });
    }

    db.query('DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?', [id], (err, result) => {
      if (err) {
        console.error('Lỗi xóa người dùng:', err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng cần xóa' });
      }

      res.json({ message: 'Xóa người dùng thành công!' });
    });
  });
});

// 5. API lấy danh sách vai trò
app.get('/api/roles', (req, res) => {
  const sql = 'SELECT id, ma, ten_vn, ten_en, icon FROM vai_tro';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 8. API lấy thông tin người dùng theo tên
app.get('/api/user-info/:identifier', (req, res) => {
  const { identifier } = req.params;

  const sql = `
    SELECT id_nguoi_dung, ho_ten, ten_dangnhap
    FROM nguoi_dung 
    WHERE ten_dangnhap = ? OR ho_ten = ? 
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

// 9. API lấy danh sách lớp
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

// 10. API lấy tên chương trình theo lớp
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

// 11. API lấy danh sách kỹ năng
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

// API phụ lấy id và username
app.get('/api/data', (req, res) => {
  const sql = 'SELECT id_nguoi_dung, ten_dangnhap FROM nguoi_dung';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ============================================================
// API NHÓM BÀI ĐỌC (bai_doc + 4 bảng phụ)
// ============================================================

// ── 1. bai_doc ──
app.get('/api/bai-doc', (req, res) => {
  const { lop_id } = req.query;
  let sql = 'SELECT * FROM bai_doc';
  const params = [];
  if (lop_id) { sql += ' WHERE lop_id = ?'; params.push(lop_id); }
  sql += ' ORDER BY lop_id, thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/bai-doc/:id', (req, res) => {
  db.query('SELECT * FROM bai_doc WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy bài đọc' });
    res.json(results[0]);
  });
});

app.post('/api/bai-doc', (req, res) => {
  const { lop_id, chu_de_id, tuan_so, bai_so, ten_bai, hinh_anh_bai, tac_gia, noi_dung_day_du, thu_tu } = req.body;
  const sql = `INSERT INTO bai_doc (lop_id, chu_de_id, tuan_so, bai_so, ten_bai, hinh_anh_bai, tac_gia, noi_dung_day_du, thu_tu)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [lop_id, chu_de_id, tuan_so, bai_so, ten_bai, hinh_anh_bai, tac_gia, noi_dung_day_du, thu_tu || 1], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thêm bài đọc thành công!', id: result.insertId });
  });
});

app.put('/api/bai-doc/:id', (req, res) => {
  const { lop_id, chu_de_id, tuan_so, bai_so, ten_bai, hinh_anh_bai, tac_gia, noi_dung_day_du, thu_tu } = req.body;
  const sql = `UPDATE bai_doc SET lop_id=?, chu_de_id=?, tuan_so=?, bai_so=?, ten_bai=?, hinh_anh_bai=?, tac_gia=?, noi_dung_day_du=?, thu_tu=? WHERE id=?`;
  db.query(sql, [lop_id, chu_de_id, tuan_so, bai_so, ten_bai, hinh_anh_bai, tac_gia, noi_dung_day_du, thu_tu, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cập nhật thành công!' });
  });
});

app.delete('/api/bai-doc/:id', (req, res) => {
  db.query('DELETE FROM bai_doc WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa bài đọc thành công!' });
  });
});

// ── 2. doan_van ──
app.get('/api/doan-van', (req, res) => {
  const { bai_doc_id } = req.query;
  let sql = 'SELECT * FROM doan_van';
  const params = [];
  if (bai_doc_id) { sql += ' WHERE bai_doc_id = ?'; params.push(bai_doc_id); }
  sql += ' ORDER BY so_doan ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/doan-van/:id', (req, res) => {
  db.query('SELECT * FROM doan_van WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy đoạn văn' });
    res.json(results[0]);
  });
});

app.post('/api/doan-van', (req, res) => {
  const { bai_doc_id, so_doan, noi_dung, ghi_chu } = req.body;
  const sql = 'INSERT INTO doan_van (bai_doc_id, so_doan, noi_dung, ghi_chu) VALUES (?, ?, ?, ?)';
  db.query(sql, [bai_doc_id, so_doan, noi_dung, ghi_chu], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thêm đoạn văn thành công!', id: result.insertId });
  });
});

app.put('/api/doan-van/:id', (req, res) => {
  const { bai_doc_id, so_doan, noi_dung, ghi_chu } = req.body;
  db.query('UPDATE doan_van SET bai_doc_id=?, so_doan=?, noi_dung=?, ghi_chu=? WHERE id=?',
    [bai_doc_id, so_doan, noi_dung, ghi_chu, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cập nhật đoạn văn thành công!' });
  });
});

app.delete('/api/doan-van/:id', (req, res) => {
  db.query('DELETE FROM doan_van WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa đoạn văn thành công!' });
  });
});

// ── 3. am_thanh_bai_doc ──
app.get('/api/am-thanh-bai-doc', (req, res) => {
  const { bai_doc_id, loai } = req.query;
  let sql = 'SELECT * FROM am_thanh_bai_doc WHERE 1=1';
  const params = [];
  if (bai_doc_id) { sql += ' AND bai_doc_id = ?'; params.push(bai_doc_id); }
  if (loai)       { sql += ' AND loai = ?';        params.push(loai); }
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/am-thanh-bai-doc/:id', (req, res) => {
  db.query('SELECT * FROM am_thanh_bai_doc WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy âm thanh' });
    res.json(results[0]);
  });
});

app.post('/api/am-thanh-bai-doc', (req, res) => {
  const { bai_doc_id, doan_id, loai, ma_key, duong_dan } = req.body;
  const sql = 'INSERT INTO am_thanh_bai_doc (bai_doc_id, doan_id, loai, ma_key, duong_dan) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [bai_doc_id, doan_id || null, loai || 'toan_bai', ma_key, duong_dan], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thêm âm thanh thành công!', id: result.insertId });
  });
});

app.put('/api/am-thanh-bai-doc/:id', (req, res) => {
  const { bai_doc_id, doan_id, loai, ma_key, duong_dan } = req.body;
  db.query('UPDATE am_thanh_bai_doc SET bai_doc_id=?, doan_id=?, loai=?, ma_key=?, duong_dan=? WHERE id=?',
    [bai_doc_id, doan_id || null, loai, ma_key, duong_dan, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cập nhật âm thanh thành công!' });
  });
});

app.delete('/api/am-thanh-bai-doc/:id', (req, res) => {
  db.query('DELETE FROM am_thanh_bai_doc WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa âm thanh thành công!' });
  });
});

// ── 4. tu_kho ──
app.get('/api/tu-kho', (req, res) => {
  const { bai_doc_id } = req.query;
  let sql = 'SELECT * FROM tu_kho';
  const params = [];
  if (bai_doc_id) { sql += ' WHERE bai_doc_id = ?'; params.push(bai_doc_id); }
  sql += ' ORDER BY thu_tu ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/tu-kho/:id', (req, res) => {
  db.query('SELECT * FROM tu_kho WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy từ khó' });
    res.json(results[0]);
  });
});

app.post('/api/tu-kho', (req, res) => {
  const { bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu } = req.body;
  const sql = 'INSERT INTO tu_kho (bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu || 1], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thêm từ khó thành công!', id: result.insertId });
  });
});

app.put('/api/tu-kho/:id', (req, res) => {
  const { bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu } = req.body;
  db.query('UPDATE tu_kho SET bai_doc_id=?, tu=?, giai_thich=?, am_thanh=?, ma_key=?, thu_tu=? WHERE id=?',
    [bai_doc_id, tu, giai_thich, am_thanh, ma_key, thu_tu, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cập nhật từ khó thành công!' });
  });
});

app.delete('/api/tu-kho/:id', (req, res) => {
  db.query('DELETE FROM tu_kho WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa từ khó thành công!' });
  });
});

// ── 5. cau_hoi_bai_doc ──
app.get('/api/cau-hoi-bai-doc', (req, res) => {
  const { bai_doc_id } = req.query;
  let sql = 'SELECT * FROM cau_hoi_bai_doc';
  const params = [];
  if (bai_doc_id) { sql += ' WHERE bai_doc_id = ?'; params.push(bai_doc_id); }
  sql += ' ORDER BY so_cau ASC';
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/cau-hoi-bai-doc/:id', (req, res) => {
  db.query('SELECT * FROM cau_hoi_bai_doc WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
    res.json(results[0]);
  });
});

app.post('/api/cau-hoi-bai-doc', (req, res) => {
  const { bai_doc_id, so_cau, noi_dung_cau, dap_an, am_thanh_cau, am_thanh_dap, ma_key_cau, ma_key_dap } = req.body;
  const sql = `INSERT INTO cau_hoi_bai_doc (bai_doc_id, so_cau, noi_dung_cau, dap_an, am_thanh_cau, am_thanh_dap, ma_key_cau, ma_key_dap)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [bai_doc_id, so_cau, noi_dung_cau, dap_an, am_thanh_cau, am_thanh_dap, ma_key_cau, ma_key_dap], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Thêm câu hỏi thành công!', id: result.insertId });
  });
});

app.put('/api/cau-hoi-bai-doc/:id', (req, res) => {
  const { bai_doc_id, so_cau, noi_dung_cau, dap_an, am_thanh_cau, am_thanh_dap, ma_key_cau, ma_key_dap } = req.body;
  const sql = `UPDATE cau_hoi_bai_doc SET bai_doc_id=?, so_cau=?, noi_dung_cau=?, dap_an=?, am_thanh_cau=?, am_thanh_dap=?, ma_key_cau=?, ma_key_dap=? WHERE id=?`;
  db.query(sql, [bai_doc_id, so_cau, noi_dung_cau, dap_an, am_thanh_cau, am_thanh_dap, ma_key_cau, ma_key_dap, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cập nhật câu hỏi thành công!' });
  });
});

app.delete('/api/cau-hoi-bai-doc/:id', (req, res) => {
  db.query('DELETE FROM cau_hoi_bai_doc WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa câu hỏi thành công!' });
  });
});

// ============================================================
// Khởi chạy server tại cổng 5000
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server backend đang chạy tại http://localhost:${PORT}`);
});