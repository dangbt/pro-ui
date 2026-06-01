import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Display/Tabs',
  component: Tabs,
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs
      defaultSelectedKey="overview"
      items={[
        { id: 'overview', label: 'Overview', content: <p className="text-sm text-fg-2">Overview content here.</p> },
        { id: 'activity', label: 'Activity', content: <p className="text-sm text-fg-2">Activity feed here.</p> },
        { id: 'settings', label: 'Settings', content: <p className="text-sm text-fg-2">Settings panel here.</p> },
      ]}
    />
  ),
}

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs
      defaultSelectedKey="general"
      items={[
        { id: 'general', label: 'General', content: <p className="text-sm text-fg-2">General settings.</p> },
        { id: 'billing', label: 'Billing', content: <p className="text-sm text-fg-2">Billing settings.</p> },
        { id: 'advanced', label: 'Advanced', disabled: true, content: <p className="text-sm text-fg-2">Advanced settings.</p> },
      ]}
    />
  ),
}
