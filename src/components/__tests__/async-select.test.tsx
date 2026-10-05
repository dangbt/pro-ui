import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AsyncSelect } from '../async-select'

const empty = async () => ({ options: [], hasMore: false })
const failing = async (): Promise<never> => {
  throw new Error('boom')
}

describe('AsyncSelect texts', () => {
  it('shows default English empty text', async () => {
    render(<AsyncSelect label="Product" fetchOptions={empty} debounceMs={0} />)
    fireEvent.click(screen.getByRole('button'))
    expect(await screen.findByText('No results found')).toBeDefined()
  })

  it('uses emptyText when provided', async () => {
    render(<AsyncSelect label="Product" fetchOptions={empty} debounceMs={0} emptyText="Không có kết quả" />)
    fireEvent.click(screen.getByRole('button'))
    expect(await screen.findByText('Không có kết quả')).toBeDefined()
    expect(screen.queryByText('No results found')).toBeNull()
  })

  it('uses loadErrorText and retryText when fetch fails', async () => {
    render(
      <AsyncSelect
        label="Product"
        fetchOptions={failing}
        debounceMs={0}
        loadErrorText="Tải thất bại"
        retryText="Thử lại"
      />,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(await screen.findByText('Tải thất bại')).toBeDefined()
    expect(screen.getByText('Thử lại')).toBeDefined()
  })
})
