import { useState } from 'react'
import { Button } from '../../components'
import { SectionHeader } from '../shared'

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

export function LLMTxtSection() {
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
        <Button variant="primary" size="md" onPress={handleCopy}>
          {copied ? '✓ Copied!' : 'Copy LLM.txt'}
        </Button>
      </div>

      <div className="rounded-[var(--base-radius)] border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle bg-surface-subtle/80">
          <span className="text-[11px] font-mono font-medium text-fg-disabled tracking-wide">
            llm.txt — {LLM_TXT.length.toLocaleString()} characters · {LLM_TXT.split('\n').length} lines
          </span>
          <button
            onClick={handleCopy}
            className="text-[11px] text-fg-disabled hover:text-primary transition-colors font-mono"
          >
            {copied ? '✓ copied' : 'copy'}
          </button>
        </div>
        <textarea
          readOnly
          value={LLM_TXT}
          rows={30}
          className="w-full px-5 py-4 text-xs font-mono text-gray-300 bg-gray-950 resize-none outline-none leading-5"
        />
      </div>
    </div>
  )
}
