import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './link'

const meta: Meta<typeof Link> = {
  title: 'Navigation/Link',
  component: Link,
  args: { children: 'Link', href: '#' },
}

export default meta
type Story = StoryObj<typeof Link>

export const Default: Story = {}

export const ActiveState: Story = {
  render: () => (
    <nav className="flex flex-col gap-2">
      {(['default', 'muted', 'danger'] as const).map(variant => (
        <div key={variant} className="flex gap-4">
          <Link href="#" variant={variant}>{variant}</Link>
          <Link href="#" variant={variant} aria-current="page">{variant} (current)</Link>
        </div>
      ))}
    </nav>
  ),
}
