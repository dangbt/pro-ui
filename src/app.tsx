import { useState } from 'react'
import { today, getLocalTimeZone, isWeekend } from '@internationalized/date'
import {
  Button, Input, Textarea, NumberField, SearchField,
  Select, ComboBox, Checkbox, CheckboxGroup, RadioGroup,
  Switch, Slider, DatePicker, DateRangePicker, TagGroup,
  Modal, ConfirmModal, Tooltip, Menu, Tabs, Breadcrumbs,
  ProgressBar, Alert, Spinner, Badge, Card,
  Avatar, AvatarGroup, Divider, Skeleton, ProTable,
} from './components'
import type { ProColumnType, QueryParams, TagItem } from './components'
import { cn } from './lib/cn'

/* ─── ProTable mock data ─────────────────────────────────────────────────── */

type User = {
  id: string; name: string; email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  revenue: number; createdAt: string
}

const MOCK: User[] = Array.from({ length: 87 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do','Grace Bui','Hank Vu'][i % 8]! + ` #${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: (['admin','editor','viewer'] as const)[i % 3]!,
  status: (['active','active','active','inactive','pending'] as const)[i % 5]!,
  revenue: Math.floor(Math.random() * 50_000_000) + 1_000_000,
  createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}))

function mockRequest(p: QueryParams) {
  return new Promise<{ data: User[]; total: number; success: boolean }>(ok => setTimeout(() => {
    let f = [...MOCK]
    if (p.name)   f = f.filter(u => u.name.toLowerCase().includes(String(p.name).toLowerCase()))
    if (p.status) f = f.filter(u => u.status === p.status)
    if (p.role)   f = f.filter(u => u.role === p.role)
    const total = f.length
    const s = ((p.current as number) - 1) * (p.pageSize as number)
    ok({ data: f.slice(s, s + (p.pageSize as number)), total, success: true })
  }, 350))
}

const TABLE_COLS: ProColumnType<User>[] = [
  { title: 'Name',    dataIndex: 'name',      sortable: true, width: 200 },
  { title: 'Email',   dataIndex: 'email',     width: 220 },
  { title: 'Role',    dataIndex: 'role',      valueType: 'select', valueEnum: { admin: { text: 'Admin', color: 'danger' }, editor: { text: 'Editor', color: 'warning' }, viewer: { text: 'Viewer', color: 'info' } } },
  { title: 'Status',  dataIndex: 'status',    valueType: 'select', valueEnum: { active: { text: 'Active', color: 'success' }, inactive: { text: 'Inactive', color: 'default' }, pending: { text: 'Pending', color: 'warning' } } },
  { title: 'Revenue', dataIndex: 'revenue',   valueType: 'money', sortable: true, align: 'right', hideInSearch: true },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date',  sortable: true, hideInSearch: true },
  {
    title: 'Actions', key: 'actions', hideInSearch: true, align: 'center', width: 120,
    render: (_v, r) => (
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => alert(`Edit ${r.name}`)} className="text-primary text-xs font-medium px-2 py-1 hover:bg-primary-50 rounded-[var(--base-radius)] transition-colors">Edit</button>
        <button onClick={() => alert(`Delete ${r.name}`)} className="text-danger text-xs font-medium px-2 py-1 hover:bg-danger-50 rounded-[var(--base-radius)] transition-colors">Delete</button>
      </div>
    ),
  },
]

/* ─── Navigation ─────────────────────────────────────────────────────────── */

type NavItem = { id: string; label: string }
type NavGroup = { group: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { id: 'overview', label: 'Introduction'  },
      { id: 'colors',   label: 'Color system'  },
    ],
  },
  {
    group: 'Form',
    items: [
      { id: 'text-inputs',  label: 'Text inputs'        },
      { id: 'select',       label: 'Select & ComboBox'  },
      { id: 'datetime',     label: 'Date & Time'        },
      { id: 'toggles',      label: 'Toggles & Choices'  },
      { id: 'slider',       label: 'Slider & Range'     },
      { id: 'tags',         label: 'Tags'               },
    ],
  },
  {
    group: 'Overlay',
    items: [
      { id: 'modal',   label: 'Modal & Dialog'  },
      { id: 'tooltip', label: 'Tooltip'         },
      { id: 'menu',    label: 'Dropdown Menu'   },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { id: 'tabs',        label: 'Tabs'        },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
    ],
  },
  {
    group: 'Display',
    items: [
      { id: 'badge',    label: 'Badge'              },
      { id: 'alert',    label: 'Alert'              },
      { id: 'card',     label: 'Card'               },
      { id: 'avatar',   label: 'Avatar'             },
      { id: 'progress', label: 'Progress & Spinner' },
      { id: 'skeleton', label: 'Skeleton & Divider' },
    ],
  },
  {
    group: 'Data',
    items: [{ id: 'protable', label: 'ProTable' }],
  },
]

/* ─── Demo block ─────────────────────────────────────────────────────────── */

function Demo({
  label,
  children,
  className,
  center = true,
}: {
  label: string
  children: React.ReactNode
  className?: string
  center?: boolean
}) {
  return (
    <div className="rounded-[var(--base-radius)] border border-gray-200 overflow-hidden">
      <div className="px-3.5 py-2 border-b border-gray-100 bg-gray-50/80">
        <span className="text-[11px] font-mono font-medium text-gray-400 tracking-wide select-none">
          {label}
        </span>
      </div>
      <div className={cn('p-6 bg-white', center && 'flex items-center justify-center', className)}>
        {children}
      </div>
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  )
}

/* ─── Section content ────────────────────────────────────────────────────── */

function Overview() {
  const stats = [
    { count: 13, label: 'Form',    color: 'bg-primary-50  text-primary-700'  },
    { count: 5,  label: 'Overlay', color: 'bg-info-50     text-info-700'     },
    { count: 8,  label: 'Display', color: 'bg-success-50  text-success-700'  },
    { count: 1,  label: 'Data',    color: 'bg-warning-50  text-warning-700'  },
  ]

  return (
    <div className="space-y-8">
      <div className="border border-gray-200 rounded-[var(--base-radius)] p-8 bg-gradient-to-br from-primary-50/60 to-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-[var(--base-radius)] bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">pro-ui</span>
          <Badge color="info">v0.1</Badge>
        </div>
        <p className="text-gray-600 text-sm max-w-lg mb-6">
          UI framework built on <strong>React Aria Components</strong> + <strong>Tailwind v4</strong>.
          Single <code className="text-primary bg-primary-50 px-1 rounded font-mono text-xs">--primary</code> token,
          3 radius presets, full accessibility out of the box.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className={cn('rounded-[var(--base-radius)] px-4 py-3', s.color)}>
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Button — 4 variants">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Demo>
        <Demo label="Badge — 6 colors">
          <div className="flex flex-wrap gap-2">
            {(['default','primary','success','warning','danger','info'] as const).map(c => (
              <Badge key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
            ))}
          </div>
        </Demo>
        <Demo label="Alert">
          <div className="w-full space-y-2">
            <Alert variant="success" closable>Changes saved successfully.</Alert>
            <Alert variant="warning">Your session will expire soon.</Alert>
          </div>
        </Demo>
        <Demo label="Avatar & AvatarGroup">
          <div className="space-y-3 text-center">
            <div className="flex items-end justify-center gap-2">
              {(['xs','sm','md','lg'] as const).map(s => (
                <Avatar key={s} name="Alice Nguyen" size={s} />
              ))}
            </div>
            <AvatarGroup
              size="sm"
              avatars={['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do'].map(n => ({ name: n }))}
              max={4}
            />
          </div>
        </Demo>
        <Demo label="ProgressBar">
          <div className="w-full space-y-3">
            <ProgressBar value={65} maxValue={100} label="Upload" variant="primary" showValue />
            <ProgressBar value={85} maxValue={100} label="CPU"    variant="danger"  showValue />
          </div>
        </Demo>
        <Demo label="Switch & Checkbox">
          <div className="space-y-3">
            <Switch defaultSelected>Notifications</Switch>
            <Switch>Dark mode</Switch>
            <Checkbox defaultSelected>Remember me</Checkbox>
            <Checkbox>Subscribe to updates</Checkbox>
          </div>
        </Demo>
      </div>
    </div>
  )
}

function TextInputsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Text Inputs" description="Accessible text entry components built on React Aria TextField." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Input" center={false}><Input label="Label" placeholder="Placeholder text..." className="w-full" /></Demo>
        <Demo label="Input — disabled" center={false}><Input label="Disabled" placeholder="Not editable" isDisabled className="w-full" /></Demo>
        <Demo label="Input — readonly" center={false}><Input label="Read only" defaultValue="Read-only value" isReadOnly className="w-full" /></Demo>
        <Demo label="Textarea" center={false}><Textarea label="Message" placeholder="Write something..." rows={3} className="w-full" /></Demo>
        <Demo label="NumberField" center={false}><NumberField label="Quantity" defaultValue={1} minValue={0} maxValue={99} className="w-full" /></Demo>
        <Demo label="SearchField" center={false}><SearchField label="Search" placeholder="Search anything..." className="w-full" /></Demo>
      </div>
    </div>
  )
}

function SelectSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Select & ComboBox" description="Dropdown selection and autocomplete inputs." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Select" center={false}>
          <Select
            label="Framework"
            placeholder="Choose one..."
            className="w-full"
            options={[
              { value: 'react', label: 'React' },
              { value: 'vue', label: 'Vue' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'angular', label: 'Angular' },
            ]}
          />
        </Demo>
        <Demo label="Select — with default" center={false}>
          <Select
            label="Status"
            defaultSelectedKey="active"
            className="w-full"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ]}
          />
        </Demo>
        <Demo label="ComboBox — autocomplete" center={false}>
          <ComboBox
            label="Language"
            placeholder="Type to filter..."
            className="w-full"
            options={[
              { value: 'js', label: 'JavaScript' },
              { value: 'ts', label: 'TypeScript' },
              { value: 'py', label: 'Python' },
              { value: 'rs', label: 'Rust' },
              { value: 'go', label: 'Go' },
              { value: 'kt', label: 'Kotlin' },
            ]}
          />
        </Demo>
        <Demo label="Select — disabled" center={false}>
          <Select label="Region" placeholder="Select region..." isDisabled className="w-full"
            options={[{ value: 'vn', label: 'Vietnam' }]}
          />
        </Demo>
      </div>
    </div>
  )
}

function DateSection() {
  const tz = getLocalTimeZone()
  const todayDate = today(tz)

  return (
    <div className="space-y-6">
      <SectionHeader title="Date & Time" description="Calendar-powered date pickers using React Aria & @internationalized/date." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="DatePicker — basic" center={false}>
          <DatePicker label="Pick a date" className="w-full" />
        </Demo>

        <Demo label="DatePicker — no future dates" center={false}>
          <DatePicker
            label="Up to today"
            maxValue={todayDate}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — min / max range" center={false}>
          <DatePicker
            label="This month only"
            minValue={todayDate.set({ day: 1 })}
            maxValue={todayDate.set({ day: 1 }).add({ months: 1 }).subtract({ days: 1 })}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — block weekends" center={false}>
          <DatePicker
            label="Weekdays only"
            isDateUnavailable={date => isWeekend(date, tz)}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — block specific dates" center={false}>
          <DatePicker
            label="Holidays blocked"
            isDateUnavailable={date =>
              ['2025-01-01', '2025-04-30', '2025-05-01', '2025-09-02'].includes(date.toString())
            }
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — disabled" center={false}>
          <DatePicker label="Disabled" isDisabled className="w-full" />
        </Demo>

        <Demo label="DateRangePicker — basic" center={false} className="col-span-full">
          <DateRangePicker label="Date range" className="w-full" />
        </Demo>

        <Demo label="DateRangePicker — no future" center={false} className="col-span-full">
          <DateRangePicker
            label="Historical range"
            maxValue={todayDate}
            className="w-full"
          />
        </Demo>
      </div>
    </div>
  )
}

function TogglesSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Toggles & Choices" description="Checkbox, radio, and switch components." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Checkbox" center={false}>
          <div className="space-y-2.5">
            <Checkbox>Accept terms and conditions</Checkbox>
            <Checkbox defaultSelected>Receive notifications</Checkbox>
            <Checkbox isIndeterminate>Indeterminate state</Checkbox>
            <Checkbox isDisabled>Disabled</Checkbox>
          </div>
        </Demo>
        <Demo label="CheckboxGroup" center={false}>
          <CheckboxGroup
            label="Notifications"
            defaultValue={['email']}
            options={[
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'push', label: 'Push notifications' },
              { value: 'slack', label: 'Slack', disabled: true },
            ]}
          />
        </Demo>
        <Demo label="RadioGroup" center={false}>
          <RadioGroup
            label="Subscription plan"
            defaultValue="pro"
            options={[
              { value: 'free', label: 'Free', description: 'Up to 5 projects' },
              { value: 'pro', label: 'Pro', description: 'Unlimited projects' },
              { value: 'enterprise', label: 'Enterprise', description: 'Custom limits' },
            ]}
          />
        </Demo>
        <Demo label="Switch" center={false}>
          <div className="space-y-3">
            <Switch defaultSelected>Enable dark mode</Switch>
            <Switch>Auto-save drafts</Switch>
            <Switch size="sm" defaultSelected>Compact mode (sm)</Switch>
            <Switch isDisabled>Disabled</Switch>
          </div>
        </Demo>
      </div>
    </div>
  )
}

function SliderSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Slider & Range" description="Drag-to-select range values." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Slider — default" center={false} className="!p-8">
          <Slider label="Volume" defaultValue={65} minValue={0} maxValue={100} className="w-full" />
        </Demo>
        <Demo label="Slider — step" center={false} className="!p-8">
          <Slider label="Zoom" defaultValue={50} minValue={0} maxValue={200} step={10} className="w-full" />
        </Demo>
      </div>
    </div>
  )
}

function TagsSection() {
  const [tags, setTags] = useState<TagItem[]>([
    { id: '1', label: 'React',      color: 'primary' },
    { id: '2', label: 'TypeScript', color: 'info'    },
    { id: '3', label: 'Tailwind',   color: 'success' },
    { id: '4', label: 'Vite',       color: 'warning' },
  ])

  return (
    <div className="space-y-6">
      <SectionHeader title="Tags" description="Selectable and removable tag groups." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="TagGroup — removable" center={false}>
          <TagGroup
            label="Tech stack"
            items={tags}
            selectionMode="multiple"
            onRemove={keys => setTags(prev => prev.filter(t => keys !== 'all' && !keys.has(t.id)))}
          />
        </Demo>
        <Demo label="TagGroup — selectable" center={false}>
          <TagGroup
            label="Status filter"
            selectionMode="multiple"
            items={[
              { id: 'a', label: 'Active',   color: 'success' },
              { id: 'b', label: 'Pending',  color: 'warning' },
              { id: 'c', label: 'Inactive', color: 'default' },
              { id: 'd', label: 'Error',    color: 'danger'  },
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

function ModalSection() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="space-y-6">
      <SectionHeader title="Modal & Dialog" description="Accessible dialogs with focus management via React Aria." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Modal — form">
          <Button variant="primary" onPress={() => setOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={open}
            onOpenChange={setOpen}
            title="Edit Profile"
            footer={({ close }) => (
              <>
                <Button variant="secondary" onPress={close}>Cancel</Button>
                <Button variant="primary" onPress={close}>Save changes</Button>
              </>
            )}
          >
            <div className="space-y-4">
              <Input label="Display name" defaultValue="Alice Nguyen" />
              <Input label="Email" defaultValue="alice@example.com" />
              <Select label="Role" defaultSelectedKey="editor"
                options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }]}
              />
            </div>
          </Modal>
        </Demo>
        <Demo label="ConfirmModal — danger">
          <Button variant="danger" onPress={() => setConfirm(true)}>Delete Account</Button>
          <ConfirmModal
            isOpen={confirm}
            onOpenChange={setConfirm}
            title="Delete Account"
            description="This action is permanent. All data will be removed."
            confirmLabel="Yes, delete"
            danger
            onConfirm={() => alert('Deleted')}
          />
        </Demo>
      </div>
    </div>
  )
}

function TooltipSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Tooltip" description="Hover-triggered informational overlays." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="placement: top (default)">
          <Tooltip content="Tooltip on top"><Button variant="secondary">Hover me</Button></Tooltip>
        </Demo>
        <Demo label="placement: bottom">
          <Tooltip content="Tooltip on bottom" placement="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
        </Demo>
        <Demo label="delay: 0">
          <Tooltip content="Instant tooltip" delay={0}><Button variant="secondary">No delay</Button></Tooltip>
        </Demo>
        <Demo label="long content">
          <Tooltip content="This is a longer tooltip message that wraps across lines.">
            <Button variant="ghost">Long content</Button>
          </Tooltip>
        </Demo>
        <Demo label="trigger: icon button">
          <Tooltip content="More information">
            <button className="w-7 h-7 rounded-full border border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-colors text-sm flex items-center justify-center">?</button>
          </Tooltip>
        </Demo>
      </div>
    </div>
  )
}

function MenuSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Dropdown Menu" description="Contextual action menus with keyboard navigation." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Menu — with icons & shortcut">
          <Menu
            trigger={<Button variant="secondary">Actions ▾</Button>}
            items={[
              { id: 'edit', label: 'Edit', shortcut: '⌘E' },
              { id: 'dup',  label: 'Duplicate', shortcut: '⌘D' },
              { id: 'sep',  label: '', separator: true },
              { id: 'del',  label: 'Delete', shortcut: '⌫', danger: true },
            ]}
            onAction={k => alert(String(k))}
          />
        </Demo>
        <Demo label="Menu — more options">
          <Menu
            trigger={<Button variant="ghost">⋯ More</Button>}
            items={[
              { id: 'share',  label: 'Share link'   },
              { id: 'export', label: 'Export as CSV' },
              { id: 'print',  label: 'Print', disabled: true },
            ]}
            onAction={k => alert(String(k))}
          />
        </Demo>
      </div>
    </div>
  )
}

function TabsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Tabs" description="Keyboard-navigable tab panels." />
      <Demo label="Tabs — horizontal" center={false}>
        <Tabs
          defaultSelectedKey="general"
          items={[
            {
              id: 'general', label: 'General',
              content: (
                <div className="space-y-4">
                  <Input label="Project name" defaultValue="pro-ui" />
                  <Input label="Description" placeholder="Describe your project..." />
                </div>
              ),
            },
            {
              id: 'security', label: 'Security',
              content: <div className="space-y-3"><Switch defaultSelected>Two-factor auth</Switch><Switch>Session timeout</Switch></div>,
            },
            {
              id: 'billing', label: 'Billing',
              content: <Alert variant="info">Managed by your org admin.</Alert>,
            },
            { id: 'disabled', label: 'Disabled', disabled: true, content: null },
          ]}
        />
      </Demo>
    </div>
  )
}

function BreadcrumbsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Breadcrumbs" description="Navigation path indicators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Breadcrumbs — 3 levels" center={false}>
          <Breadcrumbs items={[{ id: 'home', label: 'Home', href: '/' }, { id: 'settings', label: 'Settings', href: '/settings' }, { id: 'profile', label: 'Profile' }]} />
        </Demo>
        <Demo label="Breadcrumbs — 2 levels" center={false}>
          <Breadcrumbs items={[{ id: 'users', label: 'Users', href: '/users' }, { id: 'alice', label: 'Alice Nguyen' }]} />
        </Demo>
      </div>
    </div>
  )
}

function BadgeSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Badge" description="Small status indicators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Badge — all colors">
          <div className="flex flex-wrap gap-2">
            {(['default','primary','success','warning','danger','info'] as const).map(c => (
              <Badge key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
            ))}
          </div>
        </Demo>
        <Demo label="Badge — in context">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary">
              Messages <Badge color="danger" className="ml-1">9+</Badge>
            </Button>
            <span className="text-sm text-gray-700">Status: <Badge color="success" className="ml-1">Online</Badge></span>
          </div>
        </Demo>
      </div>
    </div>
  )
}

function AlertSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Alert" description="Contextual feedback messages for user actions." />
      <div className="space-y-3">
        <Demo label="Alert — info (with title + closable)" center={false}>
          <Alert variant="info" title="New version available" closable>
            pro-ui v0.2 is available. <a href="#" className="underline">See what's new →</a>
          </Alert>
        </Demo>
        <Demo label="Alert — success" center={false}>
          <Alert variant="success" title="Deployment successful" closable>
            Your changes are live at <code className="text-xs bg-success-100 text-success-700 px-1 rounded">pro-ui.vercel.app</code>
          </Alert>
        </Demo>
        <Demo label="Alert — warning" center={false}>
          <Alert variant="warning" closable>
            Your free plan expires in 7 days. Upgrade to keep access.
          </Alert>
        </Demo>
        <Demo label="Alert — danger" center={false}>
          <Alert variant="danger" title="Build failed">
            TypeScript error in <code className="text-xs bg-danger-100 text-danger-700 px-1 rounded">src/App.tsx:42</code>
          </Alert>
        </Demo>
      </div>
    </div>
  )
}

function CardSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Card" description="Surface for grouping related content." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Card — with header" center={false}>
          <Card title="Recent activity" extra={<Badge color="primary">Live</Badge>} className="w-full">
            <p className="text-sm text-gray-500">3 events in the last hour.</p>
          </Card>
        </Demo>
        <Demo label="Card — metric" center={false}>
          <Card title="Revenue" shadow className="w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">₫42M</span>
              <span className="text-sm text-success font-medium">↑ 8.2%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs last month</p>
          </Card>
        </Demo>
        <Demo label="Card — with footer" center={false}>
          <Card title="Confirm" footer={<div className="flex justify-end gap-2"><Button size="sm" variant="secondary">Cancel</Button><Button size="sm" variant="primary">Apply</Button></div>} className="w-full">
            <p className="text-sm text-gray-500">Apply these settings to all projects?</p>
          </Card>
        </Demo>
      </div>
    </div>
  )
}

function AvatarSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Avatar" description="User profile images with automatic initials and color generation." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Avatar — sizes">
          <div className="flex items-end gap-3">
            {(['xs','sm','md','lg','xl'] as const).map(s => (
              <Avatar key={s} name="Alice Nguyen" size={s} />
            ))}
          </div>
        </Demo>
        <Demo label="Avatar — shapes">
          <div className="flex items-center gap-3">
            <Avatar name="Bob Tran" size="lg" shape="circle" />
            <Avatar name="Carol Le" size="lg" shape="square" />
            <Avatar size="lg" shape="circle" />
            <Avatar size="lg" shape="square" />
          </div>
        </Demo>
        <Demo label="Avatar — color generation">
          <div className="flex flex-wrap gap-2">
            {['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do','Grace Bui','Hank Vu'].map(n => (
              <Avatar key={n} name={n} size="md" />
            ))}
          </div>
        </Demo>
        <Demo label="AvatarGroup — max overflow">
          <div className="space-y-3">
            <AvatarGroup size="md" max={4} avatars={['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do'].map(n => ({ name: n }))} />
            <AvatarGroup size="sm" max={5} avatars={['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do','Grace Bui'].map(n => ({ name: n }))} />
          </div>
        </Demo>
      </div>
    </div>
  )
}

function ProgressSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Progress & Spinner" description="Visual indicators for loading and progress states." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="ProgressBar — variants" center={false} className="space-y-4 !py-6">
          <ProgressBar label="Upload"  value={65} maxValue={100} variant="primary" showValue />
          <ProgressBar label="CPU"     value={88} maxValue={100} variant="danger"  showValue />
          <ProgressBar label="Storage" value={42} maxValue={100} variant="warning" size="sm" showValue />
          <ProgressBar label="Tasks"   value={73} maxValue={100} variant="success" showValue />
        </Demo>
        <Demo label="Spinner — sizes & variants">
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <div className="flex items-center gap-4">
              <Spinner label="Loading data..." />
              <div className="flex items-center justify-center w-28 h-9 bg-primary rounded-[var(--base-radius)]">
                <Spinner size="sm" variant="white" label="" />
                <span className="text-white text-sm ml-2">Saving</span>
              </div>
            </div>
          </div>
        </Demo>
      </div>
    </div>
  )
}

function SkeletonSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Skeleton & Divider" description="Loading placeholders and visual separators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Skeleton — article card" center={false}>
          <div className="w-full flex items-start gap-3">
            <Skeleton variant="circle" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="text" lines={3} />
            </div>
          </div>
        </Demo>
        <Demo label="Skeleton — image card" center={false}>
          <div className="w-full space-y-3">
            <Skeleton height={100} />
            <Skeleton variant="text" lines={2} />
          </div>
        </Demo>
        <Demo label="Divider — horizontal" center={false}>
          <div className="w-full space-y-3 text-sm text-gray-500">
            <div>Content above</div>
            <Divider />
            <div>Content below</div>
            <Divider label="OR" />
            <div>Below OR divider</div>
          </div>
        </Demo>
        <Demo label="Divider — vertical">
          <div className="flex items-stretch h-12 gap-4 text-sm text-gray-600">
            <span className="flex items-center">Left</span>
            <Divider orientation="vertical" />
            <span className="flex items-center">Middle</span>
            <Divider orientation="vertical" />
            <span className="flex items-center">Right</span>
          </div>
        </Demo>
      </div>
    </div>
  )
}

function ProTableSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="ProTable" description="Data table with auto search form, server-side pagination, sorting, and valueType renderers." />
      <ProTable<User>
        columns={TABLE_COLS}
        request={mockRequest}
        rowKey="id"
        headerTitle="User Management"
        toolBarRender={() => [
          <Button key="add" variant="primary" size="sm">+ Add User</Button>,
          <Button key="exp" variant="secondary" size="sm">Export</Button>,
        ]}
      />
    </div>
  )
}

/* ─── Color system section ───────────────────────────────────────────────── */

function ColorSwatch({ prefix, step }: { prefix: string; step: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-full h-10 rounded-[var(--base-radius)] border border-black/[0.06] transition-colors duration-300"
        style={{ backgroundColor: `var(--${prefix}-${step})` }}
      />
      <span className="text-[10px] text-gray-400 font-mono leading-none">{step}</span>
    </div>
  )
}

function ColorSystemSection() {
  const primarySteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  const statusSteps  = [50, 100, 200, 500, 600, 700, 800]
  const statuses = [
    { name: 'Success', prefix: 'success', anchor: 'oklch(52% 0.17 142) — green' },
    { name: 'Warning', prefix: 'warning', anchor: 'oklch(62% 0.15  70) — amber' },
    { name: 'Danger',  prefix: 'danger',  anchor: 'oklch(55% 0.22  25) — red'   },
    { name: 'Info',    prefix: 'info',    anchor: 'oklch(55% 0.15 225) — blue'  },
  ]

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Color system"
        description="One --primary token drives the entire palette. Status colors blend 25% primary into their hue anchor — recognisable, but harmonised with the brand."
      />

      {/* Formula code block */}
      <div className="rounded-[var(--base-radius)] border border-gray-200 overflow-hidden">
        <div className="px-3.5 py-2 border-b border-gray-100 bg-gray-50/80">
          <span className="text-[11px] font-mono font-medium text-gray-400 tracking-wide">src/index.css — the complete formula</span>
        </div>
        <pre className="px-5 py-4 text-xs font-mono text-gray-600 leading-6 bg-gray-950 overflow-x-auto">
          <span className="text-gray-500">{"/* ── 1. Only these 2 lines need changing per project ─────────── */"}{'\n'}</span>
          <span className="text-emerald-400">{"--primary"}</span>
          <span className="text-gray-300">{": #6366f1;"}{'\n'}</span>
          <span className="text-emerald-400">{"--base-radius"}</span>
          <span className="text-gray-300">{": 0px;"}{'\n\n'}</span>

          <span className="text-gray-500">{"/* ── 2. Primary scale — same formula, different % ─────────────── */"}{'\n'}</span>
          <span className="text-blue-300">{"--primary-50"}</span>
          <span className="text-gray-300">{"  : color-mix(in oklch, "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-yellow-300">{"  8%"}</span>
          <span className="text-gray-300">{", white);"}{'\n'}</span>
          <span className="text-blue-300">{"--primary-500"}</span>
          <span className="text-gray-300">{" : "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-gray-300">{";"}{'\n'}</span>
          <span className="text-blue-300">{"--primary-900"}</span>
          <span className="text-gray-300">{" : color-mix(in oklch, "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-yellow-300">{" 40%"}</span>
          <span className="text-gray-300">{", black);"}{'\n\n'}</span>

          <span className="text-gray-500">{"/* ── 3. Status = 25% primary + 75% hue anchor ─────────────────── */"}{'\n'}</span>
          <span className="text-green-400">{"--success"}</span>
          <span className="text-gray-300">{": color-mix(in oklch, "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-yellow-300">{" 25%"}</span>
          <span className="text-gray-300">{", "}</span>
          <span className="text-green-400">{"oklch(52% 0.17 142)"}</span>
          <span className="text-gray-300">{");"}{'\n'}</span>
          <span className="text-yellow-400">{"--warning"}</span>
          <span className="text-gray-300">{": color-mix(in oklch, "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-yellow-300">{" 25%"}</span>
          <span className="text-gray-300">{", "}</span>
          <span className="text-yellow-400">{"oklch(62% 0.15  70)"}</span>
          <span className="text-gray-300">{");"}{'\n'}</span>
          <span className="text-red-400">{"--danger "}</span>
          <span className="text-gray-300">{": color-mix(in oklch, "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-yellow-300">{" 25%"}</span>
          <span className="text-gray-300">{", "}</span>
          <span className="text-red-400">{"oklch(55% 0.22  25)"}</span>
          <span className="text-gray-300">{");"}{'\n'}</span>
          <span className="text-sky-400">{"--info   "}</span>
          <span className="text-gray-300">{": color-mix(in oklch, "}</span>
          <span className="text-emerald-400">{"var(--primary)"}</span>
          <span className="text-yellow-300">{" 25%"}</span>
          <span className="text-gray-300">{", "}</span>
          <span className="text-sky-400">{"oklch(55% 0.15 225)"}</span>
          <span className="text-gray-300">{");"}{'\n\n'}</span>

          <span className="text-gray-500">{"/* ── 4. Status scales follow same lightness formula as primary ─── */"}{'\n'}</span>
          <span className="text-green-400">{"--success-100"}</span>
          <span className="text-gray-300">{": color-mix(in oklch, "}</span>
          <span className="text-green-400">{"var(--success)"}</span>
          <span className="text-yellow-300">{" 15%"}</span>
          <span className="text-gray-300">{", white);"}{'\n'}</span>
          <span className="text-green-400">{"--success-700"}</span>
          <span className="text-gray-300">{": color-mix(in oklch, "}</span>
          <span className="text-green-400">{"var(--success)"}</span>
          <span className="text-yellow-300">{" 75%"}</span>
          <span className="text-gray-300">{", black);"}</span>
        </pre>
      </div>

      {/* Primary swatches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Primary scale</p>
          <span className="text-[11px] text-gray-400 font-mono hidden sm:block">
            color-mix(in oklch, var(--primary) N%, white/black)
          </span>
        </div>
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${primarySteps.length}, minmax(0, 1fr))` }}
        >
          {primarySteps.map(s => <ColorSwatch key={s} prefix="primary" step={s} />)}
        </div>
      </div>

      {/* Status swatches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">Status scales</p>
          <span className="text-[11px] text-gray-400 font-mono hidden sm:block">
            color-mix(in oklch, var(--primary) 25%, anchor) → scale
          </span>
        </div>
        <div className="space-y-5">
          {statuses.map(s => (
            <div key={s.name}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: `var(--${s.prefix})` }} />
                <span className="text-xs font-semibold text-gray-700">{s.name}</span>
                <span className="text-[10px] text-gray-400 font-mono">{s.anchor}</span>
              </div>
              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${statusSteps.length}, minmax(0, 1fr))` }}
              >
                {statusSteps.map(step => <ColorSwatch key={step} prefix={s.prefix} step={step} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live demo — components using tokens */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Live — change primary color (top-right ↗) to see everything adapt
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { variant: 'success' as const, title: 'Success', body: 'Deployed to production' },
            { variant: 'warning' as const, title: 'Warning', body: '3 issues detected'      },
            { variant: 'danger'  as const, title: 'Danger',  body: 'Build failed'            },
            { variant: 'info'    as const, title: 'Info',    body: 'Update available'        },
          ].map(a => (
            <Alert key={a.variant} variant={a.variant} title={a.title}>{a.body}</Alert>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {(['success','warning','danger','info','primary','default'] as const).map(c => (
            <Badge key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
          ))}
        </div>
        <div className="space-y-2.5">
          <ProgressBar label="Success track" value={72} maxValue={100} variant="success" showValue />
          <ProgressBar label="Warning track" value={55} maxValue={100} variant="warning" showValue />
          <ProgressBar label="Danger track"  value={88} maxValue={100} variant="danger"  showValue />
        </div>
      </div>
    </div>
  )
}

/* ─── Section registry ───────────────────────────────────────────────────── */

const SECTIONS: Record<string, React.ReactNode> = {
  overview:    <Overview />,
  colors:      <ColorSystemSection />,
  'text-inputs': <TextInputsSection />,
  select:      <SelectSection />,
  datetime:    <DateSection />,
  toggles:     <TogglesSection />,
  slider:      <SliderSection />,
  tags:        <TagsSection />,
  modal:       <ModalSection />,
  tooltip:     <TooltipSection />,
  menu:        <MenuSection />,
  tabs:        <TabsSection />,
  breadcrumbs: <BreadcrumbsSection />,
  badge:       <BadgeSection />,
  alert:       <AlertSection />,
  card:        <CardSection />,
  avatar:      <AvatarSection />,
  progress:    <ProgressSection />,
  skeleton:    <SkeletonSection />,
  protable:    <ProTableSection />,
}

/* ─── Radius & color ─────────────────────────────────────────────────────── */

type RadiusMode = 'none' | 'md' | 'lg'
const RADIUS_MAP: Record<RadiusMode, string> = { none: '0px', md: '6px', lg: '12px' }

/* ─── App ────────────────────────────────────────────────────────────────── */

export default function App() {
  const [active, setActive] = useState('overview')
  const [radius, setRadius] = useState<RadiusMode>('none')
  const [primary, setPrimary] = useState('#6366f1')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const applyTheme = (r: RadiusMode, p: string) => {
    document.documentElement.style.setProperty('--base-radius', RADIUS_MAP[r])
    document.documentElement.style.setProperty('--primary', p)
  }

  const navLabel = NAV.flatMap(g => g.items).find(i => i.id === active)?.label ?? ''

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur border-b border-gray-200 z-50 flex items-center px-4 gap-4">
        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
          onClick={() => setMobileNavOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="4" width="16" height="2" rx="1"/>
            <rect x="2" y="9" width="16" height="2" rx="1"/>
            <rect x="2" y="14" width="16" height="2" rx="1"/>
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-[var(--base-radius)] bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">pro-ui</span>
          <Badge color="info" className="hidden sm:inline-flex">v0.1</Badge>
        </div>

        <div className="flex-1" />

        {/* Theme controls */}
        <div className="flex items-center gap-3 text-sm">
          {/* Primary color */}
          <label className="flex items-center gap-1.5 cursor-pointer" title="Primary color">
            <span className="text-xs text-gray-400 hidden sm:block">Color</span>
            <div className="relative">
              <input
                type="color"
                value={primary}
                onChange={e => { setPrimary(e.target.value); applyTheme(radius, e.target.value) }}
                className="w-7 h-7 border border-gray-200 rounded-[var(--base-radius)] cursor-pointer p-0.5 bg-white"
              />
            </div>
          </label>

          {/* Radius */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 hidden sm:block mr-0.5">Radius</span>
            {(['none','md','lg'] as RadiusMode[]).map(r => (
              <button
                key={r}
                onClick={() => { setRadius(r); applyTheme(r, primary) }}
                className={cn(
                  'px-2.5 py-1 text-xs border rounded-[var(--base-radius)] transition-colors',
                  radius === r
                    ? 'bg-primary text-white border-primary'
                    : 'text-gray-500 border-gray-200 hover:border-gray-400',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar overlay for mobile */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-14 left-0 w-56 h-[calc(100vh-56px)] border-r border-gray-100 bg-white',
            'overflow-y-auto z-40 transition-transform',
            'md:translate-x-0',
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          )}
        >
          <nav className="py-4 px-3">
            {NAV.map(group => (
              <div key={group.group} className="mb-5">
                <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => { setActive(item.id); setMobileNavOpen(false) }}
                        className={cn(
                          'w-full text-left px-3 py-1.5 text-sm rounded-[var(--base-radius)] transition-colors',
                          active === item.id
                            ? 'bg-primary-50 text-primary font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className={cn(
          'flex-1 min-w-0 md:ml-56',
          active === 'protable' ? 'p-6' : 'px-6 py-8 max-w-4xl',
        )}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <span>pro-ui</span>
            <span>›</span>
            <span className="text-gray-700 font-medium">{navLabel}</span>
          </div>

          {SECTIONS[active]}
        </main>
      </div>
    </div>
  )
}
