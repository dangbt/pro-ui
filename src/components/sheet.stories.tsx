import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet } from './sheet'
import { Button } from './button'

const meta: Meta = { title: 'Overlay/Sheet' }
export default meta
type Story = StoryObj

const body = <p>Swipe, press Escape or use the close button to dismiss.</p>

export const BottomSnapPoints: Story = {
  render: () => (
    <Sheet
      title="Snap points"
      position="bottom"
      size="xl"
      snapPoints={['40%', '100%']}
      triggerElement={<Button variant="primary">Open bottom sheet</Button>}
    >
      {body}
    </Sheet>
  ),
}

export const LeftRight: Story = {
  render: () => (
    <div className="flex gap-2">
      {(['left', 'right'] as const).map(position => (
        <Sheet
          key={position}
          title={`${position} sheet`}
          position={position}
          triggerElement={<Button variant="secondary">{position}</Button>}
        >
          {body}
        </Sheet>
      ))}
    </div>
  ),
}

export const Center: Story = {
  render: () => (
    <Sheet
      title="Center sheet"
      position="center"
      showHandle={false}
      triggerElement={<Button variant="secondary">Open center</Button>}
      footer={({ close }) => <Button variant="primary" onPress={close}>Done</Button>}
    >
      {body}
    </Sheet>
  ),
}

export const Stacked: Story = {
  render: () => (
    <Sheet
      title="First sheet"
      size="lg"
      triggerElement={<Button variant="primary">Open first</Button>}
    >
      <div className="flex flex-col gap-3">
        {body}
        <Sheet
          title="Second sheet"
          size="md"
          triggerElement={<Button variant="secondary">Open second</Button>}
        >
          <p>Nested sheet in the stack.</p>
        </Sheet>
      </div>
    </Sheet>
  ),
}
