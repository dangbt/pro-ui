import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NavigationTree } from '../navigation-tree'
import type { NavigationTreeNode, NavigationTreeSectionDef } from '../navigation-tree'

const items: (NavigationTreeNode | NavigationTreeSectionDef)[] = [
  {
    title: 'Getting Started',
    items: [
      { id: 'intro', label: 'Introduction', href: '/docs/intro' },
      {
        id: 'guides',
        label: 'Guides',
        children: [
          { id: 'install', label: 'Installation', href: '/docs/install' },
          { id: 'config', label: 'Configuration', href: '/docs/config' },
        ],
      },
    ],
  },
  {
    title: 'Components',
    items: [{ id: 'button', label: 'Button', href: '/docs/button' }],
  },
]

describe('NavigationTree', () => {
  it('is exported as a function', () => {
    expect(typeof NavigationTree).toBe('function')
  })

  it('renders links with the correct href', () => {
    render(
      <NavigationTree
        aria-label="Docs navigation"
        items={items}
        defaultExpandedKeys={['guides']}
      />,
    )
    const intro = screen.getByRole('link', { name: 'Introduction' })
    expect(intro.getAttribute('href')).toBe('/docs/intro')

    const button = screen.getByRole('link', { name: 'Button' })
    expect(button.getAttribute('href')).toBe('/docs/button')
  })

  it('sets aria-current="page" on the matching link only', () => {
    render(
      <NavigationTree
        aria-label="Docs navigation"
        items={items}
        selectedRoute="/docs/button"
        defaultExpandedKeys={['guides']}
      />,
    )
    const current = screen.getByRole('link', { name: 'Button' })
    expect(current.getAttribute('aria-current')).toBe('page')

    const other = screen.getByRole('link', { name: 'Introduction' })
    expect(other.getAttribute('aria-current')).toBeNull()

    // Only one element has aria-current="page".
    const currentEls = document.querySelectorAll('[aria-current="page"]')
    expect(currentEls.length).toBe(1)
  })

  it('renders section header text', () => {
    render(<NavigationTree aria-label="Docs navigation" items={items} />)
    expect(screen.getByText('Getting Started')).toBeDefined()
    expect(screen.getByText('Components')).toBeDefined()
  })
})
