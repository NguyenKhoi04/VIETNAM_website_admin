import type { KieuCach } from './types'

interface KieuCachSelectorProps {
  value: KieuCach
  onChange: (k: KieuCach) => void
  chuText?: string
}

export function KieuCachSelector({ value, onChange, chuText }: KieuCachSelectorProps) {
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
