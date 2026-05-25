import { useRef, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { RefreshCw, Columns3 } from 'lucide-react'
import { Button } from '../button'
import { cn } from '../../lib/cn'
import type { Column } from '@tanstack/react-table'

interface ColumnToggleItem {
  id: string
  label: string
  canHide: boolean
  isVisible: boolean
  toggle: () => void
}

interface ToolbarProps {
  title?: string
  actions?: ReactNode[]
  onRefresh?: () => void
  columnToggles?: ColumnToggleItem[]
}

function ColumnsPopover({ columns }: { columns: ColumnToggleItem[] }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const hideable = columns.filter(c => c.canHide)
  if (!hideable.length) return null

  const handleOpen = () => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    setOpen(v => !v)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Button variant="ghost" size="sm" onPress={handleOpen} aria-label="Toggle columns">
        <Columns3 className="w-4 h-4" />
      </Button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="fixed min-w-[160px] rounded-[var(--base-radius)] border border-border bg-white shadow-lg py-1"
          style={{ top: pos.top, right: pos.right, zIndex: 9999 }}
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Columns</p>
          {hideable.map(col => (
            <label
              key={col.id}
              className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={col.isVisible}
                onChange={col.toggle}
                className="w-3.5 h-3.5 accent-primary rounded"
              />
              {col.label}
            </label>
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

export function Toolbar({ title, actions, onRefresh, columnToggles }: ToolbarProps) {
  const hasContent = title || actions?.length || onRefresh || columnToggles?.length
  if (!hasContent) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-3 border-b border-border">
      <h3 className="text-sm font-semibold text-gray-800">{title ?? ''}</h3>
      <div className="flex items-center gap-2">
        {actions?.map((action, i) => (
          <span key={i}>{action}</span>
        ))}
        {columnToggles && <ColumnsPopover columns={columnToggles} />}
        {onRefresh && (
          <Button variant="ghost" size="sm" onPress={onRefresh} aria-label="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Utility to build column toggles from tanstack table columns
export function buildColumnToggles<T>(
  columns: Column<T, unknown>[],
): ColumnToggleItem[] {
  return columns
    .filter(col => col.id !== 'select')
    .map(col => ({
      id: col.id,
      label: typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id,
      canHide: col.getCanHide(),
      isVisible: col.getIsVisible(),
      toggle: () => col.toggleVisibility(),
    }))
}

export { cn }
