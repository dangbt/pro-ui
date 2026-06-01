import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menu } from './menu'
import { Button } from './button'
import { Edit, Copy, Trash2, MoreHorizontal } from 'lucide-react'

const meta: Meta = {
  title: 'Overlay/Menu',
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Menu
      trigger={<Button variant="ghost" size="sm"><MoreHorizontal size={16} /></Button>}
      items={[
        { id: 'edit', label: 'Edit', icon: <Edit size={14} /> },
        { id: 'duplicate', label: 'Duplicate', icon: <Copy size={14} /> },
        { id: 'delete', label: 'Delete', danger: true, icon: <Trash2 size={14} /> },
      ]}
    />
  ),
}

export const WithTextTrigger: Story = {
  render: () => (
    <Menu
      trigger={<Button variant="secondary">Actions</Button>}
      items={[
        { id: 'edit', label: 'Edit' },
        { id: 'duplicate', label: 'Duplicate' },
        { id: 'archive', label: 'Archive' },
        { id: 'delete', label: 'Delete', danger: true },
      ]}
    />
  ),
}
