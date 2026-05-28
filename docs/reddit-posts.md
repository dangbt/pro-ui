# Reddit Posts — Launch

---

## r/reactjs

**Title:** I built a React UI library where Claude Code and Cursor know every component's exact API

I got tired of AI coding assistants hallucinating wrong prop names for my components. So I built an MCP server for my UI library.

Now when I ask Claude "add a data table with search and bulk delete", it calls `get_component_api("ProTable")` first, then generates correct code on the first try.

**The library: @dangbt/pro-ui**
- Built on React Aria Components (accessibility-first) + Tailwind CSS v4
- ProTable: server-side table with search, sort, pagination, row selection, bulk actions
- ProForm: schema-driven forms with Zod
- Layout: sidebar or horizontal top navigation (3 variants)
- 30+ components total

**The MCP server: mcp-pro-ui**
- 5 tools: list_components, get_component_api, get_component_example, search_components, scaffold_page
- Works with Claude Code, Cursor, Windsurf
- Setup: add 4 lines to your AI config

**Links:**
- Showcase: https://pro-ui.pages.dev
- npm: `npm install @dangbt/pro-ui`
- MCP: `npx mcp-pro-ui` (or add to claude.json)

Happy to answer questions about the MCP implementation or the components!

---

## r/ClaudeAI

**Title:** mcp-pro-ui: MCP server that gives Claude exact React component APIs — no more hallucinated props

I built an MCP server for my React UI library (@dangbt/pro-ui) that gives Claude 5 tools:

- `list_components` — browse 30+ components
- `get_component_api` — exact props, types, defaults
- `get_component_example` — ready-to-use code
- `search_components` — find the right component
- `scaffold_page` — generate dashboard/form/settings/login pages

**Setup (add to ~/.claude.json):**
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

Then ask Claude: "scaffold me an admin dashboard page" — it uses scaffold_page to generate a complete, type-safe page using the correct component APIs.

Before MCP: Claude would generate wrong prop names, missing imports, fake component names.
After MCP: correct on first try, every time.

npm: https://www.npmjs.com/package/mcp-pro-ui
Showcase: https://pro-ui.pages.dev

---

## r/webdev

**Title:** Show r/webdev: Pro UI — React component library with MCP support, ProTable, ProForm, and 30+ components

Hey r/webdev! Sharing a project I've been working on.

**@dangbt/pro-ui** — React component library built on React Aria (accessibility-first) and Tailwind CSS v4.

What makes it different:
1. **MCP Server** (`mcp-pro-ui`) — AI coding assistants can browse components and scaffold full pages using correct APIs
2. **ProTable** — server-side data table that handles 90% of admin table requirements out of the box
3. **ProForm** — write a Zod schema, list your fields, get a complete validated form
4. **Layout** — sidebar or horizontal top navigation with 3 style variants

Live showcase with interactive demos: https://pro-ui.pages.dev

Also made a Pro Admin Dashboard template (8 pages, charts, auth flow) that shows what you can build: https://pro-admin-demo.pages.dev

Would love feedback!

---

## r/indiehackers

**Title:** Building in public: React UI library → $0 to $100 goal

Hey IH! Sharing my current build-in-public project.

**What I built:** @dangbt/pro-ui — a React component library with 30+ components, ProTable, ProForm, and (this is the interesting part) a built-in MCP server so AI coding assistants know the exact API.

**Current status:**
- v1.3.20 on npm, MIT open source
- Showcase site: pro-ui.pages.dev
- MCP server published: mcp-pro-ui on npm
- CLI scaffolder: create-pro-ui-app
- Pro Admin Template (8 pages, Recharts): live at pro-admin-demo.pages.dev

**$100 goal breakdown:**
- Pro Admin Template at $79 on LemonSqueezy (1-2 sales = $100)
- GitHub Sponsors as secondary channel

**What's working:**
- The MCP angle is getting traction — AI-native dev tools are hot right now
- Pro template is complete and deployed

**What I need:**
- Feedback on pricing ($79 too high/low?)
- Anyone want to beta test the template?
- Tips for getting the first sale

Happy to give anyone early access in exchange for honest feedback.

GitHub: https://github.com/dangbt/pro-ui
