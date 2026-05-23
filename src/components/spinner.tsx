import { cn } from '../lib/cn'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'
type SpinnerVariant = 'primary' | 'white' | 'gray'

interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  label?: string
  className?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

const variantMap: Record<SpinnerVariant, string> = {
  primary: 'border-primary-200 border-t-primary',
  white:   'border-white/30 border-t-white',
  gray:    'border-gray-200 border-t-gray-500',
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  label,
  className,
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label ?? 'Loading'}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span
        className={cn(
          'animate-spin rounded-full shrink-0',
          sizeMap[size],
          variantMap[variant],
        )}
      />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </span>
  )
}
