<div align="center">

<img src="https://raw.githubusercontent.com/dangbt/pro-ui/main/src/assets/logo-readme.svg" alt="pro-ui" height="48" />

<br/>
<br/>

**AI-native React UI library — 70+ accessible components built for Claude Code & Cursor**

[![npm version](https://img.shields.io/npm/v/@dangbt/pro-ui?style=flat-square&color=6366f1&logo=npm&logoColor=white)](https://www.npmjs.com/package/@dangbt/pro-ui)
[![npm downloads](https://img.shields.io/npm/dm/@dangbt/pro-ui?style=flat-square&color=10b981&logo=npm&logoColor=white)](https://www.npmjs.com/package/@dangbt/pro-ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React Aria](https://img.shields.io/badge/React_Aria-accessible-e9501e?style=flat-square)](https://react-spectrum.adobe.com/react-aria/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-6366f1?style=flat-square)](https://github.com/dangbt/pro-ui/blob/main/LICENSE)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/dangbt?style=flat-square&color=ea4aaa&logo=github-sponsors&logoColor=white&label=sponsor)](https://github.com/sponsors/dangbt)

[**Docs →**](https://pro-ui-docs.pages.dev) · [**Live Showcase →**](https://pro-ui.pages.dev) · [npm](https://www.npmjs.com/package/@dangbt/pro-ui) · [MCP Server](https://www.npmjs.com/package/mcp-pro-ui) · [Pro Template →](https://pro-admin-demo.pages.dev) · [**Sponsor**](https://github.com/sponsors/dangbt)

</div>

---

## What is pro-ui?

Production-ready React components built on **React Aria Components** (accessibility-first) and **Tailwind CSS v4**. Includes power components like `ProTable` and `ProForm` that handle complex patterns out of the box.

The only React UI library with a **built-in MCP server** — letting Claude Code, Cursor, and Windsurf scaffold pages using your exact component API with zero hallucinations.

---

## Why pro-ui?

| Feature | **pro-ui** | shadcn/ui | MUI | Chakra |
|---|:---:|:---:|:---:|:---:|
| MCP Server (AI-native) | **Yes** | No | No | No |
| Tailwind CSS v4 | **Yes** | Yes | No | No |
| React Aria (accessible) | **Yes** | No | Partial | Partial |
| ProTable (server-side) | **Yes** | No | No | No |
| ProForm (schema-driven) | **Yes** | No | No | No |
| CLI scaffold | **Yes** | No | No | No |
| Dark mode (CSS vars) | **Yes** | Yes | Yes | Yes |
| Zero runtime CSS-in-JS | **Yes** | Yes | No | No |

---

## Quick Start

```bash
npm install @dangbt/pro-ui
```

```tsx
// main.tsx
import '@dangbt/pro-ui/tailwind.css'
import '@dangbt/pro-ui/theme.css'
import { ThemeProvider, ToastProvider } from '@dangbt/pro-ui'

root.render(
  <ThemeProvider defaultTheme="system">
    <ToastProvider />
    <App />
  </ThemeProvider>
)
```

**Or scaffold a full project in 30 seconds:**

```bash
npx create-pro-ui-app my-app
```

---

## AI Integration (MCP Server)

Let Claude Code, Cursor, or Windsurf build pages using the correct component APIs — zero hallucinated props.

### Claude Code

```json
{
  "mcpServers": {
    "pro-ui": { "command": "npx", "args": ["mcp-pro-ui"] }
  }
}
```

### Cursor / Windsurf

```json
// .cursor/mcp.json  or  ~/.codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "pro-ui": { "command": "npx", "args": ["mcp-pro-ui"] }
  }
}
```

Then ask: *"scaffold me an admin dashboard page using pro-ui"*

**MCP tools:** `list_components` · `get_component_api` · `get_component_example` · `search_components` · `scaffold_page`

---

## Components

70+ components. Full API: [Docs](https://pro-ui-docs.pages.dev) · [Live Showcase](https://pro-ui.pages.dev) · [llms-full.txt](https://pro-ui.pages.dev/llms-full.txt)

### Pro Components
| Component | Description |
|---|---|
| `ProTable` | Server-side data table — search form, filter, sort, pagination, row selection, bulk actions, `actionRef` |
| `ProForm` | Schema-driven form with Zod — 20+ field types (incl. `ProFormList`, `ProFormDependency`), grid layout, validation |
| `Layout` | App shell — `Sider` (collapsible sidebar) or `TopNav` (pill/line/bold variants + sub-nav) |

### Form & Input
`Button` · `ToggleButton` · `ToggleButtonGroup` · `Input` · `Textarea` · `NumberField` · `SearchField` · `InputOTP` · `Select` · `AsyncSelect` · `ComboBox` · `Autocomplete` · `Checkbox` · `CheckboxGroup` · `RadioGroup` · `Switch` · `Slider` · `Segmented` · `DatePicker` · `DateRangePicker` · `DateField` · `TimeField` · `Calendar` · `RangeCalendar` · `TagGroup` · `TokenField` · `ColorPicker` · `ColorSwatch` · `ColorSwatchPicker` · `FileTrigger` · `Upload` · `DropZone` · `Transfer`

### Overlay
`Modal` · `ConfirmModal` · `Drawer` · `Sheet` · `Popover` · `Tooltip` · `PreviewCard` · `Menu` · `Dropdown`

### Navigation
`Tabs` · `Breadcrumbs` · `Link` · `Pagination` · `Steps` · `NavigationTree` · `Tree` · `Toolbar`

### Data Display
`Table` · `ListBox` · `GridList` · `Descriptions` · `Timeline` · `Statistic` · `Badge` · `Card` · `Avatar` · `AvatarGroup` · `Disclosure` · `Accordion` · `Divider` · `Title` · `Text` · `Paragraph`

### Feedback
`Alert` · `toast` / `ToastProvider` · `ProgressBar` · `Meter` · `Spinner` · `Skeleton` · `Empty` · `Result` · `ErrorBoundary`

### Utilities
`ThemeProvider` · `useTheme` · `getThemeInitScript` · `useSider`

---

## ProTable Example

```tsx
import { ProTable, Button } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

interface User { id: string; name: string; status: 'active' | 'inactive' }

const columns: ProColumnType<User>[] = [
  { title: 'Name',   dataIndex: 'name',   sortable: true },
  { title: 'Status', dataIndex: 'status', valueType: 'select',
    valueEnum: { active: { text: 'Active', color: 'success' }, inactive: 'Inactive' } },
]

<ProTable<User>
  columns={columns}
  rowKey="id"
  request={async ({ current, pageSize }) => {
    const res = await fetch(`/api/users?page=${current}&limit=${pageSize}`)
    const data = await res.json()
    return { data: data.items, total: data.total, success: true }
  }}
  toolBarRender={() => [<Button key="add" variant="primary">+ Add</Button>]}
  rowSelection={{ onChange: (keys) => console.log(keys) }}
/>
```

---

## Pro Admin Template

Complete admin dashboard — 8 pages, Recharts charts, auth flow, dark mode.

**[→ Live Demo](https://pro-admin-demo.pages.dev)** &nbsp;|&nbsp; **[→ Get Template ($79)](https://prouiadmin.lemonsqueezy.com/checkout/buy/d10a5885-0c86-4fba-9eee-33b4de31413f)**

Dashboard · Analytics · Users · Settings · Login · Register · Forgot Password · 404

---

## Changelog

**Latest — 1.13.0**

- New `Sheet` component (React Aria 1.22) — swipe-to-dismiss overlay from any edge, `snapPoints`, stacked sheets.
- `Link` — active styling via `aria-current`.
- Peer `react-aria-components` raised to `>=1.22.0`.

Full history: **[CHANGELOG.md →](https://github.com/dangbt/pro-ui/blob/main/CHANGELOG.md)**

---

## AI Docs

- [/llms.txt](https://pro-ui.pages.dev/llms.txt) — Summary for AI agents
- [/llms-full.txt](https://pro-ui.pages.dev/llms-full.txt) — Full API reference

---

## Roadmap & Pro Tier

Pro components (RichTextEditor, KanbanBoard, GanttChart, AdvancedFilters, DataGrid…) are planned for v2.0.

**[View full roadmap →](https://github.com/dangbt/pro-ui/blob/main/ROADMAP.md)**

---

## Sponsors

pro-ui is MIT-licensed and free forever. If it saves you time, please consider sponsoring:

| Tier | Price | Benefits |
|---|---|---|
| Coffee | $5/mo | Name in SPONSORS.md |
| Pro Supporter | $15/mo | Early access to Pro components |
| Team | $50/mo | Logo on README + priority support |

**[Become a sponsor →](https://github.com/sponsors/dangbt)**

---

## License

MIT © [Dâng Bùi Tấn](https://github.com/dangbt) · [SPONSORS.md](https://github.com/dangbt/pro-ui/blob/main/SPONSORS.md)

<div align="center">
  <sub>If pro-ui saves you time, consider <a href="https://github.com/sponsors/dangbt">sponsoring</a></sub>
</div>
