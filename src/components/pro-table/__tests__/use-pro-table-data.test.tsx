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

describe('useProTableData — refreshToken', () => {
  it('refetches the page the user is on, without resetting it', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const { result: hook, rerender } = renderHook(
      ({ token }: { token: number }) =>
        useProTableData<Row>({ ...options(request, { q: 'a' }), refreshToken: token }),
      { initialProps: { token: 0 } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 4 })))
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    rerender({ token: 1 })

    await waitFor(() => expect(request).toHaveBeenCalledTimes(3))
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ current: 5, q: 'a' }))
    expect(hook.current.pagination.pageIndex).toBe(4)
  })

  it('does not refetch while the token holds still', async () => {
    const request = vi.fn().mockResolvedValue(result())
    const { rerender } = renderHook(() =>
      useProTableData<Row>({ ...options(request), refreshToken: 7 }),
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    rerender()
    rerender()

    await new Promise(r => setTimeout(r, 20))
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('does not report a pagination change, having moved no page', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const onPaginationChange = vi.fn()
    const { result: hook, rerender } = renderHook(
      ({ token }: { token: number }) =>
        useProTableData<Row>({ ...options(request), refreshToken: token, onPaginationChange }),
      { initialProps: { token: 0 } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 2 })))
    await waitFor(() => expect(onPaginationChange).toHaveBeenCalledTimes(1))

    rerender({ token: 1 })

    await waitFor(() => expect(request).toHaveBeenCalledTimes(3))
    expect(onPaginationChange).toHaveBeenCalledTimes(1)
  })

  it('is ignored in client mode', async () => {
    const { result: hook, rerender } = renderHook(
      ({ token }: { token: number }) =>
        useProTableData<Row>({
          dataSource: [{ id: '1' }, { id: '2' }],
          refreshToken: token,
          rowKey: 'id',
          defaultPageSize: 10,
        }),
      { initialProps: { token: 0 } },
    )

    rerender({ token: 1 })

    expect(hook.current.tableData).toHaveLength(2)
  })
})

describe('useProTableData — defaultCurrent / onPaginationChange', () => {
  it('opens on defaultCurrent and fetches that page first', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const { result: hook } = renderHook(() =>
      useProTableData<Row>({ ...options(request), defaultCurrent: 3 }),
    )

    expect(hook.current.pagination.pageIndex).toBe(2)
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect(request).toHaveBeenCalledWith(expect.objectContaining({ current: 3 }))
  })

  it('treats a missing or out-of-range defaultCurrent as page 1', async () => {
    const request = vi.fn().mockResolvedValue(result())
    const { result: hook } = renderHook(() =>
      useProTableData<Row>({ ...options(request), defaultCurrent: 0 }),
    )

    expect(hook.current.pagination.pageIndex).toBe(0)
  })

  it('ignores later defaultCurrent changes so the user is not dragged back', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const { result: hook, rerender } = renderHook(
      ({ c }: { c: number }) => useProTableData<Row>({ ...options(request), defaultCurrent: c }),
      { initialProps: { c: 1 } },
    )

    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 4 })))
    rerender({ c: 1 })

    expect(hook.current.pagination.pageIndex).toBe(4)
  })

  it('reports page and pageSize changes, but not the initial render', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const onPaginationChange = vi.fn()
    const { result: hook } = renderHook(() =>
      useProTableData<Row>({ ...options(request), onPaginationChange }),
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    expect(onPaginationChange).not.toHaveBeenCalled()

    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 2 })))
    await waitFor(() => expect(onPaginationChange).toHaveBeenCalledWith(3, 10))

    act(() => hook.current.setPagination({ pageIndex: 0, pageSize: 50 }))
    await waitFor(() => expect(onPaginationChange).toHaveBeenLastCalledWith(1, 50))
  })

  it('reports the reset to page 1 caused by a params change', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: '1' }], total: 100, success: true })
    const onPaginationChange = vi.fn()
    const { result: hook, rerender } = renderHook(
      ({ q }: { q: string }) =>
        useProTableData<Row>({ ...options(request, { q }), onPaginationChange }),
      { initialProps: { q: 'first' } },
    )

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 4 })))
    await waitFor(() => expect(onPaginationChange).toHaveBeenLastCalledWith(5, 10))

    rerender({ q: 'second' })

    await waitFor(() => expect(onPaginationChange).toHaveBeenLastCalledWith(1, 10))
  })

  it('fires in client mode too', async () => {
    const onPaginationChange = vi.fn()
    const { result: hook } = renderHook(() =>
      useProTableData<Row>({
        dataSource: [{ id: '1' }, { id: '2' }],
        rowKey: 'id',
        defaultPageSize: 1,
        defaultCurrent: 2,
        onPaginationChange,
      }),
    )

    expect(hook.current.pagination.pageIndex).toBe(1)
    expect(onPaginationChange).not.toHaveBeenCalled()

    act(() => hook.current.setPagination(prev => ({ ...prev, pageIndex: 0 })))
    await waitFor(() => expect(onPaginationChange).toHaveBeenCalledWith(1, 1))
  })
})
