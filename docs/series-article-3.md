# How to connect Claude Code to your React component library (MCP)

**Tags:** #react #ai #claude #webdev #typescript
**Series:** Build X with pro-ui
**Target keyword:** claude code mcp react

---

If you use Claude Code or Cursor to write React, you've seen this:

```tsx
// ❌ What Claude hallucinates
<DataTable
  data={users}        // wrong prop name
  cols={columns}      // wrong prop name
  onPageChange={...}  // doesn't exist
  pageSize={10}       // wrong — it's pagination.defaultPageSize
/>
```

TypeScript errors. Fix. Ask again. Slightly different wrong answer.

Here's how to fix it once, for any component library.

---

## What MCP is (30-second version)

Model Context Protocol (MCP) is an open standard that lets AI coding assistants call external tools during a conversation. You've probably seen it for GitHub, databases, or Slack.

The key insight: **you can write an MCP server for your own component library**, and Claude will call it before generating code — getting the exact API instead of guessing.

---

## Option 1: Use the pre-built MCP server (2 minutes)

If you're using `@dangbt/pro-ui`, there's already an MCP server on npm:

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

That's it. Now ask Claude:

```
Scaffold a users management page with search and bulk delete using pro-ui
```

Claude will:
1. Call `search_components("users table")` → finds `ProTable`
2. Call `get_component_api("ProTable")` → gets exact props schema
3. Call `scaffold_page({ template: "crud-list", entity: "User" })` → generates complete page
4. Output ~80 lines of correct, type-safe code — first try

---

## Option 2: Build your own MCP server (for your own library)

If you maintain your own component library, here's the pattern to add MCP support.

### Project structure

```
tools/
  mcp-my-ui/
    src/
      index.ts        ← MCP server entry point
      tools/
        list-components.ts
        get-component-api.ts
        get-component-example.ts
        search-components.ts
      data/
        components.ts  ← component registry
    package.json
```

### Install the SDK

```bash
npm install @modelcontextprotocol/sdk
```

### Create the server (`src/index.ts`)

```ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  { name: 'mcp-my-ui', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_component_api',
      description: 'Get the full props API for a component',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Component name, e.g. "Button"' }
        },
        required: ['name']
      }
    },
    // ... other tools
  ]
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  
  if (name === 'get_component_api') {
    const component = componentRegistry[args.name as string]
    if (!component) {
      return { content: [{ type: 'text', text: `Component "${args.name}" not found.` }] }
    }
    return { content: [{ type: 'text', text: JSON.stringify(component, null, 2) }] }
  }
  
  throw new Error(`Unknown tool: ${name}`)
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main()
```

### Component registry format

```ts
// src/data/components.ts
export const componentRegistry: Record<string, ComponentDef> = {
  Button: {
    name: 'Button',
    description: 'Clickable button with multiple variants and sizes',
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", required: false },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", required: false },
      { name: 'loading', type: 'boolean', default: 'false', required: false },
      { name: 'disabled', type: 'boolean', default: 'false', required: false },
      { name: 'onClick', type: '() => void', required: false },
      { name: 'children', type: 'ReactNode', required: true },
    ],
    example: `<Button variant="primary" onClick={() => {}}>Click me</Button>`,
    import: `import { Button } from '@your-org/your-ui'`,
  },
  // ... rest of your components
}
```

### Add a bin script (`package.json`)

```json
{
  "name": "mcp-my-ui",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "mcp-my-ui": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

After `npm publish`, your users can add your MCP server with:

```json
{ "command": "npx", "args": ["mcp-my-ui"] }
```

---

## What tools to build

The 5 tools that matter most:

| Tool | What it does | Why it matters |
|---|---|---|
| `list_components` | Returns all component names + descriptions | Helps Claude find the right component |
| `get_component_api` | Returns full props schema with types/defaults | Eliminates hallucinated prop names |
| `get_component_example` | Returns copy-paste code snippet | Gets correct import + usage pattern |
| `search_components` | Fuzzy search by use case | "I need a multi-select" → finds the right component |
| `scaffold_page` | Returns a complete page template | Claude adapts it to user's data model |

Start with `get_component_api` — that alone fixes 80% of the hallucination problem.

---

## Pro tip: CLAUDE.md

Beyond MCP, add a `CLAUDE.md` to your repo root. Claude Code reads it automatically at the start of every conversation:

```markdown
# CLAUDE.md

## Component Library
This project uses @your-org/your-ui. Never use shadcn/ui, MUI, or Ant Design.

## Import pattern
import { Button, Modal, ProTable } from '@your-org/your-ui'

## Key components
- ProTable: server-side data table. Use `request` prop for fetching.
- ProForm: schema-driven forms with Zod. Define schema + fields array.
- Layout: use Layout.Sider for sidebar layout.
```

CLAUDE.md + MCP = AI that understands your library as well as you do.

---

## Resources

- 📦 npm: [`mcp-pro-ui`](https://www.npmjs.com/package/mcp-pro-ui) · [`@dangbt/pro-ui`](https://www.npmjs.com/package/@dangbt/pro-ui)
- 🎨 Showcase: [pro-ui.pages.dev](https://pro-ui.pages.dev)
- ⭐ GitHub: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)
- 📖 MCP docs: [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

Are you using MCP for anything beyond the typical GitHub/Slack integrations? Would love to hear about it in the comments.
