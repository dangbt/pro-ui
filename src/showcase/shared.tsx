import { cn } from '../lib/cn'

export function Demo({
  label,
  children,
  className,
  wrapperClassName,
  center = true,
}: {
  label: string
  children: React.ReactNode
  className?: string
  /** Applied to the outer wrapper — use for col-span, row-span, etc. */
  wrapperClassName?: string
  center?: boolean
}) {
  return (
    <div className={cn('rounded-[var(--base-radius)] border border-border overflow-hidden', wrapperClassName)}>
      <div className="px-3.5 py-2 border-b border-border-subtle bg-surface-subtle/80">
        <span className="text-[11px] font-mono font-medium text-fg-disabled tracking-wide select-none">
          {label}
        </span>
      </div>
      <div className={cn('p-6 bg-surface', center && 'flex items-center justify-center', className)}>
        {children}
      </div>
    </div>
  )
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-fg mb-1">{title}</h2>
      {description && <p className="text-sm text-fg-muted">{description}</p>}
    </div>
  )
}
