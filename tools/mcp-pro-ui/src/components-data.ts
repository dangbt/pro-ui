export interface ComponentInfo {
  name: string
  importName: string
  category: 'data' | 'form' | 'layout' | 'overlay' | 'feedback' | 'display' | 'theme'
  description: string
  useCases: string[]
  props: PropInfo[]
  example: string
  notes?: string
}

export interface PropInfo {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export const COMPONENTS: ComponentInfo[] = [
  // ─── DATA ────────────────────────────────────────────────────────────────
  {
    name: 'ProTable',
    importName: 'ProTable',
    category: 'data',
    description:
      'Advanced data table with server-side pagination, sorting, filtering, column toggling, column pinning, row selection, bulk actions, and expandable rows. Supports both server-side (request) and client-side (dataSource) modes.',
    useCases: [
      'admin data table',
      'CRUD list page',
      'data grid with pagination',
      'table with search/filter',
      'bulk actions table',
      'server-side pagination',
    ],
    props: [
      { name: 'columns', type: 'ProColumnType<T>[]', required: true, description: 'Column definitions' },
      { name: 'request', type: '(params: QueryParams) => Promise<RequestResult<T>>', required: false, description: 'Server-side data fetcher. Mutually exclusive with dataSource. Held in a ref — replacing the function does not refetch, pass external filters via params.' },
      { name: 'params', type: 'Record<string, unknown>', required: false, description: 'External filters owned by the page (search box, tabs, URL query). Merged into the request argument and refetches on change, resetting to page 1. Compared by value, so an inline object literal is safe.' },
      { name: 'dataSource', type: 'T[]', required: false, description: 'Client-side static data. Mutually exclusive with request.' },
      { name: 'rowKey', type: 'keyof T | ((record: T) => string)', required: true, description: 'Unique key for each row' },
      { name: 'headerTitle', type: 'string', required: false, description: 'Table header title' },
      { name: 'toolBarRender', type: '() => ReactNode[]', required: false, description: 'Render extra buttons in the toolbar' },
      { name: 'search', type: 'boolean', required: false, default: 'true', description: 'Set false to hide search form' },
      { name: 'loading', type: 'boolean', required: false, description: 'Override loading state' },
      { name: 'pagination', type: '{ defaultPageSize?: number; pageSizeOptions?: number[] }', required: false, description: 'Pagination config' },
      { name: 'rowSelection', type: '{ onChange?: (keys: string[], rows: T[]) => void }', required: false, description: 'Enable row selection with checkboxes' },
      { name: 'bulkActions', type: 'BulkActionDef<T>[]', required: false, description: 'Actions shown when rows are selected' },
      { name: 'expandedRowRender', type: '(record: T) => ReactNode', required: false, description: 'Render content below expanded row' },
      { name: 'rowClassName', type: '(record: T, index: number) => string', required: false, description: 'Add CSS classes to rows conditionally' },
      { name: 'onRow', type: '(record: T, index: number) => { onClick?; onDoubleClick?; onContextMenu? }', required: false, description: 'Row event handlers' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Table density size' },
      { name: 'persistColumnVisibility', type: 'boolean | string', required: false, default: 'true', description: 'Persist show/hide column state to localStorage. true = auto-derived key; string = explicit key; false = disabled' },
    ],
    example: `import { ProTable } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

interface User {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  createdAt: string
}

const columns: ProColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', sortable: true },
  { title: 'Email', dataIndex: 'email' },
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
]

export function UsersPage() {
  return (
    <ProTable<User>
      headerTitle="Users"
      columns={columns}
      rowKey="id"
      request={async ({ current, pageSize, ...filters }) => {
        const res = await fetch(\`/api/users?page=\${current}&limit=\${pageSize}\`)
        const data = await res.json()
        return { data: data.items, total: data.total, success: true }
      }}
      toolBarRender={() => [
        <Button key="add" variant="solid" onPress={() => {}}>Add User</Button>
      ]}
      rowSelection={{ onChange: (keys, rows) => console.log(keys, rows) }}
      bulkActions={[
        { label: 'Delete selected', danger: true, onClick: (keys) => console.log('delete', keys) },
      ]}
    />
  )
}`,
  },

  // ─── FORM ─────────────────────────────────────────────────────────────────
  {
    name: 'ProForm',
    importName: 'ProForm, ProFormInput, ProFormSelect, ProFormDatePicker, ProFormTextarea, ProFormNumberField, ProFormCheckbox, ProFormSwitch, ProFormRadioGroup, ProFormComboBox, ProFormAsyncSelect',
    category: 'form',
    description:
      'Form builder with Zod validation, grid layout, and a rich set of field components. Uses react-hook-form under the hood.',
    useCases: [
      'create/edit form',
      'settings form',
      'login form',
      'form with validation',
      'multi-column form layout',
    ],
    props: [
      { name: 'schema', type: 'ZodSchema', required: true, description: 'Zod schema for validation' },
      { name: 'onSubmit', type: '(values: T) => void | Promise<void>', required: true, description: 'Submit handler with validated values' },
      { name: 'defaultValues', type: 'Partial<T>', required: false, description: 'Initial form values' },
      { name: 'layout', type: "'vertical' | 'horizontal'", required: false, default: "'vertical'", description: 'Label placement' },
      { name: 'cols', type: 'number', required: false, default: '1', description: 'Grid columns for the form' },
      { name: 'loading', type: 'boolean', required: false, description: 'Show loading state on submit button' },
      { name: 'submitText', type: 'string', required: false, default: "'Submit'", description: 'Submit button label' },
      { name: 'onReset', type: '() => void', required: false, description: 'Called when form resets' },
    ],
    example: `import { z } from 'zod'
import { ProForm, ProFormInput, ProFormSelect, ProFormDatePicker } from '@dangbt/pro-ui'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user', 'viewer']),
  joinDate: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateUserForm() {
  return (
    <ProForm<FormValues>
      schema={schema}
      onSubmit={async (values) => {
        await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(values),
        })
      }}
      defaultValues={{ role: 'user' }}
      cols={2}
      submitText="Create User"
    >
      <ProFormInput name="name" label="Full Name" placeholder="John Doe" />
      <ProFormInput name="email" label="Email" type="email" />
      <ProFormSelect
        name="role"
        label="Role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
          { value: 'viewer', label: 'Viewer' },
        ]}
      />
      <ProFormDatePicker name="joinDate" label="Join Date" />
    </ProForm>
  )
}`,
  },

  // ─── LAYOUT ───────────────────────────────────────────────────────────────
  {
    name: 'Layout',
    importName: 'Layout',
    category: 'layout',
    description:
      'App shell with collapsible sidebar navigation, header slot, and content area. Handles responsive mobile drawer automatically.',
    useCases: [
      'admin app shell',
      'dashboard layout',
      'sidebar navigation',
      'app with header and sidebar',
    ],
    props: [
      { name: 'nav', type: 'NavItem[]', required: true, description: 'Navigation items for the sidebar' },
      { name: 'header', type: 'ReactNode', required: false, description: 'Header content (right side)' },
      { name: 'logo', type: 'ReactNode', required: false, description: 'Logo in the sidebar' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Page content' },
    ],
    example: `import { Layout } from '@dangbt/pro-ui'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={16} /> },
  { label: 'Users', href: '/users', icon: <Users size={16} /> },
  { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
]

export function App() {
  return (
    <Layout
      nav={nav}
      logo={<span className="font-bold text-primary">MyApp</span>}
      header={<Button variant="ghost" size="sm">Logout</Button>}
    >
      {/* page content here */}
    </Layout>
  )
}`,
  },

  // ─── OVERLAY ──────────────────────────────────────────────────────────────
  {
    name: 'Modal',
    importName: 'Modal, ModalTrigger',
    category: 'overlay',
    description: 'Accessible modal dialog with focus trap, backdrop, and animation. Uses React Aria DialogTrigger.',
    useCases: ['confirmation dialog', 'create/edit modal', 'detail view modal'],
    props: [
      { name: 'title', type: 'string', required: false, description: 'Modal header title' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", required: false, default: "'md'", description: 'Modal width' },
      { name: 'footer', type: 'ReactNode', required: false, description: 'Modal footer content' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Modal body content' },
    ],
    example: `import { Modal, ModalTrigger, Button } from '@dangbt/pro-ui'
import { DialogTrigger } from 'react-aria-components'

export function DeleteConfirm() {
  return (
    <DialogTrigger>
      <Button variant="danger">Delete</Button>
      <Modal
        title="Confirm Delete"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" slot="close">Cancel</Button>
            <Button variant="solid" onPress={() => handleDelete()}>Delete</Button>
          </div>
        }
      >
        Are you sure you want to delete this item? This action cannot be undone.
      </Modal>
    </DialogTrigger>
  )
}`,
  },

  {
    name: 'Drawer',
    importName: 'Drawer',
    category: 'overlay',
    description: 'Slide-in panel from left, right, or bottom. Ideal for filter panels, mobile nav, detail views.',
    useCases: ['filter panel', 'mobile navigation', 'detail side panel', 'slide-in form'],
    props: [
      { name: 'placement', type: "'left' | 'right' | 'bottom'", required: false, default: "'right'", description: 'Which edge to slide from' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Drawer width/height' },
      { name: 'title', type: 'string', required: false, description: 'Drawer header title' },
      { name: 'withOverlay', type: 'boolean', required: false, default: 'true', description: 'Show backdrop overlay' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Drawer body content' },
    ],
    example: `import { Drawer, Button } from '@dangbt/pro-ui'
import { DialogTrigger } from 'react-aria-components'

export function FilterDrawer() {
  return (
    <DialogTrigger>
      <Button variant="outline">Filters</Button>
      <Drawer title="Filter Options" placement="right">
        {/* filter form content */}
      </Drawer>
    </DialogTrigger>
  )
}`,
  },

  {
    name: 'Popover',
    importName: 'Popover',
    category: 'overlay',
    description: 'Floating popover panel anchored to a trigger element. Good for contextual menus and info panels.',
    useCases: ['context menu', 'info popover', 'floating panel'],
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Popover content' },
      { name: 'placement', type: 'Placement', required: false, default: "'bottom'", description: 'Placement relative to trigger' },
      { name: 'showArrow', type: 'boolean', required: false, default: 'true', description: 'Show arrow pointing to trigger' },
    ],
    example: `import { Popover, Button } from '@dangbt/pro-ui'
import { DialogTrigger } from 'react-aria-components'

export function InfoPopover() {
  return (
    <DialogTrigger>
      <Button variant="ghost" size="sm">ⓘ Info</Button>
      <Popover>
        <p className="text-sm">This is additional context information.</p>
      </Popover>
    </DialogTrigger>
  )
}`,
  },

  {
    name: 'Toast',
    importName: 'ToastProvider, toast',
    category: 'feedback',
    description: 'Global toast notifications. Mount ToastProvider once at app root, call toast() anywhere.',
    useCases: ['success notification', 'error message', 'action confirmation', 'system alert'],
    props: [
      { name: 'position', type: "'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'", required: false, default: "'top-right'", description: 'Toast position on screen' },
    ],
    example: `// 1. Mount provider once (e.g. in App.tsx)
import { ToastProvider, toast } from '@dangbt/pro-ui'

export function App() {
  return (
    <>
      <ToastProvider />
      {/* rest of app */}
    </>
  )
}

// 2. Call from anywhere
toast.success('User created successfully!')
toast.error('Something went wrong.')
toast.warning('Please review your input.')
toast.info('New version available.')

// With options:
toast.success('Saved!', { duration: 5000, persistent: false })`,
  },

  // ─── THEME ────────────────────────────────────────────────────────────────
  {
    name: 'ThemeProvider',
    importName: 'ThemeProvider, useTheme',
    category: 'theme',
    description:
      'Context provider for light/dark/system theme. Persists to localStorage, listens to system preference. Toggle class .dark on <html> element.',
    useCases: ['dark mode', 'light/dark toggle', 'theme switching', 'system theme'],
    props: [
      { name: 'defaultTheme', type: "'light' | 'dark' | 'system'", required: false, default: "'system'", description: 'Initial theme if nothing in localStorage' },
      { name: 'storageKey', type: 'string', required: false, default: "'pro-ui-theme'", description: 'localStorage key for persistence' },
      { name: 'children', type: 'ReactNode', required: true, description: 'App content' },
    ],
    example: `// 1. Wrap app (e.g. main.tsx)
import { ThemeProvider } from '@dangbt/pro-ui'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system">
    <App />
  </ThemeProvider>
)

// 2. Use in any component
import { useTheme } from '@dangbt/pro-ui'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}`,
  },

  // ─── DISPLAY ──────────────────────────────────────────────────────────────
  {
    name: 'Statistic',
    importName: 'Statistic',
    category: 'display',
    description: 'KPI card showing a metric value with optional trend indicator (up/down/neutral), prefix, suffix, and formatter.',
    useCases: ['KPI card', 'metric display', 'dashboard stat', 'trend indicator'],
    props: [
      { name: 'title', type: 'string', required: true, description: 'Metric label' },
      { name: 'value', type: 'number | string', required: true, description: 'The metric value' },
      { name: 'prefix', type: 'ReactNode', required: false, description: 'Content before value (e.g. icon or currency symbol)' },
      { name: 'suffix', type: 'ReactNode', required: false, description: 'Content after value (e.g. unit)' },
      { name: 'trend', type: "'up' | 'down' | 'neutral'", required: false, description: 'Trend direction indicator' },
      { name: 'trendValue', type: 'string', required: false, description: 'Trend percentage or delta text (e.g. "+12%")' },
      { name: 'formatter', type: '(value: number | string) => ReactNode', required: false, description: 'Custom value formatter' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Display size' },
    ],
    example: `import { Statistic } from '@dangbt/pro-ui'
import { DollarSign } from 'lucide-react'

export function DashboardStats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Statistic
        title="Total Revenue"
        value={125430}
        prefix={<DollarSign size={16} />}
        trend="up"
        trendValue="+12.5%"
        formatter={(v) => Number(v).toLocaleString()}
      />
      <Statistic title="Active Users" value={2847} trend="up" trendValue="+8%" />
      <Statistic title="Churn Rate" value="3.2%" trend="down" trendValue="-0.5%" />
    </div>
  )
}`,
  },

  {
    name: 'Steps',
    importName: 'Steps',
    category: 'display',
    description: 'Multi-step progress indicator. Supports horizontal/vertical orientation, error state, clickable steps, and custom icons.',
    useCases: ['multi-step form', 'onboarding flow', 'progress indicator', 'wizard UI'],
    props: [
      { name: 'items', type: 'StepItem[]', required: true, description: 'Array of step definitions ({ title, description?, status?, icon? })' },
      { name: 'current', type: 'number', required: true, description: 'Zero-based index of the current step' },
      { name: 'direction', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Layout direction' },
      { name: 'onChange', type: '(index: number) => void', required: false, description: 'Called when a step is clicked (makes steps clickable)' },
    ],
    example: `import { Steps } from '@dangbt/pro-ui'
import { useState } from 'react'

export function OnboardingWizard() {
  const [step, setStep] = useState(0)

  return (
    <Steps
      current={step}
      onChange={setStep}
      items={[
        { title: 'Account', description: 'Create your account' },
        { title: 'Profile', description: 'Set up your profile' },
        { title: 'Done', description: 'All set!' },
      ]}
    />
  )
}`,
  },

  {
    name: 'Empty',
    importName: 'Empty',
    category: 'display',
    description: 'Empty state placeholder with optional custom image, title, description, and action button.',
    useCases: ['empty state', 'no data placeholder', 'zero state UI'],
    props: [
      { name: 'title', type: 'string', required: false, default: "'No data'", description: 'Empty state headline' },
      { name: 'description', type: 'string', required: false, description: 'Supporting text' },
      { name: 'image', type: 'ReactNode', required: false, description: 'Custom illustration or icon' },
      { name: 'action', type: 'ReactNode', required: false, description: 'CTA button or link' },
    ],
    example: `import { Empty, Button } from '@dangbt/pro-ui'

export function EmptyUsers() {
  return (
    <Empty
      title="No users yet"
      description="Add your first user to get started."
      action={<Button variant="solid" onPress={() => {}}>Add User</Button>}
    />
  )
}`,
  },

  // ─── FOUNDATION ───────────────────────────────────────────────────────────
  {
    name: 'Button',
    importName: 'Button',
    category: 'form',
    description: 'Accessible button with variants (solid, outline, ghost, danger), sizes, loading state, and icon support. Built on React Aria.',
    useCases: ['primary action', 'secondary action', 'danger action', 'icon button', 'loading button'],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", required: false, default: "'secondary'", description: 'Visual style' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Button size' },
      { name: 'loading', type: 'boolean', required: false, description: 'Show spinner and disable interaction' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the button' },
      { name: 'onPress', type: '() => void', required: false, description: 'Press handler (use onPress, not onClick)' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", required: false, default: "'button'", description: 'HTML button type' },
    ],
    example: `import { Button } from '@dangbt/pro-ui'
import { Plus, Trash2 } from 'lucide-react'

// Variants
<Button variant="primary" onPress={handleSave}>Save</Button>
<Button variant="secondary" onPress={handleCancel}>Cancel</Button>
<Button variant="ghost" onPress={handleEdit}>Edit</Button>
<Button variant="danger" onPress={handleDelete}>Delete</Button>

// With icon
<Button variant="primary" onPress={handleAdd}>
  <Plus size={16} /> Add Item
</Button>

// Loading state
<Button variant="primary" loading={isSubmitting} type="submit">
  Submit
</Button>`,
  },

  {
    name: 'Input',
    importName: 'Input',
    category: 'form',
    description: 'Text input field with label, description, error message, prefix/suffix icons. Built on React Aria.',
    useCases: ['text input', 'search field', 'email input', 'password field'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Input label' },
      { name: 'type', type: 'string', required: false, default: "'text'", description: 'HTML input type (text, email, password, etc.)' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'description', type: 'string', required: false, description: 'Helper text below input' },
      { name: 'errorMessage', type: 'string', required: false, description: 'Error text (also sets invalid state)' },
      { name: 'prefix', type: 'ReactNode', required: false, description: 'Icon or text before input' },
      { name: 'suffix', type: 'ReactNode', required: false, description: 'Icon or text after input' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the input' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Input size' },
    ],
    example: `import { Input } from '@dangbt/pro-ui'
import { Search, Mail } from 'lucide-react'

<Input label="Email" type="email" placeholder="you@example.com" prefix={<Mail size={14} />} />
<Input label="Search" placeholder="Search..." prefix={<Search size={14} />} />
<Input label="Name" errorMessage="Name is required" />`,
  },

  {
    name: 'Select',
    importName: 'Select',
    category: 'form',
    description: 'Accessible dropdown select with keyboard navigation, search, and custom option rendering.',
    useCases: ['dropdown selection', 'enum picker', 'status selector'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Select label' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder when no value selected' },
      { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Options list' },
      { name: 'errorMessage', type: 'string', required: false, description: 'Error state text' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the select' },
    ],
    example: `import { Select } from '@dangbt/pro-ui'

<Select
  label="Role"
  placeholder="Select a role"
  options={[
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'viewer', label: 'Viewer' },
  ]}
/>`,
  },

  {
    name: 'Badge',
    importName: 'Badge',
    category: 'display',
    description: 'Small status label with color variants for indicating states.',
    useCases: ['status badge', 'tag', 'label chip', 'count indicator'],
    props: [
      { name: 'variant', type: "'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'", required: false, default: "'default'", description: 'Color variant' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Badge content' },
    ],
    example: `import { Badge } from '@dangbt/pro-ui'

<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">Draft</Badge>`,
  },

  {
    name: 'Card',
    importName: 'Card',
    category: 'display',
    description: 'Container card with optional header, footer, padding, and shadow.',
    useCases: ['content card', 'info panel', 'dashboard widget', 'settings section'],
    props: [
      { name: 'header', type: 'ReactNode', required: false, description: 'Card header content' },
      { name: 'footer', type: 'ReactNode', required: false, description: 'Card footer content' },
      { name: 'noPadding', type: 'boolean', required: false, description: 'Remove default padding' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Card body content' },
    ],
    example: `import { Card } from '@dangbt/pro-ui'

<Card header={<h3 className="font-semibold">Account Settings</h3>}>
  <p>Manage your account preferences here.</p>
</Card>`,
  },

  {
    name: 'Menu',
    importName: 'Menu, MenuItem, MenuSection',
    category: 'overlay',
    description: 'Dropdown action menu with keyboard navigation, sections, and icons.',
    useCases: ['action menu', 'context menu', 'dropdown options', 'more options button'],
    props: [
      { name: 'items', type: 'MenuItemDef[]', required: true, description: 'Menu item definitions' },
      { name: 'placement', type: 'Placement', required: false, description: 'Menu placement relative to trigger' },
    ],
    example: `import { Menu, Button } from '@dangbt/pro-ui'
import { DialogTrigger } from 'react-aria-components'
import { MoreHorizontal } from 'lucide-react'

<DialogTrigger>
  <Button variant="ghost" size="sm"><MoreHorizontal size={16} /></Button>
  <Menu
    items={[
      { key: 'edit', label: 'Edit', onAction: () => handleEdit() },
      { key: 'duplicate', label: 'Duplicate', onAction: () => handleDuplicate() },
      { key: 'delete', label: 'Delete', danger: true, onAction: () => handleDelete() },
    ]}
  />
</DialogTrigger>`,
  },

  {
    name: 'Tabs',
    importName: 'Tabs, TabList, Tab, TabPanel',
    category: 'display',
    description: 'Accessible tab navigation with keyboard support.',
    useCases: ['tab navigation', 'content switcher', 'section tabs'],
    props: [
      { name: 'defaultSelectedKey', type: 'string', required: false, description: 'Default selected tab key' },
      { name: 'onSelectionChange', type: '(key: Key) => void', required: false, description: 'Called on tab change' },
    ],
    example: `import { Tabs, TabList, Tab, TabPanel } from '@dangbt/pro-ui'

<Tabs defaultSelectedKey="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="activity">Activity</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel id="overview">Overview content</TabPanel>
  <TabPanel id="activity">Activity content</TabPanel>
  <TabPanel id="settings">Settings content</TabPanel>
</Tabs>`,
  },

  {
    name: 'Alert',
    importName: 'Alert',
    category: 'feedback',
    description: 'Inline alert message with icon and color variants for info, success, warning, and error states.',
    useCases: ['inline alert', 'warning message', 'error banner', 'info notice'],
    props: [
      { name: 'variant', type: "'info' | 'success' | 'warning' | 'danger'", required: false, default: "'info'", description: 'Alert severity' },
      { name: 'title', type: 'string', required: false, description: 'Alert headline' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Alert body text' },
      { name: 'onDismiss', type: '() => void', required: false, description: 'If provided, shows a dismiss button' },
    ],
    example: `import { Alert } from '@dangbt/pro-ui'

<Alert variant="warning" title="Heads up">
  Your trial expires in 3 days. Upgrade to keep access.
</Alert>
<Alert variant="danger" onDismiss={() => setError(null)}>
  Failed to save changes. Please try again.
</Alert>`,
  },

  {
    name: 'Avatar',
    importName: 'Avatar, AvatarGroup',
    category: 'display',
    description: 'User avatar with image, initials fallback, and size variants. AvatarGroup stacks multiple avatars.',
    useCases: ['user avatar', 'profile picture', 'team members display'],
    props: [
      { name: 'src', type: 'string', required: false, description: 'Image URL' },
      { name: 'name', type: 'string', required: false, description: 'Name for initials fallback and aria-label' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", required: false, default: "'md'", description: 'Avatar size' },
    ],
    example: `import { Avatar, AvatarGroup } from '@dangbt/pro-ui'

<Avatar src="/avatar.jpg" name="John Doe" size="md" />
<Avatar name="Jane Smith" size="lg" /> {/* initials fallback */}

<AvatarGroup max={3}>
  <Avatar name="Alice" />
  <Avatar name="Bob" />
  <Avatar name="Charlie" />
  <Avatar name="Diana" />
</AvatarGroup>`,
  },

  {
    name: 'Tooltip',
    importName: 'Tooltip',
    category: 'overlay',
    description: 'Accessible tooltip on hover/focus with customizable placement.',
    useCases: ['hover tooltip', 'icon label', 'help text on hover'],
    props: [
      { name: 'content', type: 'string | ReactNode', required: true, description: 'Tooltip text or content' },
      { name: 'placement', type: 'Placement', required: false, default: "'top'", description: 'Tooltip placement' },
      { name: 'children', type: 'ReactNode', required: true, description: 'The element that triggers the tooltip' },
    ],
    example: `import { Tooltip, Button } from '@dangbt/pro-ui'
import { Info } from 'lucide-react'

<Tooltip content="This field is required for compliance">
  <Button variant="ghost" size="sm"><Info size={14} /></Button>
</Tooltip>`,
  },

  {
    name: 'Spinner',
    importName: 'Spinner',
    category: 'feedback',
    description: 'Loading spinner with size and color variants.',
    useCases: ['loading indicator', 'async operation feedback'],
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Spinner size' },
    ],
    example: `import { Spinner } from '@dangbt/pro-ui'

{isLoading && <Spinner size="sm" />}`,
  },

  {
    name: 'Skeleton',
    importName: 'Skeleton',
    category: 'feedback',
    description: 'Content placeholder skeleton for loading states.',
    useCases: ['loading skeleton', 'content placeholder', 'shimmer loading'],
    props: [
      { name: 'className', type: 'string', required: false, description: 'Custom classes for size/shape (e.g. w-full h-4 rounded)' },
      { name: 'count', type: 'number', required: false, default: '1', description: 'Number of skeleton lines to render' },
    ],
    example: `import { Skeleton } from '@dangbt/pro-ui'

{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-4 w-3/4 rounded" />
    <Skeleton className="h-4 w-full rounded" />
    <Skeleton className="h-4 w-1/2 rounded" />
  </div>
) : <ActualContent />}`,
  },

  // ─── FORM: ADDITIONAL INPUTS ──────────────────────────────────────────────

  {
    name: 'Textarea',
    importName: 'Textarea',
    category: 'form',
    description: 'Multi-line text input with label, placeholder, and resize support.',
    useCases: ['multi-line input', 'description field', 'comments', 'long text input'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'rows', type: 'number', required: false, default: '3', description: 'Initial visible rows' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Input size' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the textarea' },
      { name: 'isReadOnly', type: 'boolean', required: false, description: 'Make the textarea read-only' },
    ],
    example: `import { Textarea } from '@dangbt/pro-ui'

<Textarea
  label="Description"
  placeholder="Write a description..."
  rows={4}
/>`,
  },

  {
    name: 'NumberField',
    importName: 'NumberField',
    category: 'form',
    description: 'Numeric input with increment/decrement buttons, min/max, and formatting support.',
    useCases: ['number input', 'quantity picker', 'price input', 'age field'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'minValue', type: 'number', required: false, description: 'Minimum allowed value' },
      { name: 'maxValue', type: 'number', required: false, description: 'Maximum allowed value' },
      { name: 'step', type: 'number', required: false, default: '1', description: 'Increment/decrement step' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Field size' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the field' },
    ],
    example: `import { NumberField } from '@dangbt/pro-ui'

<NumberField label="Quantity" minValue={1} maxValue={100} step={1} />
<NumberField label="Price" minValue={0} step={0.01} />`,
  },

  {
    name: 'SearchField',
    importName: 'SearchField',
    category: 'form',
    description: 'Search input with built-in search icon and clear button.',
    useCases: ['search input', 'filter field', 'quick search bar'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'placeholder', type: 'string', required: false, default: "'Search...'", description: 'Placeholder text' },
      { name: 'onSubmit', type: '(value: string) => void', required: false, description: 'Called on Enter or search submit' },
      { name: 'onChange', type: '(value: string) => void', required: false, description: 'Called on every keystroke' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the field' },
    ],
    example: `import { SearchField } from '@dangbt/pro-ui'

<SearchField
  placeholder="Search users..."
  onSubmit={(value) => handleSearch(value)}
/>`,
  },

  {
    name: 'Checkbox',
    importName: 'Checkbox, CheckboxGroup',
    category: 'form',
    description: 'Accessible checkbox with animated checkmark. CheckboxGroup renders a labeled group of checkboxes from an options array.',
    useCases: ['checkbox', 'multi-select options', 'terms acceptance', 'checkbox group'],
    props: [
      { name: 'isSelected', type: 'boolean', required: false, description: 'Controlled checked state' },
      { name: 'defaultSelected', type: 'boolean', required: false, description: 'Uncontrolled default state' },
      { name: 'onChange', type: '(isSelected: boolean) => void', required: false, description: 'Called when state changes' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the checkbox' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Checkbox size' },
      { name: 'children', type: 'ReactNode', required: false, description: 'Label content' },
    ],
    notes: 'CheckboxGroup props: `label`, `options: { value, label, disabled? }[]`, `orientation: "horizontal" | "vertical"`, `value`, `onChange`.',
    example: `import { Checkbox, CheckboxGroup } from '@dangbt/pro-ui'

// Single checkbox
<Checkbox defaultSelected>Accept terms and conditions</Checkbox>

// Group
<CheckboxGroup
  label="Permissions"
  options={[
    { value: 'read', label: 'Read' },
    { value: 'write', label: 'Write' },
    { value: 'admin', label: 'Admin', disabled: true },
  ]}
  defaultValue={['read']}
/>`,
  },

  {
    name: 'RadioGroup',
    importName: 'RadioGroup',
    category: 'form',
    description: 'Accessible radio button group rendered from an options array.',
    useCases: ['radio buttons', 'single choice', 'option picker', 'enum selection'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Group label' },
      { name: 'options', type: '{ value: string; label: string; description?: string; disabled?: boolean }[]', required: true, description: 'Radio options' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'vertical'", description: 'Layout direction' },
      { name: 'value', type: 'string', required: false, description: 'Controlled selected value' },
      { name: 'onChange', type: '(value: string) => void', required: false, description: 'Called when selection changes' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable all radios' },
    ],
    example: `import { RadioGroup } from '@dangbt/pro-ui'

<RadioGroup
  label="Billing Cycle"
  options={[
    { value: 'monthly', label: 'Monthly', description: '$9/month' },
    { value: 'yearly', label: 'Yearly', description: '$90/year — save 17%' },
  ]}
  defaultValue="monthly"
/>`,
  },

  {
    name: 'Switch',
    importName: 'Switch',
    category: 'form',
    description: 'Toggle switch for boolean settings. Visually distinct from a checkbox.',
    useCases: ['toggle switch', 'on/off setting', 'feature toggle', 'boolean preference'],
    props: [
      { name: 'isSelected', type: 'boolean', required: false, description: 'Controlled on/off state' },
      { name: 'defaultSelected', type: 'boolean', required: false, description: 'Uncontrolled default state' },
      { name: 'onChange', type: '(isSelected: boolean) => void', required: false, description: 'Called when toggled' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the switch' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Switch size' },
      { name: 'children', type: 'ReactNode', required: false, description: 'Label content' },
    ],
    example: `import { Switch } from '@dangbt/pro-ui'

<Switch defaultSelected>Email notifications</Switch>
<Switch isSelected={enabled} onChange={setEnabled}>
  Dark mode
</Switch>`,
  },

  {
    name: 'Slider',
    importName: 'Slider',
    category: 'form',
    description: 'Range slider with optional label and value output display.',
    useCases: ['range slider', 'volume control', 'price range', 'opacity slider'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Slider label' },
      { name: 'minValue', type: 'number', required: false, default: '0', description: 'Minimum value' },
      { name: 'maxValue', type: 'number', required: false, default: '100', description: 'Maximum value' },
      { name: 'step', type: 'number', required: false, default: '1', description: 'Step increment' },
      { name: 'defaultValue', type: 'number', required: false, description: 'Uncontrolled default value' },
      { name: 'value', type: 'number', required: false, description: 'Controlled value' },
      { name: 'onChange', type: '(value: number) => void', required: false, description: 'Called on change' },
      { name: 'showOutput', type: 'boolean', required: false, default: 'true', description: 'Show current value text' },
    ],
    example: `import { Slider } from '@dangbt/pro-ui'

<Slider label="Volume" defaultValue={70} />
<Slider label="Price range" minValue={0} maxValue={1000} step={10} defaultValue={200} />`,
  },

  {
    name: 'DatePicker',
    importName: 'DatePicker, DateRangePicker, DateField, Calendar, RangeCalendar',
    category: 'form',
    description: 'Date picker with calendar popover. Also includes DateRangePicker for date ranges, DateField for inline editing, and standalone Calendar.',
    useCases: ['date picker', 'date range picker', 'calendar', 'date input', 'booking dates'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'value', type: 'DateValue', required: false, description: 'Controlled date value (use @internationalized/date types)' },
      { name: 'defaultValue', type: 'DateValue', required: false, description: 'Uncontrolled default date' },
      { name: 'onChange', type: '(value: DateValue) => void', required: false, description: 'Called when date changes' },
      { name: 'minValue', type: 'DateValue', required: false, description: 'Minimum selectable date' },
      { name: 'maxValue', type: 'DateValue', required: false, description: 'Maximum selectable date' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the picker' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Field size' },
    ],
    notes: 'Requires `@internationalized/date` for DateValue types. Import: `import { today, getLocalTimeZone } from "@internationalized/date"`',
    example: `import { DatePicker, DateRangePicker } from '@dangbt/pro-ui'
import { today, getLocalTimeZone } from '@internationalized/date'

// Single date
<DatePicker label="Start date" />

// Date range
<DateRangePicker
  label="Booking period"
  minValue={today(getLocalTimeZone())}
/>`,
  },

  {
    name: 'TimeField',
    importName: 'TimeField',
    category: 'form',
    description: 'Time input with segmented hour/minute/second editing.',
    useCases: ['time input', 'time picker', 'schedule time', 'clock field'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'value', type: 'TimeValue', required: false, description: 'Controlled time value' },
      { name: 'defaultValue', type: 'TimeValue', required: false, description: 'Uncontrolled default time' },
      { name: 'onChange', type: '(value: TimeValue) => void', required: false, description: 'Called when time changes' },
      { name: 'hourCycle', type: '12 | 24', required: false, description: '12-hour or 24-hour display' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the field' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Field size' },
    ],
    example: `import { TimeField } from '@dangbt/pro-ui'

<TimeField label="Meeting time" />
<TimeField label="Closing time" hourCycle={24} />`,
  },

  {
    name: 'TagGroup',
    importName: 'TagGroup',
    category: 'form',
    description: 'Displays a list of tags with optional color variants and removal support.',
    useCases: ['tag list', 'chip group', 'label tags', 'removable tags', 'multi-select chips'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Group label' },
      { name: 'items', type: 'TagItem[]', required: true, description: 'Tag items ({ id, label, color? })' },
      { name: 'onRemove', type: '(keys: Selection) => void', required: false, description: 'If provided, shows remove button on each tag' },
      { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", required: false, description: 'Tag selection behavior' },
      { name: 'onSelectionChange', type: '(keys: Selection) => void', required: false, description: 'Called when selection changes' },
    ],
    example: `import { TagGroup } from '@dangbt/pro-ui'
import { useState } from 'react'

function TagsDemo() {
  const [tags, setTags] = useState([
    { id: '1', label: 'React', color: 'primary' as const },
    { id: '2', label: 'TypeScript', color: 'info' as const },
    { id: '3', label: 'Tailwind', color: 'success' as const },
  ])

  return (
    <TagGroup
      label="Skills"
      items={tags}
      onRemove={(keys) => setTags(tags.filter(t => !keys.has(t.id)))}
    />
  )
}`,
  },

  {
    name: 'ToggleButton',
    importName: 'ToggleButton, ToggleButtonGroup',
    category: 'form',
    description: 'Button that toggles on/off with selected state styling. ToggleButtonGroup manages single or multiple selection.',
    useCases: ['toggle button', 'on/off button', 'toolbar toggle', 'view mode switcher', 'filter toggle'],
    props: [
      { name: 'isSelected', type: 'boolean', required: false, description: 'Controlled selected state' },
      { name: 'defaultSelected', type: 'boolean', required: false, description: 'Uncontrolled default' },
      { name: 'onChange', type: '(isSelected: boolean) => void', required: false, description: 'Called when state changes' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the button' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Button size' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Button content' },
    ],
    notes: 'ToggleButtonGroup props: `selectionMode: "single" | "multiple"`, `selectedKeys`, `onSelectionChange`.',
    example: `import { ToggleButton, ToggleButtonGroup } from '@dangbt/pro-ui'
import { Grid, List } from 'lucide-react'

// Single toggle
<ToggleButton defaultSelected>Bold</ToggleButton>

// Group for view mode
<ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['grid']}>
  <ToggleButton id="grid"><Grid size={16} /> Grid</ToggleButton>
  <ToggleButton id="list"><List size={16} /> List</ToggleButton>
</ToggleButtonGroup>`,
  },

  {
    name: 'AsyncSelect',
    importName: 'AsyncSelect',
    category: 'form',
    description: 'Select with server-side search and infinite scroll. Fetches options on demand via a fetch function.',
    useCases: ['async dropdown', 'server-side search', 'large dataset select', 'user picker', 'infinite scroll select'],
    props: [
      { name: 'fetchOptions', type: '(params: { search: string; page: number; pageSize: number }) => Promise<{ options: T[]; hasMore: boolean }>', required: true, description: 'Async function to load options' },
      { name: 'value', type: 'string | null', required: false, description: 'Controlled selected value' },
      { name: 'onChange', type: '(value: string | null, option: T | null) => void', required: false, description: 'Called when selection changes' },
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'placeholder', type: 'string', required: false, default: "'Select...'", description: 'Placeholder text' },
      { name: 'pageSize', type: 'number', required: false, default: '20', description: 'Options per page' },
      { name: 'debounceMs', type: 'number', required: false, default: '300', description: 'Search debounce delay' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the select' },
    ],
    example: `import { AsyncSelect } from '@dangbt/pro-ui'

<AsyncSelect
  label="Assign user"
  placeholder="Search users..."
  fetchOptions={async ({ search, page, pageSize }) => {
    const res = await fetch(\`/api/users?q=\${search}&page=\${page}&limit=\${pageSize}\`)
    const data = await res.json()
    return { options: data.items, hasMore: data.hasMore }
  }}
  onChange={(value, option) => setAssignee(value)}
/>`,
  },

  {
    name: 'ComboBox',
    importName: 'ComboBox',
    category: 'form',
    description: 'Editable select with typeahead filtering. User can type to filter options from a static list.',
    useCases: ['combobox', 'typeahead', 'filterable dropdown', 'editable select'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'placeholder', type: 'string', required: false, default: "'Type to search...'", description: 'Input placeholder' },
      { name: 'options', type: '{ value: string; label: string }[]', required: true, description: 'Available options' },
      { name: 'selectedKey', type: 'string', required: false, description: 'Controlled selected value' },
      { name: 'onSelectionChange', type: '(key: string) => void', required: false, description: 'Called when an option is selected' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the field' },
    ],
    example: `import { ComboBox } from '@dangbt/pro-ui'

<ComboBox
  label="Country"
  placeholder="Search countries..."
  options={[
    { value: 'vn', label: 'Vietnam' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
/>`,
  },

  {
    name: 'Autocomplete',
    importName: 'Autocomplete',
    category: 'form',
    description: 'Search field with a filtered suggestion list below. Items filter as the user types.',
    useCases: ['autocomplete', 'live search suggestions', 'type-ahead suggestions', 'command palette'],
    props: [
      { name: 'label', type: 'string', required: false, description: 'Field label' },
      { name: 'placeholder', type: 'string', required: false, default: "'Search...'", description: 'Input placeholder' },
      { name: 'items', type: '{ id: string; label: string; description?: string }[]', required: true, description: 'Items to filter and show' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Field size' },
    ],
    example: `import { Autocomplete } from '@dangbt/pro-ui'

<Autocomplete
  label="Select framework"
  items={[
    { id: 'react', label: 'React', description: 'UI library by Meta' },
    { id: 'vue', label: 'Vue', description: 'Progressive framework' },
    { id: 'svelte', label: 'Svelte', description: 'Compiler framework' },
  ]}
/>`,
  },

  {
    name: 'FileTrigger',
    importName: 'FileTrigger',
    category: 'form',
    description: 'Wraps a button/element to trigger a file picker dialog. Use alongside DropZone or a custom upload button.',
    useCases: ['file upload button', 'image upload trigger', 'document upload'],
    props: [
      { name: 'acceptedFileTypes', type: 'string[]', required: false, description: 'Allowed MIME types (e.g. ["image/*", "application/pdf"])' },
      { name: 'allowsMultiple', type: 'boolean', required: false, description: 'Allow selecting multiple files' },
      { name: 'onSelect', type: '(files: FileList | null) => void', required: false, description: 'Called with selected files' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Trigger element (typically a Button)' },
    ],
    example: `import { FileTrigger, Button } from '@dangbt/pro-ui'

<FileTrigger
  acceptedFileTypes={['image/*']}
  allowsMultiple={false}
  onSelect={(files) => files && handleUpload(files[0])}
>
  <Button variant="outline">Upload Image</Button>
</FileTrigger>`,
  },

  {
    name: 'DropZone',
    importName: 'DropZone',
    category: 'form',
    description: 'Drag-and-drop file upload zone with visual drop target feedback and click-to-browse fallback.',
    useCases: ['drag and drop upload', 'file drop zone', 'image upload area', 'document upload'],
    props: [
      { name: 'label', type: 'string', required: false, default: "'Drop files here'", description: 'Primary label text' },
      { name: 'description', type: 'string', required: false, description: 'Supporting description text' },
      { name: 'accept', type: 'string[]', required: false, description: 'Accepted MIME types (e.g. ["image/*"])' },
      { name: 'allowsMultiple', type: 'boolean', required: false, description: 'Allow multiple files' },
      { name: 'onFiles', type: '(files: FileList) => void', required: false, description: 'Called with dropped or selected files' },
      { name: 'isDisabled', type: 'boolean', required: false, default: 'false', description: 'Disables drag, click, and keyboard interaction' },
    ],
    example: `import { DropZone } from '@dangbt/pro-ui'

<DropZone
  label="Drop images here"
  description="PNG, JPG up to 5MB"
  accept={['image/*']}
  onFiles={(files) => handleUpload(files)}
/>

// Disabled state:
<DropZone label="Upload disabled" isDisabled />`,
  },

  {
    name: 'ColorPicker',
    importName: 'ColorPicker, ColorSwatch, ColorSwatchPicker, ColorField, ColorArea, ColorWheel, ColorSlider',
    category: 'form',
    description: 'Full-featured color picker with color wheel, area, field, and swatch picker. Compose as needed.',
    useCases: ['color picker', 'color selector', 'theme color', 'paint tool'],
    props: [
      { name: 'value', type: 'Color', required: false, description: 'Controlled color value (use Color type from @dangbt/pro-ui)' },
      { name: 'defaultValue', type: 'string | Color', required: false, description: 'Uncontrolled default color (e.g. "#ff0000")' },
      { name: 'onChange', type: '(color: Color) => void', required: false, description: 'Called when color changes' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Trigger element (e.g. ColorSwatch)' },
    ],
    notes: 'ColorPicker is a dialog trigger — wrap ColorArea/ColorWheel inside its popover. ColorSwatchPicker renders a grid of preset colors.',
    example: `import { ColorPicker, ColorSwatch, ColorSwatchPicker, ColorField } from '@dangbt/pro-ui'
import { DialogTrigger } from 'react-aria-components'

<ColorPicker defaultValue="#0ea5e9">
  <ColorSwatch size="md" />
</ColorPicker>

// Swatch picker with presets:
<ColorSwatchPicker
  defaultValue="#ef4444"
  onChange={(color) => console.log(color.toString('hex'))}
>
  {['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6'].map(c => (
    <ColorSwatch key={c} color={c} />
  ))}
</ColorSwatchPicker>`,
  },

  // ─── FEEDBACK: ADDITIONAL ─────────────────────────────────────────────────

  {
    name: 'ProgressBar',
    importName: 'ProgressBar',
    category: 'feedback',
    description: 'Horizontal progress bar with value, label, and indeterminate mode for unknown durations.',
    useCases: ['progress bar', 'upload progress', 'task completion', 'loading bar', 'indeterminate loading'],
    props: [
      { name: 'value', type: 'number', required: false, description: 'Current value (0–100 by default)' },
      { name: 'minValue', type: 'number', required: false, default: '0', description: 'Minimum value' },
      { name: 'maxValue', type: 'number', required: false, default: '100', description: 'Maximum value' },
      { name: 'label', type: 'string', required: false, description: 'Progress label' },
      { name: 'showValue', type: 'boolean', required: false, default: 'false', description: 'Show percentage text' },
      { name: 'variant', type: "'primary' | 'success' | 'warning' | 'danger'", required: false, default: "'primary'", description: 'Color variant' },
      { name: 'size', type: "'sm' | 'md'", required: false, default: "'md'", description: 'Track height' },
      { name: 'isIndeterminate', type: 'boolean', required: false, description: 'Animate as indeterminate (unknown duration)' },
    ],
    example: `import { ProgressBar } from '@dangbt/pro-ui'

<ProgressBar label="Upload progress" value={65} showValue />
<ProgressBar variant="success" value={100} />
<ProgressBar isIndeterminate label="Processing..." />`,
  },

  {
    name: 'Meter',
    importName: 'Meter',
    category: 'feedback',
    description: 'Gauge bar for measured quantities like storage usage. Auto-colors from success→warning→danger based on percentage.',
    useCases: ['storage meter', 'usage indicator', 'capacity gauge', 'disk usage', 'resource meter'],
    props: [
      { name: 'value', type: 'number', required: true, description: 'Current value' },
      { name: 'minValue', type: 'number', required: false, default: '0', description: 'Minimum value' },
      { name: 'maxValue', type: 'number', required: false, default: '100', description: 'Maximum value' },
      { name: 'label', type: 'string', required: false, description: 'Meter label' },
      { name: 'showValue', type: 'boolean', required: false, default: 'true', description: 'Show value text' },
      { name: 'variant', type: "'auto' | 'primary' | 'success' | 'warning' | 'danger'", required: false, default: "'auto'", description: 'Color variant. "auto" changes color based on percentage.' },
      { name: 'size', type: "'sm' | 'md'", required: false, default: "'md'", description: 'Track height' },
    ],
    example: `import { Meter } from '@dangbt/pro-ui'

<Meter label="Storage used" value={73} maxValue={100} />
<Meter label="CPU" value={90} variant="danger" />`,
  },

  // ─── DISPLAY / NAVIGATION: ADDITIONAL ────────────────────────────────────

  {
    name: 'Breadcrumbs',
    importName: 'Breadcrumbs',
    category: 'display',
    description: 'Navigation breadcrumb trail with chevron separators and accessible current-page marking.',
    useCases: ['breadcrumb navigation', 'page path', 'hierarchical navigation'],
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', required: true, description: 'Breadcrumb items ({ id, label, href? })' },
    ],
    example: `import { Breadcrumbs } from '@dangbt/pro-ui'

<Breadcrumbs
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'users', label: 'Users', href: '/users' },
    { id: 'current', label: 'John Doe' },
  ]}
/>`,
  },

  {
    name: 'Disclosure',
    importName: 'Disclosure, Accordion',
    category: 'display',
    description: 'Collapsible panel with animated expand/collapse. Accordion groups multiple Disclosures with only one open at a time.',
    useCases: ['collapsible section', 'FAQ accordion', 'expandable panel', 'disclosure widget'],
    props: [
      { name: 'title', type: 'string', required: true, description: 'Panel header title (trigger text)' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Panel body content' },
      { name: 'defaultExpanded', type: 'boolean', required: false, description: 'Open by default' },
      { name: 'isExpanded', type: 'boolean', required: false, description: 'Controlled expanded state' },
    ],
    notes: 'Accordion wraps multiple Disclosure components and ensures only one is open. It passes no extra props beyond children.',
    example: `import { Disclosure, Accordion } from '@dangbt/pro-ui'

// Standalone
<Disclosure title="What is pro-ui?" defaultExpanded>
  A React component library built on React Aria and Tailwind CSS.
</Disclosure>

// FAQ accordion
<Accordion>
  <Disclosure title="How do I install?">
    Run npm install @dangbt/pro-ui.
  </Disclosure>
  <Disclosure title="Does it support dark mode?">
    Yes, via ThemeProvider with system/light/dark modes.
  </Disclosure>
</Accordion>`,
  },

  {
    name: 'Link',
    importName: 'Link',
    category: 'display',
    description: 'Accessible anchor link with underline styling and color variants.',
    useCases: ['inline link', 'navigation link', 'external link', 'text link'],
    props: [
      { name: 'href', type: 'string', required: false, description: 'Link URL' },
      { name: 'variant', type: "'default' | 'muted' | 'danger'", required: false, default: "'default'", description: 'Link color' },
      { name: 'target', type: 'string', required: false, description: 'HTML target (_blank for new tab)' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Link text or content' },
    ],
    example: `import { Link } from '@dangbt/pro-ui'

<Link href="/dashboard">Go to Dashboard</Link>
<Link href="https://example.com" target="_blank" variant="muted">External link</Link>
<Link variant="danger" onPress={handleDelete}>Delete account</Link>`,
  },

  {
    name: 'Divider',
    importName: 'Divider',
    category: 'display',
    description: 'Horizontal or vertical separator line, optionally with a centered label.',
    useCases: ['section divider', 'horizontal rule', 'vertical separator', 'OR divider'],
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Divider direction' },
      { name: 'label', type: 'string', required: false, description: 'Centered label text (horizontal only)' },
    ],
    example: `import { Divider } from '@dangbt/pro-ui'

<Divider />
<Divider label="OR" />
<div className="flex gap-4 h-8">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>`,
  },

  {
    name: 'ListBox',
    importName: 'ListBox',
    category: 'display',
    description: 'Selectable list with optional sections, icons, descriptions, and single/multiple selection.',
    useCases: ['selectable list', 'option list', 'command list', 'grouped list'],
    props: [
      { name: 'items', type: '(ListBoxOption | ListBoxSection)[]', required: true, description: 'Flat list or sectioned list of options' },
      { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", required: false, description: 'Selection behavior' },
      { name: 'selectedKeys', type: 'Selection', required: false, description: 'Controlled selected keys' },
      { name: 'onSelectionChange', type: '(keys: Selection) => void', required: false, description: 'Called when selection changes' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Item text size' },
    ],
    example: `import { ListBox } from '@dangbt/pro-ui'
import { User, Settings, LogOut } from 'lucide-react'

<ListBox
  selectionMode="single"
  items={[
    { id: 'profile', label: 'Profile', icon: <User size={14} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={14} /> },
    { id: 'logout', label: 'Log out', icon: <LogOut size={14} />, description: 'Sign out of your account' },
  ]}
  onSelectionChange={(keys) => handleSelect(keys)}
/>`,
  },

  {
    name: 'GridList',
    importName: 'GridList',
    category: 'display',
    description: 'Interactive grid list with optional checkbox selection, icons, and descriptions. Good for multi-select UIs.',
    useCases: ['multi-select list', 'checkbox list', 'selectable rows', 'permission list'],
    props: [
      { name: 'items', type: 'GridListOption[]', required: true, description: 'Items ({ id, label, description?, icon?, disabled? })' },
      { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", required: false, description: 'Selection behavior' },
      { name: 'selectedKeys', type: 'Selection', required: false, description: 'Controlled selected keys' },
      { name: 'onSelectionChange', type: '(keys: Selection) => void', required: false, description: 'Called when selection changes' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Item text size' },
    ],
    example: `import { GridList } from '@dangbt/pro-ui'

<GridList
  selectionMode="multiple"
  items={[
    { id: 'email', label: 'Email notifications', description: 'Get notified via email' },
    { id: 'sms', label: 'SMS notifications', description: 'Get notified via SMS' },
    { id: 'push', label: 'Push notifications', description: 'Browser push alerts' },
  ]}
/>`,
  },

  {
    name: 'Tree',
    importName: 'Tree',
    category: 'display',
    description: 'Hierarchical tree view with expandable nodes, optional icons, and selection support.',
    useCases: ['file tree', 'folder structure', 'hierarchical menu', 'nested navigation', 'category tree'],
    props: [
      { name: 'items', type: 'TreeNode[]', required: true, description: 'Tree nodes ({ id, label, icon?, children?: TreeNode[] })' },
      { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", required: false, description: 'Selection behavior' },
      { name: 'selectedKeys', type: 'Selection', required: false, description: 'Controlled selected keys' },
      { name: 'onSelectionChange', type: '(keys: Selection) => void', required: false, description: 'Called when selection changes' },
      { name: 'defaultExpandedKeys', type: 'Iterable<Key>', required: false, description: 'Keys of nodes expanded by default' },
    ],
    example: `import { Tree } from '@dangbt/pro-ui'
import { Folder, File } from 'lucide-react'

<Tree
  selectionMode="single"
  items={[
    {
      id: 'src',
      label: 'src',
      icon: <Folder size={14} />,
      children: [
        { id: 'components', label: 'components', icon: <Folder size={14} /> },
        { id: 'app', label: 'app.tsx', icon: <File size={14} /> },
      ],
    },
    { id: 'package', label: 'package.json', icon: <File size={14} /> },
  ]}
/>`,
  },

  {
    name: 'Toolbar',
    importName: 'Toolbar, ToolbarSeparator',
    category: 'display',
    description: 'Container for a row of action buttons or controls, with keyboard navigation between items.',
    useCases: ['action toolbar', 'editor toolbar', 'button row', 'formatting bar'],
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", required: false, default: "'horizontal'", description: 'Toolbar direction' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Toolbar items (Buttons, ToggleButtons, etc.)' },
    ],
    notes: 'Use ToolbarSeparator to add a visual vertical divider between groups of buttons.',
    example: `import { Toolbar, ToolbarSeparator, Button, ToggleButton } from '@dangbt/pro-ui'
import { Bold, Italic, Underline, AlignLeft, AlignCenter } from 'lucide-react'

<Toolbar>
  <ToggleButton size="sm"><Bold size={14} /></ToggleButton>
  <ToggleButton size="sm"><Italic size={14} /></ToggleButton>
  <ToggleButton size="sm"><Underline size={14} /></ToggleButton>
  <ToolbarSeparator />
  <ToggleButton size="sm"><AlignLeft size={14} /></ToggleButton>
  <ToggleButton size="sm"><AlignCenter size={14} /></ToggleButton>
</Toolbar>`,
  },
]

export const CATEGORIES = {
  data: 'Data Display & Tables',
  form: 'Forms & Inputs',
  layout: 'Layout',
  overlay: 'Overlays & Modals',
  feedback: 'Feedback & Status',
  display: 'Display & Typography',
  theme: 'Theming',
} as const
