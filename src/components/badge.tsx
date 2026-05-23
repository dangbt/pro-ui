import { cn } from '../lib/cn'

type BadgeColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  color?: BadgeColor
  size?: BadgeSize
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

const sizeCls: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-px   text-[10px]',
  md: 'px-2   py-0.5  text-xs',
  lg: 'px-2.5 py-1    text-sm',
}

export function Badge({ children, color = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-[var(--base-radius)]',
        colorCls[color],
        sizeCls[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
