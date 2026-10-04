import { useState } from 'react'
import { sidebarZones, SidebarItem } from '../data/mockData'

interface SidebarProps {
  isOpen: boolean
  activeItem: string
  onSelect: (id: string) => void
}

export default function Sidebar({ isOpen, activeItem, onSelect }: SidebarProps) {
  // Các item đang mở (tree node bất kỳ)
  const [expanded, setExpanded] = useState<string[]>(['tap-doc', 'tap-doc-phan2'])
  // Các zone đang collapsed
  const [collapsedZones, setCollapsedZones] = useState<string[]>([])

  const toggleExpand = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const toggleZone = (zoneId: string) =>
    setCollapsedZones(prev => prev.includes(zoneId) ? prev.filter(x => x !== zoneId) : [...prev, zoneId])

  // Render đệ quy – depth 0 = top-level, 1 = con, 2 = cháu
  const renderItem = (item: SidebarItem, depth = 0): React.ReactNode => {
    const hasChildren = !!item.children?.length
    const isExpanded = expanded.includes(item.id)
    const isActive   = activeItem === item.id

    if (depth === 0) {
      return (
        <div key={item.id}>
          <div
            id={`sidebar-item-${item.id}`}
            className={`sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => hasChildren ? toggleExpand(item.id) : onSelect(item.id)}
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
              style={{ maxHeight: isExpanded ? `${countLeaves(item) * 44}px` : '0' }}
            >
              {item.children!.map(child => renderItem(child, 1))}
            </div>
          )}
        </div>
      )
    }

    if (depth === 1) {
      return (
        <div key={item.id}>
          <div
            id={`sidebar-item-${item.id}`}
            className={`sidebar-subitem ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''}`}
            onClick={() => hasChildren ? toggleExpand(item.id) : onSelect(item.id)}
          >
            <span>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {hasChildren && (
              <span className={`sidebar-chevron sidebar-chevron-sm ${expanded.includes(item.id) ? 'open' : ''}`}>◀</span>
            )}
          </div>

          {hasChildren && (
            <div
              className="sidebar-submenu sidebar-submenu-l2"
              style={{ maxHeight: expanded.includes(item.id) ? `${item.children!.length * 40}px` : '0' }}
            >
              {item.children!.map(child => renderItem(child, 2))}
            </div>
          )}
        </div>
      )
    }

    // depth === 2: leaf
    return (
      <div
        key={item.id}
        id={`sidebar-item-${item.id}`}
        className={`sidebar-subitem sidebar-subitem-l2 ${isActive ? 'active' : ''}`}
        onClick={() => onSelect(item.id)}
      >
        <span>{item.icon}</span>
        <span>{item.label}</span>
      </div>
    )
  }

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <div className="sidebar-header">📌 Quản lý dữ liệu</div>

      {sidebarZones.map((zone, zi) => {
        const isZoneCollapsed = collapsedZones.includes(zone.zoneId)
        return (
          <div key={zone.zoneId} className="sidebar-zone">
            {/* Zone header */}
            <div
              className="sidebar-zone-header"
              onClick={() => toggleZone(zone.zoneId)}
              title={isZoneCollapsed ? 'Mở rộng' : 'Thu gọn'}
            >
              <span className="sidebar-zone-icon">{zone.zoneIcon}</span>
              <span className="sidebar-zone-label">{zone.zoneLabel}</span>
              <span className={`sidebar-chevron ${isZoneCollapsed ? '' : 'open'}`}>◀</span>
            </div>

            {/* Zone items */}
            <div
              className="sidebar-zone-body"
              style={{
                maxHeight: isZoneCollapsed ? '0' : `${countLeavesInZone(zone.items) * 48}px`,
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}
            >
              <div className="sidebar-section">
                {zone.items.map(item => renderItem(item, 0))}
              </div>
            </div>

            {/* Divider giữa các zone (trừ zone cuối) */}
            {zi < sidebarZones.length - 1 && <div className="sidebar-divider" />}
          </div>
        )
      })}

      {/* Hệ thống */}
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

// Đếm số node lá để tính maxHeight cho animation
function countLeaves(item: SidebarItem): number {
  if (!item.children?.length) return 1
  return item.children.reduce((sum, c) => sum + countLeaves(c), 0)
}

function countLeavesInZone(items: SidebarItem[]): number {
  return items.reduce((sum, item) => sum + countLeaves(item), 0)
}
