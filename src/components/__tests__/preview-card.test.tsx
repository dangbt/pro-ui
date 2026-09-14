import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PreviewCard } from '../preview-card'
import { Link } from '../link'
import { Button } from '../button'

describe('PreviewCard', () => {
  it('is exported as a function', () => {
    expect(typeof PreviewCard).toBe('function')
  })

  it('renders its trigger element', () => {
    render(
      <PreviewCard content={<p>Preview body</p>}>
        <Link>@dangbt</Link>
      </PreviewCard>,
    )
    expect(screen.getByText('@dangbt')).toBeDefined()
  })

  it('renders content when controlled isOpen is true', () => {
    render(
      <PreviewCard isOpen content={<p>Preview body</p>}>
        <Link>@dangbt</Link>
      </PreviewCard>,
    )
    expect(screen.getByText('Preview body')).toBeDefined()
  })

  it('does not render content when closed (controlled isOpen=false)', () => {
    render(
      <PreviewCard isOpen={false} content={<p>Preview body</p>}>
        <Link>@dangbt</Link>
      </PreviewCard>,
    )
    expect(screen.queryByText('Preview body')).toBeNull()
  })

  it('renders interactive content (a focusable button) inside the open card', () => {
    render(
      <PreviewCard isOpen content={<Button>Follow</Button>}>
        <Link>@dangbt</Link>
      </PreviewCard>,
    )
    expect(screen.getByRole('button', { name: 'Follow' })).toBeDefined()
  })
})
