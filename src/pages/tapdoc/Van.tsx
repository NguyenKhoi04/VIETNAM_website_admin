// ========================
// Tab 2 – Đoạn văn  (Van.tsx)
// ========================
import { useState, useRef } from 'react'
import type { TuKhoEntry, DoanVanEntry } from './types'
import { uid, chuDeMenu } from './types'
import { UploadImg } from './UploadImg'
import { AudioTest } from './AudioComponents'
import { RichEditor } from './RichEditor'

export default function TabDoanVan() {
  const [chuDeSo, setChuDeSo] = useState('')
  const [tenChuDe, setTenChuDe] = useState(chuDeMenu[0])
  const [anhChuDe, setAnhChuDe] = useState<File | null>(null)
  const [tenBai, setTenBai] = useState('')
  const [anhBai, setAnhBai] = useState<File | null>(null)

  // 1. Mẫu
  const [mauNoidung, setMauNoidung] = useState('')
  const [mauAudio, setMauAudio] = useState<File | null>(null)
  const [mauAudioUrl, setMauAudioUrl] = useState('')

  // 2. Từ khó
  const [tuKhoList, setTuKhoList] = useState<TuKhoEntry[]>([
    { id: uid(), tu: '', giaithich: '', audioFile: null, audioUrl: '' }
  ])

  // 3. Đọc theo mẫu
  const [doanVanList, setDoanVanList] = useState<DoanVanEntry[]>([
    { id: uid(), noidung: '', audioFile: null, audioUrl: '' }
  ])

  const [toast, setToast] = useState(false)
  const [highlightMode, setHighlightMode] = useState(false)
  const tuKhoSectionRef = useRef<HTMLDivElement>(null)

  // --- Từ khó ---
  const updateTuKho = <K extends keyof TuKhoEntry>(id: number, key: K, val: TuKhoEntry[K]) => {
    setTuKhoList(prev => prev.map(t => t.id === id ? { ...t, [key]: val } : t))
  }

  const addTuKho = (tuText = '') => {
    setTuKhoList(prev => [...prev, { id: uid(), tu: tuText, giaithich: '', audioFile: null, audioUrl: '' }])
  }

  const handleHighlightSelect = (selectedText: string) => {
    const alreadyExists = tuKhoList.some(t => t.tu.trim().toLowerCase() === selectedText.trim().toLowerCase())
    if (!alreadyExists) {
      setTuKhoList(prev => [...prev, { id: uid(), tu: selectedText, giaithich: '', audioFile: null, audioUrl: '' }])
    }
    setTimeout(() => {
      tuKhoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const removeTuKho = (id: number) => {
    setTuKhoList(prev => prev.filter(t => t.id !== id))
  }

  // --- Đoạn văn ---
  const updateDoanVan = <K extends keyof DoanVanEntry>(id: number, key: K, val: DoanVanEntry[K]) => {
    setDoanVanList(prev => prev.map(d => d.id === id ? { ...d, [key]: val } : d))
  }

  const addDoanVan = () => {
    setDoanVanList(prev => [...prev, { id: uid(), noidung: '', audioFile: null, audioUrl: '' }])
  }

  const removeDoanVan = (id: number) => {
    setDoanVanList(prev => prev.filter(d => d.id !== id))
  }

  const handleSubmit = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div>
      {/* ── Hàng 1: Chủ đề ── */}
      <div className="form-section">
        <div className="section-heading">📚 Thông tin chủ đề &amp; bài học</div>

        <div className="form-row">
          <div className="form-col w60">
            <label className="field-label">Chủ đề số</label>
            <input
              id="doan-van-chu-de-so"
              className="field-input"
              type="number"
              min={1}
              placeholder="1"
              value={chuDeSo}
              onChange={e => setChuDeSo(e.target.value)}
            />
          </div>
          <div className="form-col w200">
            <label className="field-label">Tên chủ đề</label>
            <select
              id="doan-van-ten-chu-de"
              className="field-select"
              value={tenChuDe}
              onChange={e => setTenChuDe(e.target.value)}
            >
              {chuDeMenu.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-col flex1">
            <label className="field-label">Hình ảnh tên chủ đề</label>
            <UploadImg label="Chọn hình chủ đề" value={anhChuDe} onChange={setAnhChuDe} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col full">
            <label className="field-label">Tên bài học</label>
            <input
              id="doan-van-ten-bai"
              className="field-input"
              placeholder="Nhập tên bài học..."
              value={tenBai}
              onChange={e => setTenBai(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col full">
            <label className="field-label">Hình ảnh tên bài học</label>
            <UploadImg label="Chọn hình bài học" value={anhBai} onChange={setAnhBai} />
          </div>
        </div>
      </div>

      {/* ── 1. Mẫu ── */}
      <div className="form-section">
        <div className="section-heading">📝 1. Mẫu (bài đọc)</div>

        <div className="mau-controls-bar">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            ① Nhập văn bản bên dưới → ② Bật chế độ bôi để đánh dấu từ khó
          </span>
          <button
            id="btn-toggle-highlight"
            className={`btn-highlight-toggle ${highlightMode ? 'active' : ''}`}
            onClick={() => setHighlightMode(v => !v)}
            title={highlightMode ? 'Tắt chế độ bôi từ khó' : 'Bật chế độ bôi từ khó'}
          >
            {highlightMode ? '❌ Tắt bôi từ khó' : '🔴 Bôi từ khó'}
          </button>
        </div>

        <RichEditor
          value={mauNoidung}
          onChange={setMauNoidung}
          placeholder="Nhập nội dung bài đọc mẫu..."
          minHeight={160}
          highlightMode={highlightMode}
          onHighlightSelect={handleHighlightSelect}
        />

        {highlightMode && (
          <div className="highlight-tip">
            💡 <strong>Hướng dẫn:</strong> Dùng chuột tô chọn một từ hoặc cụm từ khó trong văn bản. Từ sẽ được đổi sang <span style={{ color: '#e74c3c', fontWeight: 700 }}>đỏ in đậm</span> và tự động thêm vào danh sách "Hiểu từ khó" bên dưới.
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <AudioTest
            audioFile={mauAudio}
            audioUrl={mauAudioUrl}
            onFileChange={(f, url) => { setMauAudio(f); setMauAudioUrl(url) }}
          />
        </div>
      </div>

      {/* ── 2. Hiểu từ khó ── */}
      <div ref={tuKhoSectionRef} className="form-section">
        <div className="section-heading">🔍 2. Hiểu từ khó
          {tuKhoList.some(t => t.tu) && (
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 500, color: 'var(--primary-dark)',
              background: 'var(--primary-pale)', padding: '2px 8px', borderRadius: 20
            }}>
              {tuKhoList.filter(t => t.tu).length} từ
            </span>
          )}
        </div>

        <div className="tu-kho-list">
          {tuKhoList.map((tk, idx) => (
            <div key={tk.id} className={`tu-kho-item ${tk.tu ? 'tu-kho-highlighted' : ''}`}>
              <div className="tu-kho-header">
                <div className="chu-num-badge">{idx + 1}</div>
                <span className="chu-item-title">
                  {tk.tu
                    ? <span style={{ color: '#e74c3c', fontWeight: 700 }}>"{tk.tu}"</span>
                    : 'Từ khó'
                  }
                </span>
                {tuKhoList.length > 1 && (
                  <button className="btn-remove" onClick={() => removeTuKho(tk.id)}>✕ Xóa</button>
                )}
              </div>

              <div className="form-row">
                <div className="form-col" style={{ width: '50%' }}>
                  <label className="field-label">2.1 Từ</label>
                  <input
                    id={`tu-kho-tu-${tk.id}`}
                    className="field-input"
                    placeholder="Từ khó..."
                    value={tk.tu}
                    onChange={e => updateTuKho(tk.id, 'tu', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-col full">
                  <label className="field-label">2.2 Giải thích</label>
                  <textarea
                    id={`tu-kho-giai-thich-${tk.id}`}
                    className="field-textarea"
                    placeholder="Giải thích nghĩa của từ..."
                    value={tk.giaithich}
                    onChange={e => updateTuKho(tk.id, 'giaithich', e.target.value)}
                    style={{ minHeight: 90 }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>2.3 Test âm thanh</label>
                <AudioTest
                  audioFile={tk.audioFile}
                  audioUrl={tk.audioUrl}
                  onFileChange={(f, url) => {
                    updateTuKho(tk.id, 'audioFile', f)
                    updateTuKho(tk.id, 'audioUrl', url)
                  }}
                  small
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn-add" onClick={() => addTuKho()}>➕ Thêm từ khó</button>
          {!highlightMode && (
            <button
              className="btn-highlight-toggle"
              onClick={() => setHighlightMode(true)}
              style={{ fontSize: 12 }}
            >
              🔴 Bật bôi từ khó từ văn bản
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Đọc theo mẫu ── */}
      <div className="form-section">
        <div className="section-heading">🎙️ 3. Đọc theo mẫu</div>

        <div className="doan-van-list">
          {doanVanList.map((dv, idx) => (
            <div key={dv.id} className="doan-van-item">
              <div className="doan-van-header">
                <div className="chu-num-badge">{idx + 1}</div>
                <span className="chu-item-title">Đoạn đọc</span>
                {doanVanList.length > 1 && (
                  <button className="btn-remove" onClick={() => removeDoanVan(dv.id)}>✕ Xóa</button>
                )}
              </div>

              <div className="form-row">
                <div className="form-col full">
                  <label className="field-label">Nội dung đoạn</label>
                  <textarea
                    id={`doan-van-noi-dung-${dv.id}`}
                    className="field-textarea"
                    placeholder="Nhập đoạn văn học sinh cần đọc theo mẫu..."
                    value={dv.noidung}
                    onChange={e => updateDoanVan(dv.id, 'noidung', e.target.value)}
                    style={{ minHeight: 100 }}
                  />
                </div>
              </div>

              <AudioTest
                audioFile={dv.audioFile}
                audioUrl={dv.audioUrl}
                onFileChange={(f, url) => {
                  updateDoanVan(dv.id, 'audioFile', f)
                  updateDoanVan(dv.id, 'audioUrl', url)
                }}
                small
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button className="btn-add" onClick={addDoanVan}>➕ Thêm đoạn</button>
        </div>
      </div>

      {/* Submit */}
      <div className="btn-submit-wrap">
        <button id="tap-doc-submit-tab2" className="btn-submit" onClick={handleSubmit}>
          💾 Thêm bài
        </button>
      </div>

      {toast && (
        <div className="toast-overlay">
          <div className="toast">
            <span className="toast-icon">✅</span>
            Bài học đã được thêm thành công!
          </div>
        </div>
      )}
    </div>
  )
}
