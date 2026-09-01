import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import DataTable from '../components/DataTable'
import AddTapDoc from './AddTapDoc'
import { API_ENDPOINTS } from '../config/apiConfig'
import type { User } from '../data/mockData'
import {
  baiHocList, tuVungList, nguPhapList, baiKiemTraList, ketQuaList,
  dashboardStats,
} from '../data/mockData'

export default function TrangChu() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [user, setUser] = useState<{ name: string; username: string } | null>(null)
  const [apiUsers, setApiUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  // Đọc thông tin đăng nhập từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_user')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && !parsed.username && parsed.role) {
          parsed.username = parsed.ten_dang_nhap || parsed.role
        }
        setUser(parsed)
      } catch {
        localStorage.removeItem('admin_user')
      }
    }
  }, [])

  // Fetch danh sách người dùng từ API khi chọn tab 'users'
  useEffect(() => {
    if (activeItem !== 'users') return
    setUsersLoading(true)
    fetch(API_ENDPOINTS.GET_USERS)
      .then(res => res.json())
      .then((data: User[]) => setApiUsers(data))
      .catch(() => setApiUsers([]))
      .finally(() => setUsersLoading(false))
  }, [activeItem])

  const handleLogout = () => {
    localStorage.removeItem('admin_user')
    setUser(null)
  }

  // ===== Render main content =====
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />

      case 'users':
        if (usersLoading) return (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px' }}>
            ⏳ Đang tải danh sách người dùng...
          </div>
        )
        return (
          <DataTable
            title="Người dùng"
            icon="👥"
            data={apiUsers}
            rowKey="id_nguoi_dung"
            columns={[
              { key: 'id_nguoi_dung', label: 'ID' },
              { key: 'ho_ten', label: 'Họ tên' },
              { key: 'ten_dang_nhap', label: 'Tên đăng nhập' },
              { key: 'mat_khau', label: 'Mật khẩu' },
              { key: 'email', label: 'Email' },
              { key: 'lop', label: 'Lớp' },
              {
                key: 'ngay_tao', label: 'Ngày tạo',
                // Hiển thị định dạng ngày/tháng/năm Việt Nam
                render: (v) => {
                  if (!v) return '—'
                  const date = new Date(v as string | number)
                  return date.toLocaleDateString('vi-VN')
                }
              },

              {
                key: 'trang_thai',
                label: 'Trạng thái',
                render: (v) => {
                  const isActive = v == 1 || v === '1'
                  return (
                    <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                      {isActive ? '● Hoạt động' : '○ Không hoạt động'}
                    </span>
                  )
                }
              },
              {
                key: 'doi_tuong', label: 'Vai trò',
                render: (v) => {
                  const role = String(v)
                  const roleMap: Record<string, string> = {
                    'hoc_sinh_tieu_hoc': 'Học sinh tiểu học',
                    'nguoi_nuoc_ngoai': 'Người nước ngoài',
                    'quan_tri': 'Quản trị viên',
                    'phu_huynh': 'Phụ huynh'
                  }
                  const colorMap: Record<string, React.CSSProperties> = {
                    'quan_tri': { background: 'rgba(231,76,60,0.12)', color: '#c0392b', border: '1px solid rgba(231,76,60,0.3)' },
                    'hoc_sinh_tieu_hoc': { background: 'rgba(39,174,96,0.12)', color: '#1e8449', border: '1px solid rgba(39,174,96,0.3)' },
                    'nguoi_nuoc_ngoai': { background: 'rgba(94,184,212,0.12)', color: '#2471a3', border: '1px solid rgba(94,184,212,0.3)' },
                    'phu_huynh': { background: 'rgba(243,156,18,0.12)', color: '#b7770d', border: '1px solid rgba(243,156,18,0.3)' },
                  }
                  return (
                    <span className="status-badge" style={colorMap[role] ?? {}}>
                      {roleMap[role] || role}
                    </span>
                  )
                }
              },
            ]}
          />
        )

      case 'add-tap-doc':
        return <AddTapDoc />

      case 'ky-nang':
      case 'tap-doc':
      case 'tap-viet':
      case 'nghe-hieu':
      case 'noi': {
        const filtered = activeItem === 'ky-nang'
          ? baiHocList
          : baiHocList.filter(b => {
            const map: Record<string, string> = { 'tap-doc': 'Tập đọc', 'tap-viet': 'Tập viết', 'nghe-hieu': 'Nghe hiểu', 'noi': 'Nói' }
            return b.loai_ky_nang === map[activeItem]
          })

        const labels: Record<string, string> = {
          'ky-nang': 'Bài học', 'tap-doc': 'Tập đọc', 'tap-viet': 'Tập viết', 'nghe-hieu': 'Nghe hiểu', 'noi': 'Nói'
        }
        const icons: Record<string, string> = {
          'ky-nang': '📚', 'tap-doc': '📖', 'tap-viet': '✏️', 'nghe-hieu': '🎧', 'noi': '🎤'
        }

        return (
          <DataTable
            title={labels[activeItem] || 'Bài học'}
            icon={icons[activeItem] || '📚'}
            data={filtered}
            columns={[
              { key: 'tieu_de', label: 'Tiêu đề' },
              { key: 'loai_ky_nang', label: 'Kỹ năng' },
              { key: 'cap_do', label: 'Cấp độ' },
              { key: 'thoi_luong', label: 'Thời lượng' },
              { key: 'ngay_tao', label: 'Ngày tạo' },
              {
                key: 'trang_thai', label: 'Trạng thái',
                render: (v) => (
                  <span className={`status-badge ${v === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {v === 'active' ? '● Hiển thị' : '○ Ẩn'}
                  </span>
                )
              },
            ]}
          />
        )
      }

      case 'tu-vung':
        return (
          <DataTable
            title="Từ vựng"
            icon="🔤"
            data={tuVungList}
            columns={[
              { key: 'tu', label: 'Từ' },
              { key: 'phien_am', label: 'Phiên âm' },
              { key: 'nghia', label: 'Nghĩa' },
              { key: 'cap_do', label: 'Cấp độ' },
              { key: 'chu_de', label: 'Chủ đề' },
              { key: 'vi_du', label: 'Ví dụ' },
              {
                key: 'trang_thai', label: 'Trạng thái',
                render: (v) => (
                  <span className={`status-badge ${v === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {v === 'active' ? '● Hiển thị' : '○ Ẩn'}
                  </span>
                )
              },
            ]}
          />
        )

      case 'ngu-phap':
        return (
          <DataTable
            title="Ngữ pháp"
            icon="📋"
            data={nguPhapList}
            columns={[
              { key: 'tieu_de', label: 'Tiêu đề' },
              { key: 'cap_do', label: 'Cấp độ' },
              { key: 'quy_tac', label: 'Quy tắc' },
              { key: 'vi_du', label: 'Ví dụ' },
              {
                key: 'trang_thai', label: 'Trạng thái',
                render: (v) => (
                  <span className={`status-badge ${v === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {v === 'active' ? '● Hiển thị' : '○ Ẩn'}
                  </span>
                )
              },
            ]}
          />
        )

      case 'bai-kiem-tra':
        return (
          <DataTable
            title="Bài kiểm tra"
            icon="📝"
            data={baiKiemTraList}
            columns={[
              { key: 'tieu_de', label: 'Tiêu đề' },
              { key: 'loai', label: 'Loại' },
              { key: 'thoi_gian', label: 'Thời gian (phút)' },
              { key: 'so_cau', label: 'Số câu' },
              { key: 'diem_dat', label: 'Điểm đạt' },
              { key: 'cap_do', label: 'Cấp độ' },
              {
                key: 'trang_thai', label: 'Trạng thái',
                render: (v) => (
                  <span className={`status-badge ${v === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {v === 'active' ? '● Hoạt động' : '○ Tạm dừng'}
                  </span>
                )
              },
            ]}
          />
        )

      case 'ket-qua':
        return (
          <DataTable
            title="Kết quả kiểm tra"
            icon="🏆"
            data={ketQuaList}
            columns={[
              { key: 'nguoi_dung', label: 'Học viên' },
              { key: 'bai_kiem_tra', label: 'Bài kiểm tra' },
              {
                key: 'diem', label: 'Điểm',
                render: (v) => (
                  <span style={{ fontWeight: 700, color: Number(v) >= 60 ? 'var(--primary-dark)' : '#e74c3c' }}>
                    {String(v)} / 100
                  </span>
                )
              },
              { key: 'thoi_gian_lam', label: 'Thời gian' },
              { key: 'ngay_thi', label: 'Ngày thi' },
              {
                key: 'ket_qua', label: 'Kết quả',
                render: (v) => (
                  <span className={`status-badge ${v === 'Đạt' ? 'status-active' : 'status-inactive'}`}>
                    {v === 'Đạt' ? '✓ Đạt' : '✗ Không đạt'}
                  </span>
                )
              },
            ]}
          />
        )

      default:
        return (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Tính năng đang phát triển
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
              Nội dung sẽ được cập nhật sớm
            </div>
          </div>
        )
    }
  }

  return (
    <div className="app-layout">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="content-wrapper">
        <Sidebar
          isOpen={sidebarOpen}
          activeItem={activeItem}
          onSelect={setActiveItem}
        />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      <Footer />
    </div>
  )
}

// ===== Dashboard =====
function Dashboard() {
  return (
    <div>
      <div className="welcome-section">
        <h1 className="welcome-title">🇻🇳 Tổng quan hệ thống</h1>
        <p className="welcome-sub">Chào mừng đến với Vietnam Language Learning Admin</p>
      </div>

      <div className="stats-grid">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            📊 Bài học theo kỹ năng
          </h2>
          {[
            { label: 'Tập đọc', count: 18, color: '#5eb8d4' },
            { label: 'Tập viết', count: 14, color: '#48cae4' },
            { label: 'Nghe hiểu', count: 21, color: '#3a9ab5' },
            { label: 'Nói', count: 16, color: '#2c7da0' },
            { label: 'Từ vựng', count: 12, color: '#a8d8ea' },
            { label: 'Ngữ pháp', count: 5, color: '#d6f0f7' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{item.count}</span>
              </div>
              <div style={{ height: '6px', background: 'var(--primary-pale)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(item.count / 21) * 100}%`,
                  background: item.color,
                  borderRadius: '4px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            🏆 Kết quả kiểm tra gần đây
          </h2>
          {ketQuaList.slice(0, 5).map(kq => (
            <div key={kq.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{kq.nguoi_dung}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{kq.bai_kiem_tra}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: kq.diem >= 60 ? 'var(--primary-dark)' : '#e74c3c' }}>
                  {kq.diem}đ
                </div>
                <span className={`status-badge ${kq.ket_qua === 'Đạt' ? 'status-active' : 'status-inactive'}`}>
                  {kq.ket_qua}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
