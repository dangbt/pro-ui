import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Menu } from '../menu'
import { Button } from '../button'

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Open' }))
}

describe('Menu — empty state & loading', () => {
  it('renders items when provided', () => {
    render(
      <Menu
        trigger={<Button>Open</Button>}
        items={[{ id: 'edit', label: 'Edit' }]}
      />,
    )
    openMenu()
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeDefined()
  })

  it('shows default "No items" empty state when items is empty', () => {
    render(<Menu trigger={<Button>Open</Button>} items={[]} />)
    openMenu()
    expect(screen.getByText('No items')).toBeDefined()
  })

  it('renders custom emptyContent when items is empty', () => {
    render(
      <Menu
        trigger={<Button>Open</Button>}
        items={[]}
        emptyContent="Nothing here"
      />,
    )
    openMenu()
    expect(screen.getByText('Nothing here')).toBeDefined()
  })

  it('shows a spinner (role=status) in the empty state while loading', () => {
    render(
      <Menu
        trigger={<Button>Open</Button>}
        items={[]}
        isLoading
        onLoadMore={() => {}}
      />,
    )
    openMenu()
    expect(screen.queryByText('No items')).toBeNull()
    expect(screen.getAllByRole('status')).toHaveLength(1)
  })

  it('renders a load-more spinner when onLoadMore + isLoading with items', () => {
    render(
      <Menu
        trigger={<Button>Open</Button>}
        items={[{ id: 'a', label: 'Alpha' }]}
        isLoading
        onLoadMore={() => {}}
      />,
    )
    openMenu()
    expect(screen.getByRole('menuitem', { name: 'Alpha' })).toBeDefined()
    expect(screen.getByRole('status')).toBeDefined()
  })
})
