import { Meter as RAMeter, Label, type MeterProps } from 'react-aria-components'
import { cn } from '../lib/cn'

type MeterVariant = 'auto' | 'primary' | 'success' | 'warning' | 'danger'

interface MeterProps_ extends Omit<MeterProps, 'className'> {
  label?: string
  showValue?: boolean
  variant?: MeterVariant
  size?: 'sm' | 'md'
  className?: string
}

const trackColorMap: Record<Exclude<MeterVariant, 'auto'>, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

function autoVariant(pct: number): Exclude<MeterVariant, 'auto'> {
  if (pct < 50) return 'success'
  if (pct < 80) return 'warning'
  return 'danger'
}

export function Meter({
  label,
  showValue = true,
  variant = 'auto',
  size = 'md',
  className,
  ...props
}: MeterProps_) {
  return (
    <RAMeter {...props} className={cn('w-full', className)}>
      {({ percentage, valueText }) => {
        const resolved = variant === 'auto' ? autoVariant(percentage ?? 0) : variant
        return (
          <>
            {(label || showValue) && (
              <div className="flex justify-between mb-1.5">
                {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
                {showValue && <span className="text-xs text-gray-500 tabular-nums">{valueText}</span>}
              </div>
            )}
            <div className={cn('w-full bg-gray-200 overflow-hidden rounded-full', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
              <div
                className={cn('h-full rounded-full transition-all duration-500', trackColorMap[resolved])}
                style={{ width: `${percentage ?? 0}%` }}
              />
            </div>
          </>
        )
      }}
    </RAMeter>
  )
}
