/**
 * Tests for ProFormTokenField onChange behavior.
 * 
 * These tests verify the handleChange logic in TokenFieldInner:
 * - Text segments are preserved in local state (not reset)
 * - Only committed tokens are extracted for form state
 * - Adding/removing tokens works correctly through onChange
 * 
 * Uses a mocked TokenField to capture and call onChange directly.
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Module-level variable for capturing onChange - must be declared before vi.mock
let capturedOnChange: ((val: unknown) => void) | null = null

// Mock TokenField BEFORE importing components that use it
// This mock runs first due to vitest hoisting
vi.mock('../../token-field', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../token-field')>()
  return {
    ...actual,
    TokenField: (props: { value: unknown; onChange: (val: unknown) => void }) => {
      // Capture onChange for test access
      capturedOnChange = props.onChange
      // Render segments from value
      const segments = (props.value as { segments: Array<{ type: string; text: string }> })?.segments ?? []
      return (
        <div data-testid="mock-token-field">
          {segments.filter(s => s.type === 'token').map((seg, i) => (
            <span key={i} data-testid="mock-token">{seg.text}</span>
          ))}
          {segments.filter(s => s.type === 'text').map((seg, i) => (
            <span key={`text-${i}`} data-testid="mock-text-segment">{seg.text}</span>
          ))}
        </div>
      )
    },
  }
})

// Import AFTER mock is set up
import { ProForm, ProFormTokenField } from '../index'
import { TagFieldValue } from '../../token-field'

describe('ProFormTokenField onChange behavior', () => {
  beforeEach(() => {
    capturedOnChange = null
  })

  it('(a) preserves text segment in local state and submits only committed tokens', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm
        onFinish={onFinish}
        defaultValues={{ tags: ['existing'] }}
      >
        <ProFormTokenField name="tags" label="Tags" />
      </ProForm>
    )

    // Wait for mock to capture onChange
    await waitFor(() => {
      expect(capturedOnChange).not.toBeNull()
    })

    // Simulate user typing: existing token + new token + uncommitted text
    const newValue = new TagFieldValue([
      { type: 'token', text: 'existing' },
      { type: 'token', text: 'newtoken' },
      { type: 'text', text: 'typing...' }, // uncommitted text - should be preserved
    ])

    act(() => {
      capturedOnChange!(newValue)
    })

    // Text segment should still be in the value passed to TokenField (not reset)
    await waitFor(() => {
      const textSegment = screen.queryByTestId('mock-text-segment')
      expect(textSegment?.textContent).toBe('typing...')
    })

    // Submit should only include committed tokens (text segment filtered out)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ tags: ['existing', 'newtoken'] })
    })
  })

  it('(b) adds new token via onChange, submits updated array', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm
        onFinish={onFinish}
        defaultValues={{ tags: ['first'] }}
      >
        <ProFormTokenField name="tags" label="Tags" />
      </ProForm>
    )

    await waitFor(() => {
      expect(capturedOnChange).not.toBeNull()
    })

    // Add two new committed tokens
    const newValue = new TagFieldValue([
      { type: 'token', text: 'first' },
      { type: 'token', text: 'second' },
      { type: 'token', text: 'third' },
    ])

    act(() => {
      capturedOnChange!(newValue)
    })

    // Submit and verify all tokens are included
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ tags: ['first', 'second', 'third'] })
    })
  })

  it('(c) removes token via onChange, submits shorter array', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm
        onFinish={onFinish}
        defaultValues={{ tags: ['keep', 'remove', 'also-keep'] }}
      >
        <ProFormTokenField name="tags" label="Tags" />
      </ProForm>
    )

    await waitFor(() => {
      expect(capturedOnChange).not.toBeNull()
    })

    // Remove the middle token ('remove')
    const newValue = new TagFieldValue([
      { type: 'token', text: 'keep' },
      { type: 'token', text: 'also-keep' },
    ])

    act(() => {
      capturedOnChange!(newValue)
    })

    // Submit and verify removed token is not included
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ tags: ['keep', 'also-keep'] })
    })
  })
})
