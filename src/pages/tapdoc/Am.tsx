// ========================
// Tab 1 – Đọc âm, từ, câu  (Am.tsx)
// ========================
import { useState, useCallback } from 'react'
import type { ChuEntry, KieuCach } from './types'
import { uid, tuanMenu } from './types'
import { UploadImg } from './UploadImg'
import { MultiAudioTest } from './AudioComponents'
import { KieuCachSelector } from './KieuCachSelector'
import { DanhVanTags } from './DanhVanTags'

export default function TabDocAmTuCau() {
  const [tuan, setTuan] = useState('')
  const [tenTuan, setTenTuan] = useState(tuanMenu[0])
  const [anhTuan, setAnhTuan] = useState<File | null>(null)
  const [tenBai, setTenBai] = useState('')
  const [anhBai, setAnhBai] = useState<File | null>(null)

  const [chuList, setChuList] = useState<ChuEntry[]>([
    {
      id: uid(), chu: '', cachDoc: 'chu',
      docChu: [''], danhVanTags: [[]], danhVanInput: '',
      kieuCach: 1,
      audioEntries: [{ id: uid(), label: '', file: null, url: '' }],
      kieuBonDoanList: [
        { id: uid(), text: '', audioEntries: [{ id: uid(), label: '', file: null, url: '' }] }
      ]
    }
  ])

  const [toast, setToast] = useState(false)

  // ---- CHỮ helpers ----
  const updateChu = useCallback(<K extends keyof ChuEntry>(id: number, key: K, val: ChuEntry[K]) => {
    setChuList(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c))
  }, [])

  const addChu = () => {
    setChuList(prev => [...prev, {
      id: uid(), chu: '', cachDoc: 'chu',
      docChu: [''], danhVanTags: [[]], danhVanInput: '',
      kieuCach: 1,
      audioEntries: [{ id: uid(), label: '', file: null, url: '' }],
      kieuBonDoanList: [
        { id: uid(), text: '', audioEntries: [{ id: uid(), label: '', file: null, url: '' }] }
      ]
    }])
  }

  const removeChu = (id: number) => {
    setChuList(prev => prev.filter(c => c.id !== id))
  }

  // ---- MULTI AUDIO helpers (Kiểu 1-3) ----
  const addAudio = (chuId: number) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      audioEntries: [...c.audioEntries, { id: uid(), label: '', file: null, url: '' }]
    }))
  }

  const removeAudio = (chuId: number, aId: number) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      audioEntries: c.audioEntries.filter(a => a.id !== aId)
    }))
  }

  const updateAudioFile = (chuId: number, aId: number, f: File, url: string) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      audioEntries: c.audioEntries.map(a => a.id === aId ? { ...a, file: f, url } : a)
    }))
  }

  const updateAudioLabel = (chuId: number, aId: number, label: string) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      audioEntries: c.audioEntries.map(a => a.id === aId ? { ...a, label } : a)
    }))
  }

  // ---- KIỂU 4 ĐOẠN helpers ----
  const addKieu4Doan = (chuId: number) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: [...c.kieuBonDoanList, {
        id: uid(), text: '',
        audioEntries: [{ id: uid(), label: '', file: null, url: '' }]
      }]
    }))
  }

  const removeKieu4Doan = (chuId: number, doanId: number) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: c.kieuBonDoanList.filter(d => d.id !== doanId)
    }))
  }

  const updateKieu4DoanText = (chuId: number, doanId: number, text: string) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: c.kieuBonDoanList.map(d => d.id === doanId ? { ...d, text } : d)
    }))
  }

  const addKieu4Audio = (chuId: number, doanId: number) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: c.kieuBonDoanList.map(d => d.id !== doanId ? d : {
        ...d,
        audioEntries: [...d.audioEntries, { id: uid(), label: '', file: null, url: '' }]
      })
    }))
  }

  const removeKieu4Audio = (chuId: number, doanId: number, aId: number) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: c.kieuBonDoanList.map(d => d.id !== doanId ? d : {
        ...d,
        audioEntries: d.audioEntries.filter(a => a.id !== aId)
      })
    }))
  }

  const updateKieu4AudioFile = (chuId: number, doanId: number, aId: number, f: File, url: string) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: c.kieuBonDoanList.map(d => d.id !== doanId ? d : {
        ...d,
        audioEntries: d.audioEntries.map(a => a.id === aId ? { ...a, file: f, url } : a)
      })
    }))
  }

  const updateKieu4AudioLabel = (chuId: number, doanId: number, aId: number, label: string) => {
    setChuList(prev => prev.map(c => c.id !== chuId ? c : {
      ...c,
      kieuBonDoanList: c.kieuBonDoanList.map(d => d.id !== doanId ? d : {
        ...d,
        audioEntries: d.audioEntries.map(a => a.id === aId ? { ...a, label } : a)
      })
    }))
  }

  // docChu sub-items
  const addDocChu = (chuId: number) => {
    setChuList(prev => prev.map(c => c.id === chuId ? { ...c, docChu: [...c.docChu, ''] } : c))
  }

  const updateDocChu = (chuId: number, idx: number, val: string) => {
    setChuList(prev => prev.map(c => {
      if (c.id !== chuId) return c
      const arr = [...c.docChu]; arr[idx] = val
      return { ...c, docChu: arr }
    }))
  }

  const removeDocChu = (chuId: number, idx: number) => {
    setChuList(prev => prev.map(c => {
      if (c.id !== chuId) return c
      const arr = c.docChu.filter((_, i) => i !== idx)
      return { ...c, docChu: arr.length ? arr : [''] }
    }))
  }

  // đánh vần tag helpers
  const addDvTag = (chuId: number, text: string) => {
    setChuList(prev => prev.map(c => {
      if (c.id !== chuId) return c
      const rows = c.danhVanTags.map((r, ri) =>
        ri === c.danhVanTags.length - 1
          ? [...r, { id: uid(), text }]
          : r
      )
      return { ...c, danhVanTags: rows, danhVanInput: '' }
    }))
  }

  const removeDvTag = (chuId: number, rowIdx: number, tagId: number) => {
    setChuList(prev => prev.map(c => {
      if (c.id !== chuId) return c
      const rows = c.danhVanTags.map((r, ri) =>
        ri === rowIdx ? r.filter(t => t.id !== tagId) : r
      )
      return { ...c, danhVanTags: rows }
    }))
  }

  const addDvRow = (chuId: number) => {
    setChuList(prev => prev.map(c =>
      c.id === chuId ? { ...c, danhVanTags: [...c.danhVanTags, []] } : c
    ))
  }

  const handleSubmit = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div>
      {/* ── Hàng 1: Tuần ── */}
      <div className="form-section">
        <div className="section-heading">📅 Thông tin tuần &amp; bài học</div>
        <div className="form-row">
          <div className="form-col w60">
            <label className="field-label">Tuần</label>
            <input
              id="tap-doc-tuan"
              className="field-input"
              type="number"
              min={1} max={35}
              placeholder="1"
              value={tuan}
              onChange={e => setTuan(e.target.value)}
            />
          </div>
          <div className="form-col w200">
            <label className="field-label">Tên tuần</label>
            <select
              id="tap-doc-ten-tuan"
              className="field-select"
              value={tenTuan}
              onChange={e => setTenTuan(e.target.value)}
            >
              {tuanMenu.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-col flex1">
            <label className="field-label">Hình ảnh tên tuần</label>
            <UploadImg label="Chọn hình tuần" value={anhTuan} onChange={setAnhTuan} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col full">
            <label className="field-label">Tên bài học</label>
            <input
              id="tap-doc-ten-bai"
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

      {/* ── Danh sách chữ ── */}
      <div className="form-section">
        <div className="section-heading">🔤 Nội dung đọc âm, từ, câu</div>

        <div className="chu-list">
          {chuList.map((c, idx) => (
            <div key={c.id} className="chu-item">
              {/* Header */}
              <div className="chu-item-header">
                <div className="chu-num-badge">{idx + 1}</div>
                <span className="chu-item-title">Chữ / Từ / Câu</span>
                {chuList.length > 1 && (
                  <button className="btn-remove" onClick={() => removeChu(c.id)}>✕ Xóa</button>
                )}
              </div>

              {/* 1. Nhập chữ */}
              <div className="form-row">
                <div className="form-col full">
                  <label className="field-label">1. Nhập chữ</label>
                  <input
                    id={`tap-doc-chu-${c.id}`}
                    className="field-input"
                    placeholder="Nhập chữ, từ hoặc câu..."
                    value={c.chu}
                    onChange={e => updateChu(c.id, 'chu', e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Cách đọc */}
              <div style={{ marginBottom: 14 }}>
                <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>
                  2. Cách đọc
                </label>
                <div className="cach-doc-wrapper">
                  {/* Option 1: Đọc chữ */}
                  <div
                    className={`radio-option ${c.cachDoc === 'chu' ? 'selected' : ''}`}
                    onClick={() => updateChu(c.id, 'cachDoc', 'chu')}
                  >
                    <input
                      type="radio"
                      id={`cach-chu-${c.id}`}
                      name={`cach-doc-${c.id}`}
                      checked={c.cachDoc === 'chu'}
                      onChange={() => updateChu(c.id, 'cachDoc', 'chu')}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="radio-label">① Đọc chữ thẳng</div>
                      {c.cachDoc === 'chu' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                          {c.docChu.map((dc, dci) => (
                            <div key={dci} className="radio-sub-input">
                              <input
                                id={`doc-chu-${c.id}-${dci}`}
                                className="field-input"
                                style={{ flex: 1, minWidth: 120 }}
                                placeholder={`Cách đọc ${dci + 1}...`}
                                value={dc}
                                onChange={e => updateDocChu(c.id, dci, e.target.value)}
                              />
                              {c.docChu.length > 1 && (
                                <button className="btn-remove" style={{ padding: '4px 8px' }}
                                  onClick={() => removeDocChu(c.id, dci)}>✕</button>
                              )}
                            </div>
                          ))}
                          <button className="btn-add" style={{ alignSelf: 'flex-start', fontSize: '12px' }}
                            onClick={() => addDocChu(c.id)}>
                            + Thêm cách đọc
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Option 2: Đánh vần */}
                  <div
                    className={`radio-option ${c.cachDoc === 'danh-van' ? 'selected' : ''}`}
                    onClick={() => updateChu(c.id, 'cachDoc', 'danh-van')}
                  >
                    <input
                      type="radio"
                      id={`cach-dv-${c.id}`}
                      name={`cach-doc-${c.id}`}
                      checked={c.cachDoc === 'danh-van'}
                      onChange={() => updateChu(c.id, 'cachDoc', 'danh-van')}
                    />
                    <div style={{ flex: 1 }}>
                      <div className="radio-label">② Đọc đánh vần (vd: bờ - a - ba - ba)</div>
                      {c.cachDoc === 'danh-van' && (
                        <div style={{ marginTop: 8 }}>
                          <DanhVanTags
                            rows={c.danhVanTags}
                            inputVal={c.danhVanInput}
                            onInputChange={v => updateChu(c.id, 'danhVanInput', v)}
                            onAddTag={text => addDvTag(c.id, text)}
                            onRemoveTag={(ri, tid) => removeDvTag(c.id, ri, tid)}
                            onAddRow={() => addDvRow(c.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Chọn kiểu cách */}
              <div style={{ marginBottom: 14 }}>
                <label className="field-label" style={{ marginBottom: 10, display: 'block' }}>
                  3. Chọn kiểu cách hiển thị
                </label>
                <KieuCachSelector
                  value={c.kieuCach}
                  onChange={k => updateChu(c.id, 'kieuCach', k as KieuCach)}
                  chuText={c.chu}
                />
              </div>

              {/* 4. Test âm thanh – Kiểu 1/2/3: nhiều file */}
              {c.kieuCach !== 4 && (
                <div>
                  <label className="field-label" style={{ marginBottom: 8, display: 'block' }}>
                    4. Test âm thanh
                  </label>
                  <MultiAudioTest
                    entries={c.audioEntries}
                    onAdd={() => addAudio(c.id)}
                    onRemove={aId => removeAudio(c.id, aId)}
                    onFileChange={(aId, f, url) => updateAudioFile(c.id, aId, f, url)}
                    onLabelChange={(aId, label) => updateAudioLabel(c.id, aId, label)}
                  />
                </div>
              )}

              {/* 4b. Kiểu 4: nhiều đoạn ngắn */}
              {c.kieuCach === 4 && (
                <div>
                  <label className="field-label" style={{ marginBottom: 10, display: 'block' }}>
                    4. Các đoạn (Kiểu 4) – mỗi đoạn có loa riêng
                  </label>
                  <div className="kieu4-doan-list">
                    {c.kieuBonDoanList.map((doan, di) => (
                      <div key={doan.id} className="kieu4-doan-item">
                        <div className="kieu4-doan-header">
                          <div className="chu-num-badge" style={{ fontSize: 10 }}>Đ{di + 1}</div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', flex: 1 }}>
                            Đoạn {di + 1}
                          </span>
                          {c.kieuBonDoanList.length > 1 && (
                            <button className="btn-remove" onClick={() => removeKieu4Doan(c.id, doan.id)}>✕ Xóa</button>
                          )}
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <input
                            id={`kieu4-doan-text-${doan.id}`}
                            className="field-input"
                            placeholder={`Nội dung đoạn ${di + 1} (vd: Chợ có gà ri...)`}
                            value={doan.text}
                            onChange={e => updateKieu4DoanText(c.id, doan.id, e.target.value)}
                          />
                        </div>

                        <MultiAudioTest
                          entries={doan.audioEntries}
                          onAdd={() => addKieu4Audio(c.id, doan.id)}
                          onRemove={aId => removeKieu4Audio(c.id, doan.id, aId)}
                          onFileChange={(aId, f, url) => updateKieu4AudioFile(c.id, doan.id, aId, f, url)}
                          onLabelChange={(aId, label) => updateKieu4AudioLabel(c.id, doan.id, aId, label)}
                        />
                      </div>
                    ))}
                  </div>

                  <button className="btn-add" style={{ marginTop: 10 }} onClick={() => addKieu4Doan(c.id)}>
                    ➕ Thêm đoạn
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="btn-add" onClick={addChu}>
            ➕ Thêm đọc chữ
          </button>
        </div>
      </div>

      {/* Submit */}
      <div className="btn-submit-wrap">
        <button id="tap-doc-submit-tab1" className="btn-submit" onClick={handleSubmit}>
          💾 Thêm bài
        </button>
      </div>

      {/* Toast */}
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
