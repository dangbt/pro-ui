import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup } from './radio-group'

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  args: {
    label: 'Billing Cycle',
    options: [
      { value: 'monthly', label: 'Monthly', description: '$9/month' },
      { value: 'yearly', label: 'Yearly', description: '$90/year — save 17%' },
    ],
    defaultValue: 'monthly',
  },
}

export const Horizontal: Story = {
  args: {
    label: 'Status',
    orientation: 'horizontal',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
}
