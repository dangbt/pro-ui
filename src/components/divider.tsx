import { cn } from '../lib/cn'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px bg-border self-stretch', className)}
      />
    )
  }

  if (label) {
    return (
      <div role="separator" className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-fg-muted font-medium">{label}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    )
  }

  return (
    <hr
      role="separator"
      className={cn('border-0 border-t border-border', className)}
    />
  )
}
