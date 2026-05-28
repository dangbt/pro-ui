import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 text-center">
      <div className="flex flex-col items-center gap-4 max-w-2xl">
        <div className="flex items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
            <rect width="20" height="20" rx="5" fill="#6366f1" />
            <path d="M6 10h8M10 6v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
