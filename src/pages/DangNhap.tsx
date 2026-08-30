import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface DangNhapProps {
  onLogin?: (user: { name: string; role: string }) => void
}

export default function DangNhap({ onLogin }: DangNhapProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (username === 'admin' && password === '123456') {
        const user = { name: 'Admin', role: 'Quản trị viên' }
        localStorage.setItem('admin_user', JSON.stringify(user))
        onLogin?.(user)
        navigate('/')
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng!')
      }
    }, 900)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🇻🇳</div>
          <h1 className="login-title">Vietnam Admin</h1>
          <p className="login-subtitle">Hệ thống quản trị học tiếng Việt</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="username-input" className="form-label">Tên đăng nhập</label>
            <div className="form-input-wrap">
              <input
                id="username-input"
                type="text"
                className="form-input"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
              <span className="form-input-icon" style={{ cursor: 'default' }}>👤</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password-input" className="form-label">Mật khẩu</label>
            <div className="form-input-wrap">
              <input
                id="password-input"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span
                id="toggle-password-btn"
                className="form-input-icon"
                onClick={() => setShowPass(!showPass)}
                title={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPass ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(231,76,60,0.08)',
              border: '1px solid rgba(231,76,60,0.25)',
              borderRadius: 'var(--radius-sm)',
              color: '#c0392b',
              fontSize: '13px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            id="login-submit-btn"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Đang đăng nhập...</span>
            ) : (
              '🔐 Đăng nhập'
            )}
          </button>
        </form>

        <div className="login-divider">hoặc</div>

        <button
          id="google-login-btn"
          className="google-btn"
          type="button"
          onClick={() => setError('Tính năng đăng nhập Google sẽ được tích hợp sau!')}
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Đăng nhập với Google
        </button>

        <div style={{ marginTop: '20px', padding: '14px', background: 'var(--primary-pale)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          💡 Demo: <strong>admin</strong> / <strong>123456</strong>
        </div>
      </div>
    </div>
  )
}
