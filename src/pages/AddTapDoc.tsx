// ========================
// AddTapDoc.tsx – Entry point (refactored)
// Tách code thành các file riêng trong ./tapdoc/
// ========================
import { useState } from 'react'
import TabDocAmTuCau from './tapdoc/Am'
import TabDoanVan from './tapdoc/Van'
import './AddTapDoc.css'

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
