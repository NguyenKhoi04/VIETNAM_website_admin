import { useRef } from 'react'

// ========================
// AudioTest – single audio row (dùng cho Tab 2)
// ========================
interface AudioTestProps {
  audioFile: File | null
  audioUrl: string
  onFileChange: (f: File | null, url: string) => void
  small?: boolean
}

export function AudioTest({ audioFile, audioUrl, onFileChange, small }: AudioTestProps) {
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
// SingleAudioRow – một hàng audio trong MultiAudioTest
// ========================
interface SingleAudioRowProps {
  entry: { id: number; label: string; file: File | null; url: string }
  index: number
  showRemove: boolean
  onRemove: () => void
  onFileChange: (f: File, url: string) => void
  onLabelChange: (label: string) => void
}

export function SingleAudioRow({ entry, index, showRemove, onRemove, onFileChange, onLabelChange }: SingleAudioRowProps) {
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
// MultiAudioTest – nhiều file audio
// ========================
interface MultiAudioTestProps {
  entries: { id: number; label: string; file: File | null; url: string }[]
  onAdd: () => void
  onRemove: (id: number) => void
  onFileChange: (id: number, f: File, url: string) => void
  onLabelChange: (id: number, label: string) => void
}

export function MultiAudioTest({ entries, onAdd, onRemove, onFileChange, onLabelChange }: MultiAudioTestProps) {
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
