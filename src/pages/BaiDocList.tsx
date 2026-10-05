// ========================
// BaiDocList.tsx – Danh sách bài đọc (kết nối API /api/bai-doc)
// Nút Thêm ở đầu bảng, icon Sửa (bút chì) & Xóa (thùng rác) tự vẽ SVG
// ========================
import { useState, useEffect } from 'react'
import './BaiDocList.css'

// ── Types ──────────────────────────────────────────────────────────────
interface BaiDoc {
  id: number
  lop_id: number
  chu_de_id?: number
  tuan_so?: number
  bai_so?: number
  ten_bai: string
  hinh_anh_bai?: string
  tac_gia?: string
  noi_dung_day_du?: string
  thu_tu: number
}

// ── SVG Icons ──────────────────────────────────────────────────────────
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
function BaiDocDetailModal({ data, onClose }: { data: BaiDoc; onClose: () => void }) {
  return (
    <div className="bai-doc-modal-overlay" onClick={onClose}>
      <div className="bai-doc-modal" onClick={e => e.stopPropagation()}>
        <div className="bai-doc-modal-header">
          <span>Chi tiết bài đọc</span>
          <button className="bai-doc-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="bai-doc-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>Lớp ID</label>
              <input type="number" value={data.lop_id ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Chủ đề ID</label>
              <input type="number" value={data.chu_de_id ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Tuần số</label>
              <input type="number" value={data.tuan_so ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Bài số</label>
              <input type="number" value={data.bai_so ?? ''} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Tên bài</label>
              <input type="text" value={data.ten_bai ?? ''} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Tác giả</label>
              <input type="text" value={data.tac_gia ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Hình ảnh bài (URL)</label>
              <input type="text" value={data.hinh_anh_bai ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Thứ tự</label>
              <input type="number" value={data.thu_tu ?? 1} min={1} disabled />
            </div>
            <div className="bd-form-group bd-full">
              <label>Nội dung đầy đủ</label>
              <textarea
                rows={4}
                value={data.noi_dung_day_du ?? ''}
                disabled
                style={{ height: '400px' }}
              />
            </div>
          </div>
        </div>
        <div className="bai-doc-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  )
}

// ── Modal thêm / sửa ────────────────────────────────────────────────────
interface ModalProps {
  mode: 'add' | 'edit'
  data: Partial<BaiDoc>
  onClose: () => void
  onSave: (data: Partial<BaiDoc>) => void
}

function BaiDocModal({ mode, data, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<Partial<BaiDoc>>(data)

  const set = (key: keyof BaiDoc, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="bai-doc-modal-overlay" onClick={onClose}>
      <div className="bai-doc-modal" onClick={e => e.stopPropagation()}>
        <div className="bai-doc-modal-header">
          <span>{mode === 'add' ? '➕ Thêm bài đọc mới' : '✏️ Sửa bài đọc'}</span>
          <button className="bai-doc-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="bai-doc-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>Lớp ID <span className="bd-required">*</span></label>
              <input
                type="number"
                value={form.lop_id ?? ''}
                min={1}
                onChange={e => set('lop_id', Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="bd-form-group">
              <label>Chủ đề ID</label>
              <input
                type="number"
                value={form.chu_de_id ?? ''}
                min={1}
                onChange={e => set('chu_de_id', Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="bd-form-group">
              <label>Tuần số</label>
              <input
                type="number"
                value={form.tuan_so ?? ''}
                min={1}
                max={35}
                onChange={e => set('tuan_so', Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="bd-form-group">
              <label>Bài số</label>
              <input
                type="number"
                value={form.bai_so ?? ''}
                min={1}
                onChange={e => set('bai_so', Number(e.target.value))}
                placeholder="1"
              />
            </div>
            <div className="bd-form-group bd-full">
              <label>Tên bài <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ten_bai ?? ''}
                onChange={e => set('ten_bai', e.target.value)}
                placeholder="Nhập tên bài học..."
              />
            </div>
            <div className="bd-form-group bd-full">
              <label>Tác giả</label>
              <input
                type="text"
                value={form.tac_gia ?? ''}
                onChange={e => set('tac_gia', e.target.value)}
                placeholder="Tên tác giả..."
              />
            </div>
            <div className="bd-form-group">
              <label>Hình ảnh bài (URL)</label>
              <input
                type="text"
                value={form.hinh_anh_bai ?? ''}
                onChange={e => set('hinh_anh_bai', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="bd-form-group">
              <label>Thứ tự</label>
              <input
                type="number"
                value={form.thu_tu ?? 1}
                min={1}
                onChange={e => set('thu_tu', Number(e.target.value))}
              />
            </div>
            <div className="bd-form-group bd-full">
              <label>Nội dung đầy đủ</label>
              <textarea
                rows={4}
                value={form.noi_dung_day_du ?? ''}
                onChange={e => set('noi_dung_day_du', e.target.value)}
                placeholder="Nhập nội dung bài đọc..."
                style={{ height: '400px' }}
              />
            </div>
          </div>
        </div>

        <div className="bai-doc-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="bd-btn-save" onClick={() => onSave(form)}>
            {mode === 'add' ? '➕ Thêm bài' : '💾 Lưu thay đổi'}
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
    <div className="bai-doc-modal-overlay" onClick={onCancel}>
      <div className="bai-doc-modal bd-confirm" onClick={e => e.stopPropagation()}>
        <div className="bd-confirm-icon">🗑️</div>
        <div className="bd-confirm-title">Xoá bài đọc</div>
        <div className="bd-confirm-msg">
          Bạn có chắc muốn xoá bài <strong>"{ten_bai}"</strong>?<br />
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

export default function BaiDocList() {
  const [list, setList] = useState<BaiDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterLop, setFilterLop] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [detailItem, setDetailItem] = useState<BaiDoc | null>(null)
  const [editData, setEditData] = useState<Partial<BaiDoc>>({})
  const [deleteItem, setDeleteItem] = useState<BaiDoc | null>(null)

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

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
    const url = filterLop
      ? `${API_BASE}/api/bai-doc?lop_id=${filterLop}`
      : `${API_BASE}/api/bai-doc`

    fetch(url)
      .then(r => r.json())
      .then((data: BaiDoc[]) => setList(Array.isArray(data) ? data : []))
      .catch(err => setError('Không thể kết nối API: ' + err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchList()
  }, [filterLop])

  // Reset về trang 1 khi đổi lớp hoặc tìm kiếm
  useEffect(() => {
    setPage(1)
  }, [filterLop, searchTerm])

  // ── Filter theo tên bài (client-side) ──
  const filteredList = list.filter(item =>
    item.ten_bai?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ── Phân trang ──
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1
  const start = (page - 1) * pageSize
  const currentData = filteredList.slice(start, start + pageSize)

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
        buttons.push(<span key="start-ellipsis" className="page-ellipsis">…</span>)
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
        buttons.push(<span key="end-ellipsis" className="page-ellipsis">…</span>)
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
  const handleAdd = () => {
    setModalMode('add')
    setEditData({ thu_tu: 1, lop_id: 1 })
    setShowModal(true)
  }

  const handleEdit = (item: BaiDoc) => {
    setModalMode('edit')
    setEditData({ ...item })
    setShowModal(true)
  }

  const handleSave = async (form: Partial<BaiDoc>) => {
    if (!form.ten_bai?.trim()) {
      showToast('Vui lòng nhập tên bài!', 'error')
      return
    }
    if (!form.lop_id) {
      showToast('Vui lòng nhập Lớp ID!', 'error')
      return
    }

    try {
      if (modalMode === 'add') {
        const r = await fetch(`${API_BASE}/api/bai-doc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Lỗi thêm bài đọc')
        showToast('Thêm bài đọc thành công!')
      } else {
        const r = await fetch(`${API_BASE}/api/bai-doc/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Lỗi cập nhật bài đọc')
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
      const r = await fetch(`${API_BASE}/api/bai-doc/${deleteItem.id}`, {
        method: 'DELETE',
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Lỗi xoá bài đọc')
      showToast('Đã xoá bài đọc!')
      setDeleteItem(null)
      fetchList()
    } catch (e: unknown) {
      showToast((e as Error).message, 'error')
    }
  }

  return (
    <div className="bai-doc-list-page">
      {/* Header */}
      <div className="bai-doc-list-header">
        <div>
          <h1 className="bai-doc-list-title">📋 Danh sách bài đọc</h1>
          <p className="bai-doc-list-sub">Quản lý toàn bộ bài đọc trong hệ thống</p>
        </div>
        <button id="btn-them-bai-doc" className="bd-btn-primary" onClick={handleAdd}>
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
          Thêm tập đọc
        </button>
      </div>

      {/* ── Filter ── */}
          <div className="bai-doc-filters">
            <label className="bai-doc-filter-label">🔍 Lọc theo lớp:</label>
            <select
              id="bd-filter-lop"
              className="bai-doc-filter-select"
              value={filterLop}
              onChange={e => setFilterLop(e.target.value)}
            >
              <option value="">Tất cả lớp</option>
              <option value="1">Lớp 1</option>
              <option value="2">Lớp 2</option>
              <option value="3">Lớp 3</option>
            </select>

            {/* Ô tìm kiếm tên bài */}
            <input
              type="text"
              placeholder="Tìm theo tên bài..."
              className="bai-doc-filter-search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ marginLeft: 12, minWidth: 220 }}
            />

            <span className="bai-doc-count">
              {loading ? '...' : `${filteredList.length} bài đọc`}
            </span>
          </div>

      {/* Error */}
      {error && (
        <div className="bai-doc-error">
          ⚠️ {error}
          <button onClick={fetchList} className="bd-btn-retry">
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bai-doc-table-wrap">
        <table className="bai-doc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên bài</th>
              <th>Lớp</th>
              <th>Chủ đề</th>
              <th>Tuần</th>
              <th>Bài</th>
              <th>Tác giả</th>
              <th>Nội dung</th>
              <th>Thứ tự</th>
              <th className="bd-actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="bd-td-center">
                  <div className="bai-doc-loading">
                    <div className="bai-doc-spinner" />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
                   <tr>
                <td colSpan={10} className="bd-td-center">
                  <div className="bai-doc-empty">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div>
                      {searchTerm
                        ? 'Không tìm thấy bài đọc nào'
                        : 'Chưa có bài đọc nào'}
                    </div>
                    {!searchTerm && (
                      <button
                        className="bd-btn-primary"
                        style={{ marginTop: 14 }}
                        onClick={handleAdd}
                      >
                        ➕ Thêm bài đọc đầu tiên
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map(item => (
                <tr key={item.id} className="bd-tr-hover">
                  <td className="bd-td-id">{item.id}</td>
                  <td className="bd-td-name">{item.ten_bai}</td>
                  <td>
                    <span className="bd-badge bd-badge-lop">Lớp {item.lop_id}</span>
                  </td>
                  <td>{item.chu_de_id ?? '—'}</td>
                  <td>{item.tuan_so ?? '—'}</td>
                  <td>{item.bai_so ?? '—'}</td>
                  <td className="bd-td-author">{item.tac_gia || '—'}</td>
                  <td className="bd-td-content">
                    {item.noi_dung_day_du?.slice(0, 50) || '—'}
                  </td>
                  <td>{item.thu_tu}</td>
                  <td className="bd-td-actions">
                    <button
                      id={`btn-detail-${item.id}`}
                      className="bd-icon-btn bd-icon-btn-detail"
                      title="Xem chi tiết bài đọc"
                      onClick={() => setDetailItem(item)}
                    >
                      <IconDetail />
                    </button>
                    <button
                      id={`btn-edit-${item.id}`}
                      className="bd-icon-btn bd-icon-btn-edit"
                      title="Sửa bài đọc"
                      onClick={() => handleEdit(item)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      id={`btn-delete-${item.id}`}
                      className="bd-icon-btn bd-icon-btn-delete"
                      title="Xóa bài đọc"
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
              Hiển thị {start + 1}–{Math.min(start + pageSize, filteredList.length)} / {filteredList.length} bài đọc
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
        <BaiDocModal
          mode={modalMode}
          data={editData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal Chi tiết */}
      {detailItem && (
        <BaiDocDetailModal
          data={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Confirm Delete */}
      {deleteItem && (
        <ConfirmDelete
          ten_bai={deleteItem.ten_bai}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`bai-doc-toast ${
            toast.type === 'error' ? 'toast-error' : 'toast-success'
          }`}
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}
    </div>
  )
}