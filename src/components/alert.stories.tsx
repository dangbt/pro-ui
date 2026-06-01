import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './alert'

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
}

export default meta
type Story = StoryObj<typeof Alert>

export const Info: Story = {
  args: { variant: 'info', title: 'Information', children: 'Your session will expire in 30 minutes.' },
}

export const Success: Story = {
  args: { variant: 'success', title: 'Saved', children: 'Your changes have been saved successfully.' },
}

export const Warning: Story = {
  args: { variant: 'warning', title: 'Warning', children: 'Your trial expires in 3 days.' },
}

export const Danger: Story = {
  args: { variant: 'danger', title: 'Error', children: 'Failed to save changes. Please try again.' },
}

export const Closable: Story = {
  args: { variant: 'warning', closable: true, children: 'This alert can be dismissed.' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Alert variant="info">Info message</Alert>
      <Alert variant="success">Success message</Alert>
      <Alert variant="warning">Warning message</Alert>
      <Alert variant="danger">Error message</Alert>
    </div>
  ),
}
