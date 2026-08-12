import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useProTableData } from '../use-pro-table-data'

interface Row {
  id: string
}

const result = (data: Row[] = [{ id: '1' }]) => ({ data, total: data.length, success: true })

/** Options with the two fields every server-mode test needs. */
const options = (request: ReturnType<typeof vi.fn>, params?: Record<string, unknown>) => ({
  request,
  params,
  rowKey: 'id' as const,
  defaultPageSize: 10,
})

describe('useProTableData — params', () => {
  it('passes params to request on the first fetch', async () => {
    const request = vi.fn().mockResolvedValue(result())
    renderHook(() => useProTableData<Row>(options(request, { q: 'abc' })))

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect(request).toHaveBeenCalledWith(expect.objectContaining({ q: 'abc', current: 1 }))
  })

  it('refetches when a param value changes', async () => {
    const request = vi.fn().mockResolvedValue(result())
    const { rerender } = renderHook(
      ({ q }: { q: string }) => useProTableData<Row>(options(request, { q })),
      { initialProps: { q: 'first' } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    rerender({ q: 'second' })

    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'second' }))
  })

  it('does not refetch when an equal params object is recreated', async () => {
    // The common case: `params={{ q }}` is a new object literal on every render.
    const request = vi.fn().mockResolvedValue(result())
    const { rerender } = renderHook(() => useProTableData<Row>(options(request, { q: 'same' })))

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    rerender()
    rerender()

    await new Promise(r => setTimeout(r, 20))
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('ignores key order within params', async () => {
    const request = vi.fn().mockResolvedValue(result())
    const { rerender } = renderHook(
      ({ p }: { p: Record<string, unknown> }) => useProTableData<Row>(options(request, p)),
      { initialProps: { p: { a: '1', b: '2' } } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    rerender({ p: { b: '2', a: '1' } })

    await new Promise(r => setTimeout(r, 20))
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('returns to the first page when params change', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const { result: hook, rerender } = renderHook(
      ({ q }: { q: string }) => useProTableData<Row>(options(request, { q })),
      { initialProps: { q: 'first' } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 4 })))
    await waitFor(() => expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ current: 5 }),
    ))

    rerender({ q: 'second' })

    await waitFor(() =>
      expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ current: 1, q: 'second' })),
    )
    expect(hook.current.pagination.pageIndex).toBe(0)
  })

  it('does not fire a request for the page being left behind', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const { result: hook, rerender } = renderHook(
      ({ q }: { q: string }) => useProTableData<Row>(options(request, { q })),
      { initialProps: { q: 'first' } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 4 })))
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    rerender({ q: 'second' })

    // Only one further call — page 1 of the new filter, never page 5 of it.
    await waitFor(() => expect(request).toHaveBeenCalledTimes(3))
    await new Promise(r => setTimeout(r, 20))
    expect(request).toHaveBeenCalledTimes(3)
    expect(request.mock.calls.every(([p]) => !(p.current === 5 && p.q === 'second'))).toBe(true)
  })

  it('lets the table search form override a param of the same name', async () => {
    const request = vi.fn().mockResolvedValue(result())
    const { result: hook } = renderHook(() =>
      useProTableData<Row>(options(request, { status: 'all' })),
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    act(() => hook.current.handleSearch({ status: 'active' }))

    await waitFor(() =>
      expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'active' })),
    )
  })

  it('is ignored in client mode', async () => {
    const { result: hook, rerender } = renderHook(
      ({ q }: { q: string }) =>
        useProTableData<Row>({
          dataSource: [{ id: '1' }, { id: '2' }],
          params: { q },
          rowKey: 'id',
          defaultPageSize: 10,
        }),
      { initialProps: { q: 'a' } },
    )

    expect(hook.current.isClientMode).toBe(true)
    expect(hook.current.tableData).toHaveLength(2)

    rerender({ q: 'b' })

    expect(hook.current.tableData).toHaveLength(2)
  })
})
