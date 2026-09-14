import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TokenField, TokenFieldValue } from '../token-field'

describe('TokenField', () => {
  it('is exported', () => {
    expect(TokenField).toBeDefined()
  })

  it('renders the label', () => {
    render(<TokenField label="Topics" />)
    expect(screen.getByText('Topics')).toBeDefined()
  })

  it('renders a token from a defaultValue', () => {
    render(
      <TokenField
        label="Topics"
        defaultValue={
          new TokenFieldValue([
            { type: 'token', text: 'design' },
            { type: 'text', text: '' },
          ])
        }
      />,
    )
    expect(screen.getByText('design')).toBeDefined()
  })

  it('sets the disabled state when isDisabled', () => {
    const { container } = render(<TokenField label="Topics" isDisabled />)
    // RAC exposes disabled state via [data-disabled] on the field/input elements.
    expect(container.querySelector('[data-disabled]')).not.toBeNull()
  })
})
