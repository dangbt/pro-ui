# UI Components — @dangbt/pro-ui

This project uses **@dangbt/pro-ui** for all UI components.

> Copy this file to your project root as `CLAUDE.md` to give Claude Code full context about pro-ui.
> For live API access: `claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui`

## Installation

```bash
npm install @dangbt/pro-ui
```

## App Setup (required)

```tsx
import { ThemeProvider, ToastProvider } from '@dangbt/pro-ui'

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ToastProvider />
      {/* your app */}
    </ThemeProvider>
  )
}
```

## Import Pattern

```tsx
// ✅ Always import from package root
import { Button, ProTable, ProForm, Modal, toast } from '@dangbt/pro-ui'
```

## Key Components

- **ProTable** — Data table: `request` (server-side) or `dataSource` (client-side)
- **ProForm** — Form with Zod validation + ProFormInput/Select/DatePicker/etc.
- **Layout** — App shell with sidebar nav
- **Modal / Drawer** — Overlays (use with `DialogTrigger`)
- **Toast / toast()** — Global notifications
- **Statistic** — KPI cards with trend
- **Badge** — Status labels (success/warning/danger/info)
- **ThemeProvider / useTheme** — Dark/light/system theme

## Theming

Use semantic tokens (not hardcoded Tailwind colors):
- `bg-surface`, `bg-canvas`, `text-fg`, `text-fg-muted`, `border-border`
- Primary: `text-primary`, `bg-primary`

## Button

Use `onPress` (not `onClick`). Variants: `solid`, `outline`, `ghost`, `danger`.
