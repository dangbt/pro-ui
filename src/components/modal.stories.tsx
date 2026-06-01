import type { Meta, StoryObj } from '@storybook/react-vite'
import { Modal, ConfirmModal } from './modal'
import { Button } from './button'
import { DialogTrigger } from 'react-aria-components'

const meta: Meta = {
  title: 'Overlay/Modal',
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="primary">Open Modal</Button>
      <Modal title="Edit User">
        <p className="text-sm text-fg-2">Modal body content goes here.</p>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="ghost" slot="close">Cancel</Button>
          <Button variant="primary" onPress={() => {}}>Save</Button>
        </div>
      </Modal>
    </DialogTrigger>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
        <DialogTrigger key={size}>
          <Button variant="secondary">{size.toUpperCase()}</Button>
          <Modal title={`${size.toUpperCase()} Modal`} size={size}>
            <p className="text-sm text-fg-2">This is a {size} modal.</p>
          </Modal>
        </DialogTrigger>
      ))}
    </div>
  ),
}

export const Confirm: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="danger">Delete Item</Button>
      <ConfirmModal
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => alert('Deleted!')}
      />
    </DialogTrigger>
  ),
}
