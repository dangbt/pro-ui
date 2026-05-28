# Build a full admin dashboard with React in 30 minutes

**Tags:** #react #typescript #webdev #tutorial
**Series:** Build X with pro-ui
**Target keyword:** react admin dashboard tutorial

---

Building an admin dashboard from scratch is painful. By the time you've wired up a data table with server-side pagination, a form with validation, a sidebar layout, and dark mode — you've burned a whole day on boilerplate.

Here's how to do it in 30 minutes using [`@dangbt/pro-ui`](https://www.npmjs.com/package/@dangbt/pro-ui).

---

## What we're building

A users management page with:
- Collapsible sidebar layout
- KPI cards (total users, active, revenue)
- Server-side data table with search, filters, row selection, and bulk delete
- "Add user" modal with a validated form
- Dark/light mode toggle

[Live demo →](https://pro-admin-demo.pages.dev)

---

## Step 1 — Scaffold the project (2 minutes)

```bash
npx create-pro-ui-app my-dashboard
```

Choose **admin-dashboard** when prompted. This gives you a full working app with sidebar, dashboard page, users table, settings form, and auth pages — all wired up.

Or start from scratch:

```bash
npm create vite@latest my-dashboard -- --template react-ts
cd my-dashboard
npm install @dangbt/pro-ui
```

Then add to your CSS:

```css
/* src/index.css */
@import "tailwindcss";
@import "@dangbt/pro-ui/styles";
```

---

## Step 2 — Set up the layout (5 minutes)

```tsx
// src/App.tsx
import { Layout, ThemeProvider, ToastProvider } from '@dangbt/pro-ui'
import { Users, LayoutDashboard, Settings } from 'lucide-react'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Layout>
          <Layout.Sider>
            <Layout.Nav>
              <Layout.Nav.Group label="Main">
                <Layout.Nav.Item icon={<LayoutDashboard size={16} />} href="/dashboard">
                  Dashboard
                </Layout.Nav.Item>
                <Layout.Nav.Item icon={<Users size={16} />} href="/users" active>
                  Users
                </Layout.Nav.Item>
                <Layout.Nav.Item icon={<Settings size={16} />} href="/settings">
                  Settings
                </Layout.Nav.Item>
              </Layout.Nav.Group>
            </Layout.Nav>
          </Layout.Sider>

          <Layout.Body>
            <Layout.Header>
              <h1 className="text-lg font-semibold">Users</h1>
            </Layout.Header>
            <Layout.Content>
              {/* page content here */}
            </Layout.Content>
          </Layout.Body>
        </Layout>
      </ToastProvider>
    </ThemeProvider>
  )
}
```

The `Layout.Sider` collapses on mobile automatically. `ThemeProvider` handles dark/light/system toggle — no config needed.

---

## Step 3 — KPI cards (3 minutes)

```tsx
import { Statistic, Card } from '@dangbt/pro-ui'
import { Users, TrendingUp, DollarSign } from 'lucide-react'

function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <Statistic
          title="Total Users"
          value={12483}
          prefix={<Users size={16} />}
          trend={{ value: 12, direction: 'up' }}
        />
      </Card>
      <Card>
        <Statistic
          title="Active"
          value={9821}
          prefix={<TrendingUp size={16} />}
          trend={{ value: 4.2, direction: 'up' }}
        />
      </Card>
      <Card>
        <Statistic
          title="MRR"
          value={48200}
          prefix={<DollarSign size={16} />}
          formatter={(v) => `$${v.toLocaleString()}`}
        />
      </Card>
    </div>
  )
}
```

---

## Step 4 — Server-side data table (10 minutes)

This is where pro-ui shines. `ProTable` handles server-side fetching, pagination, search, column sort, row selection, and bulk actions in a single component.

```tsx
import { ProTable, Badge, Avatar } from '@dangbt/pro-ui'
import type { ProTableColumn } from '@dangbt/pro-ui'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

const columns: ProTableColumn<User>[] = [
  {
    key: 'name',
    title: 'Name',
    render: (_, row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.name} size="sm" />
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.email}</div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    render: (v) => <Badge variant="outline">{v}</Badge>,
    filters: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
  {
    key: 'status',
    title: 'Status',
    render: (v) => (
      <Badge variant={v === 'active' ? 'success' : 'secondary'}>
        {v}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    title: 'Joined',
    render: (v) => new Date(v).toLocaleDateString(),
    sortable: true,
  },
]

function UsersTable() {
  return (
    <ProTable<User>
      columns={columns}
      rowKey="id"
      request={async ({ current, pageSize, search, filters, sorter }) => {
        const params = new URLSearchParams({
          page: String(current),
          limit: String(pageSize),
          ...(search && { q: search }),
          ...(filters?.role && { role: filters.role as string }),
          ...(sorter?.field && { sort: sorter.field, order: sorter.order }),
        })
        const res = await fetch(`/api/users?${params}`)
        const data = await res.json()
        return { data: data.users, total: data.total, success: true }
      }}
      searchPlaceholder="Search by name or email..."
      rowSelection={{
        onChange: (selectedKeys) => console.log('Selected:', selectedKeys),
      }}
      bulkActions={[
        {
          label: 'Delete selected',
          danger: true,
          onClick: async (keys) => {
            await fetch('/api/users/bulk-delete', {
              method: 'DELETE',
              body: JSON.stringify({ ids: keys }),
            })
          },
        },
        {
          label: 'Export CSV',
          onClick: (keys) => exportUsers(keys),
        },
      ]}
      toolbar={
        <Button onClick={() => setAddOpen(true)}>
          Add User
        </Button>
      }
    />
  )
}
```

That's it. Pagination, loading states, empty state, error handling — all handled.

---

## Step 5 — Add user modal with form (8 minutes)

```tsx
import { Modal, ProForm } from '@dangbt/pro-ui'
import type { ProFormField } from '@dangbt/pro-ui'
import { z } from 'zod'

const addUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'editor', 'viewer']),
  sendInvite: z.boolean().optional(),
})

const addUserFields: ProFormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
  { name: 'email', label: 'Email', type: 'text', placeholder: 'jane@company.com' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
  { name: 'sendInvite', label: 'Send invite email', type: 'checkbox' },
]

function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Add User" size="md">
      <ProForm
        schema={addUserSchema}
        fields={addUserFields}
        onSubmit={async (data) => {
          await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          onClose()
        }}
        submitLabel="Add User"
      />
    </Modal>
  )
}
```

ProForm handles validation display, loading state on submit, and error messages from Zod automatically.

---

## Step 6 — Dark mode (2 minutes)

It's already handled by `ThemeProvider`. Add a toggle anywhere:

```tsx
import { useTheme, Button } from '@dangbt/pro-ui'
import { Moon, Sun } from 'lucide-react'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  )
}
```

All component colors use CSS semantic tokens — they flip automatically with zero extra CSS.

---

## Result

~150 lines of code. A production-ready admin page with:
- ✅ Server-side table with search, sort, column filters, pagination
- ✅ Row selection + bulk delete
- ✅ Validated modal form
- ✅ KPI cards
- ✅ Collapsible sidebar
- ✅ Dark/light mode

---

## What's next in this series

- **Article 2:** Why I stopped using shadcn/ui for admin apps (honest comparison)
- **Article 3:** How to connect Claude Code to your React component library with MCP
- **Article 4:** Dark mode done right — CSS semantic tokens in React
- **Article 5:** ProTable deep-dive — everything you can do with it
- **Article 6:** From zero to SaaS dashboard: React + AI in one afternoon

---

## Resources

- 📦 npm: `npm install @dangbt/pro-ui`
- 🎨 Showcase: [pro-ui.pages.dev](https://pro-ui.pages.dev)
- 🚀 Pro Admin Template (8 pages, Recharts, auth): [live demo](https://pro-admin-demo.pages.dev) · [$79 →](https://prouiadmin.lemonsqueezy.com/checkout/buy/d10a5885-0c86-4fba-9eee-33b4de31413f)
- ⭐ GitHub: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)
