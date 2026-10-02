import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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

  it('sets data-invalid when isInvalid is true', () => {
    const { container } = render(<TokenField label="Topics" isInvalid />)
    expect(container.querySelector('[data-invalid]')).not.toBeNull()
  })

  it('renders multiple tokens', () => {
    render(
      <TokenField
        label="Tags"
        defaultValue={
          new TagFieldValue([
            { type: 'token', text: 'tag1' },
            { type: 'token', text: 'tag2' },
            { type: 'token', text: 'tag3' },
            { type: 'text', text: '' },
          ])
        }
      />,
    )
    expect(screen.getByText('tag1')).toBeDefined()
    expect(screen.getByText('tag2')).toBeDefined()
    expect(screen.getByText('tag3')).toBeDefined()
  })

  it('renders contenteditable input for typing', () => {
    render(<TokenField label="Topics" />)
    const input = document.querySelector('[contenteditable="true"]')
    expect(input).not.toBeNull()
    expect(input?.getAttribute('role')).toBe('textbox')
  })

  it('preserves text segment in controlled mode', () => {
    // Test that controlled TokenField with TagFieldValue preserves text segments
    const ControlledTokenField = () => {
      const [value] = useState<TagFieldValue>(
        () =>
          new TagFieldValue([
            { type: 'token', text: 'initial' },
            { type: 'text', text: 'uncommitted' },
          ]),
      )

      return (
        <div>
          <TokenField
            label="Tags"
            value={value}
            onChange={() => {}}
          />
          <span data-testid="text-segment">
            {value.segments.find((s) => s.type === 'text')?.text || 'none'}
          </span>
        </div>
      )
    }

    render(<ControlledTokenField />)

    // Initial token should be visible
    expect(screen.getByText('initial')).toBeDefined()

    // Text segment should be preserved in state
    expect(screen.getByTestId('text-segment').textContent).toBe('uncommitted')
  })

  it('renders placeholder when empty', () => {
    const { container } = render(<TokenField label="Topics" placeholder="Type here..." />)
    const input = container.querySelector('[data-placeholder="Type here..."]')
    expect(input).not.toBeNull()
  })

  it('renders description text', () => {
    render(<TokenField label="Topics" description="Add your topics" />)
    expect(screen.getByText('Add your topics')).toBeDefined()
  })

  it('renders error message', () => {
    render(<TokenField label="Topics" errorMessage="Required field" />)
    expect(screen.getByText('Required field')).toBeDefined()
  })

  it('supports custom renderToken', () => {
    render(
      <TokenField
        label="Tags"
        defaultValue={
          new TagFieldValue([
            { type: 'token', text: 'custom' },
            { type: 'text', text: '' },
          ])
        }
        renderToken={(token) => <span data-testid="custom-token">{token.text.toUpperCase()}</span>}
      />,
    )
    expect(screen.getByTestId('custom-token')).toBeDefined()
    expect(screen.getByText('CUSTOM')).toBeDefined()
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

  it('extracts only token segments for form submission', () => {
    const value = new TagFieldValue([
      { type: 'token', text: 'committed1' },
      { type: 'text', text: 'uncommitted' },
      { type: 'token', text: 'committed2' },
    ])

    const tokens = value.segments
      .filter((seg): seg is TokenSegment => seg.type === 'token')
      .map((seg) => seg.text)

    expect(tokens).toEqual(['committed1', 'committed2'])
  })

  it('handles newline as delimiter', () => {
    expect(internals().tokenize('tag1\ntag2\n')).toEqual([
      { type: 'token', text: 'tag1' },
      { type: 'token', text: 'tag2' },
    ])
  })

  it('handles mixed delimiters', () => {
    expect(internals().tokenize('a,b\nc,')).toEqual([
      { type: 'token', text: 'a' },
      { type: 'token', text: 'b' },
      { type: 'token', text: 'c' },
    ])
  })
})
