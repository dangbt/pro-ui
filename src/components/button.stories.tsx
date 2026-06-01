import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'
import { Plus, Trash2, Save } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Form/Button',
  component: Button,
  args: {
    children: 'Button',
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Edit' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary" onPress={() => {}}><Plus size={16} /> Add</Button>
      <Button variant="ghost" onPress={() => {}}><Save size={16} /> Save</Button>
      <Button variant="danger" onPress={() => {}}><Trash2 size={16} /> Delete</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  ),
}

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving...' },
}

export const Disabled: Story = {
  args: { variant: 'primary', isDisabled: true, children: 'Disabled' },
}
