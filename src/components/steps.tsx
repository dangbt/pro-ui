import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../lib/cn'

export interface StepItem {
  title: ReactNode
  description?: ReactNode
  /** Override automatic status derived from `current` */
  status?: 'wait' | 'process' | 'finish' | 'error'
  /** Custom icon for this step */
  icon?: ReactNode
}

interface StepsProps {
  /** Ordered list of step definitions */
  items: StepItem[]
  /** Zero-based index of the active step */
  current?: number
  /** Layout direction (default: 'horizontal') */
  direction?: 'horizontal' | 'vertical'
  /** Size preset (default: 'md') */
  size?: 'sm' | 'md'
  className?: string
  /** Called when a finished step is clicked */
  onChange?: (index: number) => void
}

type StepStatus = 'wait' | 'process' | 'finish' | 'error'

function resolveStatus(index: number, current: number, override?: StepStatus): StepStatus {
  if (override) return override
  if (index < current) return 'finish'
  if (index === current) return 'process'
  return 'wait'
}

const iconContainerCls: Record<StepStatus, string> = {
  finish:  'bg-primary border-primary text-white',
  process: 'bg-surface border-primary text-primary ring-2 ring-primary/20',
  wait:    'bg-surface border-border text-fg-disabled',
  error:   'bg-surface border-danger text-danger ring-2 ring-danger/20',
}

const titleCls: Record<StepStatus, string> = {
  finish:  'text-fg',
  process: 'text-primary font-semibold',
  wait:    'text-fg-disabled',
  error:   'text-danger font-semibold',
}

const connectorCls: Record<StepStatus, string> = {
  finish:  'bg-primary',
  process: 'bg-border',
  wait:    'bg-border',
  error:   'bg-border',
}

const sizeCfg = {
  sm: { dot: 'w-6 h-6 text-xs', title: 'text-xs', desc: 'text-[11px]' },
  md: { dot: 'w-8 h-8 text-sm', title: 'text-sm', desc: 'text-xs' },
}

export function Steps({
  items,
  current = 0,
  direction = 'horizontal',
  size = 'md',
  className,
  onChange,
}: StepsProps) {
  const sz = sizeCfg[size]
  const isHorizontal = direction === 'horizontal'

  return (
    <ol
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-start' : 'flex-col',
        className,
      )}
    >
      {items.map((item, index) => {
        const status = resolveStatus(index, current, item.status)
        const isLast = index === items.length - 1
        const clickable = status === 'finish' && !!onChange

        return (
          <li
            key={index}
            className={cn(
              'flex',
              isHorizontal ? 'flex-col items-center flex-1' : 'flex-row items-start',
              !isHorizontal && !isLast && 'pb-6',
            )}
          >
            {/* Icon + connector wrapper */}
            <div
              className={cn(
                'flex',
                isHorizontal ? 'flex-row items-center w-full' : 'flex-col items-center',
              )}
            >
              {/* Connector before */}
              {isHorizontal && index > 0 && (
                <div className={cn('flex-1 h-0.5', connectorCls[resolveStatus(index - 1, current, items[index - 1].status)])} />
              )}
              {!isHorizontal && index > 0 && (
                <div className={cn('w-0.5 self-center', connectorCls[resolveStatus(index - 1, current, items[index - 1].status)], 'absolute top-0 -translate-y-full h-6 hidden')} />
              )}

              {/* Step dot/icon */}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onChange(index)}
                className={cn(
                  'shrink-0 flex items-center justify-center rounded-full border-2 font-medium transition-colors',
                  sz.dot,
                  iconContainerCls[status],
                  clickable ? 'cursor-pointer' : 'cursor-default',
                )}
                aria-current={status === 'process' ? 'step' : undefined}
              >
                {item.icon ?? (
                  status === 'finish' ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  : status === 'error' ? <span>!</span>
                  : <span>{index + 1}</span>
                )}
              </button>

              {/* Connector after (horizontal) */}
              {isHorizontal && !isLast && (
                <div className={cn('flex-1 h-0.5', connectorCls[status])} />
              )}
            </div>

            {/* Vertical connector (line on the left side) */}
            {!isHorizontal && !isLast && (
              <div className={cn('w-0.5 flex-1 min-h-[1.5rem] ml-[calc(theme(space.4)-1px)] mt-1', connectorCls[status])} />
            )}

            {/* Label */}
            <div
              className={cn(
                isHorizontal ? 'text-center mt-2 px-1 w-full' : 'ml-3 pb-6',
              )}
            >
              <p className={cn('leading-tight', sz.title, titleCls[status])}>
                {item.title}
              </p>
              {item.description && (
                <p className={cn('mt-0.5 text-fg-muted', sz.desc)}>
                  {item.description}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
