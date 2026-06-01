import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarGroup } from './avatar'

const meta: Meta = {
  title: 'Display/Avatar',
}

export default meta
type Story = StoryObj

export const WithInitials: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Avatar name="John Doe" size="sm" />
      <Avatar name="Jane Smith" size="md" />
      <Avatar name="Bob Johnson" size="lg" />
      <Avatar name="Alice Brown" size="xl" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup
      max={3}
      avatars={[
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
        { name: 'Diana' },
        { name: 'Eve' },
      ]}
    />
  ),
}
