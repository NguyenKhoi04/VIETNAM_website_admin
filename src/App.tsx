import { Routes, Route, Navigate } from 'react-router-dom'
import DangNhap from './pages/DangNhap'
import TrangChu from './pages/TrangChu'

// Kiểm tra xem đã đăng nhập chưa (có dữ liệu trong localStorage không)
function isAuthenticated(): boolean {
  const user = localStorage.getItem('admin_user')
  if (!user) return false
  try {
    const parsed = JSON.parse(user)
    return !!(parsed && parsed.name)
  } catch {
    return false
  }
}

// Route bảo vệ: chưa đăng nhập → chuyển về /dang-nhap
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/dang-nhap" replace />
}

function App() {
  const handleLogin = (user: { name: string; username: string }) => {
    localStorage.setItem('admin_user', JSON.stringify(user))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TrangChu />
          </ProtectedRoute>
        }
      />
      <Route path="/dang-nhap" element={<DangNhap onLogin={handleLogin} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
