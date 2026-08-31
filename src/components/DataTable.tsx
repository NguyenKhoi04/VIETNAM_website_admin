import { useState } from 'react'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  icon: string
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  rowKey?: keyof T  // field dùng làm key cho mỗi row (mặc định 'id')
}

export default function DataTable<T extends Record<string, unknown>>({
  title,
  icon,
  columns,
  data,
  pageSize = 6,
  rowKey = 'id' as keyof T,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const start = (page - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)

  const renderPageButtons = () => {
    const pages: React.ReactNode[] = []
    const maxVisible = 5

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2))
    const endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          id={`page-btn-${i}`}
          className={`page-btn ${page === i ? 'active' : ''}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title-badge">
          <span>{icon}</span>
          <span>{title}</span>
          <span style={{
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '12px',
          }}>
            {data.length}
          </span>
        </div>
        <div className="table-actions">
          <button className="btn btn-outline" id="btn-filter">
            🔍 Lọc
          </button>
          <button className="btn btn-primary" id="btn-add">
            ＋ Thêm mới
          </button>
        </div>
      </div>

      <div className="table-scroll-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              {columns.map(col => (
                <th key={String(col.key)}>{col.label}</th>
              ))}
              <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2}>
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">Không có dữ liệu</div>
                    <div className="empty-desc">Chưa có bản ghi nào trong bảng này</div>
                  </div>
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => (
                <tr key={String(row[rowKey])}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                    {start + idx + 1}
                  </td>
                  {columns.map(col => (
                    <td key={String(col.key)} title={String(row[col.key])}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                      id={`edit-btn-${String(row[rowKey])}`}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(94,184,212,0.12)', border: '1px solid var(--border)',
                          cursor: 'pointer', fontSize: '13px', transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'var(--primary-light)'
                          e.currentTarget.style.transform = 'scale(1.1)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(94,184,212,0.12)'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        id={`delete-btn-${String(row[rowKey])}`}
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px',
                          background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
                          cursor: 'pointer', fontSize: '13px', transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(231,76,60,0.15)'
                          e.currentTarget.style.transform = 'scale(1.1)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(231,76,60,0.08)'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                        title="Xóa"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Hiển thị {start + 1}–{Math.min(start + pageSize, data.length)} / {data.length} bản ghi
          </div>
          <div className="pagination-controls">
            <button
              id="prev-page-btn"
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {renderPageButtons()}
            <button
              id="next-page-btn"
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
