import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useProTableData } from '../use-pro-table-data'

interface Row {
  id: string
}

type RequestResultRow = { data: Row[]; total: number; success: boolean }

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

describe('useProTableData — success: false', () => {
  it('surfaces a non-null fetchError when the server returns success: false', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0, success: false })
    const { result: hook } = renderHook(() => useProTableData<Row>(options(request)))

    await waitFor(() => expect(hook.current.fetchError).not.toBeNull())
    expect(hook.current.loading).toBe(false)
  })

  it('does not overwrite the previous rows with the failed response', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: '1' }, { id: '2' }], total: 2, success: true })
      .mockResolvedValue({ data: [], total: 0, success: false })
    const { result: hook } = renderHook(() => useProTableData<Row>(options(request)))

    await waitFor(() => expect(hook.current.tableData).toHaveLength(2))

    // Trigger a second fetch that fails.
    await act(async () => { await hook.current.fetchData({ current: 1, pageSize: 10 }) })

    await waitFor(() => expect(hook.current.fetchError).not.toBeNull())
    // Rows are unchanged — not clobbered with the failed response's empty data.
    expect(hook.current.tableData).toHaveLength(2)
    expect(hook.current.serverTotal).toBe(2)
  })
})

describe('useProTableData — out-of-order responses', () => {
  it('lets the last-issued request win even if it resolves first', async () => {
    // A request whose resolution we control per call. Call 1 (mount) resolves
    // immediately; then we issue two more explicit fetches and resolve the slower
    // (first-issued) one LAST to prove it does not clobber the faster one's data.
    const deferred: Array<(v: RequestResultRow) => void> = []
    const request = vi.fn().mockImplementation(
      () => new Promise<RequestResultRow>(res => { deferred.push(res) }),
    )

    const { result: hook } = renderHook(() => useProTableData<Row>(options(request)))

    // Resolve the mount fetch (call 0) so we start from a clean state.
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    await act(async () => { deferred[0]({ data: [], total: 0, success: true }) })

    // Issue two more fetches back to back.
    act(() => { hook.current.fetchData({ current: 1, pageSize: 10 }) }) // call 1 (slow)
    act(() => { hook.current.fetchData({ current: 2, pageSize: 10 }) }) // call 2 (winner)
    await waitFor(() => expect(request).toHaveBeenCalledTimes(3))

    // Resolve the winner (call 2) first.
    await act(async () => { deferred[2]({ data: [{ id: 'second' }], total: 1, success: true }) })
    expect(hook.current.tableData).toEqual([{ id: 'second' }])

    // Now resolve the superseded slow request (call 1) with stale data.
    await act(async () => { deferred[1]({ data: [{ id: 'first' }], total: 99, success: true }) })

    // It must NOT overwrite the winner's data, nor stick loading on.
    expect(hook.current.tableData).toEqual([{ id: 'second' }])
    expect(hook.current.serverTotal).toBe(1)
    expect(hook.current.loading).toBe(false)
  })

  it('does not let a superseded failing request clear the winner error state or stick loading', async () => {
    const resolvers: Array<(v: RequestResultRow) => void> = []
    const rejecters: Array<(e: Error) => void> = []
    const request = vi.fn().mockImplementation(
      () => new Promise<RequestResultRow>((res, rej) => {
        resolvers.push(res)
        rejecters.push(rej)
      }),
    )

    const { result: hook } = renderHook(() => useProTableData<Row>(options(request)))

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
    await act(async () => { resolvers[0]({ data: [], total: 0, success: true }) })

    act(() => { hook.current.fetchData({ current: 1, pageSize: 10 }) }) // call 1 (slow, will fail)
    act(() => { hook.current.fetchData({ current: 2, pageSize: 10 }) }) // call 2 (winner)
    await waitFor(() => expect(request).toHaveBeenCalledTimes(3))

    await act(async () => { resolvers[2]({ data: [{ id: 'ok' }], total: 1, success: true }) })
    expect(hook.current.tableData).toEqual([{ id: 'ok' }])

    // The superseded request rejects late — must not surface an error or stick loading.
    await act(async () => { rejecters[1](new Error('stale failure')) })

    expect(hook.current.fetchError).toBeNull()
    expect(hook.current.tableData).toEqual([{ id: 'ok' }])
    expect(hook.current.loading).toBe(false)
  })
})

describe('useProTableData — client-mode dateRange filtering', () => {
  interface DateRow { id: string; createdAt: string }

  const rows: DateRow[] = [
    { id: 'a', createdAt: '2024-01-01' },
    { id: 'b', createdAt: '2024-06-15' },
    { id: 'c', createdAt: '2024-12-31' },
  ]

  it('filters by an inclusive from/to pair on the underlying field', () => {
    const { result: hook } = renderHook(() =>
      useProTableData<DateRow>({ dataSource: rows, rowKey: 'id', defaultPageSize: 10 }),
    )

    act(() =>
      hook.current.handleSearch({ createdAt_from: '2024-03-01', createdAt_to: '2024-09-01' }),
    )

    expect(hook.current.tableData.map(r => r.id)).toEqual(['b'])
  })

  it('filters on the from side only when to is absent', () => {
    const { result: hook } = renderHook(() =>
      useProTableData<DateRow>({ dataSource: rows, rowKey: 'id', defaultPageSize: 10 }),
    )

    act(() => hook.current.handleSearch({ createdAt_from: '2024-06-15' }))

    expect(hook.current.tableData.map(r => r.id)).toEqual(['b', 'c'])
  })

  it('filters on the to side only when from is absent (inclusive of the end day)', () => {
    const { result: hook } = renderHook(() =>
      useProTableData<DateRow>({ dataSource: rows, rowKey: 'id', defaultPageSize: 10 }),
    )

    act(() => hook.current.handleSearch({ createdAt_to: '2024-06-15' }))

    expect(hook.current.tableData.map(r => r.id)).toEqual(['a', 'b'])
  })

  it('excludes rows whose field is missing or unparseable when a bound is set', () => {
    const mixed: DateRow[] = [
      { id: 'good', createdAt: '2024-05-01' },
      { id: 'bad', createdAt: 'not-a-date' },
      { id: 'empty' } as DateRow,
    ]
    const { result: hook } = renderHook(() =>
      useProTableData<DateRow>({ dataSource: mixed, rowKey: 'id', defaultPageSize: 10 }),
    )

    act(() => hook.current.handleSearch({ createdAt_from: '2024-01-01' }))

    expect(hook.current.tableData.map(r => r.id)).toEqual(['good'])
  })
})

describe('useProTableData — mode misconfiguration warnings', () => {
  it('warns once and resolves to server mode when both request and dataSource are given', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const request = vi.fn().mockResolvedValue(result())

    const { result: hook, rerender } = renderHook(() =>
      useProTableData<Row>({
        request,
        dataSource: [{ id: 'x' }],
        rowKey: 'id',
        defaultPageSize: 10,
      }),
    )

    // request wins → server mode.
    expect(hook.current.isClientMode).toBe(false)
    await waitFor(() => expect(request).toHaveBeenCalled())

    rerender()
    rerender()

    // Warned exactly once, naming both props, across mount + re-renders.
    const bothWarnings = warn.mock.calls.filter(
      ([msg]) => typeof msg === 'string' && msg.includes('request') && msg.includes('dataSource'),
    )
    expect(bothWarnings).toHaveLength(1)
    warn.mockRestore()
  })

  it('warns once when neither request nor dataSource is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { rerender } = renderHook(() =>
      useProTableData<Row>({ rowKey: 'id', defaultPageSize: 10 }),
    )

    rerender()

    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
  })

  it('does not warn for a correctly configured server-mode table', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const request = vi.fn().mockResolvedValue(result())

    renderHook(() => useProTableData<Row>(options(request)))
    await waitFor(() => expect(request).toHaveBeenCalled())

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('is silent in production', () => {
    const original = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    renderHook(() => useProTableData<Row>({ rowKey: 'id', defaultPageSize: 10 }))

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
    process.env.NODE_ENV = original
  })
})
