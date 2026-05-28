# mcp-pro-ui

> MCP server for [@dangbt/pro-ui](https://www.npmjs.com/package/@dangbt/pro-ui) — lets AI agents (Claude Code, Cursor, Copilot, Windsurf) browse components, get API references, and scaffold React pages.

## What it does

When you add `mcp-pro-ui` to your AI coding tool, the AI can:

- **Discover** all 40+ components available in `@dangbt/pro-ui`
- **Get props API** — types, defaults, descriptions for any component
- **Get code examples** — ready-to-paste TypeScript/React snippets
- **Search by use case** — "I need a data table with server-side pagination"
- **Scaffold pages** — generate complete CRUD pages, dashboards, login forms

## Setup

### Claude Code

```bash
claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui
```

Or add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["-y", "mcp-pro-ui"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["-y", "mcp-pro-ui"]
    }
  }
}
```

### Windsurf / Cline

Same `npx -y mcp-pro-ui` pattern — refer to your tool's MCP docs.

## Available tools

| Tool | Description |
|------|-------------|
| `list_components` | List all components, optionally filtered by category |
| `get_component_api` | Full props reference for a component |
| `get_component_example` | Copy-paste code example |
| `search_components` | Find components by use case description |
| `scaffold_page` | Generate a complete page (crud-list, crud-form, dashboard, settings, login) |

## Example prompts (after adding MCP)

```
"Show me all form components in pro-ui"
"Give me the ProTable API with all props"
"What component should I use for a confirmation dialog?"
"Scaffold a Users CRUD list page"
"Generate a settings page using pro-ui"
```

## Quick start (manual install)

```bash
npm install @dangbt/pro-ui
```

```tsx
import { ProTable, ProForm, Layout, Button, Modal, Toast } from '@dangbt/pro-ui'
import { ThemeProvider, ToastProvider } from '@dangbt/pro-ui'

// Wrap your app
function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider />
      <YourApp />
    </ThemeProvider>
  )
}
```

## Components overview

| Category | Components |
|----------|------------|
| **Data** | ProTable (server/client-side, filtering, sorting, bulk actions) |
| **Forms** | ProForm, ProFormInput, ProFormSelect, ProFormDatePicker, ProFormTextarea, ProFormSwitch, ProFormCheckbox, ProFormComboBox, ProFormRadioGroup, ProFormAsyncSelect, ProFormNumberField |
| **Layout** | Layout (sidebar + header shell) |
| **Overlays** | Modal, Drawer, Popover, Tooltip, Menu |
| **Feedback** | Toast, Alert, Spinner, Skeleton, ProgressBar, Meter |
| **Display** | Statistic, Steps, Empty, Card, Badge, Avatar, Tabs, Breadcrumbs |
| **Theme** | ThemeProvider, useTheme (light/dark/system) |

## Links

- **npm**: [@dangbt/pro-ui](https://www.npmjs.com/package/@dangbt/pro-ui)
- **GitHub**: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)
- **Showcase**: [pro-ui.pages.dev](https://pro-ui.pages.dev)

## License

MIT
