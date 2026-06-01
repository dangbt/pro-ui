import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: { children: 'Enable notifications' },
}

export const Checked: Story = {
  args: { defaultSelected: true, children: 'Dark mode' },
}

export const Disabled: Story = {
  args: { isDisabled: true, children: 'Disabled setting' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch size="sm">Small switch</Switch>
      <Switch size="md">Medium switch</Switch>
      <Switch size="lg">Large switch</Switch>
    </div>
  ),
}
