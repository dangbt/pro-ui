import { useState } from 'react'
import {
  LayoutDashboard as IconDashboard,
  Users           as IconUsers,
  Settings        as IconSettings,
  TrendingUp      as IconAnalytics,
  Bell            as IconBell,
  FileText        as IconDocs,
  LogOut          as IconLogout,
} from 'lucide-react'
import {
  Button, Badge, Avatar, Skeleton, Divider, Layout,
} from '../../components'
import { Demo, SectionHeader } from '../shared'
import { cn } from '../../lib/cn'

export function LayoutSection() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [activeNav2, setActiveNav2] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',  icon: <IconDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics',  icon: <IconAnalytics className="w-4 h-4" /> },
    { id: 'users',     label: 'Users',      icon: <IconUsers className="w-4 h-4" />,     badge: <Badge size="sm" color="primary">24</Badge> },
    { id: 'docs',      label: 'Docs',       icon: <IconDocs className="w-4 h-4" /> },
    { id: 'notifs',    label: 'Alerts',     icon: <IconBell className="w-4 h-4" />,      badge: <Badge size="sm" color="danger">3</Badge> },
  ]
  const settingsItems = [
    { id: 'settings', label: 'Settings', icon: <IconSettings className="w-4 h-4" /> },
    { id: 'logout',   label: 'Logout',   icon: <IconLogout className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Layout & Sider"
        description="Composable shell with sticky header, collapsible sidebar, scrollable content, and optional footer."
      />

      <Demo label="Layout — header + sidebar + content + footer" center={false} className="!p-0 overflow-hidden">
        <Layout className="h-[480px] w-full">
          <Layout.Header bordered>
            <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
              <div className="w-6 h-6 rounded-[var(--base-radius)] bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              pro-ui
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Avatar name="Alice Nguyen" size="sm" />
              <span className="text-sm text-gray-700 hidden sm:block">Alice Nguyen</span>
            </div>
          </Layout.Header>

          <Layout.Body>
            <Layout.Sider width={220}>
              <Layout.Nav>
                <Layout.Nav.Group label="Main">
                  {navItems.map(item => (
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
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 capitalize">{activeNav}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: 'Total users', value: '12,430', color: 'bg-primary-50 text-primary-700' },
                    { label: 'Revenue',     value: '₫480M',  color: 'bg-success-50 text-success-700' },
                    { label: 'Open issues', value: '23',     color: 'bg-warning-50 text-warning-700' },
                    { label: 'Uptime',      value: '99.9%',  color: 'bg-info-50 text-info-700'      },
                  ].map(stat => (
                    <div key={stat.label} className={cn('rounded-[var(--base-radius)] p-3', stat.color)}>
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-xs opacity-70">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <Skeleton variant="text" lines={4} />
              </div>
            </Layout.Content>
          </Layout.Body>

          <Layout.Footer bordered>
            <p className="text-xs text-gray-400">© 2026 pro-ui. All rights reserved.</p>
          </Layout.Footer>
        </Layout>
      </Demo>

      <Demo label="Layout.Sider — collapsible (icon-only when collapsed)" center={false} className="!p-0 overflow-hidden">
        <Layout className="h-[480px] w-full">
          <Layout.Header bordered>
            <div className={cn('flex items-center gap-2 font-semibold text-gray-900 text-sm transition-all duration-300', collapsed ? 'w-16 justify-center' : '')}>
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
                  {navItems.map(item => (
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
                <h2 className="text-lg font-bold text-gray-900 capitalize">{activeNav2}</h2>
                <div className="p-3 bg-info-50 border border-info-200 rounded-[var(--base-radius)] text-sm text-info-700">
                  Click the <strong>Collapse</strong> button at the bottom of the sidebar to toggle icon-only mode.
                </div>
                <Skeleton variant="text" lines={5} />
              </div>
            </Layout.Content>
          </Layout.Body>
        </Layout>
      </Demo>

      <Demo label="Layout.Sider — right panel" center={false} className="!p-0 overflow-hidden">
        <Layout className="h-[360px] w-full">
          <Layout.Header height={48} bordered>
            <span className="text-sm font-semibold text-gray-800">Document Editor</span>
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
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</p>
                <div className="space-y-2">
                  {[['Status', 'Draft'], ['Author', 'Alice'], ['Words', '1,240'], ['Last saved', '2m ago']].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{k}</span>
                      <span className="text-gray-700 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <Divider />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</p>
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
