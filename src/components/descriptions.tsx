import { cn } from '../lib/cn'
import { Children, isValidElement, type ReactNode } from 'react'

/* ─── DescriptionsItem ─── */
interface DescriptionsItemProps {
  label: ReactNode
  span?: number
  className?: string
  children?: ReactNode
}

export function DescriptionsItem(_props: DescriptionsItemProps) {
  return null // rendered by parent
}

/* ─── Descriptions ─── */
interface DescriptionsProps {
  title?: ReactNode
  column?: 1 | 2 | 3
  bordered?: boolean
  layout?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: ReactNode
}

const paddingCls = { sm: 'px-2 py-1', md: 'px-3 py-2', lg: 'px-4 py-3' }

export function Descriptions({
  title,
  column = 3,
  bordered = false,
  layout = 'horizontal',
  size = 'md',
  className,
  children,
}: DescriptionsProps) {
  const items = Children.toArray(children).filter(
    (child) => isValidElement(child) && (child.type as any) === DescriptionsItem,
  ) as React.ReactElement<DescriptionsItemProps>[]

  const gridCols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

  return (
    <div className={cn('text-sm', className)}>
      {title && <div className="text-fg font-semibold text-base mb-3">{title}</div>}
      <div
        className={cn(
          'grid gap-0',
          gridCols[column],
          bordered && 'border border-border rounded-[var(--base-radius)]',
        )}
      >
        {items.map((item, i) => {
          const { label, span = 1, className: itemCls, children: value } = item.props
          const style = span > 1 ? { gridColumn: `span ${span}` } : undefined
          const cellCls = cn(paddingCls[size], bordered && 'border-b border-border last:border-b-0', itemCls)

          if (layout === 'vertical') {
            return (
              <div key={i} style={style} className={cellCls}>
                <div className="text-fg-muted mb-0.5">{label}</div>
                <div className="text-fg">{value}</div>
              </div>
            )
          }
          return (
            <div key={i} style={style} className={cn(cellCls, 'flex gap-2')}>
              <span className="text-fg-muted shrink-0">{label}:</span>
              <span className="text-fg">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
