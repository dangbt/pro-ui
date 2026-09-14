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
  type Segment = { type: string; text: string }
  type TagInternals = {
    tokenize(text: string): Segment[]
    createFieldValue(segments: readonly Segment[]): unknown
  }
  const internals = () => new TagFieldValue([]) as unknown as TagInternals

  it('keeps an undelimited piece as a text segment', () => {
    expect(internals().tokenize('de')).toEqual([{ type: 'text', text: 'de' }])
  })

  it('commits a piece into a token once a delimiter follows it', () => {
    expect(internals().tokenize('de,')).toEqual([{ type: 'token', text: 'de' }])
  })

  it('tokenizes the delimited piece and keeps the trailing text untrimmed', () => {
    expect(internals().tokenize('a, b')).toEqual([
      { type: 'token', text: 'a' },
      { type: 'text', text: ' b' },
    ])
  })

  it('drops empty and whitespace-only pieces', () => {
    expect(internals().tokenize(' , \n')).toEqual([])
  })

  it('createFieldValue returns a TagFieldValue instance', () => {
    const next = internals().createFieldValue([{ type: 'token', text: 'x' }])
    expect(next).toBeInstanceOf(TagFieldValue)
  })
})
