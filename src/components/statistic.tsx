import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

interface StatisticProps {
  /** Primary metric value */
  value: ReactNode
  /** Label shown above the value */
  title: ReactNode
  /** Optional prefix element (icon, currency symbol…) */
  prefix?: ReactNode
  /** Optional suffix element (unit, %, …) */
  suffix?: ReactNode
  /** Small trend badge rendered next to the value */
  trend?: {
    value: ReactNode
    direction?: 'up' | 'down' | 'neutral'
  }
  /** Additional CSS class for the root element */
  className?: string
  /** Format a numeric value — applied when `value` is a number */
  formatter?: (val: number) => ReactNode
  /** Size preset */
  size?: 'sm' | 'md' | 'lg'
}

const valueSizeCls = {
  sm: 'text-xl font-semibold',
  md: 'text-3xl font-bold',
  lg: 'text-4xl font-bold',
}

const trendCls = {
  up:      'text-success bg-success/10',
  down:    'text-danger bg-danger/10',
  neutral: 'text-gray-500 bg-gray-100',
}

const trendArrow = {
  up:      '↑',
  down:    '↓',
  neutral: '–',
}

export function Statistic({
  value,
  title,
  prefix,
  suffix,
  trend,
  className,
  formatter,
  size = 'md',
}: StatisticProps) {
  const displayValue =
    typeof value === 'number' && formatter
      ? formatter(value)
      : value

  const trendDir = trend?.direction ?? 'neutral'

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {/* Title */}
      <span className="text-sm text-gray-500">{title}</span>

      {/* Value row */}
      <div className="flex items-baseline gap-1.5 flex-wrap">
        {prefix && <span className="text-gray-400 text-sm">{prefix}</span>}
        <span className={cn('text-gray-900 tabular-nums', valueSizeCls[size])}>
          {displayValue}
        </span>
        {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full',
              trendCls[trendDir],
            )}
          >
            <span>{trendArrow[trendDir]}</span>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
