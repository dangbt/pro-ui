import { useState, useEffect, createContext, useContext, type ComponentType } from 'react'
import * as LucideIcons from 'lucide-react'
import { Plus, Download, RefreshCw, Trash2, Upload, Image } from 'lucide-react'
import {
  LayoutDashboard as IconDashboard,
  Users           as IconUsers,
  Settings        as IconSettings,
  TrendingUp      as IconAnalytics,
  Bell            as IconBell,
  FileText        as IconDocs,
  LogOut          as IconLogout,
  Menu            as MenuIcon,
} from 'lucide-react'
import { today, getLocalTimeZone, isWeekend } from '@internationalized/date'
import { z } from 'zod'
import {
  Button, Input, Textarea, NumberField, SearchField,
  Select, AsyncSelect, ComboBox, Checkbox, CheckboxGroup, RadioGroup,
  Switch, Slider, DatePicker, DateRangePicker, DateField, Calendar, RangeCalendar, TagGroup,
  TimeField, ToggleButton, ToggleButtonGroup, FileTrigger,
  Popover, ListBox, GridList, Autocomplete, Toolbar, ToolbarSeparator, DropZone,
  ColorPicker, ColorSwatch, ColorSwatchPicker, ColorField, ColorSlider,
  Tree,
  Modal, ConfirmModal, Tooltip, Menu, Tabs, Breadcrumbs,
  ProgressBar, Meter, Alert, Spinner, Badge, Card,
  Avatar, AvatarGroup, Divider, Skeleton, Link, Disclosure, Accordion,
  ProTable, ProForm, ProFormRow,
  ProFormInput, ProFormTextarea, ProFormNumberField,
  ProFormSelect, ProFormCheckbox, ProFormSwitch, ProFormDatePicker,
  Layout,
} from './components'
import type { ProColumnType, QueryParams, TagItem, BulkActionDef } from './components'
import { cn } from './lib/cn'
import type { Size } from './lib/size'

const ShowcaseSizeCtx = createContext<Size>('md')
const useShowcaseSize = () => useContext(ShowcaseSizeCtx)

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

const ROLE_ENUM   = { admin: { text: 'Admin', color: 'danger' as const }, editor: { text: 'Editor', color: 'warning' as const }, viewer: { text: 'Viewer', color: 'info' as const } }
const STATUS_ENUM = { active: { text: 'Active', color: 'success' as const }, inactive: { text: 'Inactive', color: 'default' as const }, pending: { text: 'Pending', color: 'warning' as const } }

const TABLE_COLS: ProColumnType<User>[] = [
  { title: 'Name',    dataIndex: 'name',      sortable: true, width: 200, disableHiding: true, pinnable: true },
  { title: 'Email',   dataIndex: 'email',     width: 220 },
  { title: 'Role',    dataIndex: 'role',      valueType: 'select', valueEnum: ROLE_ENUM },
  { title: 'Status',  dataIndex: 'status',    valueType: 'select', valueEnum: STATUS_ENUM },
  { title: 'Revenue', dataIndex: 'revenue',   valueType: 'money', sortable: true, align: 'right', hideInSearch: true },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date',  sortable: true, hideInSearch: true },
  {
    title: 'Actions', key: 'actions', hideInSearch: true, align: 'center', width: 120, pinnable: true,
    render: (_v, r) => (
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => alert(`Edit ${r.name}`)} className="text-primary text-xs font-medium px-2 py-1 hover:bg-primary-50 rounded-[var(--base-radius)] transition-colors">Edit</button>
        <button onClick={() => alert(`Delete ${r.name}`)} className="text-danger text-xs font-medium px-2 py-1 hover:bg-danger-50 rounded-[var(--base-radius)] transition-colors">Delete</button>
      </div>
    ),
  },
]

const TABLE_COLS_SELECT: ProColumnType<User>[] = [
  { title: 'Name',    dataIndex: 'name',      sortable: true, width: 200, disableHiding: true, pinnable: true },
  { title: 'Email',   dataIndex: 'email',     width: 220 },
  { title: 'Role',    dataIndex: 'role',      valueType: 'select', valueEnum: ROLE_ENUM },
  { title: 'Status',  dataIndex: 'status',    valueType: 'select', valueEnum: STATUS_ENUM },
  { title: 'Revenue', dataIndex: 'revenue',   valueType: 'money', sortable: true, align: 'right', hideInSearch: true },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date',  sortable: true, hideInSearch: true, pinnable: true },
]

/* ─── AsyncSelect mock data ──────────────────────────────────────────────── */

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Bolivia','Brazil','Cambodia','Canada','Chile','China','Colombia',
  'Croatia','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia','Finland',
  'France','Germany','Ghana','Greece','Guatemala','Hungary','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kenya','Kuwait',
  'Malaysia','Mexico','Morocco','Myanmar','Netherlands','New Zealand','Nigeria',
  'Norway','Pakistan','Panama','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Saudi Arabia','Senegal','Singapore','South Africa','South Korea',
  'Spain','Sri Lanka','Sweden','Switzerland','Thailand','Turkey','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Venezuela',
  'Vietnam','Zimbabwe',
].map((label, i) => ({ value: `c${i}`, label }))

const USERS_ASYNC = Array.from({ length: 120 }, (_, i) => ({
  value: `u${i}`,
  label: ['Alice','Bob','Carol','David','Eva','Frank','Grace','Hank','Iris','Jack'][i % 10]! + ` ${['Nguyen','Tran','Le','Pham','Hoang','Do','Bui','Vu','Dang','Cao'][i % 10]!} #${i + 1}`,
}))

function fakeSearch<T extends { value: string; label: string }>(
  list: T[],
  { search, page, pageSize }: { search: string; page: number; pageSize: number },
  delay = 400,
) {
  return new Promise<{ options: T[]; hasMore: boolean }>(resolve =>
    setTimeout(() => {
      const filtered = search
        ? list.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : list
      const start = (page - 1) * pageSize
      resolve({ options: filtered.slice(start, start + pageSize), hasMore: start + pageSize < filtered.length })
    }, delay),
  )
}

/* ─── Navigation ─────────────────────────────────────────────────────────── */

type NavItem = { id: string; label: string }
type NavGroup = { group: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    group: 'Overview',
    items: [
      { id: 'overview', label: 'Introduction'  },
      { id: 'colors',   label: 'Color system'  },
      { id: 'icons',    label: 'Icons'         },
    ],
  },
  {
    group: 'Form',
    items: [
      { id: 'button',        label: 'Button'              },
      { id: 'toggle-button', label: 'ToggleButton'        },
      { id: 'text-inputs',   label: 'Text inputs'         },
      { id: 'select',        label: 'Select & ComboBox'   },
      { id: 'datetime',      label: 'Date & Time'         },
      { id: 'toggles',       label: 'Toggles & Choices'   },
      { id: 'slider',        label: 'Slider & Range'      },
      { id: 'tags',          label: 'Tags'                },
      { id: 'file',          label: 'File Upload'         },
      { id: 'autocomplete',  label: 'Autocomplete'        },
      { id: 'dropzone',      label: 'Drop Zone'           },
    ],
  },
  {
    group: 'Overlay',
    items: [
      { id: 'modal',   label: 'Modal & Dialog'  },
      { id: 'popover', label: 'Popover'         },
      { id: 'tooltip', label: 'Tooltip'         },
      { id: 'menu',    label: 'Dropdown Menu'   },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { id: 'tabs',        label: 'Tabs'        },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'toolbar',     label: 'Toolbar'     },
    ],
  },
  {
    group: 'Selection',
    items: [
      { id: 'listbox',   label: 'ListBox'   },
      { id: 'gridlist',  label: 'GridList'  },
      { id: 'tree',      label: 'Tree'      },
    ],
  },
  {
    group: 'Display',
    items: [
      { id: 'badge',        label: 'Badge'              },
      { id: 'alert',        label: 'Alert'              },
      { id: 'card',         label: 'Card'               },
      { id: 'avatar',       label: 'Avatar'             },
      { id: 'progress',     label: 'Progress & Meter'   },
      { id: 'skeleton',     label: 'Skeleton & Divider' },
      { id: 'disclosure',   label: 'Disclosure'         },
      { id: 'link',         label: 'Link'               },
      { id: 'color-picker', label: 'Color Picker'       },
    ],
  },
  {
    group: 'Data',
    items: [
      { id: 'protable', label: 'ProTable'  },
      { id: 'proform',  label: 'ProForm'   },
    ],
  },
  {
    group: 'Layout',
    items: [
      { id: 'layout', label: 'Layout & Sider' },
    ],
  },
  {
    group: 'Integration',
    items: [
      { id: 'llm-txt', label: 'LLM.txt' },
    ],
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

/* ─── LLM.txt content ───────────────────────────────────────────────────── */

const LLM_TXT = `# @dangbt/pro-ui — UI Component Library

React component library built on React Aria Components + Tailwind CSS v4.
40+ accessible components. A single --primary CSS token drives the full
color palette. All components are keyboard-navigable and fully typed.

Showcase: https://pro-ui.pages.dev

## Install

\`\`\`bash
npm install @dangbt/pro-ui
npm install react-aria-components lucide-react @tanstack/react-table \\
  react-hook-form @hookform/resolvers zod @internationalized/date
\`\`\`

## CSS setup (index.css / globals.css)

\`\`\`css
@import "tailwindcss";
@import "@dangbt/pro-ui/tailwind.css";   /* source scanning + RAC Tailwind variants */
@import "@dangbt/pro-ui/theme.css";       /* color system + all Tailwind tokens */

/* Only these 2 lines need changing per project */
:root {
  --primary: #6366f1;   /* brand color — drives the entire palette */
  --base-radius: 8px;   /* corner radius: 0px | 6px | 12px | any value */
}
\`\`\`

All color scales (primary-50…900, success/warning/danger/info + their scales)
and radius tokens are auto-derived. Nothing else to configure.

## Import

\`\`\`tsx
import { Button, Input, Select, ProTable, ProForm, Layout } from '@dangbt/pro-ui'
\`\`\`

---

## Components

### Button
\`\`\`tsx
<Button variant="primary" size="md" onPress={() => {}}>Save</Button>
// variant: 'primary' | 'secondary' | 'ghost' | 'danger'  (default: 'primary')
// size: 'sm' | 'md' | 'lg'  (default: 'md')
// isDisabled?, isLoading?, onPress?
\`\`\`

### Input
\`\`\`tsx
<Input label="Email" placeholder="user@example.com" type="email"
  size="md" isInvalid={!!error} className="w-full" />
// type: 'text'|'email'|'password'|'url'|'tel'  size: 'sm'|'md'|'lg'
// isDisabled?, isReadOnly?, isInvalid?, value?, onChange?, onBlur?
\`\`\`

### Textarea
\`\`\`tsx
<Textarea label="Bio" placeholder="Write something..." rows={4}
  size="md" className="w-full" />
// rows?, size?, isDisabled?, isReadOnly?, isInvalid?, value?, onChange?
\`\`\`

### NumberField
\`\`\`tsx
<NumberField label="Quantity" defaultValue={1} minValue={0} maxValue={99}
  step={1} size="md" className="w-full" />
// minValue?, maxValue?, step?, formatOptions? (Intl.NumberFormatOptions)
\`\`\`

### SearchField
\`\`\`tsx
<SearchField label="Search" placeholder="Search anything..." className="w-full" />
// label?, placeholder?, value?, onChange?
\`\`\`

### Select (static options)
\`\`\`tsx
<Select label="Role" placeholder="Select role..." size="md"
  options={[{ value: 'admin', label: 'Admin' }, { value: 'viewer', label: 'Viewer' }]}
  selectedKey={value} onSelectionChange={key => setValue(String(key))}
  className="w-full" />
// options: { value: string; label: string }[]
// isDisabled?, isInvalid?, size?, selectedKey?, defaultSelectedKey?
\`\`\`

### AsyncSelect (server-side search + infinite scroll)
\`\`\`tsx
<AsyncSelect
  label="User" placeholder="Search user..."
  fetchOptions={async ({ search, page, pageSize }) => {
    const res = await api.users({ search, page, pageSize })
    return { options: res.data, hasMore: res.hasMore }
  }}
  pageSize={20} debounceMs={300}
  value={value} onChange={(val, option) => setValue(val)}
  size="md" className="w-full" />
// fetchOptions: required. Returns { options: {value,label}[], hasMore: boolean }
// isDisabled?, isInvalid?, onBlur?, defaultLabel?
\`\`\`

### ComboBox (autocomplete)
\`\`\`tsx
<ComboBox label="Language" placeholder="Type to filter..."
  options={[{ value: 'ts', label: 'TypeScript' }]}
  className="w-full" />
\`\`\`

### Checkbox & CheckboxGroup
\`\`\`tsx
<Checkbox size="md" defaultSelected>Accept terms</Checkbox>
<Checkbox isIndeterminate>Partial</Checkbox>

<CheckboxGroup label="Notifications" defaultValue={['email']}
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms',   label: 'SMS', disabled: true },
  ]} />
\`\`\`

### RadioGroup
\`\`\`tsx
<RadioGroup label="Plan" defaultValue="pro"
  options={[
    { value: 'free', label: 'Free', description: 'Up to 5 projects' },
    { value: 'pro',  label: 'Pro',  description: 'Unlimited' },
  ]} />
\`\`\`

### Switch
\`\`\`tsx
<Switch size="md" defaultSelected>Enable notifications</Switch>
// size: 'sm'|'md'|'lg', isDisabled?, isSelected?, onChange?
\`\`\`

### Slider
\`\`\`tsx
<Slider label="Volume" defaultValue={65} minValue={0} maxValue={100} step={1} className="w-full" />
\`\`\`

### DatePicker / DateRangePicker / DateField
\`\`\`tsx
<DatePicker label="Start date" size="md" className="w-full"
  minValue={today(getLocalTimeZone())}
  isDateUnavailable={date => isWeekend(date, getLocalTimeZone())} />

<DateRangePicker label="Period" size="md" className="w-full" />

<DateField label="Exact date" size="md" className="w-full" />
// DateField = date input without popup calendar
// value: CalendarDate | null, onChange?, minValue?, maxValue?
\`\`\`

### Calendar / RangeCalendar (standalone)
\`\`\`tsx
<Calendar />
<Calendar minValue={today(getLocalTimeZone())} onChange={date => setDate(date)} />

<RangeCalendar />
// Standalone month calendar — no input field wrapper
\`\`\`

### TimeField
\`\`\`tsx
<TimeField label="Start time" size="md" />
<TimeField label="Duration" granularity="second" />
// granularity: 'hour'|'minute'|'second'
\`\`\`

### ToggleButton / ToggleButtonGroup
\`\`\`tsx
<ToggleButton size="md" isSelected={bold} onChange={setBold}>Bold</ToggleButton>

<ToggleButtonGroup selectionMode="single" defaultSelectedKeys={new Set(['left'])}>
  <ToggleButton id="left">Left</ToggleButton>
  <ToggleButton id="center">Center</ToggleButton>
  <ToggleButton id="right">Right</ToggleButton>
</ToggleButtonGroup>
// selectionMode: 'single'|'multiple'
\`\`\`

### FileTrigger
\`\`\`tsx
<FileTrigger onSelect={(files) => handleFiles(files)} acceptedFileTypes={['image/*']} allowsMultiple>
  <Button>Upload image</Button>
</FileTrigger>
\`\`\`

### TagGroup
\`\`\`tsx
<TagGroup label="Tags" selectionMode="multiple"
  items={[{ id: '1', label: 'React', color: 'primary' }]}
  onRemove={keys => removeTag(keys)} />
// color: 'default'|'primary'|'success'|'warning'|'danger'|'info'
\`\`\`

### Popover
\`\`\`tsx
<Popover
  triggerElement={<Button>Open</Button>}
  placement="bottom"        // 'top'|'bottom'|'left'|'right' + start/end variants
  showArrow={false}
>
  <p>Floating content — no backdrop</p>
</Popover>
\`\`\`

### ListBox
\`\`\`tsx
<ListBox
  selectionMode="single"    // 'none'|'single'|'multiple'
  selectedKeys={selected}
  onSelectionChange={keys => setSelected(keys)}
  items={[
    { id: 'a', label: 'Option A', description: 'Optional hint', icon: <Icon />, disabled: false },
    // Sections:
    { id: 'sec', title: 'Group', items: [{ id: 'b', label: 'Option B' }] },
  ]}
  size="md"
/>
\`\`\`

### GridList
\`\`\`tsx
<GridList
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={keys => setSelected(keys)}
  items={[
    { id: 'x', label: 'Item X', description: 'Subtitle', icon: <Icon />, disabled: false },
  ]}
  size="md"
/>
// Shows checkboxes when selectionMode !== 'none'
\`\`\`

### Autocomplete
\`\`\`tsx
<Autocomplete
  label="City"
  placeholder="Search cities…"
  items={[
    { id: 'hcm', label: 'Ho Chi Minh City', description: 'Southern Vietnam' },
  ]}
  size="md"
/>
// Filters items by label as the user types
\`\`\`

### Toolbar / ToolbarSeparator
\`\`\`tsx
<Toolbar aria-label="Text formatting">
  <ToggleButton size="sm">B</ToggleButton>
  <ToggleButton size="sm">I</ToggleButton>
  <ToolbarSeparator />
  <Button size="sm" variant="ghost">Action</Button>
</Toolbar>
// Arrow keys navigate between toolbar items
\`\`\`

### Tree
\`\`\`tsx
const items: TreeNode[] = [
  { id: 'src', label: 'src', children: [
    { id: 'app', label: 'app.tsx' },
  ]},
]

<Tree items={items} />
<Tree items={items} selectionMode="single" defaultSelectedKeys={new Set(['app'])} />
<Tree items={items} selectionMode="multiple" />
// TreeNode: { id, label, icon?, children? }
\`\`\`

### DropZone
\`\`\`tsx
<DropZone
  label="Drop files here or click to browse"
  description="PNG, JPG up to 10 MB"
  accept={['image/*']}     // MIME types
  allowsMultiple
  onFiles={(fileList) => handleFiles(fileList)}
/>
\`\`\`

### ColorPicker suite
\`\`\`tsx
// Full picker (area + hue + alpha + hex + presets)
<ColorPicker label="Brand color" defaultValue="#008060"
  presetColors={['#ef4444','#3b82f6','#22c55e']} />

// Individual pieces:
<ColorSwatch color="#3b82f6" size="md" />           // display swatch
<ColorSwatchPicker colors={['#ef4444','#3b82f6']} /> // palette picker
<ColorField label="Hex" defaultValue="#3b82f6" />    // hex text input
<ColorSlider channel="hue" />                        // single channel slider
<ColorSlider colorSpace="hsl" channel="saturation" label="Saturation" />
\`\`\`

### Modal / ConfirmModal
\`\`\`tsx
<Modal isOpen={open} onOpenChange={setOpen} title="Edit Profile"
  size="md"
  footer={({ close }) => (
    <><Button variant="secondary" onPress={close}>Cancel</Button>
      <Button variant="primary" onPress={close}>Save</Button></>
  )}>
  <Input label="Name" />
</Modal>

<ConfirmModal isOpen={confirm} onOpenChange={setConfirm}
  title="Delete?" description="This cannot be undone."
  confirmLabel="Yes, delete" danger onConfirm={handleDelete} />
// size: 'sm'|'md'|'lg'|'xl'|'full'
\`\`\`

### Tooltip
\`\`\`tsx
<Tooltip content="More info" placement="top" delay={400}>
  <Button>Hover me</Button>
</Tooltip>
// placement: 'top'|'bottom'|'left'|'right'
\`\`\`

### Menu
\`\`\`tsx
<Menu
  trigger={<Button>Actions ▾</Button>}
  items={[
    { id: 'edit',  label: 'Edit',   shortcut: '⌘E' },
    { id: 'sep',   label: '',       separator: true },
    { id: 'del',   label: 'Delete', danger: true },
  ]}
  onAction={key => handleAction(String(key))} />
\`\`\`

### Tabs
\`\`\`tsx
<Tabs defaultSelectedKey="general"
  items={[
    { id: 'general',  label: 'General',  content: <GeneralPanel /> },
    { id: 'security', label: 'Security', content: <SecurityPanel /> },
    { id: 'billing',  label: 'Billing',  disabled: true, content: null },
  ]} />
\`\`\`

### Breadcrumbs
\`\`\`tsx
<Breadcrumbs items={[
  { id: 'home',     label: 'Home',     href: '/' },
  { id: 'settings', label: 'Settings', href: '/settings' },
  { id: 'profile',  label: 'Profile' },
]} />
\`\`\`

### Badge
\`\`\`tsx
<Badge color="success" size="md">Active</Badge>
// color: 'default'|'primary'|'success'|'warning'|'danger'|'info'
// size: 'sm'|'md'|'lg'
\`\`\`

### Alert
\`\`\`tsx
<Alert variant="success" title="Saved!" closable>Changes saved successfully.</Alert>
// variant: 'info'|'success'|'warning'|'danger'
// closable?, icon?, title?
\`\`\`

### Card
\`\`\`tsx
<Card title="Revenue" shadow
  extra={<Badge color="primary">Live</Badge>}
  footer={<Button size="sm">View all</Button>}>
  <p>Card body content</p>
</Card>
\`\`\`

### Avatar / AvatarGroup
\`\`\`tsx
<Avatar name="Alice Nguyen" size="md" shape="circle" />
<Avatar src="/photo.jpg" size="lg" />

<AvatarGroup size="sm" max={4}
  avatars={users.map(u => ({ name: u.name }))} />
// size: 'xs'|'sm'|'md'|'lg'|'xl'
\`\`\`

### Meter
\`\`\`tsx
<Meter label="Storage used" value={72} maxValue={100} showValue />
<Meter label="CPU" value={90} variant="danger" showValue />
// variant: 'auto'|'success'|'warning'|'danger'|'primary'
// 'auto': green < 50%, yellow < 80%, red >= 80%
\`\`\`

### ProgressBar
\`\`\`tsx
<ProgressBar label="Upload" value={65} maxValue={100}
  variant="primary" size="md" showValue />
// variant: 'primary'|'success'|'warning'|'danger'
\`\`\`

### Spinner
\`\`\`tsx
<Spinner size="md" label="Loading..." variant="primary" />
// size: 'xs'|'sm'|'md'|'lg'   variant: 'primary'|'white'
\`\`\`

### Skeleton
\`\`\`tsx
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={40} height={40} />
<Skeleton height={120} />
// variant: 'text'|'circle'|'rect'
\`\`\`

### Divider
\`\`\`tsx
<Divider label="OR" />
<Divider orientation="vertical" />
\`\`\`

### Link
\`\`\`tsx
<Link href="/settings" variant="default">Settings</Link>
// variant: 'default'|'muted'|'danger'
// href? for navigation, or onPress for button-like behavior
\`\`\`

### Disclosure / Accordion
\`\`\`tsx
<Disclosure title="FAQ item">Panel content</Disclosure>

<Accordion>
  <Disclosure title="Section 1">Content 1</Disclosure>
  <Disclosure title="Section 2">Content 2</Disclosure>
</Accordion>
\`\`\`

---

## ProTable (data table)

\`\`\`tsx
type User = { id: string; name: string; status: 'active' | 'inactive' }

const columns: ProColumnType<User>[] = [
  { title: 'Name',   dataIndex: 'name',   sortable: true },
  { title: 'Status', dataIndex: 'status', valueType: 'select',
    valueEnum: { active: { text: 'Active', color: 'success' }, inactive: { text: 'Inactive', color: 'default' } } },
  { title: 'Actions', key: 'actions', hideInSearch: true,
    render: (_v, row) => <Button size="sm" onPress={() => edit(row)}>Edit</Button> },
]

<ProTable<User>
  columns={columns}
  rowKey="id"
  request={async ({ current, pageSize, ...search }) => {
    const res = await api.users({ page: current, pageSize, ...search })
    return { data: res.data, total: res.total, success: true }
  }}
  headerTitle="Users"
  toolBarRender={() => [<Button key="add" variant="primary">+ Add</Button>]}
  rowSelection={{ onChange: (keys, rows) => setSelected(rows) }}
  bulkActions={[
    { label: 'Export', onClick: (keys) => exportUsers(keys) },
    { label: 'Delete', danger: true, onClick: (keys) => deleteUsers(keys) },
  ]}
/>
// valueType: 'text'|'number'|'date'|'dateRange'|'select'|'money'|'custom'
// hideInSearch?: hide column from auto search form
// hideInTable?: hide column from table but keep in search form
\`\`\`

---

## ProForm (schema-driven forms)

\`\`\`tsx
import { z } from 'zod'

const schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  role:  z.enum(['admin', 'editor', 'viewer']).optional(),
})

<ProForm
  schema={schema}
  defaultValues={{ role: 'viewer' }}
  onFinish={values => console.log(values)}
  submitText="Save"
  showReset
  layout="vertical"   // 'vertical' | 'horizontal'
  size="md"
>
  <ProFormRow>
    <ProFormInput  name="name"  label="Full name"  required placeholder="Alice" />
    <ProFormInput  name="email" label="Email"       required type="email" />
  </ProFormRow>
  <ProFormSelect name="role" label="Role"
    options={[{ value: 'admin', label: 'Admin' }]} />
  <ProFormAsyncSelect name="userId" label="Assign to"
    fetchOptions={({ search, page, pageSize }) =>
      api.users({ search, page, pageSize }).then(r => ({ options: r.data, hasMore: r.hasMore }))} />
  <ProFormNumberField name="salary" label="Salary" min={0} />
  <ProFormTextarea   name="bio"    label="Bio" rows={3} />
  <ProFormDatePicker name="startDate" label="Start date" />
  <ProFormSwitch     name="active"    label="Active account" />
  <ProFormCheckbox   name="notify"    label="Email notifications" />
</ProForm>
// All ProForm* fields: name (required), label?, required?, description?,
//   placeholder?, size?, className?, isDisabled?
\`\`\`

---

## Layout (app shell)

\`\`\`tsx
<Layout style={{ height: '100vh' }}>
  <Layout.Header height={56} sticky bordered>
    <Logo />
    <div className="flex-1" />
    <Avatar name="Alice" size="sm" />
  </Layout.Header>

  <Layout.Body>
    <Layout.Sider
      width={240}
      collapsedWidth={64}
      collapsible               // shows built-in collapse button
      defaultCollapsed={false}
      onCollapse={setCollapsed}
    >
      <Layout.Nav>
        <Layout.Nav.Group label="Main">
          <Layout.Nav.Item
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dashboard"
            active={active === 'dashboard'}
            onClick={() => setActive('dashboard')}
          />
        </Layout.Nav.Group>
      </Layout.Nav>
    </Layout.Sider>

    <Layout.Content padding>   {/* scrollable main area */}
      <h1>Page content</h1>
    </Layout.Content>

    {/* Optional right panel */}
    <Layout.Sider width={200} bordered>
      <div className="p-3">Right panel</div>
    </Layout.Sider>
  </Layout.Body>

  <Layout.Footer bordered>
    <p className="text-xs text-gray-400">© 2026 My App</p>
  </Layout.Footer>
</Layout>

// useSider() hook — read collapsed state inside Sider children
import { useSider } from '@dangbt/pro-ui'
const { collapsed } = useSider()
\`\`\`
`

function LLMTxtSection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(LLM_TXT).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="LLM.txt — AI Integration Guide"
        description="Copy this text and paste into any AI assistant (Claude, GPT, Cursor, etc.) to instantly get accurate usage of all components."
      />

      <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-[var(--base-radius)]">
        <div className="flex-1">
          <p className="text-sm font-medium text-primary-800">Quick integrate</p>
          <p className="text-xs text-primary-600 mt-0.5">
            Copy the full component API reference below → paste to AI → describe what UI you want → done.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onPress={handleCopy}
        >
          {copied ? '✓ Copied!' : 'Copy LLM.txt'}
        </Button>
      </div>

      <div className="rounded-[var(--base-radius)] border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-100 bg-gray-50/80">
          <span className="text-[11px] font-mono font-medium text-gray-400 tracking-wide">
            llm.txt — {LLM_TXT.length.toLocaleString()} characters · {LLM_TXT.split('\n').length} lines
          </span>
          <button
            onClick={handleCopy}
            className="text-[11px] text-gray-400 hover:text-primary transition-colors font-mono"
          >
            {copied ? '✓ copied' : 'copy'}
          </button>
        </div>
        <textarea
          readOnly
          value={LLM_TXT}
          rows={30}
          className="w-full px-5 py-4 text-xs font-mono text-gray-600 bg-gray-950 text-gray-300 resize-none outline-none leading-5"
        />
      </div>
    </div>
  )
}

/* ─── Icons showcase ─────────────────────────────────────────────────────── */

type LucideIcon = ComponentType<{ className?: string; strokeWidth?: number }>

const ICON_GROUPS: { group: string; names: string[] }[] = [
  {
    group: 'Arrows & Navigation',
    names: [
      'ChevronLeft','ChevronRight','ChevronUp','ChevronDown','ChevronsUpDown',
      'ArrowLeft','ArrowRight','ArrowUp','ArrowDown','ArrowUpRight','ArrowDownLeft',
      'MoveHorizontal','CornerDownRight','CornerUpLeft',
    ],
  },
  {
    group: 'Actions',
    names: [
      'Plus','Minus','X','Check','Trash2','Pencil','Copy','ClipboardCheck',
      'Save','Download','Upload','Share2','ExternalLink','Link','RefreshCw',
      'RotateCcw','Search','Filter','SlidersHorizontal','ZoomIn','ZoomOut',
    ],
  },
  {
    group: 'UI & Layout',
    names: [
      'Menu','LayoutDashboard','Sidebar','PanelLeft','PanelRight','Columns2',
      'Rows2','Grid2x2','List','MoreHorizontal','MoreVertical','GripVertical',
      'Maximize2','Minimize2','Expand','Shrink',
    ],
  },
  {
    group: 'Files & Data',
    names: [
      'File','FileText','FileCode','FileSpreadsheet','FilePlus','FileX',
      'Folder','FolderOpen','FolderPlus','Database','Table','Package',
    ],
  },
  {
    group: 'Status & Feedback',
    names: [
      'Info','AlertTriangle','AlertCircle','CheckCircle2','XCircle',
      'HelpCircle','Shield','ShieldCheck','Lock','Unlock','Eye','EyeOff',
      'Loader','Loader2','RefreshCw','Wifi','WifiOff',
    ],
  },
  {
    group: 'Communication',
    names: [
      'Bell','BellOff','Mail','MessageSquare','MessageCircle',
      'Phone','Send','Inbox','AtSign','Hash','Reply',
    ],
  },
  {
    group: 'Users & People',
    names: [
      'User','Users','UserPlus','UserMinus','UserCheck','UserX',
      'Contact','Building','Building2','Globe',
    ],
  },
  {
    group: 'Media & Content',
    names: [
      'Image','Video','Music','Mic','MicOff','Camera','Play','Pause',
      'Square','Volume2','VolumeX','Bookmark','Star','Heart','Tag',
    ],
  },
  {
    group: 'Time & Location',
    names: [
      'Clock','Clock3','Calendar','CalendarDays','Map','MapPin',
      'Navigation','Compass','Home','Flag',
    ],
  },
  {
    group: 'Dev & Tech',
    names: [
      'Code','Code2','Terminal','GitBranch','GitCommit','GitMerge',
      'Github','Cpu','Server','Wifi','Database','Cloud','CloudUpload',
      'Settings','Settings2','Wrench','Zap',
    ],
  },
]

function IconCard({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name]
  if (!Icon) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(name).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Click to copy: ${name}`}
      className={cn(
        'flex flex-col items-center gap-2 p-3 rounded-[var(--base-radius)] border transition-all text-center group',
        copied
          ? 'border-primary bg-primary-50 text-primary'
          : 'border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900',
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className={cn(
        'text-[10px] font-mono leading-tight break-all',
        copied ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600',
      )}>
        {copied ? '✓ copied' : name}
      </span>
    </button>
  )
}

function IconsSection() {
  const [search, setSearch] = useState('')

  const filtered = ICON_GROUPS.map(g => ({
    ...g,
    names: g.names.filter(n => n.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.names.length > 0)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Icons"
        description="Powered by lucide-react. Click any icon to copy its name. Import with: import { IconName } from 'lucide-react'"
      />

      <div className="flex items-center gap-3">
        <div className="relative max-w-xs w-full">
          <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter icons..."
            className={cn(
              'w-full h-9 pl-9 pr-3 text-sm bg-white border border-gray-300 rounded-[var(--base-radius)]',
              'placeholder:text-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            )}
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No icons match "{search}"</div>
      ) : (
        <div className="space-y-8">
          {filtered.map(group => (
            <div key={group.group}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-700">{group.group}</h3>
                <span className="text-xs text-gray-400">{group.names.length}</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1">
                {group.names.map(name => (
                  <IconCard key={name} name={name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[var(--base-radius)] border border-gray-200 overflow-hidden">
        <div className="px-3.5 py-2 border-b border-gray-100 bg-gray-50/80">
          <span className="text-[11px] font-mono font-medium text-gray-400 tracking-wide">Usage example</span>
        </div>
        <pre className="px-5 py-4 text-xs font-mono text-gray-300 bg-gray-950 overflow-x-auto leading-6">
          <span className="text-gray-500">{'// Install\n'}</span>
          <span className="text-emerald-400">{'npm install lucide-react\n\n'}</span>
          <span className="text-gray-500">{'// Import & use\n'}</span>
          <span className="text-blue-300">{'import'}</span>
          <span className="text-gray-300">{' { Bell, Settings, Search } '}</span>
          <span className="text-blue-300">{'from'}</span>
          <span className="text-yellow-300">{" 'lucide-react'\n\n"}</span>
          <span className="text-gray-300">{'<Bell '}</span>
          <span className="text-blue-300">{'className'}</span>
          <span className="text-gray-300">{'='}</span>
          <span className="text-yellow-300">{'"w-5 h-5"'}</span>
          <span className="text-gray-300">{' '}</span>
          <span className="text-blue-300">{'strokeWidth'}</span>
          <span className="text-gray-300">{'='}</span>
          <span className="text-yellow-300">{'{1.5}'}</span>
          <span className="text-gray-300">{' />'}</span>
        </pre>
      </div>
    </div>
  )
}

function Overview() {
  const size = useShowcaseSize()
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
          <Badge color="info" size={size}>v{__APP_VERSION__}</Badge>
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
            <Button size={size} variant="primary">Primary</Button>
            <Button size={size} variant="secondary">Secondary</Button>
            <Button size={size} variant="ghost">Ghost</Button>
            <Button size={size} variant="danger">Danger</Button>
          </div>
        </Demo>
        <Demo label="Badge — 6 colors">
          <div className="flex flex-wrap gap-2">
            {(['default','primary','success','warning','danger','info'] as const).map(c => (
              <Badge key={c} size={size} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
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
            <Switch size={size} defaultSelected>Notifications</Switch>
            <Switch size={size}>Dark mode</Switch>
            <Checkbox size={size} defaultSelected>Remember me</Checkbox>
            <Checkbox size={size}>Subscribe to updates</Checkbox>
          </div>
        </Demo>
      </div>
    </div>
  )
}

function ButtonSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Button" description="Accessible button built on React Aria — supports variants, sizes, icon slots, and disabled/loading states." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="variant='primary'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size={size}>Primary</Button>
            <Button variant="primary" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="variant='secondary'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size={size}>Secondary</Button>
            <Button variant="secondary" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="variant='ghost'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size={size}>Ghost</Button>
            <Button variant="ghost" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="variant='danger'">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="danger" size={size}>Danger</Button>
            <Button variant="danger" size={size} isDisabled>Disabled</Button>
          </div>
        </Demo>

        <Demo label="Sizes" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="secondary" size="md">Medium</Button>
            <Button variant="secondary" size="lg">Large</Button>
          </div>
        </Demo>

        <Demo label="With icon (icon prop)">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size={size} icon={<Plus className="w-4 h-4" />}>Add item</Button>
            <Button variant="secondary" size={size} icon={<Download className="w-4 h-4" />}>Export</Button>
            <Button variant="ghost" size={size} icon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
          </div>
        </Demo>

        <Demo label="Icon only">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary"   size={size} aria-label="Add"><Plus       className="w-4 h-4" /></Button>
            <Button variant="secondary" size={size} aria-label="Download"><Download  className="w-4 h-4" /></Button>
            <Button variant="ghost"     size={size} aria-label="Refresh"><RefreshCw  className="w-4 h-4" /></Button>
            <Button variant="danger"    size={size} aria-label="Delete"><Trash2     className="w-4 h-4" /></Button>
          </div>
        </Demo>

        <Demo label="All variants — side by side" className="sm:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary"   size={size}>Primary</Button>
            <Button variant="secondary" size={size}>Secondary</Button>
            <Button variant="ghost"     size={size}>Ghost</Button>
            <Button variant="danger"    size={size}>Danger</Button>
          </div>
        </Demo>

      </div>
    </div>
  )
}

function TextInputsSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Text Inputs" description="Accessible text entry components built on React Aria TextField." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Input" center={false}><Input size={size} label="Label" placeholder="Placeholder text..." className="w-full" /></Demo>
        <Demo label="Input — disabled" center={false}><Input size={size} label="Disabled" placeholder="Not editable" isDisabled className="w-full" /></Demo>
        <Demo label="Input — readonly" center={false}><Input size={size} label="Read only" defaultValue="Read-only value" isReadOnly className="w-full" /></Demo>
        <Demo label="Textarea" center={false}><Textarea size={size} label="Message" placeholder="Write something..." rows={3} className="w-full" /></Demo>
        <Demo label="NumberField" center={false}><NumberField size={size} label="Quantity" defaultValue={1} minValue={0} maxValue={99} className="w-full" /></Demo>
        <Demo label="SearchField" center={false}><SearchField label="Search" placeholder="Search anything..." className="w-full" /></Demo>

        <Demo label="Input — sizes" center={false} className="sm:col-span-2">
          <div className="grid grid-cols-3 gap-4 w-full">
            <Input size="sm" label="Small (sm)" placeholder="sm input" className="w-full" />
            <Input size="md" label="Medium (md)" placeholder="md input" className="w-full" />
            <Input size="lg" label="Large (lg)" placeholder="lg input" className="w-full" />
          </div>
        </Demo>

        <Demo label="NumberField — sizes" center={false} className="sm:col-span-2">
          <div className="grid grid-cols-3 gap-4 w-full">
            <NumberField size="sm" label="Small (sm)" defaultValue={1} className="w-full" />
            <NumberField size="md" label="Medium (md)" defaultValue={1} className="w-full" />
            <NumberField size="lg" label="Large (lg)" defaultValue={1} className="w-full" />
          </div>
        </Demo>
      </div>
    </div>
  )
}

function SelectSection() {
  const size = useShowcaseSize()
  const [controlled, setControlled] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <SectionHeader title="Select & ComboBox" description="Dropdown selection and autocomplete inputs." />

      {/* Static Select */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Select</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Demo label="Select" center={false}>
            <Select
              size={size}
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
              size={size}
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
            <Select size={size} label="Region" placeholder="Select region..." isDisabled className="w-full"
              options={[{ value: 'vn', label: 'Vietnam' }]}
            />
          </Demo>
          <Demo label="Select — sizes" center={false} className="sm:col-span-2">
            <div className="grid grid-cols-3 gap-4 w-full">
              {(['sm', 'md', 'lg'] as const).map(s => (
                <Select
                  key={s}
                  size={s}
                  label={`${s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'} (${s})`}
                  placeholder="Select..."
                  className="w-full"
                  options={[
                    { value: 'react',  label: 'React'   },
                    { value: 'vue',    label: 'Vue'     },
                    { value: 'svelte', label: 'Svelte'  },
                  ]}
                />
              ))}
            </div>
          </Demo>
        </div>
      </div>

      {/* AsyncSelect */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">AsyncSelect</h3>
          <p className="text-xs text-gray-400 mt-0.5">Server-side search with debounce and infinite scroll pagination.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Demo label="AsyncSelect — country (75+ options, infinite scroll)" center={false}>
            <AsyncSelect
              size={size}
              label="Country"
              placeholder="Select country..."
              className="w-full"
              fetchOptions={p => fakeSearch(COUNTRIES, p)}
              pageSize={15}
            />
          </Demo>

          <Demo label="AsyncSelect — user search (120 records)" center={false}>
            <AsyncSelect
              size={size}
              label="Assign to"
              placeholder="Search user..."
              searchPlaceholder="Type name..."
              className="w-full"
              fetchOptions={p => fakeSearch(USERS_ASYNC, p, 300)}
              pageSize={10}
            />
          </Demo>

          <Demo label="AsyncSelect — controlled + reset" center={false}>
            <div className="space-y-3 w-full">
              <AsyncSelect
                size={size}
                label="Country"
                placeholder="Select country..."
                className="w-full"
                value={controlled}
                onChange={val => setControlled(val)}
                fetchOptions={p => fakeSearch(COUNTRIES, p)}
                pageSize={15}
              />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onPress={() => setControlled('c66')}>
                  Set → United States
                </Button>
                <Button size="sm" variant="ghost" onPress={() => setControlled(null)}>
                  Reset
                </Button>
              </div>
              {controlled && (
                <p className="text-xs text-gray-400">value: <code className="text-primary">{controlled}</code></p>
              )}
            </div>
          </Demo>

          <Demo label="AsyncSelect — sizes" center={false}>
            <div className="space-y-3 w-full">
              {(['sm', 'md', 'lg'] as const).map(s => (
                <AsyncSelect
                  key={s}
                  size={s}
                  placeholder={`${s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'} (${s})`}
                  className="w-full"
                  fetchOptions={p => fakeSearch(COUNTRIES, p)}
                  pageSize={10}
                />
              ))}
            </div>
          </Demo>

          <Demo label="AsyncSelect — disabled" center={false}>
            <AsyncSelect
              size={size}
              label="Region"
              placeholder="Disabled"
              className="w-full"
              isDisabled
              fetchOptions={p => fakeSearch(COUNTRIES, p)}
            />
          </Demo>

          <Demo label="AsyncSelect — invalid state" center={false}>
            <AsyncSelect
              size={size}
              label="Required field"
              placeholder="Select country..."
              className="w-full"
              isInvalid
              fetchOptions={p => fakeSearch(COUNTRIES, p)}
            />
          </Demo>
        </div>
      </div>
    </div>
  )
}

function DateSection() {
  const tz = getLocalTimeZone()
  const todayDate = today(tz)
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="Date & Time" description="Calendar-powered date pickers using React Aria & @internationalized/date." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="DatePicker — basic" center={false}>
          <DatePicker size={size} label="Pick a date" className="w-full" />
        </Demo>

        <Demo label="DatePicker — no future dates" center={false}>
          <DatePicker
            size={size}
            label="Up to today"
            maxValue={todayDate}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — min / max range" center={false}>
          <DatePicker
            size={size}
            label="This month only"
            minValue={todayDate.set({ day: 1 })}
            maxValue={todayDate.set({ day: 1 }).add({ months: 1 }).subtract({ days: 1 })}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — block weekends" center={false}>
          <DatePicker
            size={size}
            label="Weekdays only"
            isDateUnavailable={date => isWeekend(date, tz)}
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — block specific dates" center={false}>
          <DatePicker
            size={size}
            label="Holidays blocked"
            isDateUnavailable={date =>
              ['2025-01-01', '2025-04-30', '2025-05-01', '2025-09-02'].includes(date.toString())
            }
            className="w-full"
          />
        </Demo>

        <Demo label="DatePicker — disabled" center={false}>
          <DatePicker size={size} label="Disabled" isDisabled className="w-full" />
        </Demo>

        <Demo label="DateRangePicker — basic" center={false} className="col-span-full">
          <DateRangePicker size={size} label="Date range" className="w-full" />
        </Demo>

        <Demo label="DateRangePicker — no future" center={false} className="col-span-full">
          <DateRangePicker
            size={size}
            label="Historical range"
            maxValue={todayDate}
            className="w-full"
          />
        </Demo>

        <Demo label="DateField — no popup" center={false}>
          <DateField size={size} label="Exact date" className="w-full" />
        </Demo>

        <Demo label="DateField — disabled" center={false}>
          <DateField size={size} label="Disabled" isDisabled className="w-full" />
        </Demo>

        <Demo label="TimeField — basic" center={false}>
          <TimeField size={size} label="Start time" />
        </Demo>

        <Demo label="TimeField — with seconds" center={false}>
          <TimeField size={size} label="Duration" granularity="second" />
        </Demo>

        <Demo label="Calendar — standalone" center={true} className="col-span-full">
          <Calendar />
        </Demo>

        <Demo label="RangeCalendar — standalone" center={true} className="col-span-full">
          <RangeCalendar />
        </Demo>
      </div>
    </div>
  )
}

function TogglesSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Toggles & Choices" description="Checkbox, radio, and switch components." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Checkbox" center={false}>
          <div className="space-y-2.5">
            <Checkbox size={size}>Accept terms and conditions</Checkbox>
            <Checkbox size={size} defaultSelected>Receive notifications</Checkbox>
            <Checkbox size={size} isIndeterminate>Indeterminate state</Checkbox>
            <Checkbox size={size} isDisabled>Disabled</Checkbox>
          </div>
        </Demo>
        <Demo label="CheckboxGroup" center={false}>
          <CheckboxGroup
            size={size}
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
            <Switch size={size} defaultSelected>Enable dark mode</Switch>
            <Switch size={size}>Auto-save drafts</Switch>
            <Switch size={size} defaultSelected>Compact mode</Switch>
            <Switch size={size} isDisabled>Disabled</Switch>
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

function ToggleButtonSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="ToggleButton" description="Accessible press-to-toggle button built on React Aria — supports single and multi-select groups." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="ToggleButton — standalone">
          <div className="flex flex-wrap gap-2">
            <ToggleButton size={size}>Bold</ToggleButton>
            <ToggleButton size={size} defaultSelected>Italic</ToggleButton>
            <ToggleButton size={size}>Underline</ToggleButton>
          </div>
        </Demo>

        <Demo label="ToggleButton — disabled">
          <div className="flex gap-2">
            <ToggleButton size={size} isDisabled>Disabled off</ToggleButton>
            <ToggleButton size={size} isDisabled defaultSelected>Disabled on</ToggleButton>
          </div>
        </Demo>

        <Demo label="ToggleButtonGroup — single select" className="sm:col-span-2">
          <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['grid']}>
            <ToggleButton id="list" size={size}>List</ToggleButton>
            <ToggleButton id="grid" size={size}>Grid</ToggleButton>
            <ToggleButton id="kanban" size={size}>Kanban</ToggleButton>
          </ToggleButtonGroup>
        </Demo>

        <Demo label="ToggleButtonGroup — multi select" className="sm:col-span-2">
          <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['bold', 'italic']}>
            <ToggleButton id="bold"      size={size}>Bold</ToggleButton>
            <ToggleButton id="italic"    size={size}>Italic</ToggleButton>
            <ToggleButton id="underline" size={size}>Underline</ToggleButton>
            <ToggleButton id="strike"    size={size}>Strikethrough</ToggleButton>
          </ToggleButtonGroup>
        </Demo>

      </div>
    </div>
  )
}

function FileSection() {
  const size = useShowcaseSize()
  const [files, setFiles] = useState<string[]>([])

  return (
    <div className="space-y-6">
      <SectionHeader title="File Upload" description="FileTrigger wraps any element to open the native file picker — compose with Button for custom upload UIs." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="FileTrigger — single file">
          <FileTrigger onSelect={list => list && setFiles(Array.from(list).map(f => f.name))}>
            <Button variant="secondary" size={size} icon={<Upload className="w-4 h-4" />}>
              Choose file
            </Button>
          </FileTrigger>
        </Demo>

        <Demo label="FileTrigger — image only">
          <FileTrigger acceptedFileTypes={['image/*']}>
            <Button variant="primary" size={size} icon={<Image className="w-4 h-4" />}>
              Upload image
            </Button>
          </FileTrigger>
        </Demo>

        <Demo label="FileTrigger — multiple files" className="sm:col-span-2" center={false}>
          <div className="space-y-3 w-full">
            <FileTrigger
              allowsMultiple
              onSelect={list => list && setFiles(Array.from(list).map(f => f.name))}
            >
              <Button variant="secondary" size={size} icon={<Upload className="w-4 h-4" />}>
                Choose files
              </Button>
            </FileTrigger>
            {files.length > 0 && (
              <ul className="text-sm text-gray-600 space-y-1">
                {files.map(f => <li key={f} className="flex items-center gap-1.5"><span className="text-primary">✓</span>{f}</li>)}
              </ul>
            )}
          </div>
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
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="Modal & Dialog" description="Accessible dialogs with focus management via React Aria." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Modal — form">
          <Button size={size} variant="primary" onPress={() => setOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={open}
            onOpenChange={setOpen}
            title="Edit Profile"
            footer={({ close }) => (
              <>
                <Button size={size} variant="secondary" onPress={close}>Cancel</Button>
                <Button size={size} variant="primary" onPress={close}>Save changes</Button>
              </>
            )}
          >
            <div className="space-y-4">
              <Input size={size} label="Display name" defaultValue="Alice Nguyen" />
              <Input size={size} label="Email" defaultValue="alice@example.com" />
              <Select size={size} label="Role" defaultSelectedKey="editor"
                options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }]}
              />
            </div>
          </Modal>
        </Demo>
        <Demo label="ConfirmModal — danger">
          <Button size={size} variant="danger" onPress={() => setConfirm(true)}>Delete Account</Button>
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
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Tooltip" description="Hover-triggered informational overlays." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="placement: top (default)">
          <Tooltip content="Tooltip on top"><Button size={size} variant="secondary">Hover me</Button></Tooltip>
        </Demo>
        <Demo label="placement: bottom">
          <Tooltip content="Tooltip on bottom" placement="bottom"><Button size={size} variant="secondary">Bottom</Button></Tooltip>
        </Demo>
        <Demo label="delay: 0">
          <Tooltip content="Instant tooltip" delay={0}><Button size={size} variant="secondary">No delay</Button></Tooltip>
        </Demo>
        <Demo label="long content">
          <Tooltip content="This is a longer tooltip message that wraps across lines.">
            <Button size={size} variant="ghost">Long content</Button>
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
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Dropdown Menu" description="Contextual action menus with keyboard navigation." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Menu — with icons & shortcut">
          <Menu
            trigger={<Button size={size} variant="secondary">Actions ▾</Button>}
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
            trigger={<Button size={size} variant="ghost">⋯ More</Button>}
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
  const size = useShowcaseSize()
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
                  <Input size={size} label="Project name" defaultValue="pro-ui" />
                  <Input size={size} label="Description" placeholder="Describe your project..." />
                </div>
              ),
            },
            {
              id: 'security', label: 'Security',
              content: <div className="space-y-3"><Switch size={size} defaultSelected>Two-factor auth</Switch><Switch size={size}>Session timeout</Switch></div>,
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
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Badge" description="Small status indicators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Badge — all colors">
          <div className="flex flex-wrap gap-2">
            {(['default','primary','success','warning','danger','info'] as const).map(c => (
              <Badge key={c} size={size} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
            ))}
          </div>
        </Demo>
        <Demo label="Badge — in context">
          <div className="flex flex-wrap items-center gap-2">
            <Button size={size} variant="secondary">
              Messages <Badge size={size} color="danger" className="ml-1">9+</Badge>
            </Button>
            <span className="text-sm text-gray-700">Status: <Badge size={size} color="success" className="ml-1">Online</Badge></span>
          </div>
        </Demo>
        <Demo label="Badge — sizes" className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <Badge size="sm" color="primary">Small</Badge>
            <Badge size="md" color="primary">Medium</Badge>
            <Badge size="lg" color="primary">Large</Badge>
            <Badge size="sm" color="success">Small</Badge>
            <Badge size="md" color="success">Medium</Badge>
            <Badge size="lg" color="success">Large</Badge>
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
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Card" description="Surface for grouping related content." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Card — with header" center={false}>
          <Card title="Recent activity" extra={<Badge size={size} color="primary">Live</Badge>} className="w-full">
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
          <Card title="Confirm" footer={<div className="flex justify-end gap-2"><Button size={size} variant="secondary">Cancel</Button><Button size={size} variant="primary">Apply</Button></div>} className="w-full">
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
      <SectionHeader title="Progress & Meter" description="ProgressBar for tasks/loading, Meter for capacity/usage with auto color zones." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="ProgressBar — variants" center={false} className="space-y-4 !py-6">
          <ProgressBar label="Upload"  value={65} maxValue={100} variant="primary" showValue />
          <ProgressBar label="CPU"     value={88} maxValue={100} variant="danger"  showValue />
          <ProgressBar label="Storage" value={42} maxValue={100} variant="warning" size="sm" showValue />
          <ProgressBar label="Tasks"   value={73} maxValue={100} variant="success" showValue />
        </Demo>
        <Demo label="Meter — auto color (green→yellow→red)" center={false} className="space-y-4 !py-6">
          <Meter label="Disk usage"   value={25}  maxValue={100} />
          <Meter label="RAM"          value={62}  maxValue={100} />
          <Meter label="CPU"          value={91}  maxValue={100} />
          <Meter label="Network"      value={48}  maxValue={100} size="sm" />
        </Demo>
        <Demo label="Meter — fixed variants" center={false} className="space-y-4 !py-6">
          <Meter label="Primary"  value={70} maxValue={100} variant="primary" />
          <Meter label="Success"  value={55} maxValue={100} variant="success" />
          <Meter label="Warning"  value={75} maxValue={100} variant="warning" />
          <Meter label="Danger"   value={90} maxValue={100} variant="danger"  />
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

function DisclosureSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Disclosure" description="Collapsible content panels — standalone or grouped as an Accordion." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standalone</p>
          <Disclosure title="What is React Aria?">
            React Aria is a library of unstyled, accessible UI components built by Adobe. It handles all the keyboard interactions, screen reader support, and accessibility semantics so you can focus on styling.
          </Disclosure>
          <Disclosure title="Is it production-ready?" defaultExpanded>
            Yes! React Aria is used in Adobe's own products and is battle-tested for accessibility compliance, including WCAG 2.1 and ARIA 1.2 patterns.
          </Disclosure>
          <Disclosure title="Does it work with Tailwind?">
            Absolutely. Pro UI wraps React Aria with Tailwind CSS v4 classes, providing ready-to-use styled components that you can customise via CSS variables.
          </Disclosure>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accordion (single open)</p>
          <Accordion>
            <Disclosure title="Section 1 — Getting started">
              Install the package, import the Tailwind entry point, and set <code className="bg-gray-100 px-1 rounded text-xs">--primary</code> in your CSS.
            </Disclosure>
            <Disclosure title="Section 2 — Theming">
              Override <code className="bg-gray-100 px-1 rounded text-xs">--primary</code> and <code className="bg-gray-100 px-1 rounded text-xs">--base-radius</code> to retheme the entire library — all palettes are derived automatically.
            </Disclosure>
            <Disclosure title="Section 3 — ProTable & ProForm">
              ProTable gives you server-side pagination, sort, column visibility, and pinning out of the box. ProForm wraps react-hook-form with Zod validation.
            </Disclosure>
          </Accordion>
        </div>

        <div className="sm:col-span-2 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accordion — multiple open</p>
          <Accordion allowsMultipleExpanded>
            <Disclosure title="Can multiple panels be open?">Yes — pass <code className="bg-gray-100 px-1 rounded text-xs">allowsMultipleExpanded</code> to the Accordion.</Disclosure>
            <Disclosure title="Is keyboard navigation supported?">Yes — Tab moves focus, Enter/Space toggles the panel. React Aria handles all interactions automatically.</Disclosure>
            <Disclosure title="Can I nest accordions?">You can nest Disclosure components but avoid nesting Accordion inside Accordion — it creates confusing UX.</Disclosure>
          </Accordion>
        </div>

      </div>
    </div>
  )
}

function LinkSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Link" description="Accessible link built on React Aria — supports variants, external navigation, and router integration." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="Variants">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="#">Default link</Link>
            <Link href="#" variant="muted">Muted link</Link>
            <Link href="#" variant="danger">Danger link</Link>
          </div>
        </Demo>

        <Demo label="External (opens in new tab)">
          <Link href="https://react-spectrum.adobe.com/react-aria/" target="_blank" rel="noopener noreferrer">
            React Aria docs ↗
          </Link>
        </Demo>

        <Demo label="Inline in text" center={false}>
          <p className="text-sm text-gray-600 leading-relaxed">
            This component is built on{' '}
            <Link href="#">React Aria Components</Link>
            {' '}and styled with{' '}
            <Link href="#" variant="muted">Tailwind CSS v4</Link>.
            All interactions are keyboard-accessible and screen-reader friendly.
            See the <Link href="#" variant="danger">deprecation notice</Link> for older APIs.
          </p>
        </Demo>

        <Demo label="As button (no href)">
          <div className="flex gap-4 text-sm">
            <Link onPress={() => alert('clicked!')}>Press me</Link>
            <Link isDisabled>Disabled link</Link>
          </div>
        </Demo>

      </div>
    </div>
  )
}

function ProTableSection() {
  const size = useShowcaseSize()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const bulkActions: BulkActionDef<User>[] = [
    {
      label: 'Export CSV',
      onClick: (keys) => showToast(`Exported ${keys.length} users as CSV`),
    },
    {
      label: 'Change status',
      onClick: (keys) => showToast(`Updated status for ${keys.length} users`),
    },
    {
      label: 'Delete selected',
      danger: true,
      onClick: () => setConfirmDelete(true),
    },
  ]

  return (
    <div className="space-y-10">
      <SectionHeader title="ProTable" description="Data table with auto search form, server-side pagination, sorting, column visibility toggle, column pinning, and valueType renderers." />

      {/* Basic table */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Basic — search, sort, pagination, column visibility & pinning</h3>
          <p className="text-xs text-gray-400 mt-0.5">Hover column header to pin left/right · toolbar icon to show/hide columns · Name column is always visible</p>
        </div>
        <ProTable<User>
          columns={TABLE_COLS}
          request={mockRequest}
          rowKey="id"
          headerTitle="User Management"
          size={size}
          toolBarRender={() => [
            <Button key="add" variant="primary" size={size}>+ Add User</Button>,
            <Button key="exp" variant="secondary" size={size}>Export</Button>,
          ]}
        />
      </div>

      {/* Row selection + bulk actions */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">With row selection & bulk actions</h3>
          <p className="text-xs text-gray-400 mt-0.5">Select rows → sticky action bar appears · Name pinnable left, Created pinnable right</p>
        </div>

        {toast && (
          <Alert variant="success" closable>{toast}</Alert>
        )}

        <ProTable<User>
          columns={TABLE_COLS_SELECT}
          request={mockRequest}
          rowKey="id"
          headerTitle="User Management"
          size={size}
          toolBarRender={() => [
            <Button key="add" variant="primary" size={size}>+ Add User</Button>,
          ]}
          rowSelection={{
            onChange: (keys) => setSelectedKeys(keys),
          }}
          bulkActions={bulkActions}
        />

        <ConfirmModal
          isOpen={confirmDelete}
          onOpenChange={setConfirmDelete}
          title="Delete selected users"
          description={`Are you sure you want to delete ${selectedKeys.length} selected user${selectedKeys.length !== 1 ? 's' : ''}? This action cannot be undone.`}
          confirmLabel="Yes, delete"
          danger
          onConfirm={() => {
            showToast(`Deleted ${selectedKeys.length} users`)
            setConfirmDelete(false)
          }}
        />
      </div>
    </div>
  )
}

/* ─── Color system section ───────────────────────────────────────────────── */

function ThemeSwatch({ prefix, step }: { prefix: string; step: number }) {
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
          {primarySteps.map(s => <ThemeSwatch key={s} prefix="primary" step={s} />)}
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
                {statusSteps.map(step => <ThemeSwatch key={step} prefix={s.prefix} step={step} />)}
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


function LayoutSection() {
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

      {/* Demo 1 — static sidebar */}
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

      {/* Demo 2 — collapsible sidebar */}
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
                <Alert variant="info">
                  Click the <strong>Collapse</strong> button at the bottom of the sidebar to toggle icon-only mode.
                </Alert>
                <Skeleton variant="text" lines={5} />
              </div>
            </Layout.Content>
          </Layout.Body>
        </Layout>
      </Demo>

      {/* Demo 3 — right sidebar */}
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

/* ─── ProForm demo ───────────────────────────────────────────────────────── */

const profileSchema = z.object({
  name:     z.string().min(2, 'At least 2 characters'),
  email:    z.string().email('Invalid email'),
  role:     z.enum(['admin', 'editor', 'viewer']).optional(),
  salary:   z.number().min(0).optional(),
  bio:      z.string().max(200, 'Max 200 characters').optional(),
  startDate:z.string().optional(),
  notify:   z.boolean().default(false),
  active:   z.boolean().default(true),
})

const roleOptions = [
  { value: 'admin',  label: 'Admin'  },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

function ProFormSection() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="ProForm" description="Schema-driven forms with React Hook Form + Zod. Validation, error display, and all field types wired automatically." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Demo label="Vertical layout (default)" center={false}>
          <ProForm
            schema={profileSchema}
            defaultValues={{ role: 'viewer', notify: false, active: true }}
            onFinish={vals => setResult(vals)}
            submitText="Save profile"
            size={size}
            showReset
          >
            <ProFormRow>
              <ProFormInput name="name"  label="Full name"  placeholder="Alice Nguyen" required />
              <ProFormInput name="email" label="Email"      placeholder="alice@example.com" type="email" required />
            </ProFormRow>
            <ProFormRow>
              <ProFormSelect       name="role"   label="Role"   options={roleOptions} required />
              <ProFormNumberField  name="salary" label="Salary (₫)" min={0} formatOptions={{ style: 'decimal' }} />
            </ProFormRow>
            <ProFormDatePicker name="startDate" label="Start date" />
            <ProFormTextarea   name="bio"       label="Bio" placeholder="A short bio…" rows={3} />
            <ProFormRow>
              <ProFormSwitch   name="active"  label="Active account" />
              <ProFormCheckbox name="notify"  label="Email notifications" />
            </ProFormRow>
          </ProForm>
        </Demo>

        <Demo label="Horizontal layout" center={false}>
          <ProForm
            schema={z.object({
              username: z.string().min(3, 'Min 3 chars'),
              password: z.string().min(8, 'Min 8 chars'),
              confirm:  z.string(),
            }).refine(d => d.password === d.confirm, {
              message: 'Passwords do not match',
              path: ['confirm'],
            })}
            onFinish={vals => setResult(vals)}
            layout="horizontal"
            size={size}
            submitText="Sign up"
          >
            <ProFormInput name="username" label="Username" placeholder="alice" required />
            <ProFormInput name="password" label="Password" type="password" placeholder="••••••••" required />
            <ProFormInput name="confirm"  label="Confirm"  type="password" placeholder="••••••••" required />
          </ProForm>
        </Demo>

      </div>

      <Demo label="ProForm — size=sm" center={false}>
        <ProForm
          schema={z.object({ name: z.string().min(2), role: z.enum(['admin','editor','viewer']).optional() })}
          defaultValues={{ role: 'viewer' }}
          onFinish={() => {}}
          size="sm"
          submitText="Submit"
        >
          <ProFormRow>
            <ProFormInput name="name" label="Full name" placeholder="Alice Nguyen" required />
            <ProFormSelect name="role" label="Role" options={roleOptions} />
          </ProFormRow>
        </ProForm>
      </Demo>

      {result && (
        <div className="bg-gray-900 rounded-[var(--base-radius)] p-4 text-sm font-mono text-green-400 overflow-auto">
          <div className="text-gray-500 text-xs mb-2">onFinish output:</div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

/* ─── Section registry ───────────────────────────────────────────────────── */

function PopoverSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Popover" description="Floating content panel positioned relative to a trigger — no backdrop, no scroll lock." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Basic popover">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Open popover</Button>}
            placement="bottom"
          >
            <p className="text-sm text-gray-700 font-medium mb-1">Popover title</p>
            <p className="text-xs text-gray-500">This is a popover with arbitrary content. Click outside to close.</p>
          </Popover>
        </Demo>
        <Demo label="With arrow">
          <Popover
            triggerElement={<Button size={size} variant="secondary">With arrow</Button>}
            placement="bottom"
            showArrow
          >
            <p className="text-sm text-gray-600">Content with arrow indicator.</p>
          </Popover>
        </Demo>
        <Demo label="Placement top">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Top placement</Button>}
            placement="top"
          >
            <p className="text-sm text-gray-600">Placed above the trigger.</p>
          </Popover>
        </Demo>
        <Demo label="Placement right">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Right placement</Button>}
            placement="right"
          >
            <p className="text-sm text-gray-600">Placed to the right.</p>
          </Popover>
        </Demo>
      </div>
    </div>
  )
}

function ToolbarSection() {
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left')
  return (
    <div className="space-y-6">
      <SectionHeader title="Toolbar" description="Keyboard-navigable toolbar container — arrow keys move focus between items." />
      <div className="grid grid-cols-1 gap-4">
        <Demo label="Text formatting toolbar" center={false}>
          <Toolbar aria-label="Text formatting">
            <ToggleButton isSelected={bold} onChange={setBold} size="sm" aria-label="Bold">
              <span className="font-bold text-xs px-0.5">B</span>
            </ToggleButton>
            <ToggleButton isSelected={italic} onChange={setItalic} size="sm" aria-label="Italic">
              <span className="italic text-xs px-0.5">I</span>
            </ToggleButton>
            <ToggleButton isSelected={underline} onChange={setUnderline} size="sm" aria-label="Underline">
              <span className="underline text-xs px-0.5">U</span>
            </ToggleButton>
            <ToolbarSeparator />
            {(['left', 'center', 'right'] as const).map(a => (
              <ToggleButton key={a} isSelected={align === a} onChange={() => setAlign(a)} size="sm" aria-label={`Align ${a}`}>
                <span className="text-xs px-0.5 capitalize">{a[0]}</span>
              </ToggleButton>
            ))}
            <ToolbarSeparator />
            <Button size="sm" variant="ghost" aria-label="Undo">↩</Button>
            <Button size="sm" variant="ghost" aria-label="Redo">↪</Button>
          </Toolbar>
          {(bold || italic || underline) && (
            <p className="text-xs text-gray-500 mt-2">
              Active: {[bold && 'Bold', italic && 'Italic', underline && 'Underline'].filter(Boolean).join(', ')} · Align: {align}
            </p>
          )}
        </Demo>
        <Demo label="Action toolbar" center={false}>
          <Toolbar aria-label="File actions">
            <Button size="sm" variant="ghost"><Plus className="w-3.5 h-3.5" /> New</Button>
            <Button size="sm" variant="ghost"><Download className="w-3.5 h-3.5" /> Export</Button>
            <ToolbarSeparator />
            <Button size="sm" variant="ghost" className="text-danger"><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
          </Toolbar>
        </Demo>
      </div>
    </div>
  )
}

function ListBoxSection() {
  const [single, setSingle] = useState<'left' | 'center' | 'right' | string>('react')
  const [multi, setMulti] = useState(new Set(['ts']))
  return (
    <div className="space-y-6">
      <SectionHeader title="ListBox" description="Accessible selectable list with keyboard navigation, single/multiple selection, and grouped sections." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Single selection" center={false}>
          <ListBox
            selectionMode="single"
            selectedKeys={new Set([single])}
            onSelectionChange={(keys) => setSingle([...keys][0] as string)}
            items={[
              { id: 'react', label: 'React' },
              { id: 'vue', label: 'Vue' },
              { id: 'svelte', label: 'Svelte' },
              { id: 'angular', label: 'Angular', disabled: true },
            ]}
          />
        </Demo>
        <Demo label="Multiple selection" center={false}>
          <ListBox
            selectionMode="multiple"
            selectedKeys={multi}
            onSelectionChange={(keys) => setMulti(new Set(keys as Set<string>))}
            items={[
              { id: 'ts', label: 'TypeScript', description: 'Typed superset of JS' },
              { id: 'tw', label: 'Tailwind CSS', description: 'Utility-first CSS' },
              { id: 'vite', label: 'Vite', description: 'Next-gen build tool' },
              { id: 'zod', label: 'Zod', description: 'TypeScript-first schema' },
            ]}
          />
        </Demo>
        <Demo label="With sections" center={false} className="col-span-full">
          <ListBox
            selectionMode="single"
            items={[
              { id: 'frontend', title: 'Frontend', items: [
                { id: 'react2', label: 'React' },
                { id: 'next', label: 'Next.js' },
              ]},
              { id: 'backend', title: 'Backend', items: [
                { id: 'node', label: 'Node.js' },
                { id: 'go', label: 'Go' },
                { id: 'rust', label: 'Rust', disabled: true },
              ]},
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

function GridListSection() {
  const [selected, setSelected] = useState(new Set(['b']))
  return (
    <div className="space-y-6">
      <SectionHeader title="GridList" description="Selectable list with checkbox indicators — ideal for multi-select data lists." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Single selection" center={false}>
          <GridList
            selectionMode="single"
            selectedKeys={selected}
            onSelectionChange={(keys) => setSelected(new Set(keys as Set<string>))}
            items={[
              { id: 'a', label: 'Alice Nguyen', description: 'alice@example.com' },
              { id: 'b', label: 'Bob Tran', description: 'bob@example.com' },
              { id: 'c', label: 'Carol Le', description: 'carol@example.com' },
            ]}
          />
        </Demo>
        <Demo label="Multiple selection" center={false}>
          <GridList
            selectionMode="multiple"
            defaultSelectedKeys={new Set(['x', 'z'])}
            items={[
              { id: 'x', label: 'Invoice #1001', description: '₫12,000,000' },
              { id: 'y', label: 'Invoice #1002', description: '₫8,500,000' },
              { id: 'z', label: 'Invoice #1003', description: '₫22,000,000' },
              { id: 'w', label: 'Invoice #1004', description: '₫5,000,000', disabled: true },
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

function AutocompleteSection() {
  const size = useShowcaseSize()
  const CITIES = [
    { id: 'hcm', label: 'Ho Chi Minh City', description: 'Southern Vietnam' },
    { id: 'hn',  label: 'Hanoi',            description: 'Northern Vietnam'  },
    { id: 'dn',  label: 'Da Nang',          description: 'Central Vietnam'   },
    { id: 'hp',  label: 'Hai Phong',        description: 'Northern port city' },
    { id: 'ct',  label: 'Can Tho',          description: 'Mekong Delta'      },
    { id: 'bh',  label: 'Bien Hoa',         description: 'Dong Nai province' },
    { id: 'vt',  label: 'Vung Tau',         description: 'Coastal city'      },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Autocomplete" description="Searchable input with a live-filtered suggestion list." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Basic autocomplete" center={false}>
          <Autocomplete label="City" placeholder="Search cities…" items={CITIES} size={size} />
        </Demo>
        <Demo label="No label" center={false}>
          <Autocomplete placeholder="Search frameworks…" size={size} items={[
            { id: 'react', label: 'React' },
            { id: 'vue',   label: 'Vue'   },
            { id: 'svelte',label: 'Svelte'},
            { id: 'solid', label: 'Solid' },
            { id: 'qwik',  label: 'Qwik'  },
          ]} />
        </Demo>
      </div>
    </div>
  )
}

function TreeSection() {
  const TREE_DATA = [
    { id: 'src', label: 'src', children: [
      { id: 'components', label: 'components', children: [
        { id: 'button', label: 'button.tsx' },
        { id: 'input',  label: 'input.tsx'  },
        { id: 'modal',  label: 'modal.tsx'  },
      ]},
      { id: 'lib', label: 'lib', children: [
        { id: 'cn',   label: 'cn.ts'   },
        { id: 'size', label: 'size.ts' },
      ]},
      { id: 'app', label: 'app.tsx' },
    ]},
    { id: 'public', label: 'public', children: [
      { id: 'favicon', label: 'favicon.svg' },
    ]},
    { id: 'pkg', label: 'package.json' },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Tree" description="Hierarchical data with expand/collapse and optional keyboard selection." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="File tree — no selection" center={false}>
          <div className="border border-gray-200 rounded-[var(--base-radius)] bg-white p-1 w-full">
            <Tree items={TREE_DATA} />
          </div>
        </Demo>
        <Demo label="With single selection" center={false}>
          <div className="border border-gray-200 rounded-[var(--base-radius)] bg-white p-1 w-full">
            <Tree items={TREE_DATA} selectionMode="single" defaultSelectedKeys={new Set(['button'])} />
          </div>
        </Demo>
        <Demo label="With multiple selection" center={false} className="col-span-full">
          <div className="border border-gray-200 rounded-[var(--base-radius)] bg-white p-1 w-full">
            <Tree items={TREE_DATA} selectionMode="multiple" defaultSelectedKeys={new Set(['input', 'cn'])} />
          </div>
        </Demo>
      </div>
    </div>
  )
}

function DropZoneSection() {
  const [files, setFiles] = useState<string[]>([])
  return (
    <div className="space-y-6">
      <SectionHeader title="Drop Zone" description="Drag-and-drop file target area with click-to-browse fallback via FileTrigger." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Basic drop zone" center={false}>
          <DropZone
            label="Drop files here or click to browse"
            description="Any file type accepted"
            onFiles={(fl) => setFiles(Array.from(fl).map(f => f.name))}
          />
          {files.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
              {files.map(f => <div key={f} className="font-mono">{f}</div>)}
            </div>
          )}
        </Demo>
        <Demo label="Images only" center={false}>
          <DropZone
            label="Drop images or click to browse"
            description="PNG, JPG, GIF up to 10 MB"
            accept={['image/*']}
          />
        </Demo>
      </div>
    </div>
  )
}

function ColorPickerSection() {
  const PRESETS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff']
  return (
    <div className="space-y-6">
      <SectionHeader title="Color Picker" description="Full color picker suite: area picker, hue wheel, channel sliders, hex field, and swatch palettes." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Full color picker" center={false}>
          <ColorPicker label="Brand color" defaultValue="#008060" presetColors={PRESETS} />
        </Demo>
        <Demo label="Swatch palette" center={false}>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-600">Pick a preset</span>
            <ColorSwatchPicker colors={PRESETS} swatchSize="lg" />
          </div>
        </Demo>
        <Demo label="Color swatches (display)" center={false}>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(c => <ColorSwatch key={c} color={c} size="lg" />)}
          </div>
        </Demo>
        <Demo label="Hex color field" center={false}>
          <ColorField label="Hex value" defaultValue="#3b82f6" />
        </Demo>
        <Demo label="Hue slider" center={false}>
          <ColorSlider defaultValue="hsl(200, 100%, 50%)" channel="hue" label="Hue" />
        </Demo>
        <Demo label="Saturation slider" center={false}>
          <ColorSlider defaultValue="hsl(200, 75%, 50%)" colorSpace="hsl" channel="saturation" label="Saturation" />
        </Demo>
      </div>
    </div>
  )
}

const SECTIONS: Record<string, React.ReactNode> = {
  overview:    <Overview />,
  colors:      <ColorSystemSection />,
  icons:       <IconsSection />,
  button:         <ButtonSection />,
  'toggle-button': <ToggleButtonSection />,
  'text-inputs':  <TextInputsSection />,
  select:         <SelectSection />,
  datetime:       <DateSection />,
  toggles:        <TogglesSection />,
  slider:         <SliderSection />,
  tags:           <TagsSection />,
  file:           <FileSection />,
  autocomplete:   <AutocompleteSection />,
  dropzone:       <DropZoneSection />,
  modal:          <ModalSection />,
  popover:        <PopoverSection />,
  tooltip:        <TooltipSection />,
  menu:           <MenuSection />,
  tabs:           <TabsSection />,
  breadcrumbs:    <BreadcrumbsSection />,
  toolbar:        <ToolbarSection />,
  listbox:        <ListBoxSection />,
  gridlist:       <GridListSection />,
  tree:           <TreeSection />,
  'color-picker': <ColorPickerSection />,
  badge:          <BadgeSection />,
  alert:          <AlertSection />,
  card:           <CardSection />,
  avatar:         <AvatarSection />,
  progress:       <ProgressSection />,
  skeleton:       <SkeletonSection />,
  disclosure:     <DisclosureSection />,
  link:           <LinkSection />,
  protable:    <ProTableSection />,
  proform:     <ProFormSection />,
  layout:      <LayoutSection />,
  'llm-txt':   <LLMTxtSection />,
}

/* ─── Radius & color ─────────────────────────────────────────────────────── */

type RadiusMode = 'none' | 'md' | 'lg'
const RADIUS_MAP: Record<RadiusMode, string> = { none: '0px', md: '6px', lg: '12px' }

/* ─── App ────────────────────────────────────────────────────────────────── */

const ALL_IDS = new Set(NAV.flatMap(g => g.items).map(i => i.id))

function getHashSection() {
  const id = window.location.hash.slice(1)
  return ALL_IDS.has(id) ? id : 'overview'
}

export default function App() {
  const [active, setActive] = useState(getHashSection)
  const [radius, setRadius] = useState<RadiusMode>('none')
  const [primary, setPrimary] = useState('#6366f1')
  const [size, setSize] = useState<Size>('md')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setActive(getHashSection())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (id: string) => {
    window.location.hash = id
    setMobileNavOpen(false)
  }

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
          <MenuIcon className="w-5 h-5" />
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

          {/* Size */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:block">Size</span>
            <Select
              size="sm"
              selectedKey={size}
              onSelectionChange={k => setSize(k as Size)}
              options={[
                { value: 'sm', label: 'Small'  },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large'  },
              ]}
              className="w-24"
            />
          </div>

          {/* Radius */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:block">Radius</span>
            <Select
              size="sm"
              selectedKey={radius}
              onSelectionChange={k => { const r = k as RadiusMode; setRadius(r); applyTheme(r, primary) }}
              options={[
                { value: 'none', label: 'None'   },
                { value: 'md',   label: 'Medium' },
                { value: 'lg',   label: 'Large'  },
              ]}
              className="w-24"
            />
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
                        onClick={() => navigate(item.id)}
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
        <ShowcaseSizeCtx.Provider value={size}>
          <main className={cn(
            'flex-1 min-w-0 md:ml-56',
            (active === 'protable' || active === 'layout') ? 'p-6' : 'px-6 py-8 max-w-4xl',
          )}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <span>pro-ui</span>
              <span>›</span>
              <span className="text-gray-700 font-medium">{navLabel}</span>
            </div>

            {SECTIONS[active]}
          </main>
        </ShowcaseSizeCtx.Provider>
      </div>
    </div>
  )
}
