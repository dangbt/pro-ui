#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { COMPONENTS, CATEGORIES, type ComponentInfo } from './components-data.js'

const server = new McpServer({
  name: 'mcp-pro-ui',
  version: '1.0.0',
})

// ─── Tool: list_components ────────────────────────────────────────────────
server.tool(
  'list_components',
  'List all available @dangbt/pro-ui components with their category and description. Use this to discover what components are available before using get_component_api or get_component_example.',
  {
    category: z
      .enum(['data', 'form', 'layout', 'overlay', 'feedback', 'display', 'theme', 'all'])
      .optional()
      .describe('Filter by category. Omit to list all.'),
  },
  async ({ category }) => {
    const filtered =
      category && category !== 'all'
        ? COMPONENTS.filter((c) => c.category === category)
        : COMPONENTS

    const byCategory = filtered.reduce<Record<string, ComponentInfo[]>>((acc, c) => {
      acc[c.category] = acc[c.category] ?? []
      acc[c.category].push(c)
      return acc
    }, {})

    const lines: string[] = [
      `# @dangbt/pro-ui Components (${filtered.length} total)`,
      '',
      'Install: `npm install @dangbt/pro-ui`',
      '',
    ]

    for (const [cat, comps] of Object.entries(byCategory)) {
      lines.push(`## ${CATEGORIES[cat as keyof typeof CATEGORIES] ?? cat}`)
      for (const c of comps) {
        lines.push(`- **${c.name}** — ${c.description.split('.')[0]}.`)
      }
      lines.push('')
    }

    return { content: [{ type: 'text', text: lines.join('\n') }] }
  }
)

// ─── Tool: get_component_api ──────────────────────────────────────────────
server.tool(
  'get_component_api',
  'Get the full API reference (props, types, import path) for a specific @dangbt/pro-ui component.',
  {
    component: z
      .string()
      .describe('Component name, e.g. "ProTable", "ProForm", "Modal", "Button"'),
  },
  async ({ component }) => {
    const comp = COMPONENTS.find(
      (c) => c.name.toLowerCase() === component.toLowerCase()
    )

    if (!comp) {
      const names = COMPONENTS.map((c) => c.name).join(', ')
      return {
        content: [
          {
            type: 'text',
            text: `Component "${component}" not found.\n\nAvailable components:\n${names}`,
          },
        ],
      }
    }

    const lines: string[] = [
      `# ${comp.name}`,
      '',
      comp.description,
      '',
      `**Category:** ${CATEGORIES[comp.category]}`,
      '',
      '## Import',
      '```tsx',
      `import { ${comp.importName} } from '@dangbt/pro-ui'`,
      '```',
      '',
      '## Props',
      '',
      '| Prop | Type | Required | Default | Description |',
      '|------|------|----------|---------|-------------|',
      ...comp.props.map(
        (p) =>
          `| \`${p.name}\` | \`${p.type}\` | ${p.required ? '✅' : '—'} | ${p.default ? `\`${p.default}\`` : '—'} | ${p.description} |`
      ),
    ]

    if (comp.notes) {
      lines.push('', '## Notes', comp.notes)
    }

    return { content: [{ type: 'text', text: lines.join('\n') }] }
  }
)

// ─── Tool: get_component_example ──────────────────────────────────────────
server.tool(
  'get_component_example',
  'Get a ready-to-use code example for a specific @dangbt/pro-ui component. Returns copy-paste TypeScript/React code.',
  {
    component: z
      .string()
      .describe('Component name, e.g. "ProTable", "ProForm", "Toast"'),
  },
  async ({ component }) => {
    const comp = COMPONENTS.find(
      (c) => c.name.toLowerCase() === component.toLowerCase()
    )

    if (!comp) {
      return {
        content: [
          {
            type: 'text',
            text: `Component "${component}" not found. Use list_components to see available components.`,
          },
        ],
      }
    }

    const text = [
      `# ${comp.name} — Example`,
      '',
      '```tsx',
      comp.example,
      '```',
    ].join('\n')

    return { content: [{ type: 'text', text }] }
  }
)

// ─── Tool: search_components ──────────────────────────────────────────────
server.tool(
  'search_components',
  'Find the most relevant @dangbt/pro-ui component(s) for a given use case or description. Use this when you know what you need to build but not which component to use.',
  {
    query: z
      .string()
      .describe(
        'Describe what you need, e.g. "data table with pagination", "confirmation dialog", "loading indicator", "dark mode toggle"'
      ),
  },
  async ({ query }) => {
    const q = query.toLowerCase()
    const scored = COMPONENTS.map((c) => {
      let score = 0
      // Check use cases
      for (const uc of c.useCases) {
        if (uc.toLowerCase().includes(q) || q.includes(uc.toLowerCase())) score += 3
      }
      // Check name
      if (c.name.toLowerCase().includes(q)) score += 2
      // Check description words
      const descWords = c.description.toLowerCase().split(/\s+/)
      const queryWords = q.split(/\s+/)
      for (const qw of queryWords) {
        if (qw.length > 2 && descWords.some((dw) => dw.includes(qw))) score += 1
      }
      return { comp: c, score }
    })

    const matches = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    if (matches.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No components found matching "${query}".\n\nUse list_components to browse all available components.`,
          },
        ],
      }
    }

    const lines = [
      `# Components matching: "${query}"`,
      '',
      ...matches.map(({ comp }) =>
        [
          `## ${comp.name}`,
          comp.description,
          '',
          '```tsx',
          `import { ${comp.importName} } from '@dangbt/pro-ui'`,
          '```',
          '',
          `Use \`get_component_example("${comp.name}")\` for a full code example.`,
          '',
        ].join('\n')
      ),
    ]

    return { content: [{ type: 'text', text: lines.join('\n') }] }
  }
)

// ─── Tool: scaffold_page ──────────────────────────────────────────────────
server.tool(
  'scaffold_page',
  'Generate a complete React page scaffold using @dangbt/pro-ui components. Useful for quickly creating admin CRUD pages, dashboards, or settings pages.',
  {
    pageType: z
      .enum(['crud-list', 'crud-form', 'dashboard', 'settings', 'login'])
      .describe(
        'Type of page to scaffold: crud-list (data table page), crud-form (create/edit form), dashboard (overview with stats), settings (settings form), login (auth page)'
      ),
    entityName: z
      .string()
      .optional()
      .describe('Entity name in PascalCase, e.g. "User", "Product", "Order". Used for naming components and types.'),
  },
  async ({ pageType, entityName = 'Item' }) => {
    const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1)
    const entityLower = entity.toLowerCase()

    const templates: Record<string, string> = {
      'crud-list': `import { ProTable, Button, Badge } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

interface ${entity} {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: string
}

const columns: ProColumnType<${entity}>[] = [
  { title: 'Name', dataIndex: 'name', sortable: true },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      active: { text: 'Active', color: 'success' },
      inactive: { text: 'Inactive', color: 'default' },
    },
  },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date' },
  {
    title: 'Actions',
    key: 'actions',
    render: (_, record) => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onPress={() => handleEdit(record)}>Edit</Button>
        <Button size="sm" variant="danger" onPress={() => handleDelete(record.id)}>Delete</Button>
      </div>
    ),
  },
]

export function ${entity}ListPage() {
  const handleEdit = (record: ${entity}) => { /* navigate to edit page */ }
  const handleDelete = (id: string) => { /* call delete API */ }

  return (
    <ProTable<${entity}>
      headerTitle="${entity}s"
      columns={columns}
      rowKey="id"
      request={async ({ current, pageSize, ...filters }) => {
        const params = new URLSearchParams({ page: String(current), limit: String(pageSize), ...filters })
        const res = await fetch(\`/api/${entityLower}s?\${params}\`)
        const data = await res.json()
        return { data: data.items, total: data.total, success: true }
      }}
      toolBarRender={() => [
        <Button key="create" variant="solid" onPress={() => { /* navigate to create */ }}>
          + New ${entity}
        </Button>
      ]}
      rowSelection={{ onChange: (keys, rows) => console.log('selected:', keys) }}
      bulkActions={[
        { label: 'Delete selected', danger: true, onClick: (keys) => { /* bulk delete */ } },
      ]}
    />
  )
}`,

      'crud-form': `import { z } from 'zod'
import { ProForm, ProFormInput, ProFormSelect, ProFormTextarea } from '@dangbt/pro-ui'

const ${entityLower}Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
})

type ${entity}FormValues = z.infer<typeof ${entityLower}Schema>

interface ${entity}FormProps {
  defaultValues?: Partial<${entity}FormValues>
  onSuccess?: () => void
}

export function ${entity}Form({ defaultValues, onSuccess }: ${entity}FormProps) {
  return (
    <ProForm<${entity}FormValues>
      schema={${entityLower}Schema}
      defaultValues={{ status: 'active', ...defaultValues }}
      onSubmit={async (values) => {
        const isEdit = Boolean(defaultValues?.name)
        await fetch(\`/api/${entityLower}s\${isEdit ? '/id' : ''}\`, {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        onSuccess?.()
      }}
      submitText={defaultValues ? 'Save Changes' : 'Create ${entity}'}
    >
      <ProFormInput name="name" label="Name" placeholder="${entity} name" />
      <ProFormTextarea name="description" label="Description" placeholder="Optional description" />
      <ProFormSelect
        name="status"
        label="Status"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />
    </ProForm>
  )
}`,

      dashboard: `import { Statistic, Card, ProTable } from '@dangbt/pro-ui'
import { DollarSign, Users, TrendingUp, ShoppingCart } from 'lucide-react'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <Statistic
            title="Total Revenue"
            value={125430}
            prefix={<DollarSign size={16} />}
            trend="up"
            trendValue="+12.5%"
            formatter={(v) => Number(v).toLocaleString()}
          />
        </Card>
        <Card>
          <Statistic title="Active Users" value={2847} prefix={<Users size={16} />} trend="up" trendValue="+8%" />
        </Card>
        <Card>
          <Statistic title="Orders" value={431} prefix={<ShoppingCart size={16} />} trend="neutral" trendValue="0%" />
        </Card>
        <Card>
          <Statistic title="Growth" value="18.2%" prefix={<TrendingUp size={16} />} trend="up" trendValue="+3.1%" />
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card header={<h2 className="font-semibold">Recent ${entity}s</h2>} noPadding>
        <ProTable
          columns={[
            { title: 'Name', dataIndex: 'name' },
            { title: 'Status', dataIndex: 'status', valueType: 'select', valueEnum: { active: { text: 'Active', color: 'success' }, inactive: 'Inactive' } },
            { title: 'Date', dataIndex: 'createdAt', valueType: 'date' },
          ]}
          rowKey="id"
          search={false}
          request={async ({ current, pageSize }) => {
            const res = await fetch(\`/api/${entityLower}s?page=\${current}&limit=\${pageSize}\`)
            const data = await res.json()
            return { data: data.items, total: data.total, success: true }
          }}
        />
      </Card>
    </div>
  )
}`,

      settings: `import { z } from 'zod'
import { ProForm, ProFormInput, ProFormSwitch, ProFormSelect, Card, Alert } from '@dangbt/pro-ui'
import { useState } from 'react'

const settingsSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email'),
  timezone: z.string(),
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
})

type SettingsValues = z.infer<typeof settingsSchema>

export function SettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-fg-muted text-sm">Manage your account preferences</p>
      </div>

      {saved && (
        <Alert variant="success">Settings saved successfully!</Alert>
      )}

      <Card header={<h2 className="font-medium">Profile</h2>}>
        <ProForm<SettingsValues>
          schema={settingsSchema}
          defaultValues={{ emailNotifications: true, marketingEmails: false }}
          onSubmit={async (values) => {
            await fetch('/api/settings', {
              method: 'PUT',
              body: JSON.stringify(values),
            })
            setSaved(true)
          }}
          submitText="Save Settings"
        >
          <ProFormInput name="displayName" label="Display Name" />
          <ProFormInput name="email" label="Email Address" type="email" />
          <ProFormSelect
            name="timezone"
            label="Timezone"
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho Chi Minh (UTC+7)' },
              { value: 'America/New_York', label: 'America/New York (UTC-5)' },
            ]}
          />
          <ProFormSwitch name="emailNotifications" label="Email Notifications" />
          <ProFormSwitch name="marketingEmails" label="Marketing Emails" />
        </ProForm>
      </Card>
    </div>
  )
}`,

      login: `import { z } from 'zod'
import { ProForm, ProFormInput, ProFormCheckbox, Card } from '@dangbt/pro-ui'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-fg-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <Card>
          <ProForm<LoginValues>
            schema={loginSchema}
            onSubmit={async ({ email, password }) => {
              const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
              })
              if (res.ok) {
                window.location.href = '/dashboard'
              }
            }}
            submitText="Sign In"
          >
            <ProFormInput name="email" label="Email" type="email" placeholder="you@example.com" />
            <ProFormInput name="password" label="Password" type="password" placeholder="••••••••" />
            <ProFormCheckbox name="rememberMe" label="Remember me" />
          </ProForm>
        </Card>

        <p className="text-center text-sm text-fg-muted mt-4">
          Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}`,
    }

    const code = templates[pageType]
    const text = [
      `# ${entity} ${pageType.replace('-', ' ')} page scaffold`,
      '',
      '```tsx',
      code,
      '```',
      '',
      '## Next steps',
      '- Replace `/api/...` fetch URLs with your actual API endpoints',
      '- Add React Router navigation (`useNavigate`) as needed',
      '- Wrap your app with `<ThemeProvider>` and `<ToastProvider>` at the root',
      '- Install: `npm install @dangbt/pro-ui zod`',
    ].join('\n')

    return { content: [{ type: 'text', text }] }
  }
)

// ─── Start server ─────────────────────────────────────────────────────────
const transport = new StdioServerTransport()
await server.connect(transport)
