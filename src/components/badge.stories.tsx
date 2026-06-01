import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta<typeof Badge> = {
  title: 'Display/Badge',
  component: Badge,
  args: { children: 'Badge' },
}

export default meta
type Story = StoryObj<typeof Badge>

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="default">Default</Badge>
      <Badge color="primary">Primary</Badge>
      <Badge color="success">Active</Badge>
      <Badge color="warning">Pending</Badge>
      <Badge color="danger">Inactive</Badge>
      <Badge color="info">Draft</Badge>
    </div>
  ),
}
