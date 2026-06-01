import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'Form/Input',
  component: Input,
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { label: 'Full name', placeholder: 'John Doe' },
}

export const Email: Story = {
  args: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
}

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: '••••••••' },
}

export const WithDescription: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    description: 'Only letters, numbers, and underscores',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'not-an-email',
    errorMessage: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: { label: 'Disabled field', defaultValue: 'Read only value', isDisabled: true },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Input size="sm" label="Small" placeholder="Small input" />
      <Input size="md" label="Medium" placeholder="Medium input" />
      <Input size="lg" label="Large" placeholder="Large input" />
    </div>
  ),
}
