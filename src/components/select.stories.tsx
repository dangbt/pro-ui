import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './select'

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
}

export default meta
type Story = StoryObj<typeof Select>

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

export const Default: Story = {
  args: {
    label: 'Role',
    placeholder: 'Select a role',
    options: roleOptions,
  },
}

export const Invalid: Story = {
  args: {
    label: 'Role',
    options: roleOptions,
    isInvalid: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Role',
    options: roleOptions,
    isDisabled: true,
  },
}
