import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox, CheckboxGroup } from './checkbox'

const meta: Meta = {
  title: 'Form/Checkbox',
}

export default meta
type Story = StoryObj

export const Single: Story = {
  render: () => <Checkbox>Accept terms and conditions</Checkbox>,
}

export const Checked: Story = {
  render: () => <Checkbox defaultSelected>Email notifications</Checkbox>,
}

export const Disabled: Story = {
  render: () => <Checkbox isDisabled>Disabled option</Checkbox>,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Checkbox size="sm">Small checkbox</Checkbox>
      <Checkbox size="md">Medium checkbox</Checkbox>
      <Checkbox size="lg">Large checkbox</Checkbox>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      label="Notifications"
      options={[
        { value: 'email', label: 'Email notifications' },
        { value: 'sms', label: 'SMS notifications' },
        { value: 'push', label: 'Push notifications' },
        { value: 'marketing', label: 'Marketing emails', disabled: true },
      ]}
      defaultValue={['email']}
    />
  ),
}

export const GroupHorizontal: Story = {
  render: () => (
    <CheckboxGroup
      label="Tags"
      orientation="horizontal"
      options={[
        { value: 'react', label: 'React' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'tailwind', label: 'Tailwind' },
      ]}
    />
  ),
}
