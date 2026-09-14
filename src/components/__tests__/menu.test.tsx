import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import { Menu } from '../menu'
import { Button } from '../button'

// jsdom lacks CSS.escape (used by React Aria's selection manager) and
// IntersectionObserver (used by MenuLoadMoreItem's load-more sentinel).
// Polyfill both so the menu can mount.
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    // @ts-expect-error minimal shim
    globalThis.CSS = {}
  }
  if (typeof globalThis.CSS.escape !== 'function') {
    globalThis.CSS.escape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&')
  }
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    class IO {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
      root = null
      rootMargin = ''
      thresholds = []
    }
    globalThis.IntersectionObserver = IO as unknown as typeof IntersectionObserver
  }
})

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
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
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
