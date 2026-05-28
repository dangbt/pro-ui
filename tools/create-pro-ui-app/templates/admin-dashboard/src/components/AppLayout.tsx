import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Button, useTheme } from '@dangbt/pro-ui'
import { LayoutDashboard, Users, Settings, Moon, Sun } from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Users', href: '/users', icon: <Users size={16} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
]

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  // Add active state based on current path
  const navWithActive = nav.map((item) => ({
    ...item,
    active: location.pathname === item.href,
    onClick: () => navigate(item.href),
  }))

  return (
    <Layout
      nav={navWithActive}
      logo={
        <span className="font-bold text-primary text-lg tracking-tight">ProAdmin</span>
      }
      header={
        <Button
          variant="ghost"
          size="sm"
          onPress={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      }
    >
      <Outlet />
    </Layout>
  )
}
