import { useRef } from 'react'
import type { DanhVanTag } from './types'

interface DanhVanTagsProps {
  rows: DanhVanTag[][]
  inputVal: string
  onInputChange: (v: string) => void
  onAddTag: (text: string) => void
  onRemoveTag: (rowIdx: number, tagId: number) => void
  onAddRow: () => void
}

export function DanhVanTags({ rows, inputVal, onInputChange, onAddTag, onRemoveTag, onAddRow }: DanhVanTagsProps) {
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
