import { cn } from '../lib/cn'

type BadgeColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: React.ReactNode
  color?: BadgeColor
  className?: string
}

const colorCls: Record<BadgeColor, string> = {
  default:  'bg-gray-100    text-gray-600',
  primary:  'bg-primary-100 text-primary-700',
  success:  'bg-success-100 text-success-700',
  warning:  'bg-warning-100 text-warning-700',
  danger:   'bg-danger-100  text-danger-700',
  info:     'bg-info-100    text-info-700',
}

export function Badge({ children, color = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-[var(--base-radius)]',
        colorCls[color],
        className,
      )}
    >
      {children}
    </span>
  )
}
