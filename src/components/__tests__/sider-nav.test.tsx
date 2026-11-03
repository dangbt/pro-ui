import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Layout } from '../layout'

function Nav({ collapsed }: { collapsed: boolean }) {
  return (
    <Layout.Sider collapsed={collapsed}>
      <Layout.Nav>
        <Layout.Nav.Group label="Main">
          <Layout.Nav.Item icon={<i />} label="Home" />
        </Layout.Nav.Group>
      </Layout.Nav>
    </Layout.Sider>
  )
}

function snapshot(container: HTMLElement) {
  const header = container.querySelector('[data-slot="sider-group-header"]') as HTMLElement
  const item = container.querySelector('li > button') as HTMLElement
  return { header: header.className, item: item.className.split(' ').filter(c => /^h-/.test(c)) }
}

describe('Layout.Nav group/item slots', () => {
  it('keeps header slot and item height identical across collapse states', () => {
    const a = render(<Nav collapsed={false} />)
    const expanded = snapshot(a.container)
    a.unmount()
    const b = render(<Nav collapsed />)
    const collapsed = snapshot(b.container)
    expect(collapsed.header).toBe(expanded.header)
    expect(collapsed.header).toContain('h-5')
    expect(expanded.item).toEqual(['h-9'])
    expect(collapsed.item).toEqual(expanded.item)
  })

  it('collapsed: line is aria-hidden and label stays for screen readers', () => {
    const { container } = render(<Nav collapsed />)
    const line = container.querySelector('[data-slot="sider-group-line"]')
    expect(line?.getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByText('Main').className).toContain('sr-only')
  })
})
