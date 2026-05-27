# @dangbt/pro-ui

React component library built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) + [Tailwind CSS v4](https://tailwindcss.com/).

**[→ Live Showcase](https://pro-ui.pages.dev)**

---

## Features

- **40+ accessible components** built on React Aria — keyboard nav, screen reader, focus management out of the box
- **Single-token theming** — change `--primary` once, the entire palette adapts automatically via `color-mix()`
- **ProTable** — server-side data table with search form, sort, column visibility, pinning, row selection, bulk actions
- **ProForm** — schema-driven form (Zod + react-hook-form), vertical / horizontal layout, responsive

---

## Installation

```bash
npm install @dangbt/pro-ui
```

Install peer dependencies (if not already in your project):

```bash
npm install react-aria-components lucide-react tailwindcss \
  @tanstack/react-table react-hook-form @hookform/resolvers \
  zod @internationalized/date
```

### React 19 compatibility

This library ships types compiled against React 18. If you're using **React 19**, add `skipLibCheck` to your `tsconfig.json` to avoid potential type conflicts:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

---

## Quick Start

### 1 — CSS setup

In your root CSS entry point (`index.css` / `globals.css`):

```css
@import "tailwindcss";
@import "@dangbt/pro-ui/tailwind.css";   /* source scanning + RAC variants */
@import "@dangbt/pro-ui/theme.css";       /* color system + Tailwind tokens */

/* Override these 2 variables to retheme everything */
:root {
  --primary: #6366f1;   /* your brand color */
  --base-radius: 8px;   /* corner radius: 0px | 6px | 12px | … */
}
```

That's it. All color scales, status colors, and radius tokens are derived automatically.

### 2 — Use components

```tsx
import { Button, Input, Select, Badge, Modal } from '@dangbt/pro-ui'

export function Example() {
  return (
    <>
      <Input label="Email" placeholder="you@example.com" type="email" />
      <Button variant="primary" onPress={() => {}}>Save</Button>
      <Badge color="success">Active</Badge>
    </>
  )
}
```

### 3 — ProTable (data table)

```tsx
import { ProTable } from '@dangbt/pro-ui'
import type { ProColumnType, QueryParams } from '@dangbt/pro-ui'

type User = { id: string; name: string; status: 'active' | 'inactive' }

const columns: ProColumnType<User>[] = [
  { title: 'Name',   dataIndex: 'name',   sortable: true },
  { title: 'Status', dataIndex: 'status', valueType: 'select',
    valueEnum: {
      active:   { text: 'Active',   color: 'success' },
      inactive: { text: 'Inactive', color: 'default' },
    },
  },
  {
    title: '', key: 'actions', hideInSearch: true, align: 'right',
    render: (_v, row) => <Button size="sm" onPress={() => edit(row)}>Edit</Button>,
  },
]

<ProTable<User>
  rowKey="id"
  columns={columns}
  request={async ({ current, pageSize, ...search }) => {
    const res = await api.users({ page: current, pageSize, ...search })
    return { data: res.data, total: res.total, success: true }
  }}
  headerTitle="Users"
  toolBarRender={() => [<Button key="add" variant="primary">+ Add</Button>]}
  rowSelection={{ onChange: (keys, rows) => setSelected(rows) }}
  bulkActions={[
    { label: 'Export', onClick: (keys) => exportCSV(keys) },
    { label: 'Delete', danger: true, onClick: (keys) => deleteMany(keys) },
  ]}
/>
```

### 4 — ProForm (schema-driven form)

```tsx
import { ProForm, ProFormRow, ProFormInput, ProFormSelect } from '@dangbt/pro-ui'
import { z } from 'zod'

const schema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  role:  z.enum(['admin', 'editor', 'viewer']),
})

<ProForm
  schema={schema}
  defaultValues={{ name: '', email: '', role: 'viewer' }}
  onFinish={async (values) => { await save(values) }}
  layout="vertical"   /* 'vertical' | 'horizontal' */
  submitText="Save"
  showReset
>
  <ProFormRow>
    <ProFormInput name="name"  label="Full name" required />
    <ProFormInput name="email" label="Email"      required type="email" />
  </ProFormRow>
  <ProFormSelect name="role" label="Role"
    options={[
      { value: 'admin',  label: 'Admin'  },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Viewer' },
    ]}
  />
</ProForm>
```

---

## Theming

Two variables control the whole design system:

```css
:root {
  --primary: #008060;   /* any valid CSS color */
  --base-radius: 8px;   /* applied across all components */
}
```

**How it works:**

```
--primary ──► primary-50 … primary-900   (via color-mix)
         └──► --success, --warning, --danger, --info  (25% primary blended into hue anchor)
                └──► success-50 … success-800, etc.
```

Status colors harmonise with your brand automatically — no manual tweaking.

---

## Component Reference

### Form inputs

| Component | Description |
|---|---|
| `Button` | `primary` / `secondary` / `ghost` / `danger` variants, `sm`/`md`/`lg` sizes |
| `ToggleButton` / `ToggleButtonGroup` | Stateful toggle, single/multi-select group |
| `Input` | Text input with label, description, error |
| `Textarea` | Multi-line text input |
| `NumberField` | Numeric input with +/− stepper |
| `SearchField` | Input with clear (×) button |
| `Select` | Single-select dropdown |
| `AsyncSelect` | Server-side paginated select with search + infinite scroll |
| `ComboBox` | Editable combobox (type to filter) |
| `Autocomplete` | Search input with live-filtered suggestion list |
| `Checkbox` / `CheckboxGroup` | Single checkbox and grouped checkboxes |
| `RadioGroup` | Radio button group with optional descriptions |
| `Switch` | Toggle switch |
| `Slider` | Single or range slider |
| `DatePicker` | Calendar date picker (popup) |
| `DateRangePicker` | Date range picker (popup) |
| `DateField` | Date input segments — no popup |
| `TimeField` | Time input segments |
| `Calendar` | Standalone month calendar |
| `RangeCalendar` | Standalone date range calendar |
| `TagGroup` | Multi-select tag picker with remove |
| `FileTrigger` | Click-to-browse file input trigger |
| `DropZone` | Drag-and-drop file target with FileTrigger fallback |
| `ColorPicker` | Full color picker (area + wheel + sliders + hex + presets) |
| `ColorField` | Hex color text input |
| `ColorSlider` | Single color channel slider |
| `ColorSwatch` | Color preview swatch |
| `ColorSwatchPicker` | Preset color palette picker |

### Selection & data

| Component | Description |
|---|---|
| `ListBox` | Accessible selectable list — single/multiple, supports sections |
| `GridList` | Selectable list with checkbox indicators |
| `Tree` | Expandable/collapsible hierarchical tree — single/multiple selection |
| `ProTable` | Full-featured server-side data table |
| `ProForm` | Schema-driven form (Zod + react-hook-form) |

### Overlay & navigation

| Component | Description |
|---|---|
| `Modal` | Accessible dialog with footer slot |
| `ConfirmModal` | Pre-built confirmation dialog |
| `Popover` | Floating content positioned relative to trigger — no backdrop |
| `Tooltip` | Hover/focus tooltip |
| `Menu` | Dropdown action menu with keyboard nav |
| `Tabs` | Tab panels |
| `Breadcrumbs` | Navigation breadcrumb trail |
| `Toolbar` / `ToolbarSeparator` | Keyboard-navigable toolbar container |

### Display & feedback

| Component | Description |
|---|---|
| `Badge` | Status badge — 6 color variants, 3 sizes |
| `Alert` | Inline status message, optional close button |
| `Card` | Content surface with title, extra, footer, padding toggle |
| `Avatar` / `AvatarGroup` | User avatar with auto initials + color generation |
| `ProgressBar` | Determinate / indeterminate progress |
| `Meter` | Capacity/usage meter with auto color zones |
| `Spinner` | Loading spinner |
| `Skeleton` | Loading placeholder |
| `Disclosure` / `Accordion` | Collapsible panels, standalone or grouped |
| `Link` | Accessible link with variant styles |
| `Divider` | Horizontal / vertical separator with optional label |

### Layout

| Component | Description |
|---|---|
| `Layout` | App shell — Header, Sider, Content, Footer |
| `useSider()` | Hook to read collapsed state inside Sider children |

---

## Peer dependencies

| Package | Version |
|---|---|
| `react` | ≥ 18 |
| `react-dom` | ≥ 18 |
| `react-aria-components` | ≥ 1 |
| `tailwindcss` | ≥ 4 |
| `lucide-react` | ≥ 0.400 |
| `@tanstack/react-table` | ≥ 8 |
| `react-hook-form` | ≥ 7 |
| `@hookform/resolvers` | ≥ 3 |
| `@internationalized/date` | ≥ 3 |
| `zod` | ≥ 3 |
