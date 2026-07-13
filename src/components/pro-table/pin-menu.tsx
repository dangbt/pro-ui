import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Pin, PinOff } from 'lucide-react'
import type { Column } from '@tanstack/react-table'
import { cn } from '../../lib/cn'
import { useClickOutside } from '../../lib/use-click-outside'

export function PinMenu<T>({ column }: { column: Column<T, unknown> }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pinned = column.getIsPinned()

  useClickOutside([menuRef, triggerRef], () => setOpen(false), open)

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 4, left: rect.left })
    setOpen(v => !v)
  }

  return (
    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          'flex items-center rounded p-0.5 transition-colors',
          pinned
            ? 'text-primary hover:text-primary-600'
            : 'text-fg-disabled hover:text-fg-2',
        )}
        title={pinned ? 'Pinned' : 'Pin column'}
      >
        {pinned ? <Pin className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          data-react-aria-top-layer
          className="fixed min-w-[120px] rounded-[var(--base-radius)] border border-border bg-surface shadow-lg py-1"
          style={{ top: pos.top, left: pos.left, zIndex: 9999 }}
        >
          {pinned !== 'left' && (
            <button
              type="button"
              onClick={() => { column.pin('left'); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-fg-2 hover:bg-surface-subtle text-left"
            >
              <Pin className="w-3 h-3 rotate-45" /> Pin left
            </button>
          )}
          {pinned !== 'right' && (
            <button
              type="button"
              onClick={() => { column.pin('right'); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-fg-2 hover:bg-surface-subtle text-left"
            >
              <Pin className="w-3 h-3 -rotate-45" /> Pin right
            </button>
          )}
          {pinned && (
            <button
              type="button"
              onClick={() => { column.pin(false); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-fg-2 hover:bg-surface-subtle text-left"
            >
              <PinOff className="w-3 h-3" /> Unpin
            </button>
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}

export function getPinnedStyle(column: Column<unknown, unknown>) {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined
  return {
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
  }
}

export function getPinnedCls(pinned: false | 'left' | 'right', bg: string) {
  if (!pinned) return ''
  return cn(
    `sticky z-[1] ${bg}`,
    pinned === 'left' && 'shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]',
    pinned === 'right' && 'shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.08)]',
  )
}
