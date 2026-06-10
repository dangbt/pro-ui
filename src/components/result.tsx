import { cn } from '../lib/cn'
import type { ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, FileQuestion, ShieldX, ServerCrash } from 'lucide-react'

type Status = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'

interface ResultProps {
  status: Status
  title: ReactNode
  subtitle?: ReactNode
  extra?: ReactNode
  icon?: ReactNode
  className?: string
}

const statusConfig: Record<Status, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-success-500' },
  error: { icon: XCircle, color: 'text-danger-500' },
  info: { icon: Info, color: 'text-info-500' },
  warning: { icon: AlertTriangle, color: 'text-warning-500' },
  '404': { icon: FileQuestion, color: 'text-fg-muted' },
  '403': { icon: ShieldX, color: 'text-warning-500' },
  '500': { icon: ServerCrash, color: 'text-danger-500' },
}

export function Result({ status, title, subtitle, extra, icon, className }: ResultProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn('flex flex-col items-center py-12 px-6 text-center', className)}>
      <div className={cn('mb-4', config.color)}>
        {icon ?? <Icon size={64} />}
      </div>
      <h3 className="text-xl font-semibold text-fg mb-2">{title}</h3>
      {subtitle && <p className="text-fg-muted mb-6">{subtitle}</p>}
      {extra && <div className="flex gap-2 mt-4">{extra}</div>}
    </div>
  )
}
