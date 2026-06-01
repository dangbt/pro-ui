import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './card'
import { Button } from './button'

const meta: Meta<typeof Card> = {
  title: 'Display/Card',
  component: Card,
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <p className="text-sm text-fg-2">Card body content goes here.</p>,
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Account Settings',
    children: <p className="text-sm text-fg-2">Manage your account preferences here.</p>,
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Confirm Action',
    children: <p className="text-sm text-fg-2">Are you sure you want to proceed?</p>,
    footer: (
      <div className="flex gap-2 justify-end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </div>
    ),
  },
}

export const WithShadow: Story = {
  args: {
    title: 'Elevated Card',
    shadow: true,
    children: <p className="text-sm text-fg-2">This card has a shadow.</p>,
  },
}
