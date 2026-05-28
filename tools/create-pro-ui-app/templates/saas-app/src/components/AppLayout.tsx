import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Button, Avatar, useTheme } from '@dangbt/pro-ui'
import { LayoutDashboard, User, Moon, Sun, LogOut } from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
  { label: 'Profile', href: '/profile', icon: <User size={16} /> },
]

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const navWithActive = nav.map((item) => ({
    ...item,
    active: location.pathname === item.href,
    onClick: () => navigate(item.href),
  }))

  return (
    <Layout
      nav={navWithActive}
      logo={<span className="font-bold text-primary text-lg">MyApp</span>}
      header={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Avatar name="Admin User" size="sm" />
          <Button variant="ghost" size="sm" onPress={() => navigate('/login')}>
            <LogOut size={16} />
          </Button>
        </div>
      }
    >
      <Outlet />
    </Layout>
  )
}
