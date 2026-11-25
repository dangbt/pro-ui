import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Link } from '../link'

describe('Link aria-current', () => {
  it('renders aria-current on the anchor', () => {
    render(<Link href="/a" aria-current="page">A</Link>)
    expect(screen.getByRole('link', { name: 'A' }).getAttribute('aria-current')).toBe('page')
  })

  it('has no aria-current by default', () => {
    render(<Link href="/a">A</Link>)
    expect(screen.getByRole('link', { name: 'A' }).hasAttribute('aria-current')).toBe(false)
  })

  it('applies active classes for every variant', () => {
    for (const variant of ['default', 'muted', 'danger'] as const) {
      const { unmount } = render(<Link href="/a" variant={variant} aria-current="true">A</Link>)
      expect(screen.getByRole('link').className).toContain('aria-[current=true]:font-semibold')
      unmount()
    }
  })
})
