import { Alert, Badge, ProgressBar } from '../../components'
import { SectionHeader } from '../shared'

function ThemeSwatch({ prefix, step }: { prefix: string; step: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-full h-10 rounded-[var(--base-radius)] border border-black/[0.06] transition-colors duration-300"
        style={{ backgroundColor: `var(--${prefix}-${step})` }}
      />
      <span className="text-[10px] text-fg-disabled font-mono leading-none">{step}</span>
    </div>
  )
}

export function ColorSystemSection() {
  const primarySteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  const statusSteps  = [50, 100, 200, 500, 600, 700, 800]
  const statuses = [
    { name: 'Success', prefix: 'success', anchor: 'oklch(52% 0.17 142) — green' },
    { name: 'Warning', prefix: 'warning', anchor: 'oklch(62% 0.15  70) — amber' },
    { name: 'Danger',  prefix: 'danger',  anchor: 'oklch(55% 0.22  25) — red'   },
    { name: 'Info',    prefix: 'info',    anchor: 'oklch(55% 0.15 225) — blue'  },
  ]

  return (
    <div className="space-y-10">
      <SectionHeader
        title="Color system"
        description="One --primary token drives the entire palette. Status colors blend 25% primary into their hue anchor — recognisable, but harmonised with the brand."
      />

      <div className="rounded-[var(--base-radius)] border border-border overflow-hidden">
        <div className="px-3.5 py-2 border-b border-border-subtle bg-surface-subtle/80">
          <span className="text-[11px] font-mono font-medium text-fg-disabled tracking-wide">src/index.css — the complete formula</span>
        </div>
        <pre className="px-5 py-4 text-xs font-mono text-gray-600 leading-6 bg-gray-950 overflow-x-auto">
          <span className="text-gray-500">{"/* ── 1. Customize these tokens per project ────────────────────── */"}{'\n'}</span>
          <span className="text-emerald-400">{"--primary"}</span><span className="text-gray-300">{":     #6366f1;   "}</span><span className="text-gray-500">{"/* brand color */"}{'\n'}</span>
          <span className="text-emerald-400">{"--base-radius"}</span><span className="text-gray-300">{": 8px;       "}</span><span className="text-gray-500">{"/* corner radius */"}{'\n'}</span>
          <span className="text-emerald-400">{"--sz-sm"}</span><span className="text-gray-300">{"      : 28px;      "}</span><span className="text-gray-500">{"/* small input/button height */"}{'\n'}</span>
          <span className="text-emerald-400">{"--sz-md"}</span><span className="text-gray-300">{"      : 36px;      "}</span><span className="text-gray-500">{"/* medium input/button height */"}{'\n'}</span>
          <span className="text-emerald-400">{"--sz-lg"}</span><span className="text-gray-300">{"      : 44px;      "}</span><span className="text-gray-500">{"/* large input/button height */"}{'\n\n'}</span>
          <span className="text-gray-500">{"/* ── 2. Primary scale — same formula, different % ─────────────── */"}{'\n'}</span>
          <span className="text-blue-300">{"--primary-50"}</span><span className="text-gray-300">{"  : color-mix(in oklch, "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-yellow-300">{"  8%"}</span><span className="text-gray-300">{", white);"}{'\n'}</span>
          <span className="text-blue-300">{"--primary-500"}</span><span className="text-gray-300">{" : "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-gray-300">{";"}{'\n'}</span>
          <span className="text-blue-300">{"--primary-900"}</span><span className="text-gray-300">{" : color-mix(in oklch, "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-yellow-300">{" 40%"}</span><span className="text-gray-300">{", black);"}{'\n\n'}</span>
          <span className="text-gray-500">{"/* ── 3. Status = 25% primary + 75% hue anchor ─────────────────── */"}{'\n'}</span>
          <span className="text-green-400">{"--success"}</span><span className="text-gray-300">{": color-mix(in oklch, "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-yellow-300">{" 25%"}</span><span className="text-gray-300">{", "}</span><span className="text-green-400">{"oklch(52% 0.17 142)"}</span><span className="text-gray-300">{");"}{'\n'}</span>
          <span className="text-yellow-400">{"--warning"}</span><span className="text-gray-300">{": color-mix(in oklch, "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-yellow-300">{" 25%"}</span><span className="text-gray-300">{", "}</span><span className="text-yellow-400">{"oklch(62% 0.15  70)"}</span><span className="text-gray-300">{");"}{'\n'}</span>
          <span className="text-red-400">{"--danger "}</span><span className="text-gray-300">{": color-mix(in oklch, "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-yellow-300">{" 25%"}</span><span className="text-gray-300">{", "}</span><span className="text-red-400">{"oklch(55% 0.22  25)"}</span><span className="text-gray-300">{");"}{'\n'}</span>
          <span className="text-sky-400">{"--info   "}</span><span className="text-gray-300">{": color-mix(in oklch, "}</span><span className="text-emerald-400">{"var(--primary)"}</span><span className="text-yellow-300">{" 25%"}</span><span className="text-gray-300">{", "}</span><span className="text-sky-400">{"oklch(55% 0.15 225)"}</span><span className="text-gray-300">{");"}{'\n\n'}</span>
          <span className="text-gray-500">{"/* ── 4. Status scales follow same lightness formula as primary ─── */"}{'\n'}</span>
          <span className="text-green-400">{"--success-100"}</span><span className="text-gray-300">{": color-mix(in oklch, "}</span><span className="text-green-400">{"var(--success)"}</span><span className="text-yellow-300">{" 15%"}</span><span className="text-gray-300">{", white);"}{'\n'}</span>
          <span className="text-green-400">{"--success-700"}</span><span className="text-gray-300">{": color-mix(in oklch, "}</span><span className="text-green-400">{"var(--success)"}</span><span className="text-yellow-300">{" 75%"}</span><span className="text-gray-300">{", black);"}</span>
        </pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-fg-2">Primary scale</p>
          <span className="text-[11px] text-fg-disabled font-mono hidden sm:block">color-mix(in oklch, var(--primary) N%, white/black)</span>
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${primarySteps.length}, minmax(0, 1fr))` }}>
          {primarySteps.map(s => <ThemeSwatch key={s} prefix="primary" step={s} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">Status scales</p>
          <span className="text-[11px] text-gray-400 font-mono hidden sm:block">color-mix(in oklch, var(--primary) 25%, anchor) → scale</span>
        </div>
        <div className="space-y-5">
          {statuses.map(s => (
            <div key={s.name}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: `var(--${s.prefix})` }} />
                <span className="text-xs font-semibold text-gray-700">{s.name}</span>
                <span className="text-[10px] text-gray-400 font-mono">{s.anchor}</span>
              </div>
              <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${statusSteps.length}, minmax(0, 1fr))` }}>
                {statusSteps.map(step => <ThemeSwatch key={step} prefix={s.prefix} step={step} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Live — change primary color (top-right ↗) to see everything adapt</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { variant: 'success' as const, title: 'Success', body: 'Deployed to production' },
            { variant: 'warning' as const, title: 'Warning', body: '3 issues detected'      },
            { variant: 'danger'  as const, title: 'Danger',  body: 'Build failed'            },
            { variant: 'info'    as const, title: 'Info',    body: 'Update available'        },
          ].map(a => (
            <Alert key={a.variant} variant={a.variant} title={a.title}>{a.body}</Alert>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {(['success','warning','danger','info','primary','default'] as const).map(c => (
            <Badge key={c} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
          ))}
        </div>
        <div className="space-y-2.5">
          <ProgressBar label="Success track" value={72} maxValue={100} variant="success" showValue />
          <ProgressBar label="Warning track" value={55} maxValue={100} variant="warning" showValue />
          <ProgressBar label="Danger track"  value={88} maxValue={100} variant="danger"  showValue />
        </div>
      </div>
    </div>
  )
}
