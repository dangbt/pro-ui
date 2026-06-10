import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '../button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined()
  })

  it('forwards ref', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>
    render(<Button ref={ref as any}>Ref test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayName', () => {
    expect(Button.displayName).toBe('Button')
  })
})
