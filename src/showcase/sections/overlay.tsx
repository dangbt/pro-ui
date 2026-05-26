import { useState } from 'react'
import {
  Button, Input, Select, Modal, ConfirmModal, Tooltip, Menu, Popover,
} from '../../components'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'

export function ModalSection() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="Modal & Dialog" description="Accessible dialogs with focus management via React Aria." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Demo label="Modal — form">
          <Button size={size} variant="primary" onPress={() => setOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={open}
            onOpenChange={setOpen}
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
          <Button size={size} variant="danger" onPress={() => setConfirm(true)}>Delete Account</Button>
          <ConfirmModal
            isOpen={confirm}
            onOpenChange={setConfirm}
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
            <button className="w-7 h-7 rounded-full border border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-colors text-sm flex items-center justify-center">?</button>
          </Tooltip>
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
      </div>
    </div>
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
            <p className="text-sm text-gray-700 font-medium mb-1">Popover title</p>
            <p className="text-xs text-gray-500">This is a popover with arbitrary content. Click outside to close.</p>
          </Popover>
        </Demo>
        <Demo label="With arrow">
          <Popover
            triggerElement={<Button size={size} variant="secondary">With arrow</Button>}
            placement="bottom"
            showArrow
          >
            <p className="text-sm text-gray-600">Content with arrow indicator.</p>
          </Popover>
        </Demo>
        <Demo label="Placement top">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Top placement</Button>}
            placement="top"
          >
            <p className="text-sm text-gray-600">Placed above the trigger.</p>
          </Popover>
        </Demo>
        <Demo label="Placement right">
          <Popover
            triggerElement={<Button size={size} variant="secondary">Right placement</Button>}
            placement="right"
          >
            <p className="text-sm text-gray-600">Placed to the right.</p>
          </Popover>
        </Demo>
      </div>
    </div>
  )
}
