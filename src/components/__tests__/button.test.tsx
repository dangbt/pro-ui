import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRef } from 'react'
import { Button } from '../button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDefined()
  })

  it('forwards ref', () => {
    let capturedRef: HTMLButtonElement | null = null
    function TestComponent() {
      const ref = useRef<HTMLButtonElement>(null)
      capturedRef = ref.current
      return <Button ref={ref}>Ref test</Button>
    }
    const { rerender } = render(<TestComponent />)
    rerender(<TestComponent />)
    expect(capturedRef).toBeInstanceOf(HTMLButtonElement)
  })

  it('has displayName', () => {
    expect(Button.displayName).toBe('Button')
  })
})
