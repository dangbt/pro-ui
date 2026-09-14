import { useRef, useState, type ReactNode } from 'react'
import { RefreshCw, Columns3 } from 'lucide-react'
import { Button } from '../button'
import { PortalMenu } from './portal-menu'
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
  const triggerRef = useRef<HTMLButtonElement>(null)

  const hideable = columns.filter(c => c.canHide)
  if (!hideable.length) return null

  return (
    <div className="relative">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        onPress={() => setOpen(v => !v)}
        aria-label="Toggle columns"
      >
        <Columns3 className="w-4 h-4" />
      </Button>
      <PortalMenu
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
        anchor="right"
        className="min-w-[160px] rounded-[var(--base-radius)] border border-border bg-surface shadow-lg py-1"
      >
        <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-fg-disabled">Columns</p>
        {hideable.map(col => (
          <label
            key={col.id}
            className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-fg-2 hover:bg-surface-subtle cursor-pointer select-none"
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
      </PortalMenu>
    </div>
  )
}

export function Toolbar({ title, actions, onRefresh, columnToggles }: ToolbarProps) {
  const hasContent = title || actions?.length || onRefresh || columnToggles?.length
  if (!hasContent) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 px-4 py-3 border-b border-border">
      <h3 className="text-sm font-semibold text-fg-2">{title ?? ''}</h3>
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
