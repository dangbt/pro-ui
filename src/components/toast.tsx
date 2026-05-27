import { useSyncExternalStore, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '../lib/cn'

// ─── Types ──────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  title?: string
  variant?: ToastVariant
  /** Duration in ms. 0 = persistent. Default: 4000 (error: 5000) */
  duration?: number
}

interface ToastItem extends Required<ToastOptions> {
  id: string
  message: string
}

// ─── Store (singleton — works outside React tree) ───────────────────────────

type Listener = () => void

const listeners = new Set<Listener>()
let items: ToastItem[] = []

function notify() {
  listeners.forEach(fn => fn())
}

function addToast(message: string, opts: ToastOptions = {}): string {
  const id = Math.random().toString(36).slice(2, 9)
  const variant = opts.variant ?? 'info'
  const duration = opts.duration ?? (variant === 'error' ? 5000 : 4000)
  items = [...items, { id, message, title: opts.title ?? '', variant, duration }]
  notify()
  return id
}

function removeToast(id: string) {
  items = items.filter(t => t.id !== id)
  notify()
}

function subscribe(fn: Listener) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot() {
  return items
}

// ─── Public API (call without hooks, e.g. in API error handlers) ─────────────

/** Trigger a toast from anywhere — inside or outside React tree. */
export const toast = {
  success: (message: string, opts?: Omit<ToastOptions, 'variant'>) =>
    addToast(message, { ...opts, variant: 'success' }),
  error: (message: string, opts?: Omit<ToastOptions, 'variant'>) =>
    addToast(message, { ...opts, variant: 'error' }),
  warning: (message: string, opts?: Omit<ToastOptions, 'variant'>) =>
    addToast(message, { ...opts, variant: 'warning' }),
  info: (message: string, opts?: Omit<ToastOptions, 'variant'>) =>
    addToast(message, { ...opts, variant: 'info' }),
  custom: (message: string, opts?: ToastOptions) => addToast(message, opts),
  dismiss: (id: string) => removeToast(id),
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/** Access the toast API inside React components. */
export function useToast() {
  return { toast }
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, {
  bg: string; border: string; title: string; text: string; icon: string
}> = {
  success: { bg: 'bg-success-50', border: 'border-success-200', title: 'text-success-800', text: 'text-success-700', icon: 'text-success-600' },
  error:   { bg: 'bg-danger-50',  border: 'border-danger-200',  title: 'text-danger-800',  text: 'text-danger-700',  icon: 'text-danger-600'  },
  warning: { bg: 'bg-warning-50', border: 'border-warning-200', title: 'text-warning-800', text: 'text-warning-700', icon: 'text-warning-600' },
  info:    { bg: 'bg-info-50',    border: 'border-info-200',    title: 'text-info-800',    text: 'text-info-700',    icon: 'text-info-600'    },
}

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2  className="w-4 h-4 shrink-0" />,
  error:   <XCircle       className="w-4 h-4 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
  info:    <Info          className="w-4 h-4 shrink-0" />,
}

// ─── ToastItem component ──────────────────────────────────────────────────────

function ToastEntry({ item }: { item: ToastItem }) {
  const [visible, setVisible] = useState(false)
  const s = variantStyles[item.variant]

  // mount animation
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // auto-dismiss
  useEffect(() => {
    if (item.duration === 0) return
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => removeToast(item.id), 300) // wait for exit animation
    }, item.duration)
    return () => clearTimeout(timer)
  }, [item.id, item.duration])

  function dismiss() {
    setVisible(false)
    setTimeout(() => removeToast(item.id), 300)
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex gap-3 px-4 py-3 border text-sm rounded-[var(--base-radius)] shadow-lg w-80 max-w-[calc(100vw-2rem)]',
        'transition-all duration-300 ease-in-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        s.bg, s.border,
      )}
    >
      <span className={cn('mt-0.5', s.icon)}>{variantIcons[item.variant]}</span>
      <div className="flex-1 min-w-0">
        {item.title && (
          <div className={cn('font-semibold mb-0.5 truncate', s.title)}>{item.title}</div>
        )}
        <div className={cn('break-words', s.text)}>{item.message}</div>
      </div>
      <button
        onClick={dismiss}
        className={cn('shrink-0 mt-0.5 hover:opacity-60 transition-opacity cursor-pointer', s.text)}
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  /** Screen corner where toasts appear. Default: 'bottom-right' */
  position?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'
}

const positionCls: Record<NonNullable<ToastProviderProps['position']>, string> = {
  'top-left':      'top-4 left-4 items-start',
  'top-right':     'top-4 right-4 items-end',
  'top-center':    'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-left':   'bottom-4 left-4 items-start',
  'bottom-right':  'bottom-4 right-4 items-end',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
}

/**
 * Mount once at your app root — renders toasts in a portal.
 *
 * @example
 * ```tsx
 * // main.tsx / layout.tsx
 * <ToastProvider position="bottom-right" />
 * ```
 */
export function ToastProvider({ position = 'bottom-right' }: ToastProviderProps) {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  if (typeof document === 'undefined') return null // SSR guard

  return createPortal(
    <div
      aria-label="Notifications"
      className={cn(
        'fixed z-[9999] flex flex-col gap-2 pointer-events-none',
        positionCls[position],
      )}
    >
      {toasts.map(item => (
        <div key={item.id} className="pointer-events-auto">
          <ToastEntry item={item} />
        </div>
      ))}
    </div>,
    document.body,
  )
}
