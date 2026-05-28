# Why I stopped using shadcn/ui for my admin apps

**Tags:** #react #typescript #webdev #showdev
**Series:** Build X with pro-ui
**Target keyword:** shadcn alternative react
**Note:** Controversial angle → high engagement. Be honest and specific — not a hit piece.

---

I love shadcn/ui. I've recommended it to probably 50 people.

But about a year ago, I stopped using it for admin dashboards — not because it's bad, but because it's solving a different problem than the one I have.

Let me explain, and show you what I switched to.

---

## What shadcn/ui is great at

shadcn/ui is a **design system toolkit**. Copy the components you need, own them, customize them. It's brilliant for:

- Marketing sites and landing pages
- Design-system-first teams who want full code ownership
- Apps where the UI needs to match a very specific brand

The core philosophy — "copy code, don't install a package" — is genuinely good for these cases. You own every line.

---

## Where it breaks down for admin dashboards

### 1. You're assembling primitives, not features

shadcn/ui gives you a `Table` component. To build a real data table you still need to wire up:
- Server-side fetching with loading states
- Pagination (client or server)
- Search input + debounce
- Column sorting (with sort direction icons)
- Column filters (dropdowns per column)
- Row selection with checkboxes
- Bulk actions (delete selected, export, etc.)
- Column visibility toggle
- Empty state and error state

That's 300–500 lines before you've rendered a single row of your actual data.

With `ProTable`, you get all of that in one component — you just provide `columns`, `rowKey`, and a `request` async function:

```tsx
<ProTable<User>
  columns={columns}
  rowKey="id"
  request={async ({ current, pageSize, search }) => {
    const res = await fetch(`/api/users?page=${current}&q=${search}`)
    const data = await res.json()
    return { data: data.items, total: data.total, success: true }
  }}
  rowSelection={{ onChange: (keys) => setSelected(keys) }}
  bulkActions={[{ label: 'Delete', danger: true, onClick: handleBulkDelete }]}
/>
```

### 2. Forms are primitive

shadcn/ui ships `Input`, `Label`, `Select`, `Checkbox`. To build a form you need: react-hook-form, zod resolver, layout grid, error display, field descriptions, loading states. It adds up.

With `ProForm`, you define a schema + field list:

```tsx
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
})

const fields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'role', label: 'Role', type: 'select', options: roleOptions },
]

<ProForm schema={schema} fields={fields} onSubmit={handleSubmit} />
```

Validation, error display, layout, loading state — handled.

### 3. AI coding assistants hallucinate it

This one sounds niche, but it costs real time.

Because shadcn/ui components are copied into your project, they're not indexed anywhere. Ask Claude Code to use your `DataTable` component and it guesses at the API — usually wrong. You end up debugging AI-generated code instead of writing real features.

pro-ui ships with **mcp-pro-ui**, an MCP server that gives Claude Code, Cursor, and Windsurf the exact API for every component. Ask Claude to add a table — it calls `get_component_api("ProTable")` and generates correct code on the first try.

---

## The honest comparison

| | **pro-ui** | **shadcn/ui** |
|---|---|---|
| ProTable (server-side) | ✅ built-in | ❌ DIY |
| ProForm (schema-driven) | ✅ built-in | ❌ DIY |
| Accessibility (React Aria) | ✅ | ⚠️ varies by component |
| MCP server (AI-native) | ✅ | ❌ |
| Code ownership | ❌ package | ✅ copy-paste |
| Design customization | ✅ CSS tokens | ✅ full control |
| Component variety | 30+ | 50+ |
| Bundle size | 🟢 small | 🟢 small |
| Best for | Data-heavy admin apps | Design systems, marketing sites |

Neither is better. They're solving different problems.

---

## When to use each

**Use shadcn/ui when:**
- You're building a marketing site or landing page
- Your team has strong design opinions and needs full code control
- You're building a design system for multiple products
- You want to pick individual components à la carte

**Use pro-ui when:**
- You're building an admin dashboard or internal tool
- You need server-side data tables that just work
- You want schema-driven forms without the boilerplate
- You want AI coding assistants to actually understand your component library

---

## Migration is optional

If you're already invested in shadcn/ui, you don't have to switch. You can use pro-ui for `ProTable` and `ProForm` alongside your existing shadcn components — they don't conflict since both use Tailwind.

```bash
npm install @dangbt/pro-ui
```

Just import the components you need:

```tsx
import { ProTable, ProForm } from '@dangbt/pro-ui'
// use alongside your existing shadcn components
```

---

## Try it

- 📦 npm: [`@dangbt/pro-ui`](https://www.npmjs.com/package/@dangbt/pro-ui)
- 🎨 Showcase: [pro-ui.pages.dev](https://pro-ui.pages.dev)
- 🚀 Pro Admin Template: [live demo](https://pro-admin-demo.pages.dev) · [$79 →](https://prouiadmin.lemonsqueezy.com/checkout/buy/d10a5885-0c86-4fba-9eee-33b4de31413f)
- ⭐ GitHub: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)

---

What's your go-to for admin dashboards? Curious what stack others use in the comments.
