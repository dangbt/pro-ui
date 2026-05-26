import { useState } from 'react'
import {
  Button, Badge, Alert, Card, Avatar, AvatarGroup,
  ProgressBar, Meter, Spinner, Skeleton, Divider, Link,
  Disclosure, Accordion, DropZone,
  ColorPicker, ColorSwatch, ColorSwatchPicker, ColorField, ColorSlider,
} from '../../components'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'

export function BadgeSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Badge" description="Small status indicators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Badge — all colors">
          <div className="flex flex-wrap gap-2">
            {(['default','primary','success','warning','danger','info'] as const).map(c => (
              <Badge key={c} size={size} color={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</Badge>
            ))}
          </div>
        </Demo>
        <Demo label="Badge — in context">
          <div className="flex flex-wrap items-center gap-2">
            <Button size={size} variant="secondary">
              Messages <Badge size={size} color="danger" className="ml-1">9+</Badge>
            </Button>
            <span className="text-sm text-gray-700">Status: <Badge size={size} color="success" className="ml-1">Online</Badge></span>
          </div>
        </Demo>
        <Demo label="Badge — sizes" className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <Badge size="sm" color="primary">Small</Badge>
            <Badge size="md" color="primary">Medium</Badge>
            <Badge size="lg" color="primary">Large</Badge>
            <Badge size="sm" color="success">Small</Badge>
            <Badge size="md" color="success">Medium</Badge>
            <Badge size="lg" color="success">Large</Badge>
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function AlertSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Alert" description="Contextual feedback messages for user actions." />
      <div className="space-y-3">
        <Demo label="Alert — info (with title + closable)" center={false}>
          <Alert variant="info" title="New version available" closable>
            pro-ui v0.2 is available. <a href="#" className="underline">See what's new →</a>
          </Alert>
        </Demo>
        <Demo label="Alert — success" center={false}>
          <Alert variant="success" title="Deployment successful" closable>
            Your changes are live at <code className="text-xs bg-success-100 text-success-700 px-1 rounded">pro-ui.vercel.app</code>
          </Alert>
        </Demo>
        <Demo label="Alert — warning" center={false}>
          <Alert variant="warning" closable>
            Your free plan expires in 7 days. Upgrade to keep access.
          </Alert>
        </Demo>
        <Demo label="Alert — danger" center={false}>
          <Alert variant="danger" title="Build failed">
            TypeScript error in <code className="text-xs bg-danger-100 text-danger-700 px-1 rounded">src/App.tsx:42</code>
          </Alert>
        </Demo>
      </div>
    </div>
  )
}

export function CardSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Card" description="Surface for grouping related content." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Card — with header" center={false}>
          <Card title="Recent activity" extra={<Badge size={size} color="primary">Live</Badge>} className="w-full">
            <p className="text-sm text-gray-500">3 events in the last hour.</p>
          </Card>
        </Demo>
        <Demo label="Card — metric" center={false}>
          <Card title="Revenue" shadow className="w-full">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">₫42M</span>
              <span className="text-sm text-success font-medium">↑ 8.2%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">vs last month</p>
          </Card>
        </Demo>
        <Demo label="Card — with footer" center={false}>
          <Card title="Confirm" footer={<div className="flex justify-end gap-2"><Button size={size} variant="secondary">Cancel</Button><Button size={size} variant="primary">Apply</Button></div>} className="w-full">
            <p className="text-sm text-gray-500">Apply these settings to all projects?</p>
          </Card>
        </Demo>
      </div>
    </div>
  )
}

export function AvatarSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Avatar" description="User profile images with automatic initials and color generation." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Avatar — sizes">
          <div className="flex items-end gap-3">
            {(['xs','sm','md','lg','xl'] as const).map(s => (
              <Avatar key={s} name="Alice Nguyen" size={s} />
            ))}
          </div>
        </Demo>
        <Demo label="Avatar — shapes">
          <div className="flex items-center gap-3">
            <Avatar name="Bob Tran" size="lg" shape="circle" />
            <Avatar name="Carol Le" size="lg" shape="square" />
            <Avatar size="lg" shape="circle" />
            <Avatar size="lg" shape="square" />
          </div>
        </Demo>
        <Demo label="Avatar — color generation">
          <div className="flex flex-wrap gap-2">
            {['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do','Grace Bui','Hank Vu'].map(n => (
              <Avatar key={n} name={n} size="md" />
            ))}
          </div>
        </Demo>
        <Demo label="AvatarGroup — max overflow">
          <div className="space-y-3">
            <AvatarGroup size="md" max={4} avatars={['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do'].map(n => ({ name: n }))} />
            <AvatarGroup size="sm" max={5} avatars={['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do','Grace Bui'].map(n => ({ name: n }))} />
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function ProgressSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Progress & Meter" description="ProgressBar for tasks/loading, Meter for capacity/usage with auto color zones." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="ProgressBar — variants" center={false} className="space-y-4 !py-6">
          <ProgressBar label="Upload"  value={65} maxValue={100} variant="primary" showValue />
          <ProgressBar label="CPU"     value={88} maxValue={100} variant="danger"  showValue />
          <ProgressBar label="Storage" value={42} maxValue={100} variant="warning" size="sm" showValue />
          <ProgressBar label="Tasks"   value={73} maxValue={100} variant="success" showValue />
        </Demo>
        <Demo label="Meter — auto color (green→yellow→red)" center={false} className="space-y-4 !py-6">
          <Meter label="Disk usage"   value={25}  maxValue={100} />
          <Meter label="RAM"          value={62}  maxValue={100} />
          <Meter label="CPU"          value={91}  maxValue={100} />
          <Meter label="Network"      value={48}  maxValue={100} size="sm" />
        </Demo>
        <Demo label="Meter — fixed variants" center={false} className="space-y-4 !py-6">
          <Meter label="Primary"  value={70} maxValue={100} variant="primary" />
          <Meter label="Success"  value={55} maxValue={100} variant="success" />
          <Meter label="Warning"  value={75} maxValue={100} variant="warning" />
          <Meter label="Danger"   value={90} maxValue={100} variant="danger"  />
        </Demo>
        <Demo label="Spinner — sizes & variants">
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <div className="flex items-center gap-4">
              <Spinner label="Loading data..." />
              <div className="flex items-center justify-center w-28 h-9 bg-primary rounded-[var(--base-radius)]">
                <Spinner size="sm" variant="white" label="" />
                <span className="text-white text-sm ml-2">Saving</span>
              </div>
            </div>
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function SkeletonSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Skeleton & Divider" description="Loading placeholders and visual separators." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Skeleton — article card" center={false}>
          <div className="w-full flex items-start gap-3">
            <Skeleton variant="circle" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="text" lines={3} />
            </div>
          </div>
        </Demo>
        <Demo label="Skeleton — image card" center={false}>
          <div className="w-full space-y-3">
            <Skeleton height={100} />
            <Skeleton variant="text" lines={2} />
          </div>
        </Demo>
        <Demo label="Divider — horizontal" center={false}>
          <div className="w-full space-y-3 text-sm text-gray-500">
            <div>Content above</div>
            <Divider />
            <div>Content below</div>
            <Divider label="OR" />
            <div>Below OR divider</div>
          </div>
        </Demo>
        <Demo label="Divider — vertical">
          <div className="flex items-stretch h-12 gap-4 text-sm text-gray-600">
            <span className="flex items-center">Left</span>
            <Divider orientation="vertical" />
            <span className="flex items-center">Middle</span>
            <Divider orientation="vertical" />
            <span className="flex items-center">Right</span>
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function DisclosureSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Disclosure" description="Collapsible content panels — standalone or grouped as an Accordion." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Standalone</p>
          <Disclosure title="What is React Aria?">
            React Aria is a library of unstyled, accessible UI components built by Adobe. It handles all the keyboard interactions, screen reader support, and accessibility semantics so you can focus on styling.
          </Disclosure>
          <Disclosure title="Is it production-ready?" defaultExpanded>
            Yes! React Aria is used in Adobe's own products and is battle-tested for accessibility compliance, including WCAG 2.1 and ARIA 1.2 patterns.
          </Disclosure>
          <Disclosure title="Does it work with Tailwind?">
            Absolutely. Pro UI wraps React Aria with Tailwind CSS v4 classes, providing ready-to-use styled components that you can customise via CSS variables.
          </Disclosure>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accordion (single open)</p>
          <Accordion>
            <Disclosure title="Section 1 — Getting started">
              Install the package, import the Tailwind entry point, and set <code className="bg-gray-100 px-1 rounded text-xs">--primary</code> in your CSS.
            </Disclosure>
            <Disclosure title="Section 2 — Theming">
              Override <code className="bg-gray-100 px-1 rounded text-xs">--primary</code> and <code className="bg-gray-100 px-1 rounded text-xs">--base-radius</code> to retheme the entire library — all palettes are derived automatically.
            </Disclosure>
            <Disclosure title="Section 3 — ProTable & ProForm">
              ProTable gives you server-side pagination, sort, column visibility, and pinning out of the box. ProForm wraps react-hook-form with Zod validation.
            </Disclosure>
          </Accordion>
        </div>

        <div className="sm:col-span-2 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accordion — multiple open</p>
          <Accordion allowsMultipleExpanded>
            <Disclosure title="Can multiple panels be open?">Yes — pass <code className="bg-gray-100 px-1 rounded text-xs">allowsMultipleExpanded</code> to the Accordion.</Disclosure>
            <Disclosure title="Is keyboard navigation supported?">Yes — Tab moves focus, Enter/Space toggles the panel. React Aria handles all interactions automatically.</Disclosure>
            <Disclosure title="Can I nest accordions?">You can nest Disclosure components but avoid nesting Accordion inside Accordion — it creates confusing UX.</Disclosure>
          </Accordion>
        </div>

      </div>
    </div>
  )
}

export function LinkSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Link" description="Accessible link built on React Aria — supports variants, external navigation, and router integration." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="Variants">
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="#">Default link</Link>
            <Link href="#" variant="muted">Muted link</Link>
            <Link href="#" variant="danger">Danger link</Link>
          </div>
        </Demo>

        <Demo label="External (opens in new tab)">
          <Link href="https://react-spectrum.adobe.com/react-aria/" target="_blank" rel="noopener noreferrer">
            React Aria docs ↗
          </Link>
        </Demo>

        <Demo label="Inline in text" center={false}>
          <p className="text-sm text-gray-600 leading-relaxed">
            This component is built on{' '}
            <Link href="#">React Aria Components</Link>
            {' '}and styled with{' '}
            <Link href="#" variant="muted">Tailwind CSS v4</Link>.
            All interactions are keyboard-accessible and screen-reader friendly.
            See the <Link href="#" variant="danger">deprecation notice</Link> for older APIs.
          </p>
        </Demo>

        <Demo label="As button (no href)">
          <div className="flex gap-4 text-sm">
            <Link onPress={() => alert('clicked!')}>Press me</Link>
            <Link isDisabled>Disabled link</Link>
          </div>
        </Demo>

      </div>
    </div>
  )
}

export function DropZoneSection() {
  const [files, setFiles] = useState<string[]>([])
  return (
    <div className="space-y-6">
      <SectionHeader title="Drop Zone" description="Drag-and-drop file target area with click-to-browse fallback via FileTrigger." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Basic drop zone" center={false}>
          <DropZone
            label="Drop files here or click to browse"
            description="Any file type accepted"
            onFiles={(fl) => setFiles(Array.from(fl).map(f => f.name))}
          />
          {files.length > 0 && (
            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
              {files.map(f => <div key={f} className="font-mono">{f}</div>)}
            </div>
          )}
        </Demo>
        <Demo label="Images only" center={false}>
          <DropZone
            label="Drop images or click to browse"
            description="PNG, JPG, GIF up to 10 MB"
            accept={['image/*']}
          />
        </Demo>
      </div>
    </div>
  )
}

export function ColorPickerSection() {
  const PRESETS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff']
  return (
    <div className="space-y-6">
      <SectionHeader title="Color Picker" description="Full color picker suite: area picker, hue wheel, channel sliders, hex field, and swatch palettes." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Full color picker" center={false}>
          <ColorPicker label="Brand color" defaultValue="#008060" presetColors={PRESETS} />
        </Demo>
        <Demo label="Swatch palette" center={false}>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-600">Pick a preset</span>
            <ColorSwatchPicker colors={PRESETS} swatchSize="lg" />
          </div>
        </Demo>
        <Demo label="Color swatches (display)" center={false}>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(c => <ColorSwatch key={c} color={c} size="lg" />)}
          </div>
        </Demo>
        <Demo label="Hex color field" center={false}>
          <ColorField label="Hex value" defaultValue="#3b82f6" />
        </Demo>
        <Demo label="Hue slider" center={false}>
          <ColorSlider defaultValue="hsl(200, 100%, 50%)" channel="hue" label="Hue" />
        </Demo>
        <Demo label="Saturation slider" center={false}>
          <ColorSlider defaultValue="hsl(200, 75%, 50%)" colorSpace="hsl" channel="saturation" label="Saturation" />
        </Demo>
      </div>
    </div>
  )
}
