import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useSider } from './sider-context'

interface SiderNavProps {
  children: ReactNode
  className?: string
}

export function SiderNav({ children, className }: SiderNavProps) {
  return (
    <nav className={cn('py-3', className)}>
      {children}
    </nav>
  )
}

interface SiderNavGroupProps {
  label: string
  children: ReactNode
}

/**
 * The group header is a fixed-height slot (h-5 + mb-1) in BOTH states so the
 * items below never shift when the Sider collapses: expanded shows the label,
 * collapsed shows a horizontal line vertically centred in the same slot.
 */
export function SiderNavGroup({ label, children }: SiderNavGroupProps) {
  const { collapsed } = useSider()
  return (
    <div className="mb-4">
      <div data-slot="sider-group-header" className="h-5 mb-1 flex items-center overflow-hidden">
        {collapsed ? (
          <>
            <span className="sr-only">{label}</span>
            <div aria-hidden="true" data-slot="sider-group-line" className="mx-3 w-full border-t border-border-subtle" />
          </>
        ) : (
          <p className="px-4 text-[10px] leading-none font-semibold uppercase tracking-widest text-fg-disabled whitespace-nowrap overflow-hidden">
            {label}
          </p>
        )}
      </div>
      <ul className="space-y-0.5 px-2">
        {children}
      </ul>
    </div>
  )
}

interface SiderNavItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  badge?: ReactNode
}

export function SiderNavItem({ icon, label, active = false, onClick, badge }: SiderNavItemProps) {
  const { collapsed } = useSider()
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        className={cn(
          'flex items-center w-full h-9 rounded-[var(--base-radius)] transition-colors text-sm',
          collapsed ? 'justify-center px-2.5' : 'gap-3 px-3',
          active
            ? 'bg-primary-50 text-primary font-medium'
            : 'text-fg-muted hover:bg-surface-subtle hover:text-fg-2',
        )}
      >
        <span className="shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
            {badge && <span className="shrink-0">{badge}</span>}
          </>
        )}
      </button>
    </li>
  )
}
