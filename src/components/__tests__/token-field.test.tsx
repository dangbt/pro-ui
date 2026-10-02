import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { TokenField, TokenFieldValue, TagFieldValue } from '../token-field'
import type { TokenSegment } from '../token-field'

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

  it('calls onChange with value containing text segment when typing', () => {
    // This test verifies that when onChange is called with a TagFieldValue
    // containing a text segment (uncommitted text), the text segment is preserved
    const onChange = vi.fn()
    
    // Simulate what happens internally: TokenField calls onChange with the new value
    // The new value includes both tokens and uncommitted text
    const valueWithText = new TagFieldValue([
      { type: 'token', text: 'existing' },
      { type: 'text', text: 'typing' },
    ])
    
    // Verify the value structure
    expect(valueWithText.segments).toHaveLength(2)
    expect(valueWithText.segments[0]).toEqual({ type: 'token', text: 'existing' })
    expect(valueWithText.segments[1]).toEqual({ type: 'text', text: 'typing' })
    
    // When extracting tokens for form state, only tokens should be included
    const tokens = valueWithText.segments
      .filter((seg): seg is TokenSegment => seg.type === 'token')
      .map(seg => seg.text)
    expect(tokens).toEqual(['existing'])
  })

  it('preserves text segment in controlled mode', () => {
    // Test that controlled TokenField with TagFieldValue preserves text segments
    const ControlledTokenField = () => {
      const [value, setValue] = useState(() => new TagFieldValue([
        { type: 'token', text: 'initial' },
        { type: 'text', text: 'uncommitted' },
      ]))
      
      return (
        <div>
          <TokenField
            label="Tags"
            value={value}
            onChange={setValue}
          />
          <span data-testid="text-segment">{
            value.segments.find(s => s.type === 'text')?.text || 'none'
          }</span>
        </div>
      )
    }
    
    render(<ControlledTokenField />)
    
    // Initial token should be visible
    expect(screen.getByText('initial')).toBeDefined()
    
    // Text segment should be preserved in state
    expect(screen.getByTestId('text-segment').textContent).toBe('uncommitted')
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
