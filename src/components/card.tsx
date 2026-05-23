import { cn } from '../lib/cn'

interface CardProps {
  title?: React.ReactNode
  extra?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  padding?: boolean
  shadow?: boolean
  className?: string
}

export function Card({
  title,
  extra,
  children,
  footer,
  padding = true,
  shadow = false,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-[var(--base-radius)] overflow-hidden',
        shadow && 'shadow-sm',
        className,
      )}
    >
      {(title || extra) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          {title && <div className="text-sm font-semibold text-gray-800">{title}</div>}
          {extra && <div className="text-sm text-gray-500">{extra}</div>}
        </div>
      )}
      <div className={cn(padding && 'px-5 py-4')}>{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  )
}
