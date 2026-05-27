import { useState, useEffect } from 'react'
import { Plus, Sun, Moon } from 'lucide-react'
import {
  Button, Input, Select, Switch, Checkbox, Slider, SearchField,
  NumberField, DatePicker, TagGroup, Badge, Alert, Avatar, AvatarGroup,
  ProgressBar, Meter, Spinner, Skeleton, Disclosure, Accordion, Tooltip,
  Tabs, ProTable,
} from '../components'
import { useTheme } from '../components/theme-provider'
import { cn } from '../lib/cn'
import type { Size } from '../lib/size'
import { THEME_PRESETS, RADIUS_PRESETS, FONT_PRESETS } from './constants'
import type { FontPreset } from './constants'
import { mockRequest, THEME_PREVIEW_COLS } from './mock-data'
import type { User } from './mock-data'

/* ── Theme toggle (Switch: sun ☀ — track — moon 🌙) ─────── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const [sysDark, setSysDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = (e: MediaQueryListEvent) => setSysDark(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && sysDark)

  return (
    <div
      className="flex items-center gap-1.5 shrink-0"
      title={isDark ? 'Dark — click to switch to light' : 'Light — click to switch to dark'}
    >
      <Sun  className="w-3.5 h-3.5 text-fg-muted" />
      <Switch
        isSelected={isDark}
        onChange={(selected) => setTheme(selected ? 'dark' : 'light')}
        size="sm"
      />
      <Moon className="w-3.5 h-3.5 text-fg-muted" />
    </div>
  )
}

export function ThemeBuilderPage({ onBack }: { onBack: () => void }) {
  const [primary, setPrimary] = useState('#6366f1')
  const [radius, setRadius] = useState('0px')
  const [szSm, setSzSm] = useState(28)
  const [szMd, setSzMd] = useState(36)
  const [szLg, setSzLg] = useState(44)
  const [copied, setCopied] = useState(false)
  const [previewSize, setPreviewSize] = useState<Size>('md')
  const [successColor, setSuccessColor] = useState<string | null>(null)
  const [warningColor, setWarningColor] = useState<string | null>(null)
  const [dangerColor,  setDangerColor]  = useState<string | null>(null)
  const [infoColor,    setInfoColor]    = useState<string | null>(null)
  const [borderColor,  setBorderColor]  = useState<string | null>(null)
  const [fontPreset, setFontPreset] = useState<FontPreset>(FONT_PRESETS[0])

  const s = previewSize

  const apply = (p: string, r: string, sm: number, md: number, lg: number) => {
    document.documentElement.style.setProperty('--primary', p)
    document.documentElement.style.setProperty('--base-radius', r)
    document.documentElement.style.setProperty('--sz-sm', `${sm}px`)
    document.documentElement.style.setProperty('--sz-md', `${md}px`)
    document.documentElement.style.setProperty('--sz-lg', `${lg}px`)
  }
  const applyStatus = (sc: string | null, wc: string | null, dc: string | null, ic: string | null, bc: string | null) => {
    const el = document.documentElement
    const set = (k: string, v: string | null) => v ? el.style.setProperty(k, v) : el.style.removeProperty(k)
    set('--success', sc); set('--warning', wc); set('--danger', dc); set('--info', ic); set('--border', bc)
  }

  const handleColor   = (hex: string) => { setPrimary(hex); apply(hex, radius, szSm, szMd, szLg) }
  const handleRadius  = (r: string)   => { setRadius(r);    apply(primary, r, szSm, szMd, szLg) }
  const handleSzSm    = (v: number)   => { setSzSm(v);      apply(primary, radius, v, szMd, szLg) }
  const handleSzMd    = (v: number)   => { setSzMd(v);      apply(primary, radius, szSm, v, szLg) }
  const handleSzLg    = (v: number)   => { setSzLg(v);      apply(primary, radius, szSm, szMd, v) }
  const handleSuccess = (v: string | null) => { setSuccessColor(v); applyStatus(v, warningColor, dangerColor, infoColor, borderColor) }
  const handleWarning = (v: string | null) => { setWarningColor(v); applyStatus(successColor, v, dangerColor, infoColor, borderColor) }
  const handleDanger  = (v: string | null) => { setDangerColor(v);  applyStatus(successColor, warningColor, v, infoColor, borderColor) }
  const handleInfo    = (v: string | null) => { setInfoColor(v);    applyStatus(successColor, warningColor, dangerColor, v, borderColor) }
  const handleBorder  = (v: string | null) => { setBorderColor(v);  applyStatus(successColor, warningColor, dangerColor, infoColor, v) }
  const handleFont = (preset: FontPreset) => {
    setFontPreset(preset)
    const linkId = 'theme-builder-font'
    let link = document.getElementById(linkId) as HTMLLinkElement | null
    if (preset.gFont) {
      if (!link) {
        link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      link.href = `https://fonts.googleapis.com/css2?family=${preset.gFont}&display=swap`
    } else {
      link?.remove()
    }
    document.documentElement.style.setProperty('--font-sans', preset.value)
  }

  const statusOverrides = [
    { label: 'Success', cssVar: '--success', defaultHex: '#22c55e', color: successColor, handle: handleSuccess },
    { label: 'Warning', cssVar: '--warning', defaultHex: '#f59e0b', color: warningColor, handle: handleWarning },
    { label: 'Danger',  cssVar: '--danger',  defaultHex: '#ef4444', color: dangerColor,  handle: handleDanger  },
    { label: 'Info',    cssVar: '--info',    defaultHex: '#3b82f6', color: infoColor,    handle: handleInfo    },
    { label: 'Border',  cssVar: '--border',  defaultHex: '#e5e7eb', color: borderColor,  handle: handleBorder  },
  ]

  const overriddenVars = statusOverrides.filter(o => o.color !== null)
  const fontImportLine = fontPreset.gFont
    ? `@import url("https://fonts.googleapis.com/css2?family=${fontPreset.gFont}&display=swap");\n` : ''
  const fontVarLine = fontPreset.name !== 'System' ? `\n  --font-sans: ${fontPreset.value};` : ''
  const cssOutput = `${fontImportLine}@import "tailwindcss";
@import "@dangbt/pro-ui/tailwind.css";
@import "@dangbt/pro-ui/theme.css";

:root {
  --primary: ${primary};
  --base-radius: ${radius};
  --sz-sm: ${szSm}px;
  --sz-md: ${szMd}px;
  --sz-lg: ${szLg}px;${fontVarLine}${overriddenVars.map(o => `\n  ${o.cssVar}: ${o.color};`).join('')}
}`
  const copy = () => {
    navigator.clipboard.writeText(cssOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    { label: 'Total Revenue',  value: '$45,231',  change: '+20.1%', up: true  },
    { label: 'Active Users',   value: '2,350',    change: '+15.3%', up: true  },
    { label: 'New Orders',     value: '1,247',    change: '-4.5%',  up: false },
    { label: 'Pending Tasks',  value: '84',       change: '+2',     up: true  },
  ]

  const CtlLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-fg-disabled mb-2">{children}</p>
  )
  const PanelCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn('bg-surface rounded-[var(--card-radius)] border border-border overflow-hidden', className)}>
      {children}
    </div>
  )
  const PanelHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
      <p className="text-sm font-semibold text-fg-2">{title}</p>
      {action}
    </div>
  )

  const [settingsOpen, setSettingsOpen] = useState(false)

  const ControlsContent = (
    <div className="p-4 space-y-5">
      {/* Primary color */}
      <div>
        <CtlLabel>Primary color</CtlLabel>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {THEME_PRESETS.map(p => (
              <button key={p.hex} onClick={() => handleColor(p.hex)} title={p.name}
                className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                style={{ backgroundColor: p.hex, borderColor: primary === p.hex ? 'white' : 'transparent', boxShadow: primary === p.hex ? `0 0 0 2px ${p.hex}` : 'none' }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <input type="color" value={primary} onChange={e => handleColor(e.target.value)}
              className="w-7 h-7 rounded border border-border cursor-pointer p-0.5 bg-surface" />
            <input type="text" value={primary}
              onChange={e => { const v = e.target.value; if (/^#[0-9a-fA-F]{0,6}$/.test(v)) { setPrimary(v); if (/^#[0-9a-fA-F]{6}$/.test(v)) apply(v, radius, szSm, szMd, szLg) } }}
              className="h-7 w-20 px-2 font-mono text-xs border border-border rounded bg-surface text-fg focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent" />
          </div>
        </div>
        <div className="flex gap-0.5 mt-2">
          {[50,100,200,300,400,500,600,700,800,900].map(shade => (
            <div key={shade} className="flex-1 h-5 rounded-sm" style={{ background: `var(--primary-${shade})` }} />
          ))}
        </div>
      </div>

      {/* Color system */}
      <div>
        <CtlLabel>Color system</CtlLabel>
        <div className="flex gap-3">
          {statusOverrides.map(({ label, cssVar, defaultHex, color, handle }) => (
            <div key={cssVar} className="flex flex-col items-center gap-1">
              <div className="relative w-8 h-8 rounded-lg border border-black/10 overflow-hidden cursor-pointer"
                style={{ background: color ?? `var(${cssVar})` }}>
                <input type="color" value={color ?? defaultHex} onChange={e => handle(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <span className="text-[9px] text-fg-disabled">{label}</span>
              {color !== null && (
                <button onClick={() => handle(null)} className="text-[9px] text-primary hover:underline">↺</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <CtlLabel>Radius</CtlLabel>
        <div className="flex gap-1">
          {RADIUS_PRESETS.map(r => (
            <button key={r.value} onClick={() => handleRadius(r.value)} title={r.value}
              className={cn('flex-1 h-8 text-xs font-medium border transition-all',
                radius === r.value ? 'bg-primary text-white border-primary' : 'bg-surface text-fg-muted border-border hover:border-fg-muted')}
              style={{ borderRadius: r.value === '9999px' ? '9999px' : '5px' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font family */}
      <div>
        <CtlLabel>Font family</CtlLabel>
        <div className="space-y-2">
          {(['Sans-serif', 'Monospace'] as const).map(cat => {
            const fonts = FONT_PRESETS.filter(f => cat === 'Sans-serif' ? !f.mono : f.mono)
            return (
              <div key={cat}>
                <p className="text-[9px] uppercase tracking-wider text-fg-disabled mb-1">{cat}</p>
                <div className="flex flex-wrap gap-1">
                  {fonts.map(f => (
                    <button
                      key={f.name}
                      onClick={() => handleFont(f)}
                      style={{ fontFamily: f.value }}
                      className={cn(
                        'px-2 py-1 text-xs border rounded transition-all',
                        fontPreset.name === f.name
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface text-fg-muted border-border hover:border-fg-muted',
                      )}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <CtlLabel>Size scale (px)</CtlLabel>
        <div className="space-y-2">
          {([
            { label: 'SM', value: szSm, min: 20, max: 40, onChange: handleSzSm },
            { label: 'MD', value: szMd, min: 28, max: 52, onChange: handleSzMd },
            { label: 'LG', value: szLg, min: 36, max: 64, onChange: handleSzLg },
          ] as const).map(tier => (
            <div key={tier.label} className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-fg-disabled w-5 shrink-0">{tier.label}</span>
              <input type="range" min={tier.min} max={tier.max} value={tier.value}
                onChange={e => tier.onChange(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full cursor-pointer accent-primary bg-border appearance-none" />
              <span className="text-[11px] font-mono text-fg-muted w-8 text-right shrink-0">{tier.value}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Export */}
      <div>
        <CtlLabel>Export CSS</CtlLabel>
        <div className="rounded-[var(--base-radius)] border border-border overflow-hidden">
          <pre className="bg-gray-950 text-gray-100 p-3 text-[11px] font-mono overflow-x-auto leading-relaxed">
            <span className="text-gray-500">@import </span><span className="text-green-400">"tailwindcss"</span><span className="text-gray-500">;</span>{'\n'}
            <span className="text-gray-500">@import </span><span className="text-green-400">"@dangbt/pro-ui/tailwind.css"</span><span className="text-gray-500">;</span>{'\n'}
            <span className="text-gray-500">@import </span><span className="text-green-400">"@dangbt/pro-ui/theme.css"</span><span className="text-gray-500">;</span>{'\n\n'}
            <span className="text-blue-400">:root</span><span className="text-gray-300"> {'{'}</span>{'\n'}
            <span className="text-gray-300">{'  '}</span><span className="text-sky-300">--primary</span><span className="text-gray-300">: </span><span className="text-orange-300">{primary}</span><span className="text-gray-300">;</span>{'\n'}
            <span className="text-gray-300">{'  '}</span><span className="text-sky-300">--base-radius</span><span className="text-gray-300">: </span><span className="text-orange-300">{radius}</span><span className="text-gray-300">;</span>{'\n'}
            <span className="text-gray-300">{'  '}</span><span className="text-sky-300">--sz-sm</span><span className="text-gray-300">: </span><span className="text-orange-300">{szSm}px</span><span className="text-gray-300">;</span>{'\n'}
            <span className="text-gray-300">{'  '}</span><span className="text-sky-300">--sz-md</span><span className="text-gray-300">: </span><span className="text-orange-300">{szMd}px</span><span className="text-gray-300">;</span>{'\n'}
            <span className="text-gray-300">{'  '}</span><span className="text-sky-300">--sz-lg</span><span className="text-gray-300">: </span><span className="text-orange-300">{szLg}px</span><span className="text-gray-300">;</span>{'\n'}
            {fontPreset.name !== 'System' && (
              <span>
                <span className="text-gray-300">{'  '}</span>
                <span className="text-sky-300">--font-sans</span>
                <span className="text-gray-300">: </span>
                <span className="text-orange-300">{fontPreset.value}</span>
                <span className="text-gray-300">;</span>{'\n'}
              </span>
            )}
            {overriddenVars.map(o => (
              <span key={o.cssVar}>
                <span className="text-gray-300">{'  '}</span>
                <span className="text-sky-300">{o.cssVar}</span>
                <span className="text-gray-300">: </span>
                <span className="text-orange-300">{o.color}</span>
                <span className="text-gray-300">;</span>{'\n'}
              </span>
            ))}
            <span className="text-gray-300">{'}'}</span>
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-canvas overflow-hidden">
      {/* Minimal header */}
      <header className="h-14 bg-surface border-b border-border flex items-center px-4 gap-2 shrink-0 z-10">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors shrink-0"
        >
          <span className="text-base leading-none">←</span>
          <span className="hidden sm:inline">Docs</span>
        </button>
        <div className="w-px h-5 bg-border shrink-0" />
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-sm text-fg truncate hidden sm:block">Theme Builder</span>
        </div>
        <div className="flex-1" />
        {/* Theme toggle */}
        <ThemeToggle />
        {/* Size picker — desktop only; mobile gets it inside settings panel */}
        <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-0.5 shrink-0">
          {(['sm', 'md', 'lg'] as Size[]).map(sz => (
            <button key={sz} onClick={() => {
              setPreviewSize(sz)
              document.documentElement.style.setProperty('--sz', `var(--sz-${sz})`)
            }}
              className={cn('px-2.5 py-1 text-[11px] font-semibold uppercase rounded-md transition-all',
                previewSize === sz ? 'bg-primary text-white' : 'text-fg-disabled hover:text-fg-2')}
            >{sz}</button>
          ))}
        </div>
        {/* Copy CSS — full label on desktop, icon-only on mobile */}
        <button onClick={copy}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border bg-primary text-white border-primary hover:bg-primary-600 transition-colors shrink-0"
        >
          <span>{copied ? '✓' : '⎘'}</span>
          <span className="hidden sm:inline">{copied ? '' : 'Copy CSS'}</span>
        </button>
        {/* Settings trigger — mobile only */}
        <button onClick={() => setSettingsOpen(o => !o)}
          className={cn(
            'lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 text-base',
            settingsOpen
              ? 'bg-primary text-white border-primary'
              : 'border-border bg-surface text-fg-muted hover:bg-surface-subtle',
          )}
          aria-label="Customize"
        >⚙</button>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Click-away backdrop — mobile only, doesn't cover header */}
        {settingsOpen && (
          <div
            className="absolute inset-0 z-20 lg:hidden"
            onClick={() => setSettingsOpen(false)}
          />
        )}

        {/* Preview */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4 max-w-5xl">

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(st => (
                <div key={st.label} className="bg-surface rounded-[var(--card-radius)] border border-border p-4 space-y-1">
                  <p className="text-xs text-fg-muted">{st.label}</p>
                  <p className="text-2xl font-bold text-fg">{st.value}</p>
                  <p className={cn('text-xs font-medium', st.up ? 'text-success-600' : 'text-danger-600')}>
                    {st.change} vs last month
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Form panel */}
              <PanelCard className="lg:col-span-3">
                <PanelHeader title="Create account" action={<Badge color="primary" size={s}>New</Badge>} />
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="First name" placeholder="Alice" size={s} />
                    <Input label="Last name"  placeholder="Johnson" size={s} />
                  </div>
                  <Input label="Email" placeholder="alice@example.com" type="email" size={s} />
                  <Input label="Password" placeholder="••••••••" type="password" size={s} />
                  <Select
                    label="Role"
                    size={s}
                    options={[
                      { value: 'admin',  label: 'Admin'  },
                      { value: 'editor', label: 'Editor' },
                      { value: 'viewer', label: 'Viewer' },
                    ]}
                  />
                  <div className="flex items-center gap-4 pt-1">
                    <Switch defaultSelected size={s}><span className="text-sm">Send welcome email</span></Switch>
                    <Checkbox defaultSelected size={s}>Agree to terms</Checkbox>
                  </div>
                  <Slider label="Storage quota (GB)" defaultValue={20} minValue={5} maxValue={100} />
                  <div className="flex gap-2 pt-1">
                    <Button variant="primary" size={s} className="flex-1">Create account</Button>
                    <Button variant="secondary" size={s}>Cancel</Button>
                  </div>
                </div>
              </PanelCard>

              {/* Right column */}
              <div className="lg:col-span-2 space-y-4">
                {/* Buttons */}
                <PanelCard>
                  <PanelHeader title="Actions" />
                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="primary"   size={s}>Primary</Button>
                      <Button variant="secondary" size={s}>Secondary</Button>
                      <Button variant="ghost"     size={s}>Ghost</Button>
                      <Button variant="danger"    size={s}>Delete</Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge color="default" size={s}>Default</Badge>
                      <Badge color="primary" size={s}>Primary</Badge>
                      <Badge color="success" size={s}>Success</Badge>
                      <Badge color="warning" size={s}>Warning</Badge>
                      <Badge color="danger"  size={s}>Danger</Badge>
                      <Badge color="info"    size={s}>Info</Badge>
                    </div>
                  </div>
                </PanelCard>

                {/* Alerts */}
                <PanelCard>
                  <PanelHeader title="Notifications" />
                  <div className="p-4 space-y-2">
                    <Alert variant="info"    title="Update available">Version 2.0 is ready to install.</Alert>
                    <Alert variant="success" title="Deployed">Your changes are now live.</Alert>
                    <Alert variant="warning" title="Approaching limit">You've used 80% of your quota.</Alert>
                    <Alert variant="danger"  title="Build failed">Check the logs for details.</Alert>
                  </div>
                </PanelCard>

                {/* Progress */}
                <PanelCard>
                  <PanelHeader title="Usage" />
                  <div className="p-4 space-y-3">
                    <ProgressBar label="Storage" value={72} size="md" />
                    <ProgressBar label="Bandwidth" value={38} size="md" />
                    <Meter label="CPU load" value={55} size="md" />
                  </div>
                </PanelCard>
              </div>
            </div>

            {/* Users table */}
            <ProTable<User>
              columns={THEME_PREVIEW_COLS}
              request={mockRequest}
              rowKey="id"
              headerTitle="Team members"
              size={s}
              toolBarRender={() => [
                <Button key="inv" variant="primary" size={s} icon={<Plus className="w-3.5 h-3.5" />}>Invite</Button>,
                <Button key="exp" variant="secondary" size={s}>Export</Button>,
              ]}
              rowSelection={{ onChange: () => {} }}
              bulkActions={[
                { label: 'Export CSV', onClick: () => {} },
                { label: 'Change role', onClick: () => {} },
                { label: 'Remove', danger: true, onClick: () => {} },
              ]}
            />

            {/* Tabs + Cards row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <PanelCard className="lg:col-span-2">
                <div className="p-4">
                  <Tabs
                    items={[
                      { id: 'overview', label: 'Overview',  content: (
                        <div className="space-y-3 pt-3">
                          <div className="grid grid-cols-3 gap-3">
                            {['Jan','Feb','Mar'].map((m,i) => (
                              <div key={m} className="text-center p-3 rounded-[var(--base-radius)] bg-primary-50">
                                <p className="text-xs text-primary-600">{m}</p>
                                <p className="text-lg font-bold text-primary-700">{(i+1)*12}k</p>
                              </div>
                            ))}
                          </div>
                          <ProgressBar label="Q1 target" value={68} />
                        </div>
                      )},
                      { id: 'details', label: 'Details', content: (
                        <div className="space-y-2 pt-3">
                          {['API requests','Error rate','Avg latency'].map(l => (
                            <div key={l} className="flex justify-between text-sm py-1.5 border-b border-border-subtle">
                              <span className="text-fg-muted">{l}</span>
                              <span className="font-medium text-fg-2">{Math.floor(Math.random()*1000)}</span>
                            </div>
                          ))}
                        </div>
                      )},
                      { id: 'settings', label: 'Settings', content: (
                        <div className="space-y-2 pt-3">
                          <Switch defaultSelected size={s}><span className="text-sm">Email notifications</span></Switch>
                          <Switch size={s}><span className="text-sm">Slack alerts</span></Switch>
                          <Switch defaultSelected size={s}><span className="text-sm">Weekly digest</span></Switch>
                        </div>
                      )},
                    ]}
                  />
                </div>
              </PanelCard>

              <div className="space-y-4">
                {/* Profile card */}
                <PanelCard>
                  <div className="p-4 flex flex-col items-center text-center gap-2">
                    <Avatar name="Alice Johnson" size="lg" />
                    <div>
                      <p className="font-semibold text-fg-2">Alice Johnson</p>
                      <p className="text-xs text-fg-disabled">alice@company.io</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Badge color="success" size="sm">Admin</Badge>
                      <Badge color="primary" size="sm">Pro</Badge>
                    </div>
                    <div className="flex gap-2 w-full pt-1">
                      <Button variant="primary" size="sm" className="flex-1">Message</Button>
                      <Button variant="secondary" size="sm" className="flex-1">Profile</Button>
                    </div>
                  </div>
                </PanelCard>

                {/* Avatar group */}
                <PanelCard>
                  <PanelHeader title="Online now" action={<Badge color="success" size="sm">4 active</Badge>} />
                  <div className="p-4 space-y-3">
                    <AvatarGroup
                      size="sm"
                      max={5}
                      avatars={['Alice Johnson','Bob Smith','Carol White','David Kim','Eve Park','Frank Lee'].map(n => ({ name: n }))}
                    />
                    <Tooltip content="Invite more teammates">
                      <Button variant="ghost" size="sm" className="w-full">+ Invite teammates</Button>
                    </Tooltip>
                  </div>
                </PanelCard>
              </div>
            </div>

            {/* Input variety row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <PanelCard>
                <PanelHeader title="Search" />
                <div className="p-4"><SearchField placeholder="Search users…" label="" /></div>
              </PanelCard>
              <PanelCard>
                <PanelHeader title="Date" />
                <div className="p-4"><DatePicker label="Pick a date" size={s} /></div>
              </PanelCard>
              <PanelCard>
                <PanelHeader title="Number" />
                <div className="p-4"><NumberField label="Quantity" defaultValue={5} minValue={1} size={s} /></div>
              </PanelCard>
              <PanelCard>
                <PanelHeader title="Tags" />
                <div className="p-4">
                  <TagGroup
                    label="Labels"
                    items={[
                      { id: '1', label: 'Design'    },
                      { id: '2', label: 'Frontend'  },
                      { id: '3', label: 'Backend'   },
                    ]}
                  />
                </div>
              </PanelCard>
            </div>

            {/* Disclosure + Skeleton row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PanelCard>
                <PanelHeader title="FAQ" />
                <div className="p-4">
                  <Accordion>
                    <Disclosure id="a1" title="What is pro-ui?">
                      A React component library built on React Aria Components + Tailwind CSS v4 with full accessibility out of the box.
                    </Disclosure>
                    <Disclosure id="a2" title="How do I install it?">
                      Run <code className="bg-surface-subtle px-1 rounded text-xs font-mono">npm install @dangbt/pro-ui</code> and follow the Quick Start guide.
                    </Disclosure>
                    <Disclosure id="a3" title="Does it support dark mode?">
                      Yes! The color system is CSS-variable based — add <code className="bg-surface-subtle px-1 rounded text-xs font-mono">class="dark"</code> to <code className="bg-surface-subtle px-1 rounded text-xs font-mono">&lt;html&gt;</code> to switch.
                    </Disclosure>
                  </Accordion>
                </div>
              </PanelCard>

              <PanelCard>
                <PanelHeader title="Loading state" action={<Spinner size="sm" />} />
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-3 w-48 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-5/6 rounded" />
                  <Skeleton className="h-3 w-4/6 rounded" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 w-20 rounded-[var(--base-radius)]" />
                    <Skeleton className="h-8 w-20 rounded-[var(--base-radius)]" />
                  </div>
                </div>
              </PanelCard>
            </div>

          </div>
        </div>

        {/* Settings sidebar — always visible on lg+, slide-in panel on mobile */}
        <div className={cn(
          'w-72 xl:w-80 shrink-0 border-l border-border bg-surface flex-col overflow-y-auto',
          // Desktop: always in flow
          'lg:flex',
          // Mobile: fixed below header, slide in from right
          settingsOpen
            ? 'flex fixed top-14 right-0 bottom-0 z-30 shadow-2xl'
            : 'hidden',
        )}>
          {/* Mobile-only panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle shrink-0 lg:hidden">
            <span className="text-sm font-semibold text-fg-2">Customize</span>
            <button onClick={() => setSettingsOpen(false)}
              className="w-7 h-7 flex items-center justify-center text-fg-disabled hover:text-fg-2 rounded-lg hover:bg-surface-subtle text-lg leading-none"
            >✕</button>
          </div>
          {/* Size picker — mobile only (desktop uses header) */}
          <div className="px-4 py-3 border-b border-border-subtle lg:hidden">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-fg-disabled mb-2">Preview size</p>
            <div className="flex items-center border border-border rounded-lg p-0.5">
              {(['sm', 'md', 'lg'] as Size[]).map(sz => (
                <button key={sz} onClick={() => {
                  setPreviewSize(sz)
                  document.documentElement.style.setProperty('--sz', `var(--sz-${sz})`)
                }}
                  className={cn('flex-1 py-1.5 text-[11px] font-semibold uppercase rounded-md transition-all',
                    previewSize === sz ? 'bg-primary text-white' : 'text-fg-disabled hover:text-fg-2')}
                >{sz}</button>
              ))}
            </div>
          </div>
          {ControlsContent}
        </div>
      </div>
    </div>
  )
}
