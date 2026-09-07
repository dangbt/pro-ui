import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { useClickOutside } from '../../lib/use-click-outside'

type Anchor = 'left' | 'right'

interface PortalMenuProps {
  /** Whether the menu is open. */
  open: boolean
  /** Called to close the menu (outside click, Escape). */
  onClose: () => void
  /** The element the menu is anchored to and measured against. */
  triggerRef: RefObject<HTMLElement | null>
  /**
   * Which horizontal edge the menu aligns to:
   * - `left`  → menu's left edge tracks the trigger's left edge.
   * - `right` → menu's right edge tracks the trigger's right edge.
   */
  anchor?: Anchor
  className?: string
  children: ReactNode
}

/**
 * Shared floating menu used by ProTable's portal dropdowns (column-visibility
 * toolbar menu and per-column pin menu). Owns:
 *
 * - trigger measurement via `getBoundingClientRect`,
 * - portal rendering to `document.body` with `data-react-aria-top-layer` and
 *   `zIndex: 9999`,
 * - outside-click close (through the shared `useClickOutside` hook),
 * - repositioning on window `scroll` (capture phase, so it also tracks scrolling
 *   ancestor containers such as a `sticky`/`maxHeight` table) and on `resize`,
 * - `Escape` to close and return focus to the trigger.
 *
 * Internal to ProTable — not exported from the components barrel.
 */
export function PortalMenu({
  open,
  onClose,
  triggerRef,
  anchor = 'left',
  className,
  children,
}: PortalMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number }>({
    top: 0,
  })

  const reposition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    if (anchor === 'right') {
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
    } else {
      setPos({ top: rect.bottom + 4, left: rect.left })
    }
  }, [anchor, triggerRef])

  useClickOutside([menuRef, triggerRef], onClose, open)

  // Measure synchronously before paint so the menu never flashes at a stale spot.
  useLayoutEffect(() => {
    if (open) reposition()
  }, [open, reposition])

  // Keep the menu glued to its trigger while open. Capture-phase scroll catches
  // scrolling ancestor containers; both listeners are passive and only attached
  // while open.
  useEffect(() => {
    if (!open) return
    const onScroll = () => reposition()
    const onResize = () => reposition()
    window.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onResize)
    }
  }, [open, reposition])

  // Escape closes and returns focus to the trigger.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose, triggerRef])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={menuRef}
      data-react-aria-top-layer
      className={className}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        right: pos.right,
        zIndex: 9999,
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
