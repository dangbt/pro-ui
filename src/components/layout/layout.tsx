import { useState, useEffect, useRef, createContext, useContext, type ReactNode, type CSSProperties } from 'react'
import { ChevronLeft, ChevronDown, Menu as MenuIcon, X } from 'lucide-react'
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
    <div className={cn('flex flex-col bg-canvas', className)} style={style}>
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
        'flex items-center shrink-0 bg-surface px-4 z-40',
        sticky && 'sticky top-0',
        bordered && 'border-b border-border',
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
          'flex flex-col bg-surface transition-[width,min-width] duration-300 ease-in-out shrink-0 overflow-hidden',
          bordered && 'border-r border-border',
          className,
        )}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {collapsible && (
          <div className="border-t border-border-subtle shrink-0">
            {trigger === false ? null : trigger != null ? (
              <div onClick={toggle} className="cursor-pointer">{trigger}</div>
            ) : (
              <button
                type="button"
                onClick={toggle}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className={cn(
                  'flex items-center w-full px-4 py-3 text-fg-disabled hover:bg-surface-subtle hover:text-fg-muted transition-colors',
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
        'shrink-0 bg-surface px-4 py-3',
        bordered && 'border-t border-border',
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
        <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-fg-disabled whitespace-nowrap overflow-hidden">
          {label}
        </p>
      )}
      {collapsed && <div className="mx-3 my-1 border-t border-border-subtle" />}
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

/* ── TopNav context ───────────────────────────────────────────────────────── */

export type TopNavVariant = 'pill' | 'line' | 'bold'

interface TopNavCtxValue {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  variant: TopNavVariant
  isMobilePanel: boolean
}

const TopNavCtx = createContext<TopNavCtxValue>({
  mobileOpen: false,
  setMobileOpen: () => {},
  variant: 'pill',
  isMobilePanel: false,
})

/* ── TopNav (root bar) ────────────────────────────────────────────────────── */

interface TopNavRootProps {
  children: ReactNode
  height?: number
  bordered?: boolean
  sticky?: boolean
  className?: string
  variant?: TopNavVariant
}

function TopNavRoot({
  children,
  height = 56,
  bordered = true,
  sticky = true,
  className,
  variant = 'pill',
}: TopNavRootProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <TopNavCtx.Provider value={{ mobileOpen, setMobileOpen, variant, isMobilePanel: false }}>
      <div className={cn('bg-surface z-40', sticky && 'sticky top-0')}>
        {/* Main bar */}
        <div
          style={{ height, minHeight: height }}
          className={cn(
            'flex items-center px-4 gap-2',
            bordered && 'border-b border-border',
            className,
          )}
        >
          {children}
          {/* Mobile hamburger (auto-injected) */}
          <button
            type="button"
            className="md:hidden p-1.5 rounded text-fg-muted hover:bg-surface-subtle shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile panel (below bar, same sticky block) */}
        {mobileOpen && (
          <TopNavCtx.Provider value={{ mobileOpen, setMobileOpen, variant, isMobilePanel: true }}>
            <div className={cn(
              'md:hidden bg-surface py-2 px-3',
              bordered && 'border-b border-border',
            )}>
              {children}
            </div>
          </TopNavCtx.Provider>
        )}
      </div>
    </TopNavCtx.Provider>
  )
}

/* ── TopNav.Brand ─────────────────────────────────────────────────────────── */

function TopNavBrand({ children, className }: { children: ReactNode; className?: string }) {
  const { isMobilePanel } = useContext(TopNavCtx)
  if (isMobilePanel) return null
  return (
    <div className={cn('flex items-center gap-2 shrink-0 mr-1', className)}>
      {children}
    </div>
  )
}

/* ── TopNav.Actions ───────────────────────────────────────────────────────── */

function TopNavActions({ children, className }: { children: ReactNode; className?: string }) {
  const { isMobilePanel } = useContext(TopNavCtx)
  if (isMobilePanel) return null
  return (
    <div className={cn('flex items-center gap-2 ml-auto shrink-0', className)}>
      {children}
    </div>
  )
}

/* ── TopNav.Menu ──────────────────────────────────────────────────────────── */

function TopNavMenu({ children, className }: { children: ReactNode; className?: string }) {
  const { isMobilePanel } = useContext(TopNavCtx)

  if (isMobilePanel) {
    return (
      <nav className={cn('flex flex-col gap-0.5 w-full', className)}>
        {children}
      </nav>
    )
  }
  return (
    <nav className={cn('hidden md:flex items-center gap-0.5 flex-1', className)}>
      {children}
    </nav>
  )
}

/* ── TopNav.Item ──────────────────────────────────────────────────────────── */

export type TopNavDropdownEntry =
  | { label: string; onClick?: () => void; icon?: ReactNode; danger?: boolean; divider?: never }
  | { divider: true }

interface TopNavItemProps {
  label: string
  icon?: ReactNode
  active?: boolean
  onClick?: () => void
  items?: TopNavDropdownEntry[]
  badge?: ReactNode
}

function TopNavItem({ label, icon, active, onClick, items, badge }: TopNavItemProps) {
  const { variant, isMobilePanel } = useContext(TopNavCtx)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const hasItems = !!items?.length

  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  const handleClick = () => {
    if (hasItems) setOpen(o => !o)
    else onClick?.()
  }

  /* Mobile: vertical accordion */
  if (isMobilePanel) {
    return (
      <div>
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-[var(--base-radius)] transition-colors',
            active
              ? 'bg-primary-50 text-primary font-medium'
              : 'text-fg-muted hover:bg-surface-subtle hover:text-fg-2',
          )}
        >
          {icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>}
          <span className="flex-1 text-left">{label}</span>
          {badge && <span className="shrink-0">{badge}</span>}
          {hasItems && (
            <ChevronDown className={cn('w-3.5 h-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
          )}
        </button>
        {hasItems && open && (
          <div className="pl-8 py-1 flex flex-col gap-0.5">
            {items!.map((item, i) =>
              'divider' in item && item.divider
                ? <div key={i} className="my-1 border-t border-border-subtle" />
                : (
                  <button key={i} type="button"
                    onClick={() => { (item as any).onClick?.(); setOpen(false) }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm rounded-[var(--base-radius)] text-left w-full transition-colors',
                      (item as any).danger ? 'text-danger hover:bg-danger-50' : 'text-fg-2 hover:bg-surface-subtle',
                    )}
                  >
                    {(item as any).icon && <span className="w-4 h-4">{(item as any).icon}</span>}
                    {(item as any).label}
                  </button>
                )
            )}
          </div>
        )}
      </div>
    )
  }

  /* Desktop: horizontal */
  const pillActive   = 'bg-primary-50 text-primary font-medium rounded-[var(--base-radius)]'
  const boldActive   = 'text-primary font-semibold'
  const inactivePill = 'text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-[var(--base-radius)]'
  const inactiveLine = 'border-transparent text-fg-muted hover:text-fg-2'
  const activeLine   = 'border-primary text-primary font-medium'

  return (
    <div
      ref={ref}
      className={cn('relative', variant === 'line' && 'h-full flex items-end')}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex items-center gap-1.5 text-sm whitespace-nowrap transition-colors',
          variant === 'line'
            ? cn('px-3 h-full -mb-px border-b-2 rounded-none', active ? activeLine : inactiveLine)
            : cn('px-3 py-1.5', active
                ? (variant === 'bold' ? boldActive : pillActive)
                : inactivePill),
        )}
      >
        {icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>}
        <span>{label}</span>
        {badge && <span className="shrink-0">{badge}</span>}
        {hasItems && (
          <ChevronDown className={cn('w-3 h-3 shrink-0 transition-transform', open && 'rotate-180')} />
        )}
      </button>

      {hasItems && open && (
        <div className="absolute top-full left-0 mt-1 min-w-[168px] bg-surface-raised border border-border rounded-[var(--base-radius)] shadow-lg py-1 z-50">
          {items!.map((item, i) =>
            'divider' in item && item.divider
              ? <div key={i} className="my-1 border-t border-border-subtle mx-1" />
              : (
                <button key={i} type="button"
                  onClick={() => { (item as any).onClick?.(); setOpen(false) }}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left transition-colors',
                    (item as any).danger ? 'text-danger hover:bg-danger-50' : 'text-fg-2 hover:bg-surface-subtle',
                  )}
                >
                  {(item as any).icon && <span className="w-4 h-4 shrink-0">{(item as any).icon}</span>}
                  {(item as any).label}
                </button>
              )
          )}
        </div>
      )}
    </div>
  )
}

/* ── TopNav.Sub (secondary tab bar) ──────────────────────────────────────── */

interface TopNavSubProps {
  children: ReactNode
  height?: number
  bordered?: boolean
  sticky?: boolean
  stickyTop?: number
  className?: string
}

function TopNavSub({
  children,
  height = 40,
  bordered = true,
  sticky = true,
  stickyTop = 56,
  className,
}: TopNavSubProps) {
  return (
    <div
      style={{ height, minHeight: height, top: sticky ? stickyTop : undefined }}
      className={cn(
        'flex items-stretch bg-surface px-4 gap-0.5 z-30',
        sticky && 'sticky',
        bordered && 'border-b border-border-subtle',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface TopNavSubItemProps {
  label: string
  active?: boolean
  onClick?: () => void
  icon?: ReactNode
  badge?: ReactNode
}

function TopNavSubItem({ label, active, onClick, icon, badge }: TopNavSubItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 h-full text-sm border-b-2 transition-colors whitespace-nowrap',
        active
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-fg-muted hover:text-fg-2 hover:border-border',
      )}
    >
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      <span>{label}</span>
      {badge && <span className="shrink-0">{badge}</span>}
    </button>
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
  TopNav: Object.assign(TopNavRoot, {
    Brand:   TopNavBrand,
    Menu:    TopNavMenu,
    Item:    TopNavItem,
    Actions: TopNavActions,
    Sub:     Object.assign(TopNavSub, { Item: TopNavSubItem }),
  }),
})
