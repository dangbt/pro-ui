# Product Hunt Launch Kit — @dangbt/pro-ui

**Target launch:** Tuesday or Wednesday (12:01 AM PST = 2:01 PM Vietnam time)

---

## Core Positioning

**Name:** pro-ui

**Tagline:**
> The React component library built for the AI coding era

**Shorter alt tagline (if needed, ≤60 chars):**
> React UI library with a built-in MCP server for AI agents

---

## Description (~260 chars for PH card)

pro-ui is a React component library with a built-in MCP server — so Claude Code, Cursor, and Windsurf know your exact component API. Zero hallucinated props. Includes ProTable, ProForm, and a horizontal top navigation with 3 style variants. Built on React Aria + Tailwind CSS v4.

---

## Long Description (for PH product page body)

### The problem
AI coding assistants hallucinate wrong prop names. Ask Claude to add a data table and it generates `data={...}` instead of `dataSource={...}`. Every component you haven't memorized costs 20–30 minutes of fix-and-retry.

### The solution
pro-ui ships with **mcp-pro-ui** — an MCP server that gives Claude Code, Cursor, and Windsurf 5 tools:
- `list_components` — browse all 30+ components
- `get_component_api` — exact props, types, defaults
- `get_component_example` — copy-paste ready snippets
- `search_components` — find the right component
- `scaffold_page` — generate full dashboard/form/settings/login pages

Add 4 lines to your AI config. Ask "scaffold me an admin dashboard." Get correct, type-safe code on the first try.

### The library
Built on React Aria Components (accessibility-first) and Tailwind CSS v4.

Key components:
- **ProTable** — server-side data table with search form, column filters, sort, pagination, row selection, bulk actions, column visibility. One component that replaces 500 lines of boilerplate.
- **ProForm** — schema-driven forms with Zod validation. Define schema → list fields → done.
- **Layout** — sidebar or horizontal top navigation with 3 style variants (pill, line, bold). Includes two-level nav.
- **30+ standard components** — Button, Modal, Drawer, Tabs, Badge, Alert, Statistic, Steps, Toast, Avatar, and more.

### Also ships with
- `create-pro-ui-app` CLI — scaffold React + pro-ui project in 30 seconds (3 templates: minimal, admin-dashboard, saas-app)
- `/llms.txt` + `/llms-full.txt` — AI-crawler-optimized API docs
- Dark/light/system theme toggle out of the box

---

## Gallery (5 images — create these)

1. **Hero** — ProTable dark mode with search, column filters, row selection, bulk delete visible
2. **ProForm** — form with Zod validation errors showing, dark mode
3. **MCP in action** — Claude Code terminal showing `get_component_api("ProTable")` call + correct generated code
4. **Layout TopNav** — horizontal navigation with 3 variants side by side (pill/line/bold)
5. **Quick start** — `npx create-pro-ui-app my-app` terminal + the running app in browser

**Thumbnail (240×240):** pro-ui logo on dark background, animated (fade in / pulse)

---

## Video Script (60 seconds)

```
0:00 — Show the problem: AI generates wrong ProTable props, TypeScript errors
0:10 — "I fixed this. Meet pro-ui."
0:15 — npx create-pro-ui-app my-app → choose admin-dashboard template
0:25 — App running: dashboard, users table, settings page (15s of live demo)
0:40 — Claude Code: "scaffold a users page with bulk delete"
0:45 — MCP calls get_component_api + scaffold_page → perfect code generated
0:55 — "npm install @dangbt/pro-ui. Links below."
1:00 — End card with URL
```

---

## Maker Comment (post immediately after launch)

Hi PH! 👋 I'm Dâng, maker of pro-ui.

I built this because AI coding assistants kept hallucinating wrong prop names for my component library. Claude would generate `data={...}` when the prop is `dataSource`, or invent `onPageChange` that doesn't exist. Every component took 20–30 extra minutes.

The fix: ship the library with an MCP server. Now Claude calls `get_component_api("ProTable")`, gets the exact schema, and generates correct code on the first try.

**What I'd love feedback on:**
1. Which Pro components would be most valuable to you? (KanbanBoard, RichTextEditor, GanttChart, DataGrid?)
2. Would you pay $9/mo for Pro tier components?
3. What's the most painful part of working with component libraries + AI coding assistants?

Happy to answer any questions about the MCP implementation, React Aria, or Tailwind v4 integration!

---

## Pre-Launch Checklist

### 2 weeks before
- [ ] Create Product Hunt account (karma building: comment/upvote 5 products/day)
- [ ] Reach out to a hunter with 500+ followers to hunt the product
- [ ] Prep email list / X followers for launch day mobilization
- [ ] Record 60-second demo video (Loom or ScreenFlow)
- [ ] Create 5 gallery images (Figma or screenshots)
- [ ] Create 240×240 animated thumbnail

### 1 week before
- [ ] Submit product for review (PH allows pre-submission)
- [ ] Draft launch day tweets/posts
- [ ] Schedule r/reactjs, r/webdev posts for same day

### Launch day (Tue or Wed, post at 12:01 AM PST)
- [ ] Post on X/Twitter thread
- [ ] Post on r/reactjs and r/webdev (coordinate with PH launch angle)
- [ ] Comment in Dev.to article's comment section
- [ ] Notify any Discord/Slack communities
- [ ] Post maker comment immediately after launch goes live
- [ ] Reply to every comment within the first 2 hours

---

## Keywords / Tags (PH allows 5)

- react
- typescript
- developer-tools
- ai
- open-source

---

## Links

- **Website:** https://pro-ui.pages.dev
- **GitHub:** https://github.com/dangbt/pro-ui
- **npm:** https://www.npmjs.com/package/@dangbt/pro-ui
- **MCP:** https://www.npmjs.com/package/mcp-pro-ui
- **Pro Template:** https://pro-admin-demo.pages.dev
- **Buy Pro Template:** https://prouiadmin.lemonsqueezy.com/checkout/buy/d10a5885-0c86-4fba-9eee-33b4de31413f
