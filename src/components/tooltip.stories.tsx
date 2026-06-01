import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './tooltip'
import { Button } from './button'
import { Info, HelpCircle, Settings } from 'lucide-react'

const meta: Meta = {
  title: 'Overlay/Tooltip',
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tooltip content="This field is required for compliance">
      <Button variant="ghost" size="sm"><Info size={16} /></Button>
    </Tooltip>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="flex gap-8 items-center p-12">
      <Tooltip content="Top tooltip" placement="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button variant="secondary" size="sm">Left</Button>
      </Tooltip>
    </div>
  ),
}
