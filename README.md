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