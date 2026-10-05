import { useRef } from 'react'

interface UploadImgProps {
  label: string
  value: File | null
  onChange: (f: File | null) => void
}

export function UploadImg({ label, value, onChange }: UploadImgProps) {
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
