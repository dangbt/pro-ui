import { cn } from '../lib/cn'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rect' | 'circle'
  lines?: number
  className?: string
}

export function Skeleton({
  width,
  height,
  variant = 'rect',
  lines = 1,
  className,
}: SkeletonProps) {
  const base = cn(
    'bg-gray-200 animate-pulse',
    variant === 'circle' ? 'rounded-full' : 'rounded-[var(--base-radius)]',
    variant === 'text' && 'rounded',
    className,
  )

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(base, 'h-4')}
            style={{ width: i === lines - 1 ? '66%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={base}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : (height ?? (variant === 'text' ? '16px' : '40px')),
      }}
    />
  )
}
