import {
  ProgressBar as RAProgressBar,
  Label,
  type ProgressBarProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'

interface ProgressBarProps_ extends Omit<ProgressBarProps, 'className'> {
  label?: string
  showValue?: boolean
  variant?: ProgressVariant
  size?: 'sm' | 'md'
  className?: string
}

const trackColorMap: Record<ProgressVariant, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

export function ProgressBar({
  label,
  showValue = false,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ProgressBarProps_) {
  return (
    <RAProgressBar {...props} className={cn('w-full', className)}>
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {(label || showValue) && (
            <div className="flex justify-between mb-1.5">
              {label && <Label className="text-xs font-medium text-fg-muted">{label}</Label>}
              {showValue && <span className="text-xs text-fg-muted tabular-nums">{valueText}</span>}
            </div>
          )}
          <div
            className={cn(
              'w-full bg-surface-subtle overflow-hidden rounded-full',
              size === 'sm' ? 'h-1.5' : 'h-2.5',
            )}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                trackColorMap[variant],
                isIndeterminate && 'animate-[progress-indeterminate_1.5s_ease-in-out_infinite] w-1/3',
              )}
              style={!isIndeterminate ? { width: `${percentage ?? 0}%` } : undefined}
            />
          </div>
        </>
      )}
    </RAProgressBar>
  )
}
