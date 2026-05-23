import { useState } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '../lib/cn'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  closable?: boolean
  icon?: boolean
  className?: string
}

const styles: Record<AlertVariant, { bg: string; border: string; title: string; text: string }> = {
  info:    { bg: 'bg-info-50',    border: 'border-info-200',    title: 'text-info-800',    text: 'text-info-700'    },
  success: { bg: 'bg-success-50', border: 'border-success-200', title: 'text-success-800', text: 'text-success-700' },
  warning: { bg: 'bg-warning-50', border: 'border-warning-200', title: 'text-warning-800', text: 'text-warning-700' },
  danger:  { bg: 'bg-danger-50',  border: 'border-danger-200',  title: 'text-danger-800',  text: 'text-danger-700'  },
}

const icons: Record<AlertVariant, React.ReactNode> = {
  info:    <Info         className="w-4 h-4 shrink-0 mt-0.5" />,
  success: <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />,
  danger:  <XCircle      className="w-4 h-4 shrink-0 mt-0.5" />,
}

export function Alert({
  variant = 'info',
  title,
  children,
  closable = false,
  icon = true,
  className,
}: AlertProps) {
  const [visible, setVisible] = useState(true)
  const s = styles[variant]

  if (!visible) return null

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 px-4 py-3 border text-sm rounded-[var(--base-radius)]',
        s.bg,
        s.border,
        className,
      )}
    >
      {icon && <span className={s.title}>{icons[variant]}</span>}
      <div className="flex-1">
        {title && <div className={cn('font-semibold mb-0.5', s.title)}>{title}</div>}
        <div className={s.text}>{children}</div>
      </div>
      {closable && (
        <button
          onClick={() => setVisible(false)}
          className={cn('shrink-0 mt-0.5 hover:opacity-70 transition-opacity', s.text)}
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
