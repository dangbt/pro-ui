import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12 px-4 text-center pb-16">

      {/* Hero */}
      <div className="flex flex-col items-center gap-4 max-w-2xl pt-8">
        <div className="flex items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#818cf8"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#hero-grad)"/>
            <path
              d="M 8 6 L 8 26 L 13 26 L 13 18 Q 24 18 24 12 Q 24 6 13 6 Z M 13 9 Q 21 9 21 12 Q 21 15 13 15 Z"
              fill="white"
              fillRule="evenodd"
            />
          </svg>
          <h1 className="text-4xl font-bold tracking-tight">pro-ui</h1>
        </div>

        <p className="text-xl text-fd-muted-foreground">
          AI-native React UI library — ProTable, ProForm, Layout, and 30+ accessible components
          built on React Aria + Tailwind CSS v4.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/docs"
            className="px-6 py-2.5 bg-fd-primary text-fd-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Read the docs →
          </Link>
          <Link
            href="https://pro-ui.pages.dev"
            target="_blank"
            className="px-6 py-2.5 border border-fd-border rounded-lg font-semibold hover:bg-fd-muted transition-colors"
          >
            Live showcase
          </Link>
          <Link
            href="https://github.com/dangbt/pro-ui"
            target="_blank"
            className="px-6 py-2.5 border border-fd-border rounded-lg font-semibold hover:bg-fd-muted transition-colors"
          >
            GitHub ↗
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
        {[
          {
            title: '🤖 MCP Server',
            desc: 'Claude Code, Cursor, and Windsurf know your exact component API. Zero hallucinated props.',
          },
          {
            title: '📊 ProTable',
            desc: 'Server-side data table with search, sort, pagination, row selection, and bulk actions in one component.',
          },
          {
            title: '📝 ProForm',
            desc: 'Schema-driven forms with Zod validation. Define a schema and field list — done.',
          },
        ].map((f) => (
          <div key={f.title} className="p-4 border border-fd-border rounded-lg text-left">
            <div className="font-semibold mb-1">{f.title}</div>
            <div className="text-sm text-fd-muted-foreground">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Pro Admin Template CTA */}
      <div className="w-full max-w-3xl">
        <div className="rounded-xl overflow-hidden border border-fd-border">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-400 px-6 py-5 flex items-start justify-between gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span className="text-sm font-bold text-white">Pro Admin Template</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-white">$39</span>
                <span className="text-sm text-white/70">one-time</span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Full source code · TypeScript · MIT license</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                href="https://prouiadmin.lemonsqueezy.com/checkout/buy/e85bcff6-ebaf-43f2-8848-8d98f9c30967"
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-lg hover:bg-white/90 transition-colors"
              >
                Buy Template →
              </Link>
              <Link
                href="https://pro-admin-demo.pages.dev"
                target="_blank"
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 border border-white/40 text-white text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View Demo ↗
              </Link>
            </div>
          </div>
          {/* Features */}
          <div className="bg-fd-card px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-left">
              {[
                'Dashboard + Analytics',
                'Users + Billing pages',
                'Auth flow (Login/Register)',
                '2 layout variants',
                'Dark mode + Theme Island',
                'React Aria accessible',
              ].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-fd-muted-foreground">
                  <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem tools */}
      <div className="w-full max-w-3xl space-y-3 text-left">
        <h2 className="text-sm font-semibold text-fd-muted-foreground uppercase tracking-widest text-center">Ecosystem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-fd-border rounded-lg space-y-2">
            <div className="font-semibold text-sm">⚡ create-pro-ui-app</div>
            <p className="text-xs text-fd-muted-foreground">Scaffold a React + pro-ui project in seconds.</p>
            <code className="block bg-fd-muted px-3 py-1.5 rounded text-xs font-mono">
              npx create-pro-ui-app my-app
            </code>
            <Link
              href="https://www.npmjs.com/package/create-pro-ui-app"
              target="_blank"
              className="text-xs text-indigo-500 hover:underline"
            >
              npm ↗
            </Link>
          </div>
          <div className="p-4 border border-fd-border rounded-lg space-y-2">
            <div className="font-semibold text-sm">🤖 mcp-pro-ui</div>
            <p className="text-xs text-fd-muted-foreground">MCP server — lets Claude Code & Cursor generate correct component code.</p>
            <code className="block bg-fd-muted px-3 py-1.5 rounded text-xs font-mono">
              npm install mcp-pro-ui
            </code>
            <Link
              href="https://www.npmjs.com/package/mcp-pro-ui"
              target="_blank"
              className="text-xs text-indigo-500 hover:underline"
            >
              npm ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Install */}
      <div className="text-sm text-fd-muted-foreground">
        <code className="bg-fd-muted px-2 py-1 rounded text-xs">npm install @dangbt/pro-ui</code>
        {' · '}
        <Link href="https://www.npmjs.com/package/@dangbt/pro-ui" target="_blank" className="underline underline-offset-4">
          npm ↗
        </Link>
      </div>
    </main>
  )
}
