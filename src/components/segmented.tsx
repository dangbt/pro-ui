import { cn } from '../lib/cn'

interface SegmentedOption {
  label: React.ReactNode
  value: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface SegmentedProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  className?: string
}

const sizeCls = {
  sm: 'h-7 text-xs px-2.5 gap-1',
  md: 'h-8 text-sm px-3 gap-1.5',
  lg: 'h-9 text-base px-4 gap-2',
}

export function Segmented({ options, value, onChange, size = 'md', block, className }: SegmentedProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'inline-flex items-center bg-surface-subtle border border-border rounded-full p-0.5 gap-0.5',
        block && 'flex w-full',
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          type="button"
          aria-checked={value === opt.value}
          disabled={opt.disabled}
          onClick={() => onChange(opt.value)}
          className={cn(
            'inline-flex items-center justify-center font-medium rounded-full transition-all cursor-pointer select-none',
            sizeCls[size],
            block && 'flex-1',
            value === opt.value
              ? 'bg-surface text-fg shadow-sm'
              : 'text-fg-muted hover:text-fg',
            opt.disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {opt.icon && <span className="shrink-0">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
