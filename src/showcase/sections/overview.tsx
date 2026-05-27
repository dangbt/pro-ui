import { Badge, Button, Alert, Avatar, AvatarGroup, ProgressBar, Switch, Checkbox } from '../../components'
import { Demo } from '../shared'
import { useShowcaseSize } from '../context'

declare const __APP_VERSION__: string

export function Overview() {
  const size = useShowcaseSize()
  const stats = [
    { count: 13, label: 'Form',    color: 'bg-primary-50  text-primary-700'  },
    { count: 5,  label: 'Overlay', color: 'bg-info-50     text-info-700'     },
    { count: 8,  label: 'Display', color: 'bg-success-50  text-success-700'  },
    { count: 1,  label: 'Data',    color: 'bg-warning-50  text-warning-700'  },
  ]

  return (
    <div className="space-y-8">
      <div className="border border-border rounded-[var(--base-radius)] p-8 bg-gradient-to-br from-primary-50/60 to-surface">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-[var(--base-radius)] bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="font-bold text-fg text-lg">pro-ui</span>
          <Badge color="info" size={size}>v{__APP_VERSION__}</Badge>
        </div>
        <p className="text-fg-muted text-sm max-w-lg mb-6">
          UI framework built on <strong>React Aria Components</strong> + <strong>Tailwind v4</strong>.
          Single <code className="text-primary bg-primary-50 px-1 rounded font-mono text-xs">--primary</code> token,
          3 radius presets, full accessibility out of the box.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`rounded-[var(--base-radius)] px-4 py-3 ${s.color}`}>
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-xs font-medium opacity-70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Button — 4 variants">
          <div className="flex flex-wrap gap-2">
            <Button size={size} variant="primary">Primary</Button>
            <Button size={size} variant="secondary">Secondary</Button>
            <Button size={size} variant="ghost">Ghost</Button>
            <Button size={size} variant="danger">Danger</Button>
          </div>
        </Demo>
        <Demo label="Badge — 6 colors">
          <div className="flex flex-wrap gap-2">
            {(['default','primary','success','warning','danger','info'] as const).map(c => (
              <Badge key={c} size={size} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
            ))}
          </div>
        </Demo>
        <Demo label="Alert">
          <div className="w-full space-y-2">
            <Alert variant="success" closable>Changes saved successfully.</Alert>
            <Alert variant="warning">Your session will expire soon.</Alert>
          </div>
        </Demo>
        <Demo label="Avatar & AvatarGroup">
          <div className="space-y-3 text-center">
            <div className="flex items-end justify-center gap-2">
              {(['xs','sm','md','lg'] as const).map(s => (
                <Avatar key={s} name="Alice Nguyen" size={s} />
              ))}
            </div>
            <AvatarGroup
              size="sm"
              avatars={['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do'].map(n => ({ name: n }))}
              max={4}
            />
          </div>
        </Demo>
        <Demo label="ProgressBar">
          <div className="w-full space-y-3">
            <ProgressBar value={65} maxValue={100} label="Upload" variant="primary" showValue />
            <ProgressBar value={85} maxValue={100} label="CPU"    variant="danger"  showValue />
          </div>
        </Demo>
        <Demo label="Switch & Checkbox">
          <div className="space-y-3">
            <Switch size={size} defaultSelected>Notifications</Switch>
            <Switch size={size}>Dark mode</Switch>
            <Checkbox size={size} defaultSelected>Remember me</Checkbox>
            <Checkbox size={size}>Subscribe to updates</Checkbox>
          </div>
        </Demo>
      </div>
    </div>
  )
}
