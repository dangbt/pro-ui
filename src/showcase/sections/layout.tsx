import { useState } from 'react'
import {
  LayoutDashboard as IconDashboard,
  Users           as IconUsers,
  Settings        as IconSettings,
  TrendingUp      as IconAnalytics,
  Bell            as IconBell,
  FileText        as IconDocs,
  LogOut          as IconLogout,
  Package         as IconPackage,
  CreditCard      as IconBilling,
  Shield          as IconSecurity,
  UserCircle      as IconProfile,
  Globe           as IconGlobe,
  Zap             as IconZap,
  GitBranch       as IconCode,
  BookOpen        as IconBook,
  BarChart        as IconChart,
} from 'lucide-react'
import {
  Button, Badge, Avatar, Skeleton, Divider, Layout,
} from '../../components'
import { Demo, SectionHeader } from '../shared'
import { cn } from '../../lib/cn'

/* ── Shared nav data ─────────────────────────────────── */
const mainNavItems = [
  { id: 'dashboard', label: 'Dashboard',  icon: <IconDashboard className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics',  icon: <IconAnalytics className="w-4 h-4" /> },
  { id: 'users',     label: 'Users',      icon: <IconUsers className="w-4 h-4" />,   badge: <Badge size="sm" color="primary">24</Badge> },
  { id: 'docs',      label: 'Docs',       icon: <IconDocs className="w-4 h-4" /> },
  { id: 'notifs',    label: 'Alerts',     icon: <IconBell className="w-4 h-4" />,    badge: <Badge size="sm" color="danger">3</Badge> },
]
const settingsItems = [
  { id: 'settings', label: 'Settings', icon: <IconSettings className="w-4 h-4" /> },
  { id: 'logout',   label: 'Logout',   icon: <IconLogout className="w-4 h-4" /> },
]

/* ── Fake content helper ─────────────────────────────── */
function PageContent({ page }: { page: string }) {
  const stats = [
    { label: 'Total users', value: '12,430', color: 'bg-primary-50 text-primary-700' },
    { label: 'Revenue',     value: '₫480M',  color: 'bg-success-50 text-success-700' },
    { label: 'Open issues', value: '23',     color: 'bg-warning-50 text-warning-700' },
    { label: 'Uptime',      value: '99.9%',  color: 'bg-info-50 text-info-700'      },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-fg capitalize">{page}</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className={cn('rounded-[var(--base-radius)] p-3', s.color)}>
            <div className="text-xl font-bold">{s.value}</div>
            <div className="text-xs opacity-70">{s.label}</div>
          </div>
        ))}
      </div>
      <Skeleton variant="text" lines={4} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   Demo 1 — Basic TopNav (pill variant, full layout)
══════════════════════════════════════════════════════ */
function TopNavBasicDemo() {
  const [active, setActive] = useState('dashboard')
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <IconAnalytics className="w-4 h-4" /> },
    { id: 'users',     label: 'Users',     icon: <IconUsers className="w-4 h-4" />, badge: <Badge size="sm" color="primary">24</Badge> },
    { id: 'docs',      label: 'Docs',      icon: <IconDocs className="w-4 h-4" /> },
  ]
  return (
    <Layout className="h-[420px] w-full">
      <Layout.TopNav>
        <Layout.TopNav.Brand>
          <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-fg text-sm hidden sm:block">pro-ui</span>
        </Layout.TopNav.Brand>

        <Layout.TopNav.Menu>
          {items.map(item => (
            <Layout.TopNav.Item
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </Layout.TopNav.Menu>

        <Layout.TopNav.Actions>
          <button className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-subtle transition-colors relative">
            <IconBell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-danger rounded-full" />
          </button>
          <Avatar name="Alice Nguyen" size="sm" />
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      <Layout.Content>
        <PageContent page={active} />
      </Layout.Content>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════
   Demo 2 — TopNav with dropdown items
══════════════════════════════════════════════════════ */
function TopNavDropdownDemo() {
  const [active, setActive] = useState('dashboard')
  return (
    <Layout className="h-[420px] w-full">
      <Layout.TopNav>
        <Layout.TopNav.Brand>
          <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-fg text-sm hidden sm:block">pro-ui</span>
        </Layout.TopNav.Brand>

        <Layout.TopNav.Menu>
          <Layout.TopNav.Item
            label="Dashboard"
            icon={<IconDashboard className="w-4 h-4" />}
            active={active === 'dashboard'}
            onClick={() => setActive('dashboard')}
          />
          <Layout.TopNav.Item
            label="Products"
            icon={<IconPackage className="w-4 h-4" />}
            active={['products', 'inventory', 'archive'].includes(active)}
            items={[
              { label: 'All products',  icon: <IconPackage className="w-4 h-4" />,  onClick: () => setActive('products') },
              { label: 'Inventory',     icon: <IconChart className="w-4 h-4" />,    onClick: () => setActive('inventory') },
              { divider: true },
              { label: 'Archive',       icon: <IconDocs className="w-4 h-4" />,     onClick: () => setActive('archive') },
            ]}
          />
          <Layout.TopNav.Item
            label="Users"
            icon={<IconUsers className="w-4 h-4" />}
            active={active === 'users'}
            onClick={() => setActive('users')}
          />
          <Layout.TopNav.Item
            label="Settings"
            icon={<IconSettings className="w-4 h-4" />}
            active={['settings', 'billing', 'security'].includes(active)}
            items={[
              { label: 'Profile',  icon: <IconProfile className="w-4 h-4" />,  onClick: () => setActive('settings') },
              { label: 'Billing',  icon: <IconBilling className="w-4 h-4" />,  onClick: () => setActive('billing') },
              { label: 'Security', icon: <IconSecurity className="w-4 h-4" />, onClick: () => setActive('security') },
              { divider: true },
              { label: 'Sign out', icon: <IconLogout className="w-4 h-4" />,   onClick: () => setActive('dashboard'), danger: true },
            ]}
          />
        </Layout.TopNav.Menu>

        <Layout.TopNav.Actions>
          <Avatar name="Bob Tran" size="sm" />
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      <Layout.Content>
        <PageContent page={active} />
      </Layout.Content>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════
   Demo 3 — Line / tabs variant
══════════════════════════════════════════════════════ */
function TopNavLineDemo() {
  const [active, setActive] = useState('overview')
  const tabs = [
    { id: 'overview',  label: 'Overview',  icon: <IconDashboard className="w-4 h-4" /> },
    { id: 'repos',     label: 'Repos',     icon: <IconCode className="w-4 h-4" />,      badge: <Badge size="sm" color="default">42</Badge> },
    { id: 'packages',  label: 'Packages',  icon: <IconPackage className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <IconAnalytics className="w-4 h-4" /> },
    { id: 'settings',  label: 'Settings',  icon: <IconSettings className="w-4 h-4" /> },
  ]
  return (
    <Layout className="h-[420px] w-full">
      <Layout.TopNav variant="line">
        <Layout.TopNav.Brand>
          <Avatar name="dangbt" size="sm" src="https://avatars.githubusercontent.com/u/1" />
          <span className="font-semibold text-fg text-sm hidden sm:block">dangbt</span>
        </Layout.TopNav.Brand>

        <Layout.TopNav.Menu>
          {tabs.map(tab => (
            <Layout.TopNav.Item
              key={tab.id}
              icon={tab.icon}
              label={tab.label}
              badge={tab.badge}
              active={active === tab.id}
              onClick={() => setActive(tab.id)}
            />
          ))}
        </Layout.TopNav.Menu>

        <Layout.TopNav.Actions>
          <Button size="sm" variant="primary">
            <IconZap className="w-3.5 h-3.5" />
            Upgrade
          </Button>
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      <Layout.Content>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-fg capitalize">{active}</h2>
          <p className="text-sm text-fg-muted">
            The <strong>line</strong> variant mimics GitHub/Stripe-style tab navigation —
            active item gets a bottom border flush with the bar's divider.
          </p>
          <Skeleton variant="text" lines={5} />
        </div>
      </Layout.Content>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════
   Demo 4 — TopNav + Sub (two-level navigation)
══════════════════════════════════════════════════════ */
function TopNavSubDemo() {
  const [activeMain, setActiveMain] = useState('users')
  const [activeSub,  setActiveSub]  = useState('members')

  const subTabs: Record<string, { id: string; label: string; badge?: React.ReactNode }[]> = {
    users: [
      { id: 'members',  label: 'Members',      badge: <Badge size="sm" color="default">128</Badge> },
      { id: 'teams',    label: 'Teams' },
      { id: 'invites',  label: 'Pending invites', badge: <Badge size="sm" color="warning">5</Badge> },
      { id: 'audit',    label: 'Audit log' },
    ],
    settings: [
      { id: 'general',  label: 'General' },
      { id: 'billing',  label: 'Billing' },
      { id: 'security', label: 'Security' },
      { id: 'webhooks', label: 'Webhooks' },
    ],
    analytics: [
      { id: 'traffic',  label: 'Traffic' },
      { id: 'events',   label: 'Events' },
      { id: 'funnels',  label: 'Funnels' },
    ],
  }

  const currentSubs = subTabs[activeMain] ?? []

  return (
    <Layout className="h-[460px] w-full">
      {/* Level 1 */}
      <Layout.TopNav>
        <Layout.TopNav.Brand>
          <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-fg text-sm hidden sm:block">pro-ui</span>
        </Layout.TopNav.Brand>

        <Layout.TopNav.Menu>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <IconAnalytics className="w-4 h-4" /> },
            { id: 'users',     label: 'Users',     icon: <IconUsers className="w-4 h-4" /> },
            { id: 'settings',  label: 'Settings',  icon: <IconSettings className="w-4 h-4" /> },
          ].map(item => (
            <Layout.TopNav.Item
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeMain === item.id}
              onClick={() => { setActiveMain(item.id); setActiveSub(subTabs[item.id]?.[0]?.id ?? '') }}
            />
          ))}
        </Layout.TopNav.Menu>

        <Layout.TopNav.Actions>
          <Avatar name="Alice Nguyen" size="sm" />
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      {/* Level 2 — only for sections that have sub-tabs */}
      {currentSubs.length > 0 && (
        <Layout.TopNav.Sub stickyTop={56}>
          {currentSubs.map(sub => (
            <Layout.TopNav.Sub.Item
              key={sub.id}
              label={sub.label}
              badge={sub.badge}
              active={activeSub === sub.id}
              onClick={() => setActiveSub(sub.id)}
            />
          ))}
        </Layout.TopNav.Sub>
      )}

      <Layout.Content>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-fg capitalize">
            {activeMain} › {activeSub}
          </h2>
          <p className="text-sm text-fg-muted">
            Two-level navigation: <strong>TopNav</strong> for primary sections,
            <strong> TopNav.Sub</strong> for contextual tabs within each section.
          </p>
          <Skeleton variant="text" lines={5} />
        </div>
      </Layout.Content>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════
   Demo 5 — Marketing / landing site header
══════════════════════════════════════════════════════ */
function TopNavMarketingDemo() {
  const [active, setActive] = useState('')
  return (
    <Layout className="h-[420px] w-full">
      <Layout.TopNav>
        <Layout.TopNav.Brand>
          <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-fg text-sm">pro-ui</span>
        </Layout.TopNav.Brand>

        <Layout.TopNav.Menu>
          <Layout.TopNav.Item
            label="Products"
            icon={<IconPackage className="w-4 h-4" />}
            active={['table', 'form', 'layout'].includes(active)}
            items={[
              { label: 'ProTable',   icon: <IconChart className="w-4 h-4" />,   onClick: () => setActive('table') },
              { label: 'ProForm',    icon: <IconDocs className="w-4 h-4" />,    onClick: () => setActive('form') },
              { label: 'Layout',     icon: <IconDashboard className="w-4 h-4" />, onClick: () => setActive('layout') },
              { divider: true },
              { label: 'View all →', icon: <IconZap className="w-4 h-4" />,    onClick: () => setActive('all') },
            ]}
          />
          <Layout.TopNav.Item label="Pricing" active={active === 'pricing'} onClick={() => setActive('pricing')} />
          <Layout.TopNav.Item
            label="Docs"
            icon={<IconBook className="w-4 h-4" />}
            active={active === 'docs'}
            onClick={() => setActive('docs')}
          />
          <Layout.TopNav.Item label="Blog" active={active === 'blog'} onClick={() => setActive('blog')} />
          <Layout.TopNav.Item
            label="Showcase"
            active={active === 'showcase'}
            items={[
              { label: 'Admin dashboards', onClick: () => setActive('showcase') },
              { label: 'SaaS apps',        onClick: () => setActive('showcase') },
              { label: 'Marketing sites',  onClick: () => setActive('showcase') },
            ]}
          />
        </Layout.TopNav.Menu>

        <Layout.TopNav.Actions>
          <Button size="sm" variant="ghost">Log in</Button>
          <Button size="sm" variant="primary">
            Get started
            <IconZap className="w-3.5 h-3.5" />
          </Button>
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      <Layout.Content>
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
          <Badge color="primary">Open source · MIT License</Badge>
          <h1 className="text-3xl font-bold text-fg tracking-tight">
            Build beautiful React apps<br />
            <span className="text-primary">10× faster</span>
          </h1>
          <p className="text-fg-muted text-sm max-w-sm">
            Production-ready components built on React Aria + Tailwind CSS v4.
            ProTable, ProForm, 30+ UI primitives.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="primary">Get started free</Button>
            <Button variant="ghost">
              <IconGlobe className="w-4 h-4" />
              View docs
            </Button>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════
   Demo 6 — Bold variant, no icons (minimal SaaS)
══════════════════════════════════════════════════════ */
function TopNavBoldDemo() {
  const [active, setActive] = useState('inbox')
  const items = [
    { id: 'inbox',    label: 'Inbox',    badge: <Badge size="sm" color="danger">9</Badge> },
    { id: 'projects', label: 'Projects' },
    { id: 'views',    label: 'Views' },
    { id: 'members',  label: 'Members' },
  ]
  return (
    <Layout className="h-[380px] w-full">
      <Layout.TopNav variant="bold">
        <Layout.TopNav.Brand>
          <span className="font-bold text-primary tracking-tight">Linear</span>
        </Layout.TopNav.Brand>

        <Layout.TopNav.Menu>
          {items.map(item => (
            <Layout.TopNav.Item
              key={item.id}
              label={item.label}
              badge={item.badge}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </Layout.TopNav.Menu>

        <Layout.TopNav.Actions>
          <Button size="sm" variant="ghost">
            <IconSettings className="w-4 h-4" />
          </Button>
          <Avatar name="Charlie Le" size="sm" />
        </Layout.TopNav.Actions>
      </Layout.TopNav>

      <Layout.Content>
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-fg capitalize">{active}</h2>
          <p className="text-sm text-fg-muted">
            <strong>bold</strong> variant — active item is bold + primary color only, no background pill.
            Clean, text-first feel like Linear or Notion.
          </p>
          <Skeleton variant="text" lines={4} />
        </div>
      </Layout.Content>
    </Layout>
  )
}

/* ══════════════════════════════════════════════════════
   Existing sidebar demos
══════════════════════════════════════════════════════ */
export function LayoutSection() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [activeNav2, setActiveNav2] = useState('dashboard')

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Layout"
        description="Composable shell with sticky header, collapsible sidebar, and now horizontal top navigation with dropdown and sub-nav support."
      />

      {/* ── TopNav demos ─────────────────────────────── */}
      <Demo label="Layout.TopNav — basic flat (pill variant)" center={false} className="!p-0 overflow-hidden">
        <TopNavBasicDemo />
      </Demo>

      <Demo label="Layout.TopNav — dropdown items" center={false} className="!p-0 overflow-hidden">
        <TopNavDropdownDemo />
      </Demo>

      <Demo label='Layout.TopNav — variant="line" (GitHub / Stripe style)' center={false} className="!p-0 overflow-hidden">
        <TopNavLineDemo />
      </Demo>

      <Demo label="Layout.TopNav + Layout.TopNav.Sub — two-level navigation" center={false} className="!p-0 overflow-hidden">
        <TopNavSubDemo />
      </Demo>

      <Demo label="Layout.TopNav — marketing / landing site header" center={false} className="!p-0 overflow-hidden">
        <TopNavMarketingDemo />
      </Demo>

      <Demo label='Layout.TopNav — variant="bold" (minimal, text-only active)' center={false} className="!p-0 overflow-hidden">
        <TopNavBoldDemo />
      </Demo>

      {/* ── Sider demos ──────────────────────────────── */}
      <Demo label="Layout.Sider — header + sidebar + content + footer" center={false} className="!p-0 overflow-hidden">
        <Layout className="h-[480px] w-full">
          <Layout.Header bordered>
            <div className="flex items-center gap-2 font-semibold text-fg text-sm">
              <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              pro-ui
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Avatar name="Alice Nguyen" size="sm" />
              <span className="text-sm text-fg-2 hidden sm:block">Alice Nguyen</span>
            </div>
          </Layout.Header>

          <Layout.Body>
            <Layout.Sider width={220}>
              <Layout.Nav>
                <Layout.Nav.Group label="Main">
                  {mainNavItems.map(item => (
                    <Layout.Nav.Item
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      active={activeNav === item.id}
                      onClick={() => setActiveNav(item.id)}
                    />
                  ))}
                </Layout.Nav.Group>
                <Layout.Nav.Group label="Account">
                  {settingsItems.map(item => (
                    <Layout.Nav.Item
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeNav === item.id}
                      onClick={() => setActiveNav(item.id)}
                    />
                  ))}
                </Layout.Nav.Group>
              </Layout.Nav>
            </Layout.Sider>

            <Layout.Content>
              <PageContent page={activeNav} />
            </Layout.Content>
          </Layout.Body>

          <Layout.Footer bordered>
            <p className="text-xs text-fg-disabled">© 2026 pro-ui. All rights reserved.</p>
          </Layout.Footer>
        </Layout>
      </Demo>

      <Demo label="Layout.Sider — collapsible (icon-only when collapsed)" center={false} className="!p-0 overflow-hidden">
        <Layout className="h-[480px] w-full">
          <Layout.Header bordered>
            <div className={cn('flex items-center gap-2 font-semibold text-fg text-sm transition-all duration-300', collapsed ? 'w-16 justify-center' : '')}>
              <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              {!collapsed && 'pro-ui'}
            </div>
            <div className="flex-1" />
            <Badge color={collapsed ? 'warning' : 'success'} size="sm">
              {collapsed ? 'Collapsed' : 'Expanded'}
            </Badge>
          </Layout.Header>

          <Layout.Body>
            <Layout.Sider
              width={220}
              collapsedWidth={56}
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
            >
              <Layout.Nav>
                <Layout.Nav.Group label="Main">
                  {mainNavItems.map(item => (
                    <Layout.Nav.Item
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                      active={activeNav2 === item.id}
                      onClick={() => setActiveNav2(item.id)}
                    />
                  ))}
                </Layout.Nav.Group>
                <Layout.Nav.Group label="Account">
                  {settingsItems.map(item => (
                    <Layout.Nav.Item
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeNav2 === item.id}
                      onClick={() => setActiveNav2(item.id)}
                    />
                  ))}
                </Layout.Nav.Group>
              </Layout.Nav>
            </Layout.Sider>

            <Layout.Content>
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-fg capitalize">{activeNav2}</h2>
                <div className="p-3 bg-info-50 border border-info-200 rounded-[var(--base-radius)] text-sm text-info-700">
                  Click <strong>Collapse</strong> at the bottom of the sidebar to toggle icon-only mode.
                </div>
                <Skeleton variant="text" lines={5} />
              </div>
            </Layout.Content>
          </Layout.Body>
        </Layout>
      </Demo>

      <Demo label="Layout.Sider — right panel (document editor)" center={false} className="!p-0 overflow-hidden">
        <Layout className="h-[360px] w-full">
          <Layout.Header height={48} bordered>
            <span className="text-sm font-semibold text-fg">Document Editor</span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary">Preview</Button>
              <Button size="sm" variant="primary">Publish</Button>
            </div>
          </Layout.Header>
          <Layout.Body>
            <Layout.Content>
              <div className="space-y-3">
                <Skeleton height={20} width="60%" />
                <Skeleton variant="text" lines={6} />
              </div>
            </Layout.Content>
            <Layout.Sider width={200} bordered>
              <div className="p-3 space-y-3">
                <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Properties</p>
                <div className="space-y-2">
                  {[['Status', 'Draft'], ['Author', 'Alice'], ['Words', '1,240'], ['Last saved', '2m ago']].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-fg-disabled">{k}</span>
                      <span className="text-fg-2 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <Divider />
                <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {['React', 'UI', 'Design'].map(t => <Badge key={t} size="sm" color="info">{t}</Badge>)}
                </div>
              </div>
            </Layout.Sider>
          </Layout.Body>
        </Layout>
      </Demo>
    </div>
  )
}
