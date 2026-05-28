# create-pro-ui-app

> Scaffold a React + [@dangbt/pro-ui](https://www.npmjs.com/package/@dangbt/pro-ui) app in seconds.

```bash
npx create-pro-ui-app my-dashboard
```

## Templates

| Template | Description |
|----------|-------------|
| `minimal` | Bare React + Vite + pro-ui + Tailwind. Clean slate. |
| `admin-dashboard` | Layout + Sidebar + ProTable + dark mode toggle. Production-ready shell. |
| `saas-app` | Login + Dashboard + Settings + Profile. Full auth UI flow. |

## What's included

Every template comes with:
- ⚛️ React 19 + Vite + TypeScript
- 🎨 @dangbt/pro-ui (latest) with Tailwind CSS
- 🌙 Dark/light/system theme (ThemeProvider pre-configured)
- 🔔 Toast notifications (ToastProvider pre-configured)
- 📋 **CLAUDE.md** — Claude Code context pre-configured
- ✅ Zod for form validation

## AI coding tools

After scaffolding, add the MCP server for full pro-ui component access:

```bash
claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui
```

This lets Claude Code browse components, get props API, and scaffold pages.

## Links

- **pro-ui**: [@dangbt/pro-ui on npm](https://www.npmjs.com/package/@dangbt/pro-ui)
- **MCP server**: [mcp-pro-ui on npm](https://www.npmjs.com/package/mcp-pro-ui)
- **GitHub**: [dangbt/pro-ui](https://github.com/dangbt/pro-ui)
