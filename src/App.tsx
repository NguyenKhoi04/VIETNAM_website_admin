import { Routes, Route, Navigate } from 'react-router-dom'
import DangNhap from './pages/DangNhap'
import TrangChu from './pages/TrangChu'

function App() {
  const handleLogin = (user: { name: string; role: string }) => {
    localStorage.setItem('admin_user', JSON.stringify(user))
  }

  return (
    <Routes>
      <Route path="/" element={<TrangChu />} />
      <Route path="/dang-nhap" element={<DangNhap onLogin={handleLogin} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
