// ============================================================================
// BaihocLop1List.tsx – Quản lý danh sách bài học lớp 1
// ============================================================================
import React, { useState, useEffect } from 'react'
import './tuanhoc_lop1.css'
import { UploadImg } from './UploadImg'

// ── Types ──────────────────────────────────────────────────────────────────
interface BaihocLop1 {
  id: number,
  tuan_id: number,
  thu_tu: number,
  ten_bai_hoc: string,
  hinh_anh_bai: string,
  
}

// ── Cấu hình URL backend ───────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000'

// Helper hiển thị đường dẫn ảnh chính xác (hỗ trợ cả link tuyệt đối và tương đối)
const getImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

// ── SVG Icons ──────────────────────────────────────────────────────────────
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

// ── Modal Chi tiết ─────────────────────────────────────────────────────────
function BaihocLop1DetailModal({ data, onClose }: { data: BaihocLop1; onClose: () => void }) {
  return (
    <div className="bai-doc-modal-overlay" onClick={onClose}>
      <div className="bai-doc-modal" onClick={e => e.stopPropagation()}>
        <div className="bai-doc-modal-header">
          <span>Chi tiết bài học đọc cho lớp 1</span>
          <button className="bai-doc-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="bai-doc-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>bài học</label>
              <input type="number" value={data.tuan_id ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Tên bài học</label>
              <input type="text" value={data.ten_bai_hoc ?? ''} disabled />
            </div>
            <div className="bd-form-group">
              <label>Thứ tự</label>
              <input type="number" value={data.thu_tu ?? ''} disabled />
            </div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Hình ảnh bài học</label>
              {data.hinh_anh_bai ? (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={getImageUrl(data.hinh_anh_bai)}
                    alt={data.ten_bai_hoc}
                    style={{
                      maxHeight: 180,
                      maxWidth: '100%',
                      objectFit: 'contain',
                      borderRadius: 6,
                      border: '1px solid #e2e8f0'
                    }}
                  />
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: 6 }}>Chưa có hình ảnh</p>
              )}
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

// ── Modal Thêm / Sửa ───────────────────────────────────────────────────────
interface ModalProps {
  mode: 'add' | 'edit'
  data: Partial<BaihocLop1>
  onClose: () => void
  onSave: (data: Partial<BaihocLop1>, file: File | null) => void
}

function BaihocLop1Modal({ mode, data, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<Partial<BaihocLop1>>(data)
  const [anhBai, setAnhBai] = useState<File | null>(null)

  // Cập nhật lại form khi chọn item khác
  useEffect(() => {
    setForm(data)
    setAnhBai(null)
  }, [data])

  const set = (key: keyof BaihocLop1, val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const handleSaveModal = () => {
    onSave(form, anhBai)
  }

  return (
    <div className="bai-doc-modal-overlay" onClick={onClose}>
      <div className="bai-doc-modal" onClick={e => e.stopPropagation()}>
        <div className="bai-doc-modal-header">
          <span>{mode === 'add' ? '➕ Thêm bài học mới' : '✏️ Sửa bài học'}</span>
          <button className="bai-doc-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="bai-doc-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>bài học<span className="bd-required">*</span></label>
              <input
                type="number"
                value={form.tuan_id ?? ''}
                min={1}
                onChange={e => set('tuan_id', Number(e.target.value))}
                placeholder="Ví dụ: 1"
              />
            </div>

            <div className="bd-form-group">
              <label>Tên bài học <span className="bd-required">*</span></label>
              <input
                type="text"
                value={form.ten_bai_hoc ?? ''}
                onChange={e => set('ten_bai_hoc', e.target.value)}
                placeholder="Ví dụ: Tuần 1 - Những bài học đầu tiên"
              />
            </div>

            <div className="bd-form-group">
              <label>Thứ tự hiển thị</label>
              <input
                type="number"
                value={form.thu_tu ?? 1}
                min={1}
                onChange={e => set('thu_tu', Number(e.target.value))}
                placeholder="1"
              />
            </div>

            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Hình ảnh bài học</label>
              <UploadImg label="Chọn hình bài học" value={anhBai} onChange={setAnhBai} />

              {/* Preview ảnh hiện tại nếu đang edit và chưa chọn file mới */}
              {!anhBai && form.hinh_anh_bai && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>Ảnh hiện tại:</span>
                  <img
                    src={getImageUrl(form.hinh_anh_bai)}
                    alt="Ảnh tuần hiện tại"
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bai-doc-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="bd-btn-save" onClick={handleSaveModal}>
            {mode === 'add' ? '➕ Thêm bài học' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm Delete ─────────────────────────────────────────────────────────
function ConfirmDelete({
  ten_tuan,
  onConfirm,
  onCancel,
}: {
  ten_tuan: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="bai-doc-modal-overlay" onClick={onCancel}>
      <div className="bai-doc-modal bd-confirm" onClick={e => e.stopPropagation()}>
        <div className="bd-confirm-icon">🗑️</div>
        <div className="bd-confirm-title">Xoá bài học</div>
        <div className="bd-confirm-msg">
          Bạn có chắc muốn xoá bài học <strong>"{ten_tuan}"</strong>?<br />
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

// ── Main Component ─────────────────────────────────────────────────────────
export default function BaihocLop1List() {
  const [list, setList] = useState<BaihocLop1[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Modal
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [detailItem, setDetailItem] = useState<BaihocLop1 | null>(null)
  const [editData, setEditData] = useState<Partial<BaihocLop1>>({})
  const [deleteItem, setDeleteItem] = useState<BaihocLop1 | null>(null)

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Phân trang
  const [page, setPage] = useState(1)
  const pageSize = 10

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch dữ liệu ──
  const fetchList = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE}/api/baihoc-lop1`)
      .then(r => r.json())
      .then((data: BaihocLop1[]) => setList(Array.isArray(data) ? data : []))
      .catch(err => setError('Không thể kết nối API: ' + err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchList()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm])

  // ── Filter client-side theo tên tuần ──
  const filteredList = list.filter(item =>
    item.ten_bai_hoc?.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEditData({ thu_tu: 1, tuan_id: 1 })
    setShowModal(true)
  }

  const handleEdit = (item: BaihocLop1) => {
    setModalMode('edit')
    setEditData({ ...item })
    setShowModal(true)
  }

  const handleSave = async (form: Partial<BaihocLop1>, file: File | null) => {
    if (!form.tuan_id) {
      showToast('Vui lòng nhập bài học!', 'error')
      return
    }
    if (!form.ten_bai_hoc?.trim()) {
      showToast('Vui lòng nhập tên bài học!', 'error')
      return
    }

    try {
      const isAdd = modalMode === 'add'
      const url = isAdd
        ? `${API_BASE}/api/baihoc-lop1`
        : `${API_BASE}/api/baihoc-lop1/${form.id}`

      let response: Response

      // Nếu có chọn file ảnh mới -> dùng FormData để gửi multipart/form-data
      if (file) {
        const formData = new FormData()
        formData.append('tuan_id', String(form.tuan_id))
        formData.append('ten_bai_hoc', form.ten_bai_hoc.trim())
        formData.append('thu_tu', String(form.thu_tu ?? 1))
        formData.append('hinh_anh_bai', file)

        response = await fetch(url, {
          method: isAdd ? 'POST' : 'PUT',
          body: formData, // Không gắn 'Content-Type', browser sẽ tự tạo boundary
        })
      } else {
        // Nếu không có file mới -> gửi JSON bình thường
        response = await fetch(url, {
          method: isAdd ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }

      const d = await response.json()
      if (!response.ok) throw new Error(d.error || d.message || `Lỗi ${isAdd ? 'thêm' : 'cập nhật'} bài học`)

      showToast(isAdd ? 'Thêm bài học thành công!' : 'Cập nhật thành công!')
      setShowModal(false)
      fetchList()
    } catch (e: unknown) {
      showToast((e as Error).message, 'error')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return
    try {
      const r = await fetch(`${API_BASE}/api/baihoc-lop1/${deleteItem.id}`, {
        method: 'DELETE',
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Lỗi xoá bài học')
      showToast('Đã xoá bài học!')
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
          <h1 className="bai-doc-list-title">📋 Danh sách bài học</h1>
          <p className="bai-doc-list-sub">Quản lý toàn bộ bài học lớp 1 trong hệ thống</p>
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
          Thêm bài học
        </button>
      </div>

      {/* Filter / Tìm kiếm */}
      <div className="bai-doc-filters">
        <input
          type="text"
          placeholder="Tìm theo tên bài học..."
          className="bai-doc-filter-search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ minWidth: 260 }}
        />
        <span className="bai-doc-count">
          {loading ? '...' : `${filteredList.length} bài học`}
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

      {/* Bảng danh sách */}
      <div className="bai-doc-table-wrap">
        <table className="bai-doc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên bài học</th>
              <th>Tên tuần</th>
              <th>Hình ảnh bài học</th>
              <th>Thứ tự</th>
              <th className="bd-actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="bd-td-center">
                  <div className="bai-doc-loading">
                    <div className="bai-doc-spinner" />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan={6} className="bd-td-center">
                  <div className="bai-doc-empty">
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div>
                      {searchTerm
                        ? 'Không tìm thấy bài học nào phù hợp'
                        : 'Chưa có bài học nào'}
                    </div>
                    {!searchTerm && (
                      <button
                        className="bd-btn-primary"
                        style={{ marginTop: 14 }}
                        onClick={handleAdd}
                      >
                        ➕ Thêm bài học đầu tiên
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentData.map(item => (
                <tr key={item.id} className="bd-tr-hover">
                  <td className="bd-td-id">{item.id}</td>
                  <td className="bd-td-name">{item.ten_bai_hoc}</td>
                  <td>
                    <span className="bd-badge bd-badge-lop">{item.tuan_id}</span>
                  </td>
                  <td>
                    {item.hinh_anh_bai ? (
                      <img
                        src={getImageUrl(item.hinh_anh_bai)}
                        alt={item.ten_bai_hoc}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 6,
                          border: '1px solid #e2e8f0'
                        }}
                        onError={e => {
                          ;(e.currentTarget as HTMLElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'left' }}>{item.thu_tu ?? '—'}</td>
                  <td className="bd-td-actions">
                    <button
                      id={`btn-detail-${item.id}`}
                      className="bd-icon-btn bd-icon-btn-detail"
                      title="Xem chi tiết bài học"
                      onClick={() => setDetailItem(item)}
                    >
                      <IconDetail />
                    </button>
                    <button
                      id={`btn-edit-${item.id}`}
                      className="bd-icon-btn bd-icon-btn-edit"
                      title="Sửa bài học"
                      onClick={() => handleEdit(item)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      id={`btn-delete-${item.id}`}
                      className="bd-icon-btn bd-icon-btn-delete"
                      title="Xóa bài học"
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
              Hiển thị {start + 1}–{Math.min(start + pageSize, filteredList.length)} / {filteredList.length} bài học
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
        <BaihocLop1Modal
          mode={modalMode}
          data={editData}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal Chi tiết */}
      {detailItem && (
        <BaihocLop1DetailModal
          data={detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}

      {/* Confirm Delete */}
      {deleteItem && (
        <ConfirmDelete
          ten_tuan={deleteItem.ten_bai_hoc}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}

      {/* Toast thông báo */}
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