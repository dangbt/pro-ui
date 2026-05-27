# UI Components — @dangbt/pro-ui

This project uses **@dangbt/pro-ui** for all UI components.

> **AI Tip**: Add the `mcp-pro-ui` MCP server to get live component API access:
> ```bash
> claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui
> ```

## Installation

```bash
npm install @dangbt/pro-ui
```

## App Setup (required)

Wrap your app root with providers:

```tsx
// main.tsx or App.tsx
import { ThemeProvider } from '@dangbt/pro-ui'
import { ToastProvider } from '@dangbt/pro-ui'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider />
      {/* your app */}
    </ThemeProvider>
  )
}
```

## Component Import Pattern

Always import from the package root — never from sub-paths:

```tsx
// ✅ Correct
import { Button, ProTable, ProForm, Modal } from '@dangbt/pro-ui'

// ❌ Wrong
import { Button } from '@dangbt/pro-ui/components/button'
```

## Available Components

### Data
- **ProTable** — Advanced data table with server/client-side modes, pagination, sorting, filtering, column toggling, pinning, row selection, bulk actions, expandable rows
- **ProForm** — Form builder with Zod validation, grid layout

### Layout
- **Layout** — App shell: collapsible sidebar + header + content area (responsive)

### Overlays
- **Modal** — Accessible dialog with focus trap (use with `DialogTrigger` from react-aria-components)
- **Drawer** — Slide-in panel (left/right/bottom), good for filter panels
- **Popover** — Floating anchored panel
- **Tooltip** — Hover/focus tooltip
- **Menu** — Dropdown action menu

### Feedback
- **Toast / toast()** — Global notifications: `toast.success()`, `toast.error()`, etc.
- **Alert** — Inline alerts (info/success/warning/danger)
- **Spinner** — Loading indicator
- **Skeleton** — Content placeholder

### Display
- **Statistic** — KPI metric card with trend indicator
- **Steps** — Multi-step progress indicator
- **Empty** — Empty state placeholder
- **Badge** — Status chip (success/warning/danger/info)
- **Card** — Container card with optional header/footer
- **Avatar / AvatarGroup** — User avatar with initials fallback
- **Tabs** — Tab navigation

### Forms & Inputs
- **Button** — Use `onPress` (not `onClick`), variants: solid/outline/ghost/danger
- **Input, Textarea, NumberField, SearchField**
- **Select, AsyncSelect, ComboBox**
- **Checkbox, RadioGroup, Switch, ToggleButton**
- **DatePicker, TimeField**
- **TagGroup, Slider, ColorPicker**
- **FileTrigger, DropZone**

### Theme
- **ThemeProvider** — Wrap app, provides light/dark/system theme
- **useTheme()** — `{ theme, resolvedTheme, setTheme }` — use in any component

## ProTable Usage Patterns

### Server-side (recommended for large datasets)
```tsx
<ProTable<User>
  columns={columns}
  rowKey="id"
  request={async ({ current, pageSize, ...filters }) => {
    const res = await fetch(`/api/users?page=${current}&limit=${pageSize}`)
    const data = await res.json()
    return { data: data.items, total: data.total, success: true }
  }}
/>
```

### Client-side (for small static datasets)
```tsx
<ProTable<User>
  columns={columns}
  rowKey="id"
  dataSource={users}
/>
```

### Column definition with valueType
```tsx
const columns: ProColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', sortable: true },
  { title: 'Status', dataIndex: 'status', valueType: 'select',
    valueEnum: { active: { text: 'Active', color: 'success' }, inactive: 'Inactive' } },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date' },
  { title: 'Actions', render: (_, record) => <Button size="sm">Edit</Button> },
]
```

## ProForm Usage Pattern

```tsx
import { z } from 'zod'
import { ProForm, ProFormInput, ProFormSelect } from '@dangbt/pro-ui'

const schema = z.object({
  name: z.string().min(1),
  role: z.enum(['admin', 'user']),
})

<ProForm schema={schema} onSubmit={async (values) => { /* validated */ }}>
  <ProFormInput name="name" label="Name" />
  <ProFormSelect name="role" label="Role" options={[...]} />
</ProForm>
```

## Theming Rules

- All colors use semantic CSS tokens — do NOT use hardcoded Tailwind colors for dark-mode-sensitive UI
- Use: `bg-surface`, `bg-surface-subtle`, `bg-surface-raised`, `text-fg`, `text-fg-2`, `text-fg-muted`, `border-border`
- Use `bg-canvas` for page backgrounds
- Primary color: `text-primary`, `bg-primary`, `border-primary`

## Toast Usage

```tsx
// Mount once in App root:
<ToastProvider />

// Call from anywhere:
import { toast } from '@dangbt/pro-ui'
toast.success('Saved!')
toast.error('Something went wrong.')
```
