import { useState, createContext, useContext, type ReactNode, type CSSProperties } from 'react'
import { ChevronLeft } from 'lucide-react'
import { cn } from '../../lib/cn'

/* ── Sider context ────────────────────────────────────────────────────────── */

interface SiderCtxValue {
  collapsed: boolean
  collapsedWidth: number
  width: number
}

const SiderCtx = createContext<SiderCtxValue>({ collapsed: false, collapsedWidth: 64, width: 240 })

export const useSider = () => useContext(SiderCtx)

/* ── Layout (root) ────────────────────────────────────────────────────────── */

interface LayoutProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

function LayoutRoot({ children, className, style }: LayoutProps) {
  return (
    <div className={cn('flex flex-col bg-gray-50', className)} style={style}>
      {children}
    </div>
  )
}

/* ── Header ───────────────────────────────────────────────────────────────── */

interface HeaderProps {
  children: ReactNode
  className?: string
  height?: number
  bordered?: boolean
  sticky?: boolean
}

function Header({ children, className, height = 56, bordered = true, sticky = true }: HeaderProps) {
  return (
    <header
      style={{ height, minHeight: height }}
      className={cn(
        'flex items-center shrink-0 bg-white px-4 z-40',
        sticky && 'sticky top-0',
        bordered && 'border-b border-gray-200',
        className,
      )}
    >
      {children}
    </header>
  )
}

/* ── Body ─────────────────────────────────────────────────────────────────── */

function Body({ children, className }: LayoutProps) {
  return (
    <div className={cn('flex flex-1 min-h-0 overflow-hidden', className)}>
      {children}
    </div>
  )
}

/* ── Sider ────────────────────────────────────────────────────────────────── */

interface SiderProps {
  children: ReactNode
  width?: number
  collapsedWidth?: number
  collapsible?: boolean
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  className?: string
  bordered?: boolean
  trigger?: ReactNode | false
  style?: CSSProperties
}

function Sider({
  children,
  width = 240,
  collapsedWidth = 64,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapse,
  className,
  bordered = true,
  trigger,
  style,
}: SiderProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed)
  const collapsed = controlledCollapsed ?? internalCollapsed

  const toggle = () => {
    const next = !collapsed
    setInternalCollapsed(next)
    onCollapse?.(next)
  }

  const currentWidth = collapsed ? collapsedWidth : width

  return (
    <SiderCtx.Provider value={{ collapsed, collapsedWidth, width }}>
      <aside
        style={{ width: currentWidth, minWidth: currentWidth, ...style }}
        className={cn(
          'flex flex-col bg-white transition-[width,min-width] duration-300 ease-in-out shrink-0 overflow-hidden',
          bordered && 'border-r border-gray-200',
          className,
        )}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {collapsible && (
          <div className="border-t border-gray-100 shrink-0">
            {trigger === false ? null : trigger != null ? (
              <div onClick={toggle} className="cursor-pointer">{trigger}</div>
            ) : (
              <button
                type="button"
                onClick={toggle}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className={cn(
                  'flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors',
                  collapsed ? 'justify-center' : 'gap-2',
                )}
              >
                <ChevronLeft className={cn('w-4 h-4 shrink-0 transition-transform duration-300', collapsed && 'rotate-180')} />
                {!collapsed && <span className="text-xs whitespace-nowrap">Collapse</span>}
              </button>
            )}
          </div>
        )}
      </aside>
    </SiderCtx.Provider>
  )
}

/* ── Content ──────────────────────────────────────────────────────────────── */

interface ContentProps {
  children: ReactNode
  className?: string
  scrollable?: boolean
  padding?: boolean
}

function Content({ children, className, scrollable = true, padding = true }: ContentProps) {
  return (
    <main
      className={cn(
        'flex-1 min-w-0',
        scrollable && 'overflow-y-auto',
        padding && 'p-6',
        className,
      )}
    >
      {children}
    </main>
  )
}

/* ── Footer ───────────────────────────────────────────────────────────────── */

interface FooterProps {
  children: ReactNode
  className?: string
  bordered?: boolean
}

function Footer({ children, className, bordered = true }: FooterProps) {
  return (
    <footer
      className={cn(
        'shrink-0 bg-white px-4 py-3',
        bordered && 'border-t border-gray-200',
        className,
      )}
    >
      {children}
    </footer>
  )
}

/* ── SiderNav helpers ─────────────────────────────────────────────────────── */

interface SiderNavProps {
  children: ReactNode
  className?: string
}

function SiderNav({ children, className }: SiderNavProps) {
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

function SiderNavGroup({ label, children }: SiderNavGroupProps) {
  const { collapsed } = useSider()
  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap overflow-hidden">
          {label}
        </p>
      )}
      {collapsed && <div className="mx-3 my-1 border-t border-gray-100" />}
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

function SiderNavItem({ icon, label, active = false, onClick, badge }: SiderNavItemProps) {
  const { collapsed } = useSider()
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center w-full rounded-[var(--base-radius)] transition-colors text-sm',
          collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
          active
            ? 'bg-primary-50 text-primary font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
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

/* ── Compound export ──────────────────────────────────────────────────────── */

export const Layout = Object.assign(LayoutRoot, {
  Header,
  Body,
  Sider,
  Content,
  Footer,
  Nav: Object.assign(SiderNav, {
    Group: SiderNavGroup,
    Item:  SiderNavItem,
  }),
})
