import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './progress-bar'

const meta: Meta<typeof ProgressBar> = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  args: { label: 'Upload progress', value: 65, showValue: true },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <ProgressBar label="Primary" value={40} showValue variant="primary" />
      <ProgressBar label="Success" value={100} showValue variant="success" />
      <ProgressBar label="Warning" value={70} showValue variant="warning" />
      <ProgressBar label="Danger" value={90} showValue variant="danger" />
    </div>
  ),
}

export const Indeterminate: Story = {
  args: { label: 'Processing...', isIndeterminate: true },
}
