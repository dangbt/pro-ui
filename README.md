<div align="center">

# @dangbt/pro-ui

**AI-native React UI library — 30+ accessible components built for Claude Code & Cursor**

[![npm version](https://img.shields.io/npm/v/@dangbt/pro-ui?style=flat-square&color=6366f1)](https://www.npmjs.com/package/@dangbt/pro-ui)
[![npm downloads](https://img.shields.io/npm/dm/@dangbt/pro-ui?style=flat-square&color=10b981)](https://www.npmjs.com/package/@dangbt/pro-ui)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square)](https://tailwindcss.com)

[**Live Showcase →**](https://pro-ui.pages.dev) · [npm](https://www.npmjs.com/package/@dangbt/pro-ui) · [MCP Server](https://www.npmjs.com/package/mcp-pro-ui) · [Pro Template →](https://pro-admin-demo.pages.dev)

</div>

---

## What is pro-ui?

Production-ready React components built on **React Aria Components** (accessibility-first) and **Tailwind CSS v4**. Includes power components like `ProTable` and `ProForm` that handle complex patterns out of the box.

The only React UI library with a **built-in MCP server** — letting Claude Code, Cursor, and Windsurf scaffold pages using your exact component API with zero hallucinations.

---

## Why pro-ui?

| Feature | **pro-ui** | shadcn/ui | MUI | Chakra |
|---|:---:|:---:|:---:|:---:|
| 🤖 MCP Server (AI-native) | ✅ | ❌ | ❌ | ❌ |
| 🎨 Tailwind CSS v4 | ✅ | ✅ | ❌ | ❌ |
| ♿ React Aria (accessible) | ✅ | ❌ | partial | partial |
| 📊 ProTable (server-side) | ✅ | ❌ | ❌ | ❌ |
| 📝 ProForm (schema-driven) | ✅ | ❌ | ❌ | ❌ |
| 🏗️ CLI scaffold | ✅ | ❌ | ❌ | ❌ |
| 🌙 Dark mode (CSS vars) | ✅ | ✅ | ✅ | ✅ |
| 📦 Zero runtime CSS-in-JS | ✅ | ✅ | ❌ | ❌ |

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

## 🤖 AI Integration (MCP Server)

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

Then ask: *"scaffold me an admin dashboard page using pro-ui"* ✨

**MCP tools:** `list_components` · `get_component_api` · `get_component_example` · `search_components` · `scaffold_page`

---

## Components

### 🏗️ Pro Components
| Component | Description |
|---|---|
| `ProTable` | Server-side data table — search, filter, sort, pagination, row selection, bulk actions |
| `ProForm` | Schema-driven form with Zod — 10+ field types, grid layout, validation |
| `Layout` | App shell — `Sider` (collapsible sidebar) or `TopNav` (pill/line/bold variants + sub-nav) |

### 📋 Form
`Button` · `Input` · `Select` · `ComboBox` · `DatePicker` · `Checkbox` · `Switch` · `RadioGroup` · `Slider` · `TagField` · `FileUpload` · `DropZone` · `Autocomplete`

### 🪟 Overlay
`Modal` · `Drawer` · `Popover` · `Tooltip` · `DropdownMenu`

### 📊 Display
`Badge` · `Alert` · `Card` · `Avatar` · `Statistic` · `Empty` · `Steps` · `Progress` · `Skeleton` · `Divider` · `ColorPicker`

### 🔧 Utilities
`ThemeProvider` · `useTheme` · `ToastProvider` · `toast`

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

## 🚀 Pro Admin Template

Complete admin dashboard — 8 pages, Recharts charts, auth flow, dark mode.

**[→ Live Demo](https://pro-admin-demo.pages.dev)** &nbsp;|&nbsp; **[→ Get Template ($79)](https://pro-ui.lemonsqueezy.com)**

Dashboard · Analytics · Users · Settings · Login · Register · Forgot Password · 404

---

## AI Docs

- [/llms.txt](https://pro-ui.pages.dev/llms.txt) — Summary for AI agents
- [/llms-full.txt](https://pro-ui.pages.dev/llms-full.txt) — Full API reference

---

## License

MIT © [Dâng Bùi Tấn](https://github.com/dangbt)

<div align="center">
  <sub>If pro-ui saves you time, consider <a href="https://github.com/sponsors/dangbt">sponsoring ☕</a></sub>
</div>
