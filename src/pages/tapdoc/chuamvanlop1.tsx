// ============================================================================
// ChuAmVanLop1List.tsx – Quản lý danh sách Chữ / Âm / Vần lớp 1 phần 1
// ============================================================================
import React, { useState, useEffect } from 'react'
import './tuanhoc_lop1.css'
import { UploadImg } from './UploadImg'

// ── Types ──────────────────────────────────────────────────────────────────
interface ChuAmVanRow {
  id: number
  tuan_id: number             // Cột 1: Tuần học (tuan_id)
  chu_am_id: number           // Cột 2: ID chu_am_van
  ten_bai_hoc: string         // Cột 3: Tên bài học
  noi_dung: string            // Cột 4: Nội dung
  cach_doc: string            // Cột 5: Cách đọc
  cach_doc_danh_van: string   // Cột 6: Cách đọc đánh vần
  kieu_hien_thi: number       // Cột 7: Kiểu hiển thị
  hinh_minh_hoa: string       // Cột 8: Hình minh họa
  la_chu_cai: number          // Cột 9: Là chữ cái
  thanh_dieu: string          // Cột 10: Thanh điệu
  loai_am: string             // Cột 11: Loại âm
  ma_key: string              // Cột 12: Mã key
  duong_dan: string           // Cột 13: Đường dẫn âm thanh
  bai_hoc_id: number
  thu_tu: number
}

interface BaiHocOption {
  id: number
  ten_bai_hoc: string
}

const API_BASE = 'http://localhost:5000'

const getImageUrl = (url?: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

function IconDetail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v5" />
      <path d="M12 7h.01" />
    </svg>
  )
}

function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconDelete() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

// ── Modal Chi tiết ─────────────────────────────────────────────────────────
function ChuAmVanDetailModal({ data, onClose }: { data: ChuAmVanRow; onClose: () => void }) {
  return (
    <div className="bai-doc-modal-overlay" onClick={onClose}>
      <div className="bai-doc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="bai-doc-modal-header">
          <span>Chi tiết Chữ / Âm / Vần (13 cột dữ liệu)</span>
          <button className="bai-doc-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="bai-doc-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group"><label>1. Tuần học </label><input type="text" value={data.tuan_id ?? ''} disabled /></div>
            <div className="bd-form-group"><label>2. ID Chữ/Âm </label><input type="text" value={data.chu_am_id ?? ''} disabled /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}><label>3. Tên bài học</label><input type="text" value={data.ten_bai_hoc ?? ''} disabled /></div>
            <div className="bd-form-group"><label>4. Nội dung</label><input type="text" value={data.noi_dung ?? ''} disabled /></div>
            <div className="bd-form-group"><label>7. Kiểu hiển thị</label><input type="text" value={data.kieu_hien_thi ?? ''} disabled /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}><label>5. Cách đọc</label><input type="text" value={data.cach_doc ?? ''} disabled /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}><label>6. Cách đọc đánh vần</label><input type="text" value={data.cach_doc_danh_van ?? ''} disabled /></div>
            <div className="bd-form-group"><label>9. Là chữ cái</label><input type="text" value={data.la_chu_cai === 1 ? '1 (Chữ cái đơn)' : '0 (Từ/vần/câu)'} disabled /></div>
            <div className="bd-form-group"><label>10. Thanh điệu</label><input type="text" value={data.thanh_dieu ?? ''} disabled /></div>
            <div className="bd-form-group"><label>11. Loại âm</label><input type="text" value={data.loai_am ?? ''} disabled /></div>
            <div className="bd-form-group"><label>12. Mã key</label><input type="text" value={data.ma_key ?? ''} disabled /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}><label>13. Đường dẫn âm thanh</label><input type="text" value={data.duong_dan ?? ''} disabled /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}>
              <label>8. Hình minh họa</label>
              {data.hinh_minh_hoa ? <img src={getImageUrl(data.hinh_minh_hoa)} alt="" style={{ maxHeight: 120, display: 'block', marginTop: 6 }} /> : <p style={{ fontStyle: 'italic', color: '#94a3b8' }}>Không có ảnh</p>}
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
function ChuAmVanModal({ mode, data, onClose, onSave }: { mode: 'add' | 'edit'; data: Partial<ChuAmVanRow>; onClose: () => void; onSave: (d: Partial<ChuAmVanRow>, f: File | null) => void }) {
  const [form, setForm] = useState<Partial<ChuAmVanRow>>(data)
  const [hinhFile, setHinhFile] = useState<File | null>(null)
  const [baiHocList, setBaiHocList] = useState<BaiHocOption[]>([])

  useEffect(() => { setForm(data); setHinhFile(null) }, [data])
  useEffect(() => {
    fetch(`${API_BASE}/api/baihoc-lop1`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setBaiHocList(d) })
      .catch(() => {})
  }, [])

  const set = (key: keyof ChuAmVanRow, val: any) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="bai-doc-modal-overlay" onClick={onClose}>
      <div className="bai-doc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="bai-doc-modal-header">
          <span>{mode === 'add' ? '➕ Thêm Chữ / Âm / Vần' : '✏️ Sửa Chữ / Âm / Vần'}</span>
          <button className="bai-doc-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="bai-doc-modal-body">
          <div className="bd-form-grid">
            <div className="bd-form-group">
              <label>Bài học <span className="bd-required">*</span></label>
              <select value={form.bai_hoc_id ?? ''} onChange={e => set('bai_hoc_id', Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}>
                <option value="">-- Chọn bài học --</option>
                {baiHocList.map(bh => <option key={bh.id} value={bh.id}>[ID: {bh.id}] {bh.ten_bai_hoc}</option>)}
              </select>
            </div>
            <div className="bd-form-group"><label>Nội dung </label><input type="text" value={form.noi_dung ?? ''} onChange={e => set('noi_dung', e.target.value)} placeholder="Ví dụ: ba" /></div>
            <div className="bd-form-group"><label>Là chữ cái</label><select value={form.la_chu_cai ?? 0} onChange={e => set('la_chu_cai', Number(e.target.value))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}><option value={1}>1 (Chữ cái đơn)</option><option value={0}>0 (Từ/vần/câu)</option></select></div>
            <div className="bd-form-group"><label>Thanh điệu</label><input type="text" value={form.thanh_dieu ?? ''} onChange={e => set('thanh_dieu', e.target.value)} placeholder="ngang, huyền..." /></div>
            <div className="bd-form-group"><label>Cách đọc đánh vần</label><input type="text" value={form.cach_doc_danh_van ?? ''} onChange={e => set('cach_doc_danh_van', e.target.value)} placeholder="bờ-a-ba" /></div>
            <div className="bd-form-group"><label>Kiểu hiển thị</label><input type="number" value={form.kieu_hien_thi ?? 1} onChange={e => set('kieu_hien_thi', Number(e.target.value))} /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}><label>Cách đọc</label><input type="text" value={form.cach_doc ?? ''} onChange={e => set('cach_doc', e.target.value)} /></div>
            <div className="bd-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Hình minh họa</label>
              <UploadImg label="Chọn ảnh" value={hinhFile} onChange={setHinhFile} />
              {!hinhFile && form.hinh_minh_hoa && <img src={getImageUrl(form.hinh_minh_hoa)} alt="" style={{ width: 50, height: 50, marginTop: 6, objectFit: 'cover' }} />}
            </div>
          </div>
        </div>
        <div className="bai-doc-modal-footer">
          <button className="bd-btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="bd-btn-save" onClick={() => onSave(form, hinhFile)}>{mode === 'add' ? 'Thêm' : 'Lưu'}</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDelete({ noi_dung, onConfirm, onCancel }: { noi_dung: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="bai-doc-modal-overlay" onClick={onCancel}>
      <div className="bai-doc-modal bd-confirm" onClick={e => e.stopPropagation()}>
        <div className="bd-confirm-icon">🗑️</div>
        <div className="bd-confirm-title">Xoá mục</div>
        <div className="bd-confirm-msg">Bạn có chắc muốn xoá <strong>"{noi_dung}"</strong>?</div>
        <div className="bd-confirm-actions">
          <button className="bd-btn-cancel" onClick={onCancel}>Huỷ</button>
          <button className="bd-btn-delete" onClick={onConfirm}>Xoá</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ChuAmVanLop1List() {
  const [list, setList] = useState<ChuAmVanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [detailItem, setDetailItem] = useState<ChuAmVanRow | null>(null)
  const [editData, setEditData] = useState<Partial<ChuAmVanRow>>({})
  const [deleteItem, setDeleteItem] = useState<ChuAmVanRow | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 10

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchList = () => {
    setLoading(true)
    setError('')
    fetch(`${API_BASE}/api/chu-am-van`)
      .then(r => r.json())
      .then(d => setList(Array.isArray(d) ? d : []))
      .catch(err => setError('Lỗi kết nối: ' + err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchList() }, [])
  useEffect(() => { setPage(1) }, [searchTerm])

  const filteredList = list.filter(item =>
    item.noi_dung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ten_bai_hoc?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1
  const start = (page - 1) * pageSize
  const currentData = filteredList.slice(start, start + pageSize)

  const handleSave = async (form: Partial<ChuAmVanRow>, file: File | null) => {
    if (!form.bai_hoc_id || !form.noi_dung) {
      showToast('Vui lòng điền đủ bài học và nội dung!', 'error')
      return
    }
    try {
      const isAdd = modalMode === 'add'
      const url = isAdd ? `${API_BASE}/api/chu-am-van` : `${API_BASE}/api/chu-am-van/${form.id}`
      let res: Response

      if (file) {
        const fd = new FormData()
        fd.append('bai_hoc_id', String(form.bai_hoc_id))
        fd.append('noi_dung', form.noi_dung.trim())
        fd.append('cach_doc', form.cach_doc || '')
        fd.append('cach_doc_danh_van', form.cach_doc_danh_van || '')
        fd.append('kieu_hien_thi', String(form.kieu_hien_thi ?? 1))
        fd.append('la_chu_cai', String(form.la_chu_cai ?? 0))
        fd.append('thanh_dieu', form.thanh_dieu || '')
        fd.append('thu_tu', String(form.thu_tu ?? 1))
        fd.append('hinh_minh_hoa', file)
        res = await fetch(url, { method: isAdd ? 'POST' : 'PUT', body: fd })
      } else {
        res = await fetch(url, {
          method: isAdd ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        })
      }
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Lỗi thao tác')
      showToast(isAdd ? 'Thêm thành công!' : 'Cập nhật thành công!')
      setShowModal(false)
      fetchList()
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return
    try {
      const r = await fetch(`${API_BASE}/api/chu-am-van/${deleteItem.id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error('Lỗi xoá')
      showToast('Đã xoá thành công!')
      setDeleteItem(null)
      fetchList()
    } catch (e: any) {
      showToast(e.message, 'error')
    }
  }

  return (
    <div className="bai-doc-list-page">
      <div className="bai-doc-list-header">
        <div>
          <h1 className="bai-doc-list-title">🔤 Quản lý Chữ / Âm / Vần (13 Cột)</h1>
          <p className="bai-doc-list-sub">Hiển thị kết nối đồng bộ 3 bảng dữ liệu</p>
        </div>
        <button className="bd-btn-primary" onClick={() => { setModalMode('add'); setEditData({ thu_tu: 1, la_chu_cai: 0, kieu_hien_thi: 1 }); setShowModal(true) }}>
          ➕ Thêm mới
        </button>
      </div>

      <div className="bai-doc-filters">
        <input type="text" placeholder="Tìm theo nội dung hoặc tên bài..." className="bai-doc-filter-search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ minWidth: 300 }} />
        <span className="bai-doc-count">{filteredList.length} mục</span>
      </div>

      {error && <div className="bai-doc-error">⚠️ {error}</div>}

      <div className="bai-doc-table-wrap" style={{ overflowX: 'auto' }}>
        <table className="bai-doc-table" style={{ minWidth: 1400 }}>
          <thead>
            <tr>
              <th>Tuần học</th>
              <th>ID Chữ/Âm</th>
              <th>Tên bài học</th>
              <th>Nội dung</th>
              <th>Cách đọc</th>
              <th>Đánh vần</th>
              <th>Kiểu HT</th>
              <th>Hình ảnh</th>
              <th>Chữ cái</th>
              <th>Thanh điệu</th>
              <th>Loại âm</th>
              <th>Mã key</th>
              <th>Đường dẫn âm</th>
              <th className="bd-actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={14} className="bd-td-center">Đang tải...</td></tr>
            ) : currentData.length === 0 ? (
              <tr><td colSpan={14} className="bd-td-center">Không có dữ liệu</td></tr>
            ) : (
              currentData.map(item => (
                <tr key={`${item.chu_am_id}-${item.ma_key || 'no-audio'}`} className="bd-tr-hover">
                  <td><span className="bd-badge bd-badge-lop">Tuần {item.tuan_id ?? '—'}</span></td>
                  <td style={{ fontWeight: 600 }}>{item.chu_am_id}</td>
                  <td>{item.ten_bai_hoc || '—'}</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>{item.noi_dung}</td>
                  <td style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.cach_doc}>{item.cach_doc || '—'}</td>
                  <td>{item.cach_doc_danh_van || '—'}</td>
                  <td style={{ textAlign: 'center' }}>{item.kieu_hien_thi}</td>
                  <td>
                    {item.hinh_minh_hoa ? <img src={getImageUrl(item.hinh_minh_hoa)} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.la_chu_cai}</td>
                  <td>{item.thanh_dieu || '—'}</td>
                  <td><span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{item.loai_am || '—'}</span></td>
                  <td><code>{item.ma_key || '—'}</code></td>
                  <td style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.duong_dan}>{item.duong_dan || '—'}</td>
                  <td className="bd-td-actions">
                    <button className="bd-icon-btn bd-icon-btn-detail" onClick={() => setDetailItem(item)} title="Xem"><IconDetail /></button>
                    <button className="bd-icon-btn bd-icon-btn-edit" onClick={() => { setModalMode('edit'); setEditData(item); setShowModal(true) }} title="Sửa"><IconEdit /></button>
                    <button className="bd-icon-btn bd-icon-btn-delete" onClick={() => setDeleteItem(item)} title="Xoá"><IconDelete /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">Trang {page} / {totalPages}</div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        </div>
      )}

      {showModal && <ChuAmVanModal mode={modalMode} data={editData} onClose={() => setShowModal(false)} onSave={handleSave} />}
      {detailItem && <ChuAmVanDetailModal data={detailItem} onClose={() => setDetailItem(null)} />}
      {deleteItem && <ConfirmDelete noi_dung={deleteItem.noi_dung} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteItem(null)} />}
      {toast && <div className={`bai-doc-toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>{toast.msg}</div>}
    </div>
  )
}