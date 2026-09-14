import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TokenField, TokenFieldValue, TagFieldValue } from '../token-field'

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

describe('TagFieldValue', () => {
  // tokenize / createFieldValue are protected on RAC's TokenFieldValue; access
  // them through a runtime cast to exercise the tag-input behaviour directly.
  type TagInternals = {
    tokenize(text: string): { type: string; text: string }[]
    createFieldValue(segments: readonly { type: string; text: string }[]): unknown
  }

  it('splits typed text on commas and newlines into trimmed token segments', () => {
    const value = new TagFieldValue([]) as unknown as TagInternals
    const segments = value.tokenize('design, frontend\nux')
    expect(segments).toHaveLength(3)
    expect(segments.every(s => s.type === 'token')).toBe(true)
    expect(segments.map(s => s.text)).toEqual(['design', 'frontend', 'ux'])
  })

  it('drops empty pieces produced by extra separators or whitespace', () => {
    const value = new TagFieldValue([]) as unknown as TagInternals
    const segments = value.tokenize(' a , , \n  b ')
    expect(segments.map(s => s.text)).toEqual(['a', 'b'])
  })

  it('createFieldValue returns a TagFieldValue instance', () => {
    const value = new TagFieldValue([]) as unknown as TagInternals
    const next = value.createFieldValue([{ type: 'token', text: 'x' }])
    expect(next).toBeInstanceOf(TagFieldValue)
  })
})
