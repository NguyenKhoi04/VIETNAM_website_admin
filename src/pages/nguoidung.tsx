// ========================
// NguoiDungList.tsx – Danh sách người dùng (kết nối API /api/users)
// Nút Thêm ở đầu bảng, icon Sửa (bút chì) & Xóa (thùng rác) tự vẽ SVG
// ========================
import { useState, useEffect } from 'react'
import './NguoiDungList.css'

// ── Types ──────────────────────────────────────────────────────────────
interface NguoiDung {
  id_nguoi_dung: number
  ten_dangnhap: string
  email: string
  mat_khau: string
  ho_ten: string
  vai_tro: string
  trang_thai: number
  ngay_tao: string
  ngay_cap_nhat: string
}

// ── SVG Icons tự vẽ (không dùng icon thư viện) ─────────────────────────
function IconDetail() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Chi tiết"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v5" />
      <path d="M12 7h.01" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Sửa"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconDelete() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Xóa"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

// ── Modal Chi tiết ─────────────────────────────────────────────────────
function NguoiDungDetailModal({ data, onClose }: { data: NguoiDung; onClose: () => void }) {
  return (
    <div className="users-modal-overlay" onClick={onClose}>
      <div className="users-modal" onClick={e => e.stopPropagation()}>
        <div className="users-modal-header">
          <span>Chi tiết người dùng</span>
          <button className="users-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="users-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>ID người dùng</label>
              <input type="number" value={data.id_nguoi_dung ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Tên đăng nhập</label>
              <input type="text" value={data.ten_dangnhap ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Email</label>
              <input type="text" value={data.email ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Mật khẩu</label>
              <input type="password" value={data.mat_khau ?? ''} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Họ tên</label>
              <input type="text" value={data.ho_ten ?? ''} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Vai trò</label>
              <input type="text" value={data.vai_tro ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Trạng thái</label>
              <input
                type="text"
                value={data.trang_thai === 1 ? 'Hoạt động' : 'Không hoạt động'}
                disabled
              />
            </div>
            <div className="bd-form-group">
              <label>Ngày tạo</label>
              <input type="text" value={data.ngay_tao ?? ''} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Ngày cập nhật</label>
              <input type="text" value={data.ngay_cap_nhat ?? ''} disabled />
            </div>
          </div>
        </div>
        <div className="users-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  )
}

// ── Modal thêm / sửa ────────────────────────────────────────────────────
interface ModalProps {
  mode: 'add' | 'edit'
  data: Partial<NguoiDung>
  onClose: () => void
  onSave: (data: Partial<NguoiDung>) => void
}

function NguoiDungModal({ mode, data, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<Partial<NguoiDung>>(data)
  const set = (key: keyof NguoiDung, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="users-modal-overlay" onClick={onClose}>
      <div className="users-modal" onClick={e => e.stopPropagation()}>
        <div className="users-modal-header">
          <span>{mode === 'add' ? '➕ Thêm người dùng mới' : '✏️ Sửa người dùng'}</span>
          <button className="users-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="users-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>ID người dùng <span className="bd-required">*</span></label>
              <input
                type="number"
                value={form.id_nguoi_dung ?? ''}
                min={1}
                onChange={e => set('id_nguoi_dung', Number(e.target.value))}
                placeholder="1"
                disabled={mode === 'edit'}
              />
            </div>
            <div className="bd-form-group">
              <label>Tên đăng nhập <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ten_dangnhap ?? ''}
                onChange={e => set('ten_dangnhap', e.target.value)}
                placeholder="Tên đăng nhập"
              />
            </div>
            <div className="bd-form-group">
              <label>Email <span className="bd-required">*</span></label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={e => set('email', e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="bd-form-group">
              <label>Mật khẩu <span className="bd-required">*</span></label>
              <input
                type="password"
                value={form.mat_khau ?? ''}
                onChange={e => set('mat_khau', e.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="bd-form-group bd-full">
              <label>Họ tên <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ho_ten ?? ''}
                onChange={e => set('ho_ten', e.target.value)}
                placeholder="Nhập họ tên..."
              />
            </div>
            <div className="bd-form-group bd-full">
              <label>Vai trò <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.vai_tro ?? ''}
                onChange={e => set('vai_tro', e.target.value)}
                placeholder="Vai trò..."
              />
            </div>
            <div className="bd-form-group">
              <label>Trạng thái <span className="bd-required">*</span></label>
              <select
                value={form.trang_thai ?? 1}
                onChange={e => set('trang_thai', Number(e.target.value))}
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>
            <div className="bd-form-group">
              <label>Ngày tạo</label>
              <input
                type="date"
                value={form.ngay_tao ?? ''}
                onChange={e => set('ngay_tao', e.target.value)}
              />
            </div>
            <div className="bd-form-group bd-full">
              <label>Ngày cập nhật</label>
              <input
                type="date"
                value={form.ngay_cap_nhat ?? ''}
                onChange={e => set('ngay_cap_nhat', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="users-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="bd-btn-save" onClick={() => onSave(form)}>
            {mode === 'add' ? '➕ Thêm người dùng' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Delete ──────────────────────────────────────────────────────
function ConfirmDelete({
  ten_bai,
  onConfirm,
  onCancel,
}: {
  ten_bai: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="users-modal-overlay" onClick={onCancel}>
      <div className="users-modal bd-confirm" onClick={e => e.stopPropagation()}>
        <div className="bd-confirm-icon">🗑️</div>
        <div className="bd-confirm-title">Xoá người dùng</div>
        <div className="bd-confirm-msg">
          Bạn có chắc muốn xoá người dùng <strong>"{ten_bai}"</strong>?<br />
          Hành động này không thể hoàn tác.
        </div>
        <div className="bd-confirm-actions">
          <button className="bd-btn-cancel" onClick={onCancel}>Huỷ</button>
          <button className="bd-btn-delete" onClick={onConfirm}>🗑️ Xoá</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000'

export default function NguoiDungList() {
  const [list, setList] = useState<NguoiDung[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [detailItem, setDetailItem] = useState<NguoiDung | null>(null)
  const [editData, setEditData] = useState<Partial<NguoiDung>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteItem, setDeleteItem] = useState<NguoiDung | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Ẩn/hiện mật khẩu
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({})

  // Phân trang
  const [page, setPage] = useState(1)
  const pageSize = 10

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch ──
  const fetchList = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE}/api/users`)
      .then(r => r.json())
      .then((data: NguoiDung[]) => setList(Array.isArray(data) ? data : []))
      .catch(err => setError('Không thể kết nối API: ' + err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchList()
  }, [])

  // ── Filter ──
  const filteredList = list.filter(item =>
    item.ho_ten?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ── Phân trang (dựa trên filteredList) ──
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1
  const start = (page - 1) * pageSize
  const currentData = filteredList.slice(start, start + pageSize)

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  const togglePassword = (id: number) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const renderPageButtons = () => {
    const buttons = []
    const maxVisible = 5

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          className={`page-btn ${page === 1 ? 'active' : ''}`}
          onClick={() => setPage(1)}
        >
          1
        </button>
      )
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="page-ellipsis">…</span>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${page === i ? 'active' : ''}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="page-ellipsis">…</span>
        )
      }
      buttons.push(
        <button
          key={totalPages}
          className={`page-btn ${page === totalPages ? 'active' : ''}`}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </button>
      )
    }

    return buttons
  }

  // ── Handlers ──
  const handleDetail = (item: NguoiDung) => setDetailItem(item)

  const handleAdd = () => {
    setModalMode('add')
    setEditData({ trang_thai: 1 })
    setShowModal(true)
  }

  const handleEdit = (item: NguoiDung) => {
    setModalMode('edit')
    setEditData({ ...item })
    setShowModal(true)
  }

  const handleSave = async (form: Partial<NguoiDung>) => {
    if (!form.ten_dangnhap?.trim()) {
      showToast('Vui lòng nhập tên đăng nhập!', 'error')
      return
    }
    if (!form.email?.trim()) {
      showToast('Vui lòng nhập email!', 'error')
      return
    }
    if (!form.mat_khau?.trim()) {
      showToast('Vui lòng nhập mật khẩu!', 'error')
      return
    }
    if (!form.ho_ten?.trim()) {
      showToast('Vui lòng nhập họ tên!', 'error')
      return
    }
    if (!form.vai_tro?.trim()) {
      showToast('Vui lòng nhập vai trò!', 'error')
      return
    }
    if (form.trang_thai !== 0 && form.trang_thai !== 1) {
      showToast('Vui lòng chọn trạng thái!', 'error')
      return
    }

    try {
      if (modalMode === 'add') {
        const r = await fetch(`${API_BASE}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Lỗi thêm người dùng')
        showToast('Thêm người dùng thành công!')
      } else {
        const r = await fetch(`${API_BASE}/api/users/${form.id_nguoi_dung}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Lỗi cập nhật người dùng')
        showToast('Cập nhật thành công!')
      }
      setShowModal(false)
      fetchList()
    } catch (e: unknown) {
      showToast((e as Error).message, 'error')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return
    try {
      const r = await fetch(`${API_BASE}/api/users/${deleteItem.id_nguoi_dung}`, {
        method: 'DELETE',
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Lỗi xoá người dùng')
      showToast('Đã xoá người dùng!')
      setDeleteItem(null)
      fetchList()
    } catch (e: unknown) {
      showToast((e as Error).message, 'error')
    }
  }

  return (
    <div className="users-list-page">
      {/* Header */}
      <div className="users-list-header">
        <div>
          <h1 className="users-list-title">📋 Danh sách người dùng</h1>
          <p className="users-list-sub">Quản lý toàn bộ người dùng trong hệ thống</p>
        </div>
        <button id="btn-them-users" className="bd-btn-primary" onClick={handleAdd}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: 6 }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Thêm người dùng
        </button>
      </div>

      {/* Filter */}
      <div className="users-filters">
        <label className="users-filter-label">🔍 Tìm kiếm theo họ tên:</label>
        <input
          type="text"
          placeholder="Nhập họ tên..."
          className="users-filter-search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="users-error">
          ⚠️ {error}
          <button onClick={fetchList} className="bd-btn-retry">
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Mật khẩu</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th className="bd-actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="bd-td-center">
                  <div className="users-loading">
                    <div className="users-spinner" />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={10} className="bd-td-center">
                  <div className="users-empty">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div>
                      {searchTerm
                        ? 'Không tìm thấy người dùng nào'
                        : 'Chưa có người dùng nào'}
                    </div>
                    {!searchTerm && (
                      <button
                        className="bd-btn-primary"
                        style={{ marginTop: 14 }}
                        onClick={handleAdd}
                      >
                        ➕ Thêm người dùng đầu tiên
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map(item => (
                <tr key={item.id_nguoi_dung} className="bd-tr-hover">
                  <td className="bd-td-id">{item.id_nguoi_dung}</td>
                  <td className="bd-td-name">{item.ten_dangnhap}</td>
                  <td>
                    <span className="bd-badge bd-badge-lop">{item.email}</span>
                  </td>

                  {/* Cột mật khẩu + icon mắt */}
                  <td>
                    {item.mat_khau ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            letterSpacing: 1,
                            color: '#343a40',
                          }}
                        >
                          {visiblePasswords[item.id_nguoi_dung]
                            ? item.mat_khau
                            : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePassword(item.id_nguoi_dung)}
                          title={
                            visiblePasswords[item.id_nguoi_dung]
                              ? 'Ẩn mật khẩu'
                              : 'Hiện mật khẩu'
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 2,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#343a40',
                          }}
                        >
                          {visiblePasswords[item.id_nguoi_dung] ? (
                            // Eye-off
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            // Eye
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-danger)' }}>—</span>
                    )}
                  </td>

                  <td>{item.ho_ten ?? '—'}</td>
                  <td>{item.vai_tro ?? '—'}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.trang_thai === 1 ? 'status-active' : 'status-inactive'
                      }`}
                    >
                      {item.trang_thai === 1 ? '● Hoạt động' : '○ Không hoạt động'}
                    </span>
                  </td>
                  <td className="bd-td-author">{item.ngay_tao || '—'}</td>
                  <td className="bd-td-content">
                    {item.ngay_cap_nhat?.slice(0, 50) || '—'}
                  </td>
                  <td className="bd-td-actions">
                    <button
                      id={`btn-detail-${item.id_nguoi_dung}`}
                      className="bd-icon-btn bd-icon-btn-detail"
                      title="Xem chi tiết"
                      onClick={() => handleDetail(item)}
                    >
                      <IconDetail />
                    </button>
                    <button
                      id={`btn-edit-${item.id_nguoi_dung}`}
                      className="bd-icon-btn bd-icon-btn-edit"
                      title="Sửa"
                      onClick={() => handleEdit(item)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      id={`btn-delete-${item.id_nguoi_dung}`}
                      className="bd-icon-btn bd-icon-btn-delete"
                      title="Xóa"
                      onClick={() => setDeleteItem(item)}
                    >
                      <IconDelete />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        {!loading && filteredList.length > 0 && totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-info">
              Hiển thị {start + 1}–{Math.min(start + pageSize, filteredList.length)} /{' '}
              {filteredList.length} người dùng
            </div>
            <div className="pagination-controls">
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                title="Trang trước"
              >
                ‹
              </button>
              {renderPageButtons()}
              <button
                className="page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                title="Trang sau"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <NguoiDungModal
          mode={modalMode}
          data={editData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal Chi tiết */}
      {detailItem && (
        <NguoiDungDetailModal
          data={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Confirm Delete */}
      {deleteItem && (
        <ConfirmDelete
          ten_bai={deleteItem.ten_dangnhap}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`users-toast ${
            toast.type === 'error' ? 'toast-error' : 'toast-success'
          }`}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  )
}