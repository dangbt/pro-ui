# @dangbt/pro-ui

React component library built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) + [Tailwind CSS v4](https://tailwindcss.com/).

**[→ Live Showcase](https://pro-ui-showcase.pages.dev)**

---

## Features

- Fully accessible via React Aria Components
- Tailwind v4 — single `--primary` token drives the entire palette
- ProTable — server-side table with search form, sort, column visibility toggle, column pinning, row selection, bulk actions, expandable rows
- ProForm — schema-driven form (Zod + react-hook-form) with responsive layout
- Dark-mode ready via CSS variable theming

## Installation

The package is published to GitHub Packages. Add the registry to `.npmrc`:

```
@dangbt:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Then install:

```bash
npm install @dangbt/pro-ui
```

## Setup

Import the Tailwind integration entry point in your root CSS **before** your own `@theme` blocks:

```css
@import "tailwindcss";
@import "@dangbt/pro-ui/tailwind.css";

@theme inline {
  --color-primary: var(--primary);
  /* ... your other tokens */
}

:root {
  --primary: #008060;
  --base-radius: 8px;
}
```

`@dangbt/pro-ui/tailwind.css` registers the `@source` path for pro-ui's component classes and the `tailwindcss-react-aria-components` plugin automatically.

## Components

### Form

| Component | Description |
|---|---|
| `Button` | Primary / secondary / ghost / destructive variants |
| `Input` | Text input with label, description, error state |
| `Textarea` | Multi-line input |
| `NumberField` | Numeric input with stepper |
| `SearchField` | Input with clear button |
| `Select` | Single-select dropdown |
| `AsyncSelect` | Paginated async select with search |
| `ComboBox` | Searchable combobox |
| `Checkbox` / `CheckboxGroup` | Single and grouped checkboxes |
| `RadioGroup` | Radio button group |
| `Switch` | Toggle switch |
| `Slider` | Range slider (single and double thumb) |
| `DatePicker` / `DateRangePicker` | Calendar date picker |
| `TagGroup` | Multi-select tag picker |

### Pro Components

| Component | Description |
|---|---|
| `ProForm` | Schema-driven form with vertical / horizontal layout, responsive |
| `ProFormItem` | Field wrapper with label, error, description |
| `ProFormRow` | Side-by-side fields (2 cols on `sm+`, stacks on mobile) |
| `ProFormInput` / `ProFormSelect` / … | Controlled field wrappers for ProForm |
| `ProTable` | Full-featured data table (see below) |

### Display & Feedback

| Component | Description |
|---|---|
| `Badge` | Status badge with color variants |
| `Card` | Content container |
| `Avatar` / `AvatarGroup` | User avatar with fallback initials |
| `Alert` | Inline status message, closable |
| `Spinner` | Loading indicator |
| `Skeleton` | Loading placeholder |
| `ProgressBar` | Determinate / indeterminate progress |
| `Divider` | Horizontal rule |

### Overlay & Navigation

| Component | Description |
|---|---|
| `Modal` / `ConfirmModal` | Dialog, confirm dialog |
| `Tooltip` | Hover tooltip |
| `Menu` | Dropdown action menu |
| `Tabs` | Tab navigation |
| `Breadcrumbs` | Breadcrumb trail |

### Layout

| Component | Description |
|---|---|
| `Layout` / `useSider` | App shell with collapsible sidebar |

---

## ProTable

```tsx
import { ProTable } from '@dangbt/pro-ui'
import type { ProColumnType, QueryParams, RequestResult } from '@dangbt/pro-ui'

type User = { id: string; name: string; email: string; status: string }

const columns: ProColumnType<User>[] = [
  { title: 'Name',   dataIndex: 'name',   sortable: true, disableHiding: true, pinnable: true },
  { title: 'Email',  dataIndex: 'email',  width: 220 },
  { title: 'Status', dataIndex: 'status', valueType: 'select', valueEnum: {
    active:   { text: 'Active',   color: 'success' },
    inactive: { text: 'Inactive', color: 'default' },
  }},
  {
    title: 'Actions', key: 'actions', hideInSearch: true, align: 'center', pinnable: true,
    render: (_v, row) => <button onClick={() => edit(row)}>Edit</button>,
  },
]

async function fetchUsers(params: QueryParams): Promise<RequestResult<User>> {
  const res = await api.get('/users', { params })
  return { data: res.data, total: res.total, success: true }
}

<ProTable<User>
  columns={columns}
  request={fetchUsers}
  rowKey="id"
  headerTitle="Users"
  toolBarRender={() => [<Button variant="primary">+ Add</Button>]}
  rowSelection={{ onChange: (keys, rows) => setSelected(rows) }}
  bulkActions={[
    { label: 'Export', onClick: (keys) => exportCSV(keys) },
    { label: 'Delete', danger: true, onClick: (keys) => deleteMany(keys) },
  ]}
/>
```

**Column options:**

| Prop | Type | Description |
|---|---|---|
| `dataIndex` | `keyof T` | Field accessor |
| `valueType` | `text \| number \| date \| dateRange \| select \| money` | Renderer preset |
| `valueEnum` | `Record<string, { text, color }>` | Enum map for select renderer |
| `sortable` | `boolean` | Enable server-side sort |
| `pinnable` | `boolean` | Hover to pin left / right |
| `disableHiding` | `boolean` | Lock column in visibility toggle |
| `hideInSearch` | `boolean` | Exclude from search form |
| `hideInTable` | `boolean` | Hidden by default (toggle to show) |
| `render` | `(value, record, index) => ReactNode` | Custom cell renderer |

---

## ProForm

```tsx
import { ProForm, ProFormItem, ProFormRow, ProFormInput, ProFormSelect } from '@dangbt/pro-ui'
import { z } from 'zod'

const schema = z.object({
  name:  z.string().min(1),
  email: z.string().email(),
  role:  z.string(),
})

<ProForm
  schema={schema}
  defaultValues={{ name: '', email: '', role: 'viewer' }}
  onFinish={async (values) => { await save(values) }}
  layout="vertical"
  submitText="Save"
>
  <ProFormRow>
    <ProFormInput name="name"  label="Name"  required />
    <ProFormInput name="email" label="Email" required />
  </ProFormRow>
  <ProFormSelect name="role" label="Role" options={roleOptions} />
</ProForm>
```

---

## Theming

Override `--primary` and `--base-radius` at `:root` to retheme the entire library:

```css
:root {
  --primary: #6366f1;   /* indigo */
  --base-radius: 4px;   /* sharper corners */
}
```

All status colors (success, warning, danger, info) and tonal scales are computed automatically via `color-mix`.

---

## Peer dependencies

```
react >=18
react-dom >=18
react-aria-components >=1
tailwindcss >=4
@tanstack/react-table >=8
react-hook-form >=7
@hookform/resolvers >=3
@internationalized/date >=3
lucide-react >=0.400.0
zod >=3
```
