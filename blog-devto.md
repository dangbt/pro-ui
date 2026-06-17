---
title: "66% of devs say AI generates 'almost right' code. I made it generate exactly right code — first try."
published: true
description: "AI coding assistants hallucinate wrong React component props. I built an MCP server that gives them the exact API before they generate code. Here's how."
tags: react, typescript, ai, webdev
cover_image: https://pro-ui.pages.dev/blog-cover.png
---

You know this loop:

```tsx
// ❌ What Claude/Cursor generates
<ProTable
  data={users}           // wrong — prop doesn't exist
  cols={columns}         // wrong name
  onPageChange={...}     // made up
  rowsPerPage={10}       // wrong — it's pagination.defaultPageSize
/>
```

TypeScript screams. You fix it. Ask again. Slightly different wrong answer. Fix again.

I tracked this for a month. Every time I asked an AI assistant to use a component from my library, I spent **20–30 minutes** correcting hallucinated props. Not broken logic — just wrong API calls that *look* right but don't compile.

I got tired of it. So I fixed it structurally.

---

## The problem isn't the AI model. It's what the AI can access.

AI hallucinates your component API because it's pattern-matching from training data. Your library either isn't in that training data, or the version it "remembers" is outdated.

Better prompts won't fix this permanently. A `CLAUDE.md` file helps but drifts out of date.

Here's the reframe that changed everything for me:

> Would you trust a junior dev to use your internal component library without access to the docs? That's exactly what you're asking AI to do.

The AI doesn't need better instructions. It needs a way to **look up** the correct API *before* generating code.

---

## The fix: give your AI a tool to query your component API

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open standard that lets AI coding assistants call external tools during a conversation. Most people use it for GitHub or databases.

I used it to teach AI exactly how my component library works.

**Before MCP:** AI guesses → wrong props → compile error → fix → ask again → repeat

**After MCP:** AI calls `get_component_api("ProTable")` → gets exact props schema → generates correct code → **first try**

The result: [`mcp-pro-ui`](https://www.npmjs.com/package/mcp-pro-ui) — an MCP server that gives Claude Code, Cursor, and Windsurf 5 tools:

| Tool | What it does |
|---|---|
| `list_components` | Browse all 30+ components |
| `get_component_api` | Exact props, types, defaults |
| `get_component_example` | Copy-paste ready snippets |
| `search_components` | Find the right component by use case |
| `scaffold_page` | Generate a complete page template |

---

## Setup: 4 lines. 60 seconds.

### Claude Code (`~/.claude.json`)

```json
{
  "mcpServers": {
    "pro-ui": { "command": "npx", "args": ["mcp-pro-ui"] }
  }
}
```

Same pattern for **Cursor** (`.cursor/mcp.json`) and **Windsurf** (`~/.codeium/windsurf/mcp_config.json`).

Now ask: *"Scaffold a users management page with search and bulk delete using pro-ui."*

It calls the MCP tool, gets the exact schema, and generates:

```tsx
// ✅ What AI generates WITH MCP — correct on first try
<ProTable<User>
  columns={columns}
  rowKey="id"
  request={async ({ current, pageSize, search }) => {
    const res = await fetch(`/api/users?page=${current}&limit=${pageSize}&q=${search}`)
    const data = await res.json()
    return { data: data.items, total: data.total, success: true }
  }}
  rowSelection={{ onChange: (keys) => setSelected(keys) }}
  bulkActions={[
    { label: 'Delete', danger: true, onClick: (keys) => handleBulkDelete(keys) },
  ]}
/>
```

No TypeScript errors. No made-up props. Correct, type-safe code.

---

## What pro-ui actually is

[**@dangbt/pro-ui**](https://www.npmjs.com/package/@dangbt/pro-ui) is a React component library built on:

- **React Aria Components** — accessibility-first primitives from Adobe
- **Tailwind CSS v4** — CSS-variables-based theming, dark mode out of the box

30+ components. But two are the real differentiators:

### ProTable — one component that replaces 300–500 lines of boilerplate

Server-side fetching, pagination, search, column sort, column filters, row selection, bulk actions, loading/empty/error states — all handled.

You provide `columns`, `rowKey`, and a `request` function. That's it.

### ProForm — schema-driven forms with zero wiring

```tsx
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
})

<ProForm
  schema={schema}
  fields={[
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'role', label: 'Role', type: 'select', options: roleOptions },
  ]}
  onSubmit={handleSubmit}
/>
```

Validation, error display, layout, loading state — all automatic from the Zod schema.

---

## How it compares

| | **pro-ui** | **shadcn/ui** | **MUI** | **Chakra** |
|---|---|---|---|---|
| MCP server (AI-native) | ✅ built-in | ❌ | ❌ | ❌ |
| Server-side data table | ✅ ProTable | ❌ DIY (~400 LOC) | ⚠️ DataGrid (heavy) | ❌ DIY |
| Schema-driven forms | ✅ ProForm | ❌ DIY | ❌ DIY | ❌ DIY |
| Accessibility | ✅ React Aria | ⚠️ varies | ✅ | ✅ |
| Tailwind CSS v4 | ✅ | ✅ | ❌ | ❌ |
| Zero runtime CSS-in-JS | ✅ | ✅ | ❌ | ❌ |
| Best for | Admin apps + AI workflow | Marketing sites | Enterprise | General purpose |

This isn't a "pro-ui is better than everything" claim. shadcn/ui is excellent for design-system-first teams. MUI is battle-tested for enterprise.

But if you're building **admin dashboards** and you want AI to actually help instead of hallucinate — this is the stack that works.

---

## Why MCP beats "just write a better prompt"

I tried everything before building the MCP server:

- **CLAUDE.md files** — helps, but goes stale
- **Longer prompts** — bloats context, AI ignores them
- **Knowledge banks** — static snapshots, same staleness problem

MCP is structurally different:

- **Dynamic:** Always returns the current API
- **Active:** AI *calls* the tool — doesn't passively read
- **On-demand:** Only loads what's needed

You don't need the AI to memorize your library. You need the AI to **ask** your library.

---

## Try it

**1. Add the MCP server** (60 seconds):

```json
{
  "mcpServers": {
    "pro-ui": { "command": "npx", "args": ["mcp-pro-ui"] }
  }
}
```

**2. Install:**

```bash
npm install @dangbt/pro-ui
```

**3. Ask your AI to scaffold a page.** Watch it generate correct code on the first try.

---

## Links

- 📦 npm: [`@dangbt/pro-ui`](https://www.npmjs.com/package/@dangbt/pro-ui) · [`mcp-pro-ui`](https://www.npmjs.com/package/mcp-pro-ui)
- 📖 Docs: [pro-ui-docs.pages.dev](https://pro-ui-docs.pages.dev)
- 🎨 Live showcase: [pro-ui.pages.dev](https://pro-ui.pages.dev)
- ⭐ GitHub: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)
- 🚀 Pro Admin Template: [live demo](https://pro-admin-demo.pages.dev)

---

I'm building this in public and shipping weekly. If you have feedback — I genuinely want to hear it.

**What's the worst AI hallucination you've dealt with when working with a component library?** Drop it in the comments 👇
