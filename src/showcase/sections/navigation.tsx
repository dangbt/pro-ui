import { useState } from 'react'
import { Plus, Download, Trash2 } from 'lucide-react'
import {
  Button, Input, Switch, Alert, Tabs, Breadcrumbs,
  Toolbar, ToolbarSeparator, ToggleButton,
} from '../../components'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'

export function TabsSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Tabs" description="Keyboard-navigable tab panels." />
      <Demo label="Tabs — horizontal" center={false}>
        <Tabs
          defaultSelectedKey="general"
          items={[
            {
              id: 'general', label: 'General',
              content: (
                <div className="space-y-4">
                  <Input size={size} label="Project name" defaultValue="pro-ui" />
                  <Input size={size} label="Description" placeholder="Describe your project..." />
                </div>
              ),
            },
            {
              id: 'security', label: 'Security',
              content: <div className="space-y-3"><Switch size={size} defaultSelected>Two-factor auth</Switch><Switch size={size}>Session timeout</Switch></div>,
            },
            {
              id: 'billing', label: 'Billing',
              content: <Alert variant="info">Managed by your org admin.</Alert>,
            },
            { id: 'disabled', label: 'Disabled', disabled: true, content: null },
          ]}
        />
      </Demo>
    </div>
  )
}

export function BreadcrumbsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Breadcrumbs" description="Navigation path indicators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Breadcrumbs — 3 levels" center={false}>
          <Breadcrumbs items={[{ id: 'home', label: 'Home', href: '/' }, { id: 'settings', label: 'Settings', href: '/settings' }, { id: 'profile', label: 'Profile' }]} />
        </Demo>
        <Demo label="Breadcrumbs — 2 levels" center={false}>
          <Breadcrumbs items={[{ id: 'users', label: 'Users', href: '/users' }, { id: 'alice', label: 'Alice Nguyen' }]} />
        </Demo>
      </div>
    </div>
  )
}

export function ToolbarSection() {
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left')
  return (
    <div className="space-y-6">
      <SectionHeader title="Toolbar" description="Keyboard-navigable toolbar container — arrow keys move focus between items." />
      <div className="grid grid-cols-1 gap-4">
        <Demo label="Text formatting toolbar" center={false}>
          <Toolbar aria-label="Text formatting">
            <ToggleButton isSelected={bold} onChange={setBold} size="sm" aria-label="Bold">
              <span className="font-bold text-xs px-0.5">B</span>
            </ToggleButton>
            <ToggleButton isSelected={italic} onChange={setItalic} size="sm" aria-label="Italic">
              <span className="italic text-xs px-0.5">I</span>
            </ToggleButton>
            <ToggleButton isSelected={underline} onChange={setUnderline} size="sm" aria-label="Underline">
              <span className="underline text-xs px-0.5">U</span>
            </ToggleButton>
            <ToolbarSeparator />
            {(['left', 'center', 'right'] as const).map(a => (
              <ToggleButton key={a} isSelected={align === a} onChange={() => setAlign(a)} size="sm" aria-label={`Align ${a}`}>
                <span className="text-xs px-0.5 capitalize">{a[0]}</span>
              </ToggleButton>
            ))}
            <ToolbarSeparator />
            <Button size="sm" variant="ghost" aria-label="Undo">↩</Button>
            <Button size="sm" variant="ghost" aria-label="Redo">↪</Button>
          </Toolbar>
          {(bold || italic || underline) && (
            <p className="text-xs text-fg-muted mt-2">
              Active: {[bold && 'Bold', italic && 'Italic', underline && 'Underline'].filter(Boolean).join(', ')} · Align: {align}
            </p>
          )}
        </Demo>
        <Demo label="Action toolbar" center={false}>
          <Toolbar aria-label="File actions">
            <Button size="sm" variant="ghost"><Plus className="w-3.5 h-3.5" /> New</Button>
            <Button size="sm" variant="ghost"><Download className="w-3.5 h-3.5" /> Export</Button>
            <ToolbarSeparator />
            <Button size="sm" variant="ghost" className="text-danger"><Trash2 className="w-3.5 h-3.5" /> Delete</Button>
          </Toolbar>
        </Demo>
      </div>
    </div>
  )
}
