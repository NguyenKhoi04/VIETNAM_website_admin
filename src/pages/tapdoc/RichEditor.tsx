import { useRef } from 'react'

interface RichEditorProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minHeight?: number
  highlightMode?: boolean
  onHighlightSelect?: (selectedText: string) => void
}

export function RichEditor({
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

  const handleMouseUp = () => {
    if (!highlightMode || !onHighlightSelect) return
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return
    const text = selection.toString().trim()
    if (!text) return

    const range = selection.getRangeAt(0)
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return

    const span = document.createElement('span')
    span.style.color = '#e74c3c'
    span.style.fontWeight = '700'
    span.title = 'Từ khó'
    span.className = 'tu-kho-highlight'
    try {
      range.surroundContents(span)
    } catch {
      span.appendChild(range.extractContents())
      range.insertNode(span)
    }
    selection.removeAllRanges()

    onChange(editorRef.current?.innerHTML ?? '')
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
