import { useState, useCallback, useRef } from 'react'
import {
  Button, Input, Select, Modal, ConfirmModal, Drawer, Tooltip, Menu, Popover, PreviewCard, Avatar, Link, toast,
} from '../../components'
import type { MenuItemDef } from '../../components'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'

export function ModalSection() {
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="Modal & Dialog" description="Accessible dialogs with focus management via React Aria." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Modal — form">
          <Modal
            triggerElement={<Button size={size} variant="primary">Open Modal</Button>}
            title="Edit Profile"
            footer={({ close }) => (
              <>
                <Button size={size} variant="secondary" onPress={close}>Cancel</Button>
                <Button size={size} variant="primary" onPress={close}>Save changes</Button>
              </>
            )}
          >
            <div className="space-y-4">
              <Input size={size} label="Display name" defaultValue="Alice Nguyen" />
              <Input size={size} label="Email" defaultValue="alice@example.com" />
              <Select size={size} label="Role" defaultSelectedKey="editor"
                options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }]}
              />
            </div>
          </Modal>
        </Demo>
        <Demo label="ConfirmModal — danger">
          <ConfirmModal
            triggerElement={<Button size={size} variant="danger">Delete Account</Button>}
            title="Delete Account"
            description="This action is permanent. All data will be removed."
            confirmLabel="Yes, delete"
            danger
            onConfirm={() => alert('Deleted')}
          />
        </Demo>
      </div>
    </div>
  )
}

export function ToastSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Toast / Notification" description="Global notifications triggered imperatively — works inside and outside the React tree. Mount &lt;ToastProvider /&gt; once at your app root." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Variants">
          <div className="flex flex-wrap gap-2">
            <Button size={size} variant="secondary" onPress={() => toast.success('Changes saved successfully')}>Success</Button>
            <Button size={size} variant="secondary" onPress={() => toast.error('Something went wrong', { title: 'Error' })}>Error</Button>
            <Button size={size} variant="secondary" onPress={() => toast.warning('Session expires in 5 minutes')}>Warning</Button>
            <Button size={size} variant="secondary" onPress={() => toast.info('New version available')}>Info</Button>
          </div>
        </Demo>
        <Demo label="With title">
          <div className="flex flex-wrap gap-2">
            <Button size={size} variant="primary" onPress={() => toast.success('Your file has been uploaded.', { title: 'Upload complete' })}>
              With title
            </Button>
            <Button size={size} variant="secondary" onPress={() => toast.custom('This notification stays until dismissed.', { variant: 'info', title: 'Persistent', duration: 0 })}>
              Persistent
            </Button>
          </div>
        </Demo>
      </div>
    </div>
  )
}

export function TooltipSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Tooltip" description="Hover-triggered informational overlays." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="placement: top (default)">
          <Tooltip content="Tooltip on top"><Button size={size} variant="secondary">Hover me</Button></Tooltip>
        </Demo>
        <Demo label="placement: bottom">
          <Tooltip content="Tooltip on bottom" placement="bottom"><Button size={size} variant="secondary">Bottom</Button></Tooltip>
        </Demo>
        <Demo label="delay: 0">
          <Tooltip content="Instant tooltip" delay={0}><Button size={size} variant="secondary">No delay</Button></Tooltip>
        </Demo>
        <Demo label="long content">
          <Tooltip content="This is a longer tooltip message that wraps across lines.">
            <Button size={size} variant="ghost">Long content</Button>
          </Tooltip>
        </Demo>
        <Demo label="trigger: icon button">
          <Tooltip content="More information">
            <button className="w-7 h-7 rounded-full border border-border text-fg-disabled hover:border-primary hover:text-primary transition-colors text-sm flex items-center justify-center">?</button>
          </Tooltip>
        </Demo>
      </div>
    </div>
  )
}

/** GitHub-style user preview card: avatar, name, bio, Follow button. */
function UserPreviewCard() {
  const size = useShowcaseSize()
  return (
    <div className="w-64">
      <div className="flex items-start gap-3">
        <Avatar size="lg" name="Dâng Bùi Tấn" src="https://avatars.githubusercontent.com/u/1?v=4" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fg leading-tight">Dâng Bùi Tấn</p>
          <p className="text-xs text-fg-muted">@dangbt</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-fg-2">
        Building pro-ui — an AI-native React component library on React Aria &amp; Tailwind v4.
      </p>
      <div className="mt-2 flex items-center gap-3 text-xs text-fg-muted">
        <span><span className="font-semibold text-fg-2">128</span> followers</span>
        <span><span className="font-semibold text-fg-2">42</span> following</span>
      </div>
      <div className="mt-3">
        <Button size={size} variant="primary" className="w-full" onPress={() => alert('Followed!')}>
          Follow
        </Button>
      </div>
    </div>
  )
}

export function PreviewCardSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="PreviewCard"
        description="A popover that opens on hover, focus, or long-press — unlike a tooltip, it may contain interactive content (links, buttons)."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="User preview (hover / focus the link)">
          <p className="text-sm text-fg-2">
            Follow{' '}
            <PreviewCard content={<UserPreviewCard />}>
              <Link>@dangbt</Link>
            </PreviewCard>{' '}
            for updates.
          </p>
        </Demo>
        <Demo label="With arrow · placement top">
          <p className="text-sm text-fg-2">
            Maintained by{' '}
            <PreviewCard content={<UserPreviewCard />} placement="top" showArrow>
              <Link>@dangbt</Link>
            </PreviewCard>
            .
          </p>
        </Demo>
      </div>
    </div>
  )
}

export function MenuSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Dropdown Menu" description="Contextual action menus with keyboard navigation." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Menu — with icons & shortcut">
          <Menu
            trigger={<Button size={size} variant="secondary">Actions ▾</Button>}
            items={[
              { id: 'edit', label: 'Edit', shortcut: '⌘E' },
              { id: 'dup',  label: 'Duplicate', shortcut: '⌘D' },
              { id: 'sep',  label: '', separator: true },
              { id: 'del',  label: 'Delete', shortcut: '⌫', danger: true },
            ]}
            onAction={k => alert(String(k))}
          />
        </Demo>
        <Demo label="Menu — more options">
          <Menu
            trigger={<Button size={size} variant="ghost">⋯ More</Button>}
            items={[
              { id: 'share',  label: 'Share link'   },
              { id: 'export', label: 'Export as CSV' },
              { id: 'print',  label: 'Print', disabled: true },
            ]}
            onAction={k => alert(String(k))}
          />
        </Demo>
        <Demo label="Menu — async load more">
          <AsyncMenuDemo size={size} />
        </Demo>
      </div>
    </div>
  )
}

/** Loads 3 pages of fake items page-by-page as you scroll the menu. */
function AsyncMenuDemo({ size }: { size: ReturnType<typeof useShowcaseSize> }) {
  const TOTAL_PAGES = 3
  const PAGE_SIZE = 8
  const [items, setItems] = useState<MenuItemDef[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const pageRef = useRef(0)

  const loadMore = useCallback(() => {
    if (isLoading || pageRef.current >= TOTAL_PAGES) return
    setIsLoading(true)
    const nextPage = pageRef.current + 1
    // Simulate a network request with latency.
    setTimeout(() => {
      const start = pageRef.current * PAGE_SIZE
      const newItems: MenuItemDef[] = Array.from({ length: PAGE_SIZE }, (_, i) => ({
        id: `item-${start + i}`,
        label: `Item ${start + i + 1}`,
      }))
      pageRef.current = nextPage
      setItems(prev => [...prev, ...newItems])
      setIsLoading(false)
    }, 700)
  }, [isLoading])

  return (
    <Menu
      trigger={<Button size={size} variant="secondary">Async ▾</Button>}
      items={items}
      isLoading={isLoading}
      onLoadMore={loadMore}
      emptyContent="No items yet"
      onAction={k => alert(String(k))}
    />
  )
}

export function PopoverSection() {
  const size = useShowcaseSize()
  return (
    <div className="space-y-6">
      <SectionHeader title="Popover" description="Floating content panel positioned relative to a trigger — no backdrop, no scroll lock." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Basic popover">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Open popover</Button>}
            placement="bottom"
          >
            <p className="text-sm text-fg-2 font-medium mb-1">Popover title</p>
            <p className="text-xs text-fg-muted">This is a popover with arbitrary content. Click outside to close.</p>
          </Popover>
        </Demo>
        <Demo label="With arrow">
          <Popover
            triggerElement={<Button size={size} variant="secondary">With arrow</Button>}
            placement="bottom"
            showArrow
          >
            <p className="text-sm text-fg-muted">Content with arrow indicator.</p>
          </Popover>
        </Demo>
        <Demo label="Placement top">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Top placement</Button>}
            placement="top"
          >
            <p className="text-sm text-fg-muted">Placed above the trigger.</p>
          </Popover>
        </Demo>
        <Demo label="Placement right">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Right placement</Button>}
            placement="right"
          >
            <p className="text-sm text-fg-muted">Placed to the right.</p>
          </Popover>
        </Demo>
      </div>
    </div>
  )
}

export function DrawerSection() {
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Drawer"
        description="Slide-in panel from any edge — right, left, or bottom. Same children/footer API as Modal."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <Demo label="placement: right (default)">
          <Drawer
            triggerElement={<Button size={size} variant="primary">Open right drawer</Button>}
            title="Right Drawer"
            placement="right"
            footer={({ close }) => (
              <>
                <Button size={size} variant="secondary" onPress={close}>Cancel</Button>
                <Button size={size} variant="primary" onPress={close}>Save</Button>
              </>
            )}
          >
            <p className="text-sm text-fg-muted">This drawer slides in from the right. It's great for edit panels, detail views, and settings.</p>
            <div className="mt-4 space-y-3">
              <Input size={size} label="Full name" defaultValue="Alice Nguyen" />
              <Input size={size} label="Email" defaultValue="alice@example.com" />
              <Select size={size} label="Role" defaultSelectedKey="editor"
                options={[{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }]}
              />
            </div>
          </Drawer>
        </Demo>

        <Demo label="placement: left">
          <Drawer
            triggerElement={<Button size={size} variant="secondary">Open left drawer</Button>}
            title="Left Drawer"
            placement="left"
          >
            <p className="text-sm text-fg-muted">Slides in from the left — typically used for navigation menus or filters.</p>
          </Drawer>
        </Demo>

        <Demo label="placement: bottom">
          <Drawer
            triggerElement={<Button size={size} variant="secondary">Open bottom sheet</Button>}
            title="Bottom Sheet"
            placement="bottom"
            size="md"
          >
            <p className="text-sm text-fg-muted">Slides up from the bottom. Common on mobile for action sheets and quick forms.</p>
          </Drawer>
        </Demo>

        <Demo label="size: lg">
          <Drawer
            triggerElement={<Button size={size} variant="secondary">Large drawer</Button>}
            title="Large Drawer"
            size="lg"
          >
            <p className="text-sm text-fg-muted">Use <code className="bg-surface-subtle px-1 rounded text-xs">size="lg"</code> (480 px) for complex edit forms.</p>
          </Drawer>
        </Demo>

        <Demo label="withOverlay: false">
          <Drawer
            triggerElement={<Button size={size} variant="ghost">No backdrop</Button>}
            title="No Overlay"
            withOverlay={false}
          >
            <p className="text-sm text-fg-muted">Pass <code className="bg-surface-subtle px-1 rounded text-xs">withOverlay={'{false}'}</code> to skip the dark backdrop — click outside still closes.</p>
          </Drawer>
        </Demo>

      </div>
    </div>
  )
}
