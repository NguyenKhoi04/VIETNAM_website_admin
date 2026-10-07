// ========================
// VaiTroList.tsx – Danh sách người dùng (kết nối API /api/roles)
// Nút Thêm ở đầu bảng, icon Sửa (bút chì) & Xóa (thùng rác) tự vẽ SVG
// ========================
import { useState, useEffect } from 'react'
import './vaitro.css'
import { useNavigate } from 'react-router-dom'

// ── Types ──────────────────────────────────────────────────────────────
interface VaiTro {
  id: number
  ma: string
  ten_vn:string
  ten_en:string
  icon:string
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
function VaiTroDetailModal({ data, onClose }: { data: VaiTro; onClose: () => void }) {
  return (
    <div className="roles-modal-overlay" onClick={onClose}>
      <div className="roles-modal" onClick={e => e.stopPropagation()}>
        <div className="roles-modal-header">
          <span>Chi tiết vai trò</span>
          <button className="roles-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="roles-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>ID vai trò</label>
              <input type="number" value={data.id ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Mã vai trò</label>
              <input type="text" value={data.ma ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Tên tiếng Việt</label>
              <input type="text" value={data.ten_vn ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Tên tiếng Anh</label>
              <input type="text" value={data.ten_en ?? ''} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Icon</label>
              <input type="text" value={data.icon ?? ''} disabled />
            </div>
          </div>
        </div>
        <div className="roles-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  )
}

// ── Modal thêm / sửa ────────────────────────────────────────────────────
interface ModalProps {
  mode: 'add' | 'edit'
  data: Partial<VaiTro>
  onClose: () => void
  onSave: (data: Partial<VaiTro>) => void
}

function VaiTroModal({ mode, data, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<Partial<VaiTro>>(data)
  const set = (key: keyof VaiTro, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="roles-modal-overlay" onClick={onClose}>
      <div className="roles-modal" onClick={e => e.stopPropagation()}>
        <div className="roles-modal-header">
          <span>{mode === 'add' ? '➕ Thêm vai trò mới' : '✏️ Sửa vai trò'}</span>
          <button className="roles-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="roles-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>ID vai trò <span className="bd-required">*</span></label>
              <input
                type="number"
                value={form.id ?? ''}
                min={1}
                onChange={e => set('id', Number(e.target.value))}
                placeholder="1"
                disabled={mode === 'edit'}
              />
            </div>
            <div className="bd-form-group">
              <label>Mã vai trò <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ma ?? ''}
                onChange={e => set('ma', e.target.value)}
                placeholder="Mã vai trò"
              />
            </div>
            <div className="bd-form-group">
              <label>Tên tiếng Việt <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ten_vn ?? ''}
                onChange={e => set('ten_vn', e.target.value)}
                placeholder="Tên tiếng Việt"
              />
            </div>
            <div className="bd-form-group">
              <label>Tên tiếng Anh <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ten_en ?? ''}
                onChange={e => set('ten_en', e.target.value)}
                placeholder="Nhập tên tiếng Anh"
              />
            </div>
            <div className="bd-form-group">
              <label>Icon <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.icon ?? ''}
                onChange={e => set('icon', e.target.value)}
                placeholder="Nhập icon..."
              />
            </div>
          </div>
        </div>
        <div className="roles-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="bd-btn-save" onClick={() => onSave(form)}>
            {mode === 'add' ? '➕ Thêm vai trò' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Delete ──────────────────────────────────────────────────────
function ConfirmDelete({
 ten_vn,
  ten_en,
  onConfirm,
  onCancel,
}: {
 ten_vn: string
 ten_en: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="roles-modal-overlay" onClick={onCancel}>
      <div className="roles-modal bd-confirm" onClick={e => e.stopPropagation()}>
        <div className="bd-confirm-icon">🗑️</div>
        <div className="bd-confirm-title">Xoá vai trò</div>
        <div className="bd-confirm-msg">
          Bạn có chắc muốn xoá vai trò <strong>"{ten_vn} ({ten_en})"</strong>?<br />
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

export default function VaiTro() {
  const [list, setList] = useState<VaiTro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [detailItem, setDetailItem] = useState<VaiTro | null>(null)
  const [editData, setEditData] = useState<Partial<VaiTro>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteItem, setDeleteItem] = useState<VaiTro | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const navigate = useNavigate()

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
    fetch(`${API_BASE}/api/roles`)
      .then(r => r.json())
      .then((data: VaiTro[]) => setList(Array.isArray(data) ? data : []))
      .catch(err => setError('Không thể kết nối API: ' + err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchList()
  }, [])

  // ── Filter ──
  const filteredList = list.filter(item =>
    item.ten_vn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ten_en?.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleDetail = (item: VaiTro) => setDetailItem(item)

  
  const handleEdit = (item: VaiTro) => {
    setModalMode('edit')
    setEditData({ ...item })
    setShowModal(true)
  }

  const handleSave = async (form: Partial<VaiTro>) => {
    if (!form.ma?.trim()) {
      showToast('Vui lòng nhập mã vai trò!', 'error')
      return
    }
    if (!form.ten_vn?.trim()) {
      showToast('Vui lòng nhập tên tiếng Việt!', 'error')
      return
    }
    if (!form.ten_en?.trim()) {
      showToast('Vui lòng nhập tên tiếng Anh!', 'error')
      return
    }
    if (!form.icon?.trim()) {
      showToast('Vui lòng nhập vai trò!', 'error')
      return
    }

    try {
      if (modalMode === 'add') {
        const r = await fetch(`${API_BASE}/api/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Lỗi thêm vai trò')
        showToast('Thêm vai trò thành công!')
      } else {
        const r = await fetch(`${API_BASE}/api/roles/${form.id}`, {
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
      const r = await fetch(`${API_BASE}/api/roles/${deleteItem.id}`, {
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
    <div className="roles-list-page">
      {/* Header */}
      <div className="roles-list-header">
        <div>
          <h1 className="roles-list-title">Danh sách Vai Trò</h1>
          <p className="roles-list-sub">Quản lý toàn bộ vai trò trong hệ thống</p>
        </div>
        <button id="btn-them-roles" className="bd-btn-primary" onClick={() => {navigate("add-vaitro")}}> 
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
          Thêm Vai Trò
        </button>
      </div>

      {/* Filter */}
      <div className="roles-filters">
        <label className="roles-filter-label">🔍 Tìm kiếm theo tên Vai Trò:</label>
        <input
          type="text"
          placeholder="Nhập tên Vai Trò..."
          className="roles-filter-search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="roles-error">
          ⚠️ {error}
          <button onClick={fetchList} className="bd-btn-retry">
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      <div className="roles-table-wrap">
        <table className="roles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã Vai Trò</th>
              <th>Tên Tiếng Việt</th>
              <th>Tên Tiếng Anh</th>
              <th>Icon</th>
              <th className="bd-actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="bd-td-center">
                  <div className="roles-loading">
                    <div className="roles-spinner" />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="bd-td-center">
                  <div className="roles-empty">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div>
                      {searchTerm
                        ? 'Không tìm thấy Vai Trò nào'
                        : 'Chưa có Vai Trò nào'}
                    </div>
                    {!searchTerm && (
                      <button
                        className="bd-btn-primary"
                        style={{ marginTop: 14 }}
                        onClick={() => {navigate("add-vaitro")}}
                      >
                        ➕ Thêm Vai Trò đầu tiên
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map(item => (
                <tr key={item.id} className="bd-tr-hover">
                    <td className="bd-td-id">{item.id}</td>
                    <td>{item.ma}</td>
                    <td className="bd-td-name">{item.ten_vn}</td>
                    <td>
                    <span className="bd-badge bd-badge-lop">{item.ten_en}</span>
                    </td>
                    <td>{item.icon}</td>
                    <td className="bd-td-actions">
                    <button
                        id={`btn-detail-${item.id}`}
                        className="bd-icon-btn bd-icon-btn-detail"
                        title="Xem chi tiết"
                        onClick={() => handleDetail(item)}
                    >
                        <IconDetail />
                    </button>
                    <button
                        id={`btn-edit-${item.id}`}
                        className="bd-icon-btn bd-icon-btn-edit"
                        title="Sửa"
                        onClick={() => handleEdit(item)}
                    >
                        <IconEdit />
                    </button>
                    <button
                        id={`btn-delete-${item.id}`}
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
              {filteredList.length} vai trò
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
        <VaiTroModal
          mode={modalMode}
          data={editData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal Chi tiết */}
      {detailItem && (
        <VaiTroDetailModal
          data={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Confirm Delete */}
      {deleteItem && (
        <ConfirmDelete
         ten_vn={deleteItem.ten_vn}
         ten_en={deleteItem.ten_en}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`roles-toast ${
            toast.type === 'error' ? 'toast-error' : 'toast-success'
          }`}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  )
}