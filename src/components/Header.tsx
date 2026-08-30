import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  user: { name: string; role: string } | null
  onLogout: () => void
}

export default function Header({ sidebarOpen, onToggleSidebar, user, onLogout }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header-left">
        <button
          id="sidebar-toggle-btn"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Ẩn sidebar' : 'Hiện sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        <div className="header-logo">
          <div className="logo-icon">🇻🇳</div>
          <span className="logo-text">Vietnam Admin</span>
        </div>
      </div>

      <div className="header-right">
        {user ? (
          <div style={{ position: 'relative' }}>
            <div
              className="user-box"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              id="user-menu-btn"
            >
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '4px' }}>▼</span>
            </div>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '180px',
                zIndex: 2000,
                overflow: 'hidden',
                animation: 'fadeInUp 0.2s ease',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Đã đăng nhập
                </div>
                <button
                  id="profile-btn"
                  style={{ width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: '13px', color: 'var(--text-primary)', background: 'none', cursor: 'pointer', border: 'none', transition: 'var(--transition)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-pale)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  👤 Tài khoản
                </button>
                <button
                  id="logout-btn"
                  onClick={() => { onLogout(); setDropdownOpen(false); navigate('/') }}
                  style={{ width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: '13px', color: '#e74c3c', background: 'none', cursor: 'pointer', border: 'none', transition: 'var(--transition)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(231,76,60,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/dang-nhap" className="user-box" id="login-link">
            <div className="user-avatar" style={{ background: 'var(--primary-pale)', color: 'var(--primary-dark)' }}>
              👤
            </div>
            <div className="user-info">
              <span className="user-name" style={{ color: 'var(--primary-dark)' }}>Đăng nhập tài khoản</span>
              <span className="user-role">Chưa đăng nhập</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
