import { cn } from '../lib/cn'
import { Children, type ReactNode } from 'react'

/* ─── TimelineItem ─── */
interface TimelineItemProps {
  color?: string
  dot?: ReactNode
  label?: ReactNode
  className?: string
  children?: ReactNode
}

export function TimelineItem(_props: TimelineItemProps) {
  return null // rendered by parent
}

/* ─── Timeline ─── */
interface TimelineProps {
  mode?: 'left' | 'right' | 'alternate'
  pending?: ReactNode
  className?: string
  children?: ReactNode
}

export function Timeline({ mode = 'left', pending, className, children }: TimelineProps) {
  const items = Children.toArray(children).filter(
    (child): child is React.ReactElement<TimelineItemProps> =>
      typeof child === 'object' && child !== null && 'type' in child && (child as any).type === TimelineItem,
  )

  const allItems = pending
    ? [...items, { props: { children: pending, color: 'muted' } } as unknown as React.ReactElement<TimelineItemProps>]
    : items

  return (
    <div className={cn('relative', className)}>
      {allItems.map((item, i) => {
        const { color = 'primary', dot, label, className: itemCls, children: content } = item.props
        const isLast = i === allItems.length - 1
        const isRight = mode === 'right' || (mode === 'alternate' && i % 2 === 1)

        const dotColor = color === 'primary' ? 'bg-primary' : color === 'muted' ? 'bg-fg-muted' : undefined
        const dotStyle = !dotColor ? { backgroundColor: color } : undefined

        return (
          <div
            key={i}
            className={cn(
              'relative flex gap-3 pb-6',
              isRight && 'flex-row-reverse text-right',
              isLast && 'pb-0',
              itemCls,
            )}
          >
            {/* Line + Dot */}
            <div className="flex flex-col items-center">
              {dot ?? (
                <div
                  className={cn('w-3 h-3 rounded-full shrink-0 mt-1', dotColor)}
                  style={dotStyle}
                />
              )}
              {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-fg text-sm">{content}</div>
              {label && <div className="text-fg-muted text-xs mt-0.5">{label}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
