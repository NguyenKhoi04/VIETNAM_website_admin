## Tải lại thư viện
1. `npm install` ở cả thư mục backend và frontend
2. Cài dependecy của backend và frontend
3. Cài thêm mysql

Câu lệnh: "npm install cors mysql2 express"

## Backend chưa được chạy (Nguyên nhân phổ biến nhất)

Trong VS Code, bạn chỉ đang mở 1 Terminal và chạy frontend Vite (npm run dev).

Thư mục backend có server.js và package.json riêng biệt.

Cách khắc phục:

Bấm dấu + ở góc trên tab Terminal để mở thêm một Terminal mới (hoặc chia đôi màn hình terminal).

Chạy lệnh:

```bash
cd backend
npm install
node server.js
```

## cách chạy chỗ thêm tập đọc
① Nhập bài đọc vào Rich Editor bình thường
        ↓
② Bấm nút  🔴 Bôi từ khó  (góc phải thanh điều khiển)
        ↓
③ Editor đổi sang chế độ bôi (viền đỏ nhạt, con trỏ ✛, toolbar nền đỏ)
        ↓
④ Dùng chuột tô chọn từ/cụm từ khó trong văn bản
        ↓ (tự động)
   • Từ đổi màu đỏ in đậm ngay trong văn bản
   • Tự động thêm vào danh sách "Hiểu từ khó" bên dưới (có ô Từ được điền sẵn)
   • Trang cuộn mượt xuống phần từ khó
        ↓
⑤ Nhập giải thích nghĩa & test âm thanh cho từng từ
        ↓
⑥ Bấm  ❌ Tắt bôi từ khó  khi xong
