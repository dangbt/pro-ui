# AI coding assistants keep hallucinating wrong React component APIs. I fixed that.

**Tags:** #react #typescript #ai #webdev #opensource

**Cover image:** (screenshot of showcase or terminal demo GIF)

---

You know the drill.

You ask Claude Code or Cursor to "add a data table to this page." It generates something like:

```tsx
// ❌ What AI hallucinates
<ProTable
  data={users}           // wrong — it's `dataSource`
  columns={cols}
  onPageChange={...}     // doesn't exist
  rowsPerPage={10}       // wrong — it's `pagination.defaultPageSize`
/>
```

Compile error. Fix. Ask again. Slightly different wrong answer. Fix again.

This costs me 20–30 minutes on *every* component I haven't memorized. Multiply by a team of developers and it's a serious productivity drain.

So I built a fix.

---

## The solution: an MCP server for your component library

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) lets you give AI coding assistants structured access to external tools and data. Most people use it for databases, GitHub, or Slack.

I used it to teach Claude Code exactly how my component library works.

The result: **`mcp-pro-ui`** — an MCP server for [@dangbt/pro-ui](https://www.npmjs.com/package/@dangbt/pro-ui) that gives AI agents 5 tools:

| Tool | What it does |
|---|---|
| `list_components` | Browse all 30+ components with descriptions |
| `get_component_api` | Get exact props, types, and defaults |
| `get_component_example` | Copy-paste ready code snippets |
| `search_components` | Find the right component for a use case |
| `scaffold_page` | Generate a full page (dashboard, CRUD, settings, login) |

Now when I ask Claude to add a data table, it first calls `get_component_api("ProTable")`, gets the exact schema, and generates:

```tsx
// ✅ What AI generates with MCP
<ProTable<User>
  columns={columns}
  rowKey="id"
  request={async ({ current, pageSize }) => {
    const res = await fetch(`/api/users?page=${current}&limit=${pageSize}`)
    const data = await res.json()
    return { data: data.items, total: data.total, success: true }
  }}
  rowSelection={{ onChange: (keys) => setSelected(keys) }}
  bulkActions={[{ label: 'Delete', danger: true, onClick: (keys) => {} }]}
/>
```

First try. No errors. ✨

---

## What is @dangbt/pro-ui?

Before going further — here's the library itself.

**@dangbt/pro-ui** is a React component library built on:
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/) — accessibility-first primitives from Adobe
- [Tailwind CSS v4](https://tailwindcss.com) — latest, CSS-variables-based theming

It's the component library I wish existed when building admin dashboards. The key components:

**`ProTable`** — server-side data table with search form, column filters, sorting, pagination, row selection, bulk actions, and column visibility control. One component that replaces 500 lines of boilerplate.

**`ProForm`** — schema-driven forms with Zod validation. Define a schema, list your fields, done. Handles layout, error display, loading states.

**`Layout`** — app shell with collapsible sidebar OR horizontal top navigation (3 variants: pill, line/tabs, bold). Includes `Layout.TopNav.Sub` for two-level navigation.

Plus 30+ standard components: Button, Modal, Drawer, Tabs, Badge, Alert, Statistic, Steps, Avatar, Toast, and more.

---

## Setup in 60 seconds

**1. Install the library**

```bash
npm install @dangbt/pro-ui
```

**2. Add the MCP server to your AI tool**

### Claude Code (`~/.claude.json`)

```json
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["mcp-pro-ui"]
    }
  }
}
```

### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["mcp-pro-ui"]
    }
  }
}
```

### Windsurf (`~/.codeium/windsurf/mcp_config.json`)

```json
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["mcp-pro-ui"]
    }
  }
}
```

**3. Ask your AI**

```
"Scaffold me an admin dashboard page with a users table and KPI cards using pro-ui"
```

The AI calls `scaffold_page` with `template: "crud-list"`, gets a complete working page template, and adapts it to your data model. No hallucinated props.

---

## What scaffold_page generates

Here's a real example. I asked Claude Code:

> "Create a users management page with search, bulk delete, and an add user button"

It called `scaffold_page({ template: "crud-list", entity: "User" })` and generated a complete page using the correct ProTable API, with column definitions, mock request function, rowSelection, and bulkActions wired up correctly.

The output was ~80 lines of correct, type-safe code. Ready to swap in a real API endpoint.

---

## Scaffold a full project

Don't want to set up the boilerplate yourself? There's also a CLI:

```bash
npx create-pro-ui-app my-app
```

Choose from 3 templates:
- **minimal** — bare-bones React + pro-ui setup
- **admin-dashboard** — full CRUD app with sidebar, dashboard, users, settings
- **saas-app** — login/register, dashboard, profile, onboarding steps

---

## AI-optimized documentation

One more thing: the showcase at [pro-ui.pages.dev](https://pro-ui.pages.dev) includes `/llms.txt` and `/llms-full.txt` — [llmstxt.org](https://llmstxt.org) format files that AI crawlers and coding assistants can read to understand the full component API without hallucinating.

If you're building your own component library, I highly recommend adding these. It's a 2-hour investment that saves your users hours of debugging.

---

## Try it

- 📦 npm: [`@dangbt/pro-ui`](https://www.npmjs.com/package/@dangbt/pro-ui) · [`mcp-pro-ui`](https://www.npmjs.com/package/mcp-pro-ui) · [`create-pro-ui-app`](https://www.npmjs.com/package/create-pro-ui-app)
- 🎨 Showcase: [pro-ui.pages.dev](https://pro-ui.pages.dev)
- 🚀 Pro Admin Template (8 pages, Recharts, auth): [live demo](https://pro-admin-demo.pages.dev) · [get it →](https://prouiadmin.lemonsqueezy.com/checkout/buy/d10a5885-0c86-4fba-9eee-33b4de31413f)
- ⭐ GitHub: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)

---

I'm building this in public. Happy to answer questions about the MCP implementation, the component architecture, or anything else in the comments.

What's the most painful part of working with AI coding assistants and component libraries for you?
