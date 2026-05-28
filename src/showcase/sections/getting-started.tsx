import { useState } from 'react'
import { Check, Copy, Terminal, Bot, Zap, Package, FolderOpen, Code2 } from 'lucide-react'
import { Badge } from '../../components'
import { SectionHeader } from '../shared'

/* ── Reusable code block with copy button ────────────────────────────── */
function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="rounded-[var(--base-radius)] border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border-subtle bg-surface-subtle/80">
        <span className="text-[11px] font-mono font-medium text-fg-disabled tracking-wide">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[11px] text-fg-disabled hover:text-primary transition-colors font-mono"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="px-5 py-4 text-xs font-mono text-gray-300 bg-gray-950 overflow-x-auto leading-5 whitespace-pre">
        {code}
      </pre>
    </div>
  )
}

/* ── Step badge ──────────────────────────────────────────────────────── */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
        {n}
      </div>
      <div className="flex-1 space-y-3">
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

/* ── Tool card ───────────────────────────────────────────────────────── */
function ToolCard({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-[var(--base-radius)] border border-border bg-surface hover:bg-surface-subtle transition-colors">
      <div className="w-8 h-8 rounded-[var(--base-radius)] bg-primary-50 text-primary flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-mono font-semibold text-fg">{name}</p>
        <p className="text-xs text-fg-muted mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MCP SERVER SECTION
══════════════════════════════════════════════════════════════════════════ */
export function MCPSection() {
  const [activeTab, setActiveTab] = useState<'claude' | 'cursor' | 'windsurf'>('claude')

  const setupCode = {
    claude: `# One-liner — add to Claude Code permanently
claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui

# Or add to ~/.claude/settings.json:
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["-y", "mcp-pro-ui"]
    }
  }
}`,
    cursor: `// .cursor/mcp.json (project-level)
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["-y", "mcp-pro-ui"]
    }
  }
}`,
    windsurf: `// ~/.codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "pro-ui": {
      "command": "npx",
      "args": ["-y", "mcp-pro-ui"]
    }
  }
}`,
  }

  const tabs = [
    { key: 'claude' as const, label: 'Claude Code' },
    { key: 'cursor' as const, label: 'Cursor' },
    { key: 'windsurf' as const, label: 'Windsurf' },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="MCP Server — AI-native component access"
        description="Add mcp-pro-ui to your AI coding tool. The AI can then browse components, get props API, and scaffold pages — without you writing a single prompt about the library."
      />

      {/* Hero banner */}
      <div className="p-5 bg-gradient-to-br from-primary-50/80 to-surface border border-primary-200 rounded-[var(--base-radius)] space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-semibold text-fg">How it works</span>
        </div>
        <p className="text-sm text-fg-muted leading-relaxed">
          When you prompt <em>"Build a user management page"</em>, the AI automatically calls
          the MCP server to look up <code className="text-primary bg-primary-50 px-1 rounded text-xs font-mono">ProTable</code> and{' '}
          <code className="text-primary bg-primary-50 px-1 rounded text-xs font-mono">ProForm</code> specs,
          then generates correct code — no hallucinated props, no wrong imports.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge color="success">5 tools available</Badge>
          <Badge color="info">Claude Code</Badge>
          <Badge color="info">Cursor</Badge>
          <Badge color="info">Windsurf</Badge>
          <Badge color="info">Cline</Badge>
        </div>
      </div>

      {/* Available tools */}
      <div>
        <h3 className="text-sm font-semibold text-fg mb-3 flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          Available MCP tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ToolCard
            icon={<Code2 size={14} />}
            name="list_components"
            desc="List all 40+ components filtered by category (form, overlay, data…)"
          />
          <ToolCard
            icon={<Code2 size={14} />}
            name="get_component_api"
            desc="Full props table with types, defaults and descriptions for any component"
          />
          <ToolCard
            icon={<Code2 size={14} />}
            name="get_component_example"
            desc="Ready-to-paste TypeScript + React code example"
          />
          <ToolCard
            icon={<Code2 size={14} />}
            name="search_components"
            desc='Find the right component by use-case: "data table with pagination"'
          />
          <ToolCard
            icon={<Code2 size={14} />}
            name="scaffold_page"
            desc="Generate a complete page: crud-list, crud-form, dashboard, settings, login"
          />
        </div>
      </div>

      {/* Setup tabs */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
          <Terminal size={14} className="text-primary" />
          Setup — pick your tool
        </h3>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-surface-subtle rounded-[var(--base-radius)] w-fit border border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-surface text-fg shadow-sm border border-border'
                  : 'text-fg-muted hover:text-fg'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CodeBlock code={setupCode[activeTab]} lang={activeTab === 'claude' ? 'bash / json' : 'json'} />
      </div>

      {/* Example prompts */}
      <div>
        <h3 className="text-sm font-semibold text-fg mb-3 flex items-center gap-2">
          <Bot size={14} className="text-primary" />
          Example prompts (after adding MCP)
        </h3>
        <div className="space-y-2">
          {[
            'List all form components in pro-ui',
            'Show me the ProTable props API',
            'What component should I use for a slide-in filter panel?',
            'Scaffold a Users CRUD list page',
            'Generate a settings page using pro-ui',
            'Give me an example of ProForm with Zod validation',
          ].map((p) => (
            <div
              key={p}
              className="flex items-start gap-2.5 px-4 py-2.5 rounded-[var(--base-radius)] bg-surface border border-border"
            >
              <Bot size={13} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-fg-2 font-mono">"{p}"</span>
            </div>
          ))}
        </div>
      </div>

      {/* NPM link */}
      <div className="flex items-center gap-3 p-4 bg-surface-subtle border border-border rounded-[var(--base-radius)]">
        <Package size={16} className="text-fg-muted flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-fg font-medium">npm package</p>
          <a
            href="https://www.npmjs.com/package/mcp-pro-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-mono"
          >
            npmjs.com/package/mcp-pro-ui
          </a>
        </div>
        <CodeBlock code="npx -y mcp-pro-ui" lang="bash" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   CREATE APP SECTION
══════════════════════════════════════════════════════════════════════════ */

const TEMPLATES = [
  {
    key: 'minimal',
    label: 'Minimal',
    badge: 'clean slate' as const,
    color: 'default' as const,
    desc: 'Bare React + Vite + pro-ui setup. Start from zero.',
    includes: ['ThemeProvider + ToastProvider', 'Dark/light toggle', 'CLAUDE.md pre-configured'],
  },
  {
    key: 'admin-dashboard',
    label: 'Admin Dashboard',
    badge: 'recommended' as const,
    color: 'primary' as const,
    desc: 'Layout + Sidebar + ProTable + dark mode. Production-ready shell.',
    includes: ['App shell with collapsible sidebar', 'Dashboard with KPI cards', 'Users page with ProTable', 'Settings page with ProForm'],
  },
  {
    key: 'saas-app',
    label: 'SaaS App',
    badge: 'full flow' as const,
    color: 'success' as const,
    desc: 'Login + Dashboard + Profile. Complete auth UI flow.',
    includes: ['Login page with Zod validation', 'Dashboard with stats + steps', 'Profile edit form', 'Avatar + theme toggle in header'],
  },
]

const FILE_TREE = `my-app/
├── src/
│   ├── main.tsx            # ThemeProvider + ToastProvider setup
│   ├── App.tsx             # Root component
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   └── Settings.tsx
│   └── components/
│       └── AppLayout.tsx   # Layout + sidebar nav
├── CLAUDE.md               # AI context (auto-generated)
├── package.json            # @dangbt/pro-ui pre-installed
├── vite.config.ts
└── tsconfig.json`

export function CreateAppSection() {
  const [selected, setSelected] = useState('admin-dashboard')
  const sel = TEMPLATES.find((t) => t.key === selected)!

  return (
    <div className="space-y-8">
      <SectionHeader
        title="create-pro-ui-app — scaffold in 30 seconds"
        description="One command creates a fully-configured React project with pro-ui, Tailwind, dark mode, and CLAUDE.md ready to go."
      />

      {/* Main command */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
          <Terminal size={14} className="text-primary" />
          Run
        </h3>
        <CodeBlock code="npx create-pro-ui-app my-app" lang="bash" />
        <p className="text-xs text-fg-muted">
          No global install needed — npx handles it. Prompts for template if not specified.
        </p>
      </div>

      {/* Template selector */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
          <FolderOpen size={14} className="text-primary" />
          Templates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelected(t.key)}
              className={`text-left p-4 rounded-[var(--base-radius)] border-2 transition-all ${
                selected === t.key
                  ? 'border-primary bg-primary-50/40'
                  : 'border-border bg-surface hover:border-primary/40 hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-fg">{t.label}</span>
                <Badge color={t.color} size="sm">{t.badge}</Badge>
              </div>
              <p className="text-xs text-fg-muted leading-relaxed">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Template details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-[var(--base-radius)] border border-border bg-surface space-y-3">
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Includes</p>
            <ul className="space-y-1.5">
              {sel.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-fg-2">
                  <Check size={13} className="text-success mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-fg-2">
                <Check size={13} className="text-success mt-0.5 flex-shrink-0" />
                CLAUDE.md auto-generated
              </li>
              <li className="flex items-start gap-2 text-sm text-fg-2">
                <Check size={13} className="text-success mt-0.5 flex-shrink-0" />
                Dark / light / system theme
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide px-1">File structure</p>
            <div className="rounded-[var(--base-radius)] border border-border overflow-hidden">
              <div className="px-3.5 py-2 border-b border-border-subtle bg-surface-subtle/80">
                <span className="text-[11px] font-mono text-fg-disabled">admin-dashboard template</span>
              </div>
              <pre className="px-4 py-3 text-[11px] font-mono text-gray-300 bg-gray-950 overflow-x-auto leading-5">
                {FILE_TREE}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* With template flag */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
          <Terminal size={14} className="text-primary" />
          Skip the prompt — pass template directly
        </h3>
        <div className="space-y-2">
          <CodeBlock code="npx create-pro-ui-app my-app --template minimal" lang="bash" />
          <CodeBlock code="npx create-pro-ui-app my-app --template admin-dashboard" lang="bash" />
          <CodeBlock code="npx create-pro-ui-app my-app --template saas-app" lang="bash" />
        </div>
      </div>

      {/* After scaffold */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          After scaffolding
        </h3>
        <div className="space-y-2">
          <Step n={1} title="Start dev server">
            <CodeBlock code={`cd my-app\nnpm run dev`} lang="bash" />
          </Step>
          <Step n={2} title="Add MCP server for AI assistance">
            <CodeBlock
              code="claude mcp add mcp-pro-ui -- npx -y mcp-pro-ui"
              lang="bash"
            />
            <p className="text-xs text-fg-muted">
              The CLAUDE.md in your project already gives Claude Code context.
              The MCP server adds live component API lookup on top.
            </p>
          </Step>
          <Step n={3} title='Prompt Claude Code to build your features'>
            <div className="space-y-1.5">
              {[
                'Add a products page with a server-side ProTable',
                'Create a settings page with profile form and notification toggles',
                'Add a create user modal with ProForm and Zod validation',
              ].map((p) => (
                <div
                  key={p}
                  className="flex items-start gap-2 px-3 py-2 rounded bg-surface border border-border"
                >
                  <Bot size={12} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-mono text-fg-2">"{p}"</span>
                </div>
              ))}
            </div>
          </Step>
        </div>
      </div>

      {/* Tech stack */}
      <div className="p-4 bg-surface-subtle border border-border rounded-[var(--base-radius)]">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">Every template includes</p>
        <div className="flex flex-wrap gap-2">
          {[
            'React 19', 'Vite', 'TypeScript', '@dangbt/pro-ui',
            'Tailwind CSS v4', 'React Router v7', 'Zod',
            'ThemeProvider', 'ToastProvider', 'CLAUDE.md',
          ].map((t) => (
            <Badge key={t} color="default" size="sm">{t}</Badge>
          ))}
        </div>
      </div>

      {/* NPM link */}
      <div className="flex items-center gap-3 p-4 bg-surface-subtle border border-border rounded-[var(--base-radius)]">
        <Package size={16} className="text-fg-muted flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-fg font-medium">npm package</p>
          <a
            href="https://www.npmjs.com/package/create-pro-ui-app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-mono"
          >
            npmjs.com/package/create-pro-ui-app
          </a>
        </div>
      </div>
    </div>
  )
}
