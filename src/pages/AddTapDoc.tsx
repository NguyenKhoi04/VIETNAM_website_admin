import { useState, useRef, useCallback } from 'react'
import './AddTapDoc.css'

// ========================
// Types
// ========================
type CachDocType = 'chu' | 'danh-van'
type KieuCach = 1 | 2 | 3 | 4

interface DanhVanTag {
  id: number
  text: string
}

// Một file âm thanh có thể có nhãn tuỳ chọn
interface AudioEntry {
  id: number
  label: string      // nhãn (vd: "Đọc chậm", "Đọc nhanh")
  file: File | null
  url: string
}

// Đoạn nhỏ dùng cho Kiểu 4 – mỗi đoạn có nội dung + audio riêng
interface KieuBonDoan {
  id: number
  text: string
  audioEntries: AudioEntry[]
}

interface ChuEntry {
  id: number
  chu: string
  cachDoc: CachDocType
  // Kiểu 1 – đọc chữ thẳng
  docChu: string[]
  // Kiểu 2 – đọc đánh vần (tags)
  danhVanTags: DanhVanTag[][]   // mỗi lần nhập = một dòng tag
  danhVanInput: string           // input đang gõ dở
  kieuCach: KieuCach
  // Kiểu 1-3: nhiều audio (nút + Thêm âm thanh)
  audioEntries: AudioEntry[]
  // Kiểu 4: nhiều đoạn, mỗi đoạn có audio riêng
  kieuBonDoanList: KieuBonDoan[]
}

interface TuKhoEntry {
  id: number
  tu: string
  giaithich: string
  audioFile: File | null
  audioUrl: string
}

interface DoanVanEntry {
  id: number
  noidung: string
  audioFile: File | null
  audioUrl: string
}

// ========================
// Helpers
// ========================
let nextId = 1
const uid = () => nextId++

const tuanMenu = Array.from({ length: 35 }, (_, i) => `Tuần ${i + 1}`)
const chuDeMenu = Array.from({ length: 10 }, (_, i) => `Chủ đề ${i + 1}`)

// ========================
// Sub-component: Upload Image
// ========================
interface UploadImgProps {
  label: string
  value: File | null
  onChange: (f: File | null) => void
}

function UploadImg({ label, value, onChange }: UploadImgProps) {
  const ref = useRef<HTMLInputElement>(null)
  const preview = value ? URL.createObjectURL(value) : null

  return (
    <div
      className="upload-zone"
      style={{ cursor: 'pointer' }}
      onClick={() => ref.current?.click()}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
      <span className="upload-icon">{preview ? '' : '🖼️'}</span>
      {preview
        ? <img src={preview} alt="preview" className="upload-preview-img" />
        : null
      }
      <div className="upload-text">
        <strong>{label}</strong><br />
        {value ? value.name : 'Nhấn để chọn ảnh (PNG, JPG)'}
      </div>
    </div>
  )
}

// ========================
// Sub-component: Audio Test (single, dùng cho Tab 2)
// ========================
interface AudioTestProps {
  audioFile: File | null
  audioUrl: string
  onFileChange: (f: File | null, url: string) => void
  small?: boolean
}

function AudioTest({ audioFile, audioUrl, onFileChange, small }: AudioTestProps) {
  const ref = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFile = (f: File | null) => {
    if (!f) return
    const url = URL.createObjectURL(f)
    onFileChange(f, url)
  }

  const handleListen = () => {
    if (!audioUrl) return
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  return (
    <div className="audio-test-row" style={small ? { padding: '8px 12px' } : undefined}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        🎵 Test âm thanh
      </span>
      <button className="btn-add" style={{ borderStyle: 'solid', padding: '6px 12px', fontSize: '12px' }}
        onClick={() => ref.current?.click()}>
        📂 Chọn file
      </button>
      <input
        ref={ref}
        type="file"
        accept=".wav,.mp3,.nav,audio/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files?.[0] ?? null)}
      />
      {audioFile && (
        <span className="audio-file-name">{audioFile.name}</span>
      )}
      <button
        className="btn-listen"
        onClick={handleListen}
        disabled={!audioUrl}
        style={{ opacity: audioUrl ? 1 : 0.45 }}
      >
        🔊 Nghe thử
      </button>
      {audioUrl && <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />}
    </div>
  )
}

// ========================
// Sub-component: Multi Audio – nhiều file, có nút + Thêm âm thanh
// ========================
interface MultiAudioTestProps {
  entries: AudioEntry[]
  onAdd: () => void
  onRemove: (id: number) => void
  onFileChange: (id: number, f: File, url: string) => void
  onLabelChange: (id: number, label: string) => void
}

function MultiAudioTest({ entries, onAdd, onRemove, onFileChange, onLabelChange }: MultiAudioTestProps) {
  return (
    <div className="multi-audio-wrapper">
      {entries.map((entry, idx) => (
        <SingleAudioRow
          key={entry.id}
          entry={entry}
          index={idx}
          showRemove={entries.length > 1}
          onRemove={() => onRemove(entry.id)}
          onFileChange={(f, url) => onFileChange(entry.id, f, url)}
          onLabelChange={label => onLabelChange(entry.id, label)}
        />
      ))}
      <button className="btn-add" style={{ marginTop: 6, fontSize: '12.5px' }} onClick={onAdd}>
        ➕ Thêm âm thanh
      </button>
    </div>
  )
}

interface SingleAudioRowProps {
  entry: AudioEntry
  index: number
  showRemove: boolean
  onRemove: () => void
  onFileChange: (f: File, url: string) => void
  onLabelChange: (label: string) => void
}

function SingleAudioRow({ entry, index, showRemove, onRemove, onFileChange, onLabelChange }: SingleAudioRowProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleFile = (f: File | null) => {
    if (!f) return
    onFileChange(f, URL.createObjectURL(f))
  }

  const handleListen = () => {
    if (!entry.url || !audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play()
  }

  return (
    <div className="audio-entry-row">
      <span className="audio-entry-idx">#{index + 1}</span>
      <input
        className="field-input audio-label-input"
        placeholder="Nhãn (vd: Đọc chậm)"
        value={entry.label}
        onChange={e => onLabelChange(e.target.value)}
      />
      <button
        className="btn-add"
        style={{ borderStyle: 'solid', padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
        onClick={() => fileRef.current?.click()}
      >
        📂 Chọn file
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".wav,.mp3,.nav,audio/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files?.[0] ?? null)}
      />
      {entry.file && (
        <span className="audio-file-name" style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.file.name}
        </span>
      )}
      <button
        className="btn-listen"
        onClick={handleListen}
        disabled={!entry.url}
        style={{ opacity: entry.url ? 1 : 0.45 }}
      >
        🔊 Nghe thử
      </button>
      {showRemove && (
        <button className="btn-remove" onClick={onRemove}>✕</button>
      )}
      {entry.url && <audio ref={audioRef} src={entry.url} style={{ display: 'none' }} />}
    </div>
  )
}

// ========================
// Sub-component: Kiểu Cách Selector
// ========================
interface KieuCachSelectorProps {
  value: KieuCach
  onChange: (k: KieuCach) => void
  chuText?: string
}

function KieuCachSelector({ value, onChange, chuText }: KieuCachSelectorProps) {
  const kieu: { k: KieuCach; label: string; preview: React.ReactNode }[] = [
    {
      k: 1,
      label: '3 ô + Loa',
      preview: (
        <div className="preview-3o">
          <div className="pbox" />
          <div className="pbox" />
          <div className="pbox" />
          <div className="ploa">🔊</div>
        </div>
      )
    },
    {
      k: 2,
      label: '2 cột × 2 hàng + Loa',
      preview: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="preview-2x2">
            <div className="pbox" />
            <div className="pbox" />
            <div className="pbox" style={{ gridColumn: '1 / -1' }} />
          </div>
          <div className="ploa" style={{
            width: 18, height: 18, background: 'var(--primary)', borderRadius: '50%',
            fontSize: 9, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>🔊</div>
        </div>
      )
    },
    {
      k: 3,
      label: 'Chữ đã nhập + Loa',
      preview: (
        <div className="preview-merged">
          <div className="ptext">{chuText || 'ba'}</div>
          <div style={{
            width: 18, height: 18, background: 'var(--primary)', borderRadius: '50%',
            fontSize: 9, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>🔊</div>
        </div>
      )
    },
    {
      k: 4,
      label: 'Nhiều đoạn, mỗi đoạn 1 loa',
      preview: (
        <div className="preview-multi">
          {[0, 1, 2].map(i => (
            <div key={i} className="prow">
              <div className="ptext" />
              <div className="ploa">🔊</div>
            </div>
          ))}
        </div>
      )
    }
  ]

  return (
    <div className="kieu-cach-grid">
      {kieu.map(item => (
        <div
          key={item.k}
          className={`kieu-cach-card ${value === item.k ? 'selected' : ''}`}
          onClick={() => onChange(item.k)}
        >
          <div className="kieu-check">✓</div>
          {item.preview}
          <span className="kieu-label">{`Kiểu ${item.k}: ${item.label}`}</span>
        </div>
      ))}
    </div>
  )
}

// ========================
// Sub-component: Đánh vần tags
// ========================
interface DanhVanTagsProps {
  rows: DanhVanTag[][]
  inputVal: string
  onInputChange: (v: string) => void
  onAddTag: (text: string) => void
  onRemoveTag: (rowIdx: number, tagId: number) => void
  onAddRow: () => void
}

function DanhVanTags({ rows, inputVal, onInputChange, onAddTag, onRemoveTag, onAddRow }: DanhVanTagsProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === '-' || e.key === ' ' || e.key === 'Enter') && inputVal.trim()) {
      e.preventDefault()
      onAddTag(inputVal.trim())
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          {row.map((tag, ti) => (
            <span key={tag.id} className="dv-tag">
              {tag.text}
              <span className="dv-tag-remove" onClick={() => onRemoveTag(ri, tag.id)}>✕</span>
              {ti < row.length - 1 && <span className="dv-sep"> - </span>}
            </span>
          ))}
        </div>
      ))}
      <div className="danh-van-tags" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          className="dv-input"
          value={inputVal}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Gõ âm rồi nhấn "-" hoặc Enter (vd: bờ)'
        />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {inputVal.trim() && (
          <button className="btn-add" style={{ padding: '5px 12px', fontSize: '12px', borderStyle: 'solid' }}
            onClick={() => onAddTag(inputVal.trim())}>
            + Thêm âm
          </button>
        )}
        <button className="btn-add" style={{ padding: '5px 12px', fontSize: '12px' }}
          onClick={onAddRow}>
          + Dòng mới
        </button>
      </div>
    </div>
  )
}

// ========================
// Sub-component: Rich Text Editor (toolbar + contenteditable)
// ========================
interface RichEditorProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minHeight?: number
  highlightMode?: boolean
  onHighlightSelect?: (selectedText: string) => void
}

function RichEditor({
  value, onChange,
  placeholder = 'Nhập nội dung...',
  minHeight = 120,
  highlightMode = false,
  onHighlightSelect,
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
  }

  // Xử lý khi thả chuột trong chế độ bôi từ khó
  const handleMouseUp = () => {
    if (!highlightMode || !onHighlightSelect) return
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return
    const text = selection.toString().trim()
    if (!text) return

    // Kiểm tra vùng chọn nằm trong editor
    const range = selection.getRangeAt(0)
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return

    // Bao phủ vần bản chọn bằng <span> đỏ + in đậm
    const span = document.createElement('span')
    span.style.color = '#e74c3c'
    span.style.fontWeight = '700'
    span.title = 'Từ khó'
    span.className = 'tu-kho-highlight'
    try {
      range.surroundContents(span)
    } catch {
      // Nếu surroundContents thất bại (chọn nhiều node) dùng extractContents
      span.appendChild(range.extractContents())
      range.insertNode(span)
    }
    selection.removeAllRanges()

    // Cập nhật nội dung HTML
    onChange(editorRef.current?.innerHTML ?? '')
    // Callback thêm vào danh sách từ khó
    onHighlightSelect(text)
  }

  return (
    <div>
      <div className={`rich-toolbar ${highlightMode ? 'toolbar-highlight-mode' : ''}`}>
        <button className="rich-toolbar-btn" title="In đậm" onMouseDown={e => { e.preventDefault(); exec('bold') }}><b>B</b></button>
        <button className="rich-toolbar-btn" title="In nghiêng" onMouseDown={e => { e.preventDefault(); exec('italic') }}><i>I</i></button>
        <button className="rich-toolbar-btn" title="Gạch chân" onMouseDown={e => { e.preventDefault(); exec('underline') }}><u>U</u></button>
        <div className="rich-toolbar-sep" />
        <button className="rich-toolbar-btn" title="Căn trái" onMouseDown={e => { e.preventDefault(); exec('justifyLeft') }}>⬱</button>
        <button className="rich-toolbar-btn" title="Căn giữa" onMouseDown={e => { e.preventDefault(); exec('justifyCenter') }}>☰</button>
        <button className="rich-toolbar-btn" title="Căn phải" onMouseDown={e => { e.preventDefault(); exec('justifyRight') }}>⬰</button>
        <div className="rich-toolbar-sep" />
        <button className="rich-toolbar-btn" title="Cỡ chữ lớn" onMouseDown={e => { e.preventDefault(); exec('fontSize', '5') }}>A+</button>
        <button className="rich-toolbar-btn" title="Cỡ chữ nhỏ" onMouseDown={e => { e.preventDefault(); exec('fontSize', '2') }}>A-</button>
        {highlightMode && (
          <>
            <div className="rich-toolbar-sep" />
            <span className="highlight-mode-badge">
              🔴 Đang chế độ bôi từ khó — tô chọn văn bản để đánh dấu
            </span>
          </>
        )}
      </div>
      <div
        ref={editorRef}
        className={`rich-editor ${highlightMode ? 'rich-editor-highlight-mode' : ''}`}
        contentEditable
        suppressContentEditableWarning
        style={{ minHeight }}
        onInput={e => onChange((e.target as HTMLDivElement).innerHTML)}
        onMouseUp={handleMouseUp}
        data-placeholder={placeholder}
      />
    </div>
  )
}

// ========================
// Tab 1 – Đọc âm, từ, câu
// ========================
function TabDocAmTuCau() {
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

  const removeChu = (id: number) => {
    setChuList(prev => prev.filter(c => c.id !== id))
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
        <div className="section-heading">📅 Thông tin tuần & bài học</div>
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

        {/* ── Hàng 2: Tên bài ── */}
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

        {/* ── Hàng 3: Hình ảnh tên bài ── */}
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
                  onChange={k => updateChu(c.id, 'kieuCach', k)}
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

              {/* 4b. Kiểu 4: nhiều đoạn ngắn, mỗi đoạn có audio riêng */}
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

                        {/* Text đoạn */}
                        <div style={{ marginBottom: 10 }}>
                          <input
                            id={`kieu4-doan-text-${doan.id}`}
                            className="field-input"
                            placeholder={`Nội dung đoạn ${di + 1} (vd: Chợ có gà ri...)`}
                            value={doan.text}
                            onChange={e => updateKieu4DoanText(c.id, doan.id, e.target.value)}
                          />
                        </div>

                        {/* Audio riêng của đoạn */}
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

// ========================
// Tab 2 – Đoạn văn
// ========================
function TabDoanVan() {
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

  // Chế độ bôi từ khó trực tiếp trên văn bản
  const [highlightMode, setHighlightMode] = useState(false)
  const tuKhoSectionRef = useRef<HTMLDivElement>(null)

  // --- Từ khó ---

  const updateTuKho = <K extends keyof TuKhoEntry>(id: number, key: K, val: TuKhoEntry[K]) => {
    setTuKhoList(prev => prev.map(t => t.id === id ? { ...t, [key]: val } : t))
  }

  const addTuKho = (tuText = '') => {
    setTuKhoList(prev => [...prev, { id: uid(), tu: tuText, giaithich: '', audioFile: null, audioUrl: '' }])
  }

  // Xử lý khi bôi từ khó từ Rich Editor
  const handleHighlightSelect = (selectedText: string) => {
    // Chỉ thêm nếu chưa có từ đó trong danh sách
    const alreadyExists = tuKhoList.some(t => t.tu.trim().toLowerCase() === selectedText.trim().toLowerCase())
    if (!alreadyExists) {
      setTuKhoList(prev => [...prev, { id: uid(), tu: selectedText, giaithich: '', audioFile: null, audioUrl: '' }])
    }
    // Cuộn xuống phần từ khó
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
        <div className="section-heading">📚 Thông tin chủ đề & bài học</div>

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

        {/* Toolbar điều khiển chế độ */}
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
            💡 <strong>Hướng dẫn:</strong> Dùng chuột tô chọn một từ hoặc cụm từ khó trong văn bản. Từ sẽ được đổi sang <span style={{ color: '#e74c3c', fontWeight: 700 }}>đỏ in đậm</span> và tự động thêm vào danh sách “Hiểu từ khó” bên dưới.
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

// ========================
// Main – AddTapDoc
// ========================
export default function AddTapDoc() {
  const [activeTab, setActiveTab] = useState<'am-tu-cau' | 'doan-van'>('am-tu-cau')

  return (
    <div className="add-tapdoc-page">
      {/* Page title */}
      <div>
        <h1 className="add-tapdoc-title">📖 Thêm bài Tập đọc</h1>
        <p className="add-tapdoc-sub">Tạo bài học tập đọc mới – âm, từ, câu hoặc đoạn văn</p>
      </div>

      {/* Tab switcher */}
      <div className="tab-switcher" role="tablist">
        <button
          id="tab-btn-am-tu-cau"
          role="tab"
          aria-selected={activeTab === 'am-tu-cau'}
          className={`tab-btn ${activeTab === 'am-tu-cau' ? 'active' : ''}`}
          onClick={() => setActiveTab('am-tu-cau')}
        >
          🔤 Đọc âm, từ, câu
        </button>
        <button
          id="tab-btn-doan-van"
          role="tab"
          aria-selected={activeTab === 'doan-van'}
          className={`tab-btn ${activeTab === 'doan-van' ? 'active' : ''}`}
          onClick={() => setActiveTab('doan-van')}
        >
          📄 Đoạn văn
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'am-tu-cau'
        ? <TabDocAmTuCau />
        : <TabDoanVan />
      }
    </div>
  )
}
