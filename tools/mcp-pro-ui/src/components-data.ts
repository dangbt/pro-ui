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
      { name: 'request', type: '(params: QueryParams) => Promise<RequestResult<T>>', required: false, description: 'Server-side data fetcher. Mutually exclusive with dataSource.' },
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
      { name: 'variant', type: "'solid' | 'outline' | 'ghost' | 'danger'", required: false, default: "'outline'", description: 'Visual style' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Button size' },
      { name: 'loading', type: 'boolean', required: false, description: 'Show spinner and disable interaction' },
      { name: 'isDisabled', type: 'boolean', required: false, description: 'Disable the button' },
      { name: 'onPress', type: '() => void', required: false, description: 'Press handler (use onPress, not onClick)' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", required: false, default: "'button'", description: 'HTML button type' },
    ],
    example: `import { Button } from '@dangbt/pro-ui'
import { Plus, Trash2 } from 'lucide-react'

// Variants
<Button variant="solid" onPress={handleSave}>Save</Button>
<Button variant="outline" onPress={handleCancel}>Cancel</Button>
<Button variant="ghost" onPress={handleEdit}>Edit</Button>
<Button variant="danger" onPress={handleDelete}>Delete</Button>

// With icon
<Button variant="solid" onPress={handleAdd}>
  <Plus size={16} /> Add Item
</Button>

// Loading state
<Button variant="solid" loading={isSubmitting} type="submit">
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
