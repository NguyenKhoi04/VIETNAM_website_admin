import { useState } from 'react'
import { sidebarMenu, SidebarItem } from '../data/mockData'

interface SidebarProps {
  isOpen: boolean
  activeItem: string
  onSelect: (id: string) => void
}

export default function Sidebar({ isOpen, activeItem, onSelect }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['ky-nang'])

  const toggleExpand = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const renderItem = (item: SidebarItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const isActive = activeItem === item.id

    if (depth > 0) {
      return (
        <div
          key={item.id}
          id={`sidebar-item-${item.id}`}
          className={`sidebar-subitem ${isActive ? 'active' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      )
    }

    return (
      <div key={item.id}>
        <div
          id={`sidebar-item-${item.id}`}
          className={`sidebar-item ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id)
            } else {
              onSelect(item.id)
            }
          }}
        >
          <span className="sidebar-item-icon">{item.icon}</span>
          <span className="sidebar-item-label">{item.label}</span>
          {hasChildren && (
            <span className={`sidebar-chevron ${isExpanded ? 'open' : ''}`}>◀</span>
          )}
        </div>

        {hasChildren && (
          <div
            className="sidebar-submenu"
            style={{ maxHeight: isExpanded ? `${item.children!.length * 44}px` : '0' }}
          >
            {item.children!.map(child => renderItem(child, 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">
        📌 Quản lý dữ liệu
      </div>
      <div className="sidebar-section">
        {sidebarMenu.map(item => renderItem(item))}
      </div>

      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <div className="sidebar-section-title">Hệ thống</div>
        <div
          id="sidebar-item-settings"
          className={`sidebar-item ${activeItem === 'settings' ? 'active' : ''}`}
          onClick={() => onSelect('settings')}
        >
          <span className="sidebar-item-icon">⚙️</span>
          <span className="sidebar-item-label">Cài đặt</span>
        </div>
        <div
          id="sidebar-item-reports"
          className={`sidebar-item ${activeItem === 'reports' ? 'active' : ''}`}
          onClick={() => onSelect('reports')}
        >
          <span className="sidebar-item-icon">📈</span>
          <span className="sidebar-item-label">Báo cáo</span>
        </div>
      </div>
    </aside>
  )
}
