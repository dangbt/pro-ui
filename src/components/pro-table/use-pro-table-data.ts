/// <reference types="vite/client" />
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import type { QueryParams, RequestResult, SortState } from './types'

interface UseProTableDataOptions<T extends object> {
  request?: (params: QueryParams) => Promise<RequestResult<T>>
  dataSource?: T[]
  params?: Record<string, unknown>
  refreshToken?: string | number
  rowKey: keyof T | ((record: T) => string)
  defaultPageSize: number
  defaultCurrent?: number
  onPaginationChange?: (page: number, pageSize: number) => void
  /** Initial sort state applied on mount. */
  defaultSort?: SortState
  /** Called when sort changes (user clicks a column header). */
  onSortChange?: (sort: SortState | undefined) => void
}

/**
 * Serialise `params` by value so an inline object literal — a new reference on every
 * render — doesn't look like a change. Top-level keys are sorted so key order in the
 * literal doesn't matter either.
 */
function serialiseParams(params?: Record<string, unknown>): string {
  if (!params) return ''
  return JSON.stringify(Object.keys(params).sort().map(key => [key, params[key]]))
}

export interface UseProTableDataReturn<T extends object> {
  isClientMode: boolean
  tableData: T[]
  serverTotal: number
  loading: boolean
  fetchError: string | null
  searchParams: Record<string, unknown>
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  handleSearch: (params: Record<string, unknown>) => void
  handleReset: () => void
  fetchData: (params: QueryParams) => Promise<void>
  /** Re-fetch current page with sort, params, and searchParams preserved */
  reload: () => void
  /** Re-fetch and reset to page 1 with sort, params, and searchParams preserved */
  reloadAndReset: () => void
  dataIdentity: string
}

export function useProTableData<T extends object>({
  request,
  dataSource,
  params,
  refreshToken,
  rowKey,
  defaultPageSize,
  defaultCurrent,
  onPaginationChange,
  defaultSort,
  onSortChange,
}: UseProTableDataOptions<T>): UseProTableDataReturn<T> {
  const isClientMode = !request && dataSource !== undefined

  // Warn once per mount on a misconfigured mode. `request` and `dataSource` are
  // documented as mutually exclusive: passing both silently ignores `dataSource`
  // (request wins, matching today's behaviour); passing neither leaves the table
  // empty with no request to fire. Silent in production.
  const modeWarnedRef = useRef(false)
  useEffect(() => {
    if (modeWarnedRef.current) return
    // `import.meta.env.PROD` is Vite's build-time constant: it is statically replaced
    // (with `true` in the published bundle) so the whole warning block is tree-shaken out
    // of production output — and it never leaves a bare `process` reference that would
    // throw `ReferenceError: process is not defined` in a native-ESM / Deno / worker
    // runtime that loads the shipped file without a bundler.
    if (import.meta.env.PROD) return
    if (request && dataSource !== undefined) {
      modeWarnedRef.current = true
      // eslint-disable-next-line no-console
      console.warn(
        '[ProTable] Both `request` and `dataSource` were provided; they are mutually ' +
          'exclusive. Using `request` (server mode) and ignoring `dataSource`.',
      )
    } else if (!request && dataSource === undefined) {
      modeWarnedRef.current = true
      // eslint-disable-next-line no-console
      console.warn(
        '[ProTable] Neither `request` nor `dataSource` was provided; the table has no ' +
          'data source and will stay empty. Provide exactly one.',
      )
    }
    // Intentionally mount-only: warnings fire once, not per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Server-side state
  const [serverData, setServerData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loadingServer, setLoadingServer] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})

  // Shared state
  const [sorting, setSorting] = useState<SortingState>(
    defaultSort ? [{ id: defaultSort.field, desc: defaultSort.order === 'desc' }] : [],
  )
  // `defaultCurrent` seeds the initial state only: re-reading it on every render would let
  // a stale prop drag the user back to the page they just left.
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: Math.max(0, (defaultCurrent ?? 1) - 1),
    pageSize: defaultPageSize,
  })

  // Client-side: filter dataSource by searchParams
  const filteredClientData = useMemo(() => {
    if (!isClientMode || !dataSource) return []
    if (Object.keys(searchParams).length === 0) return dataSource
    return dataSource.filter(row => {
      return Object.entries(searchParams).every(([key, val]) => {
        if (val === undefined || val === null || val === '') return true

        // `dateRange` columns emit `${base}_from` / `${base}_to` keys (see search-form).
        // There is no `row[base_from]` field, so substring-matching that literal key
        // empties the table. Instead resolve the underlying `row[base]` and compare it
        // as a date against the inclusive bound this key represents.
        //
        // Guard on the row shape, not on key shape alone: a plain text column can
        // legitimately be named `sent_from` / `transfer_to`. Only take the range path
        // when the literal key is NOT a field on the row AND the base key IS — otherwise
        // fall through to the normal substring match on the real field.
        const rangeMatch = /^(.+)_(from|to)$/.exec(key)
        if (rangeMatch && !(key in (row as Record<string, unknown>))) {
          const [, base, side] = rangeMatch
          if (base in (row as Record<string, unknown>)) {
            const cell = (row as Record<string, unknown>)[base]
            const cellTime = new Date(cell as string | number | Date).getTime()
            // Missing/unparseable cell is excluded whenever a bound is set.
            if (Number.isNaN(cellTime)) return false
            let boundTime = new Date(val as string | number | Date).getTime()
            if (Number.isNaN(boundTime)) return true
            // A bare `YYYY-MM-DD` bound (what the date input emits) parses to midnight.
            // For the upper bound, extend it to the end of that day so a same-day cell
            // with a time component is still included.
            if (side === 'to' && /^\d{4}-\d{2}-\d{2}$/.test(String(val))) {
              boundTime += 24 * 60 * 60 * 1000 - 1
            }
            return side === 'from' ? cellTime >= boundTime : cellTime <= boundTime
          }
        }

        const cell = (row as Record<string, unknown>)[key]
        return String(cell ?? '').toLowerCase().includes(String(val).toLowerCase())
      })
    })
  }, [isClientMode, dataSource, searchParams])

  // Keep the latest `request` in a ref so `fetchData` stays stable
  const requestRef = useRef(request)
  useEffect(() => {
    requestRef.current = request
  })

  // Same for `params`: the effect below depends on their serialised value, not on the
  // object identity, so the ref supplies the current values without widening the deps.
  const paramsRef = useRef(params)
  useEffect(() => {
    paramsRef.current = params
  })
  const paramsKey = useMemo(() => serialiseParams(params), [params])
  const prevParamsKeyRef = useRef(paramsKey)

  // Track previous sorting to detect changes (for server mode page reset)
  const sortingKey = useMemo(
    () => sorting.map(s => `${s.id}:${s.desc}`).join(','),
    [sorting],
  )
  const prevSortingKeyRef = useRef(sortingKey)

  // Report paging outward. Held in a ref so an inline arrow doesn't re-fire the effect,
  // and skipped on mount so a consumer that feeds the values back in through
  // `defaultCurrent`/`defaultPageSize` doesn't bounce between the two.
  const onPaginationChangeRef = useRef(onPaginationChange)
  useEffect(() => {
    onPaginationChangeRef.current = onPaginationChange
  })
  const paginationIsInitialRef = useRef(true)
  useEffect(() => {
    if (paginationIsInitialRef.current) {
      paginationIsInitialRef.current = false
      return
    }
    onPaginationChangeRef.current?.(pagination.pageIndex + 1, pagination.pageSize)
  }, [pagination.pageIndex, pagination.pageSize])

  // Report sorting outward. Similar pattern to pagination: ref for the callback,
  // skip initial mount to avoid firing when defaultSort is applied.
  const onSortChangeRef = useRef(onSortChange)
  useEffect(() => {
    onSortChangeRef.current = onSortChange
  })
  const sortingIsInitialRef = useRef(true)
  useEffect(() => {
    if (sortingIsInitialRef.current) {
      sortingIsInitialRef.current = false
      return
    }
    const sort = sorting[0]
    onSortChangeRef.current?.(
      sort ? { field: sort.id, order: sort.desc ? 'desc' : 'asc' } : undefined,
    )
  }, [sorting])

  // Monotonically increasing request id: only the most recently issued request is
  // allowed to write state. A slow first request that resolves after a faster second
  // one is stale — its id no longer matches `requestIdRef.current`, so it's dropped
  // (data, error, and loading are all left to the winner).
  const requestIdRef = useRef(0)

  const fetchData = useCallback(async (queryParams: QueryParams) => {
    const req = requestRef.current
    if (!req) return
    const requestId = ++requestIdRef.current
    setLoadingServer(true)
    setFetchError(null)
    try {
      const result = await req(queryParams)
      if (requestId !== requestIdRef.current) return
      if (result.success) {
        setServerData(result.data)
        setTotal(result.total)
      } else {
        setFetchError('Failed to load data')
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setFetchError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      // Only the winning request clears loading, so a superseded request settling
      // late doesn't switch the spinner off while the current request is still open.
      if (requestId === requestIdRef.current) setLoadingServer(false)
    }
  }, [])

  useEffect(() => {
    if (isClientMode) return

    // New filters mean a different result set, so start from page 1 — page 5 of the
    // previous filter is rarely a valid page of the new one. Returning early lets the
    // pagination update re-run this effect instead of firing a throwaway request.
    // `refreshToken` deliberately skips this: same result set, so the page still applies.
    if (prevParamsKeyRef.current !== paramsKey) {
      prevParamsKeyRef.current = paramsKey
      if (pagination.pageIndex !== 0) {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
        return
      }
    }

    // Same for sorting: changing sort order in server mode should reset to page 1 —
    // the first items in the new order aren't necessarily on the old page 5.
    if (prevSortingKeyRef.current !== sortingKey) {
      prevSortingKeyRef.current = sortingKey
      if (pagination.pageIndex !== 0) {
        setPagination(prev => ({ ...prev, pageIndex: 0 }))
        return
      }
    }

    const sort = sorting[0]
    fetchData({
      current: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sort && { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }),
      ...paramsRef.current,
      ...searchParams,
    })
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    sortingKey,
    searchParams,
    paramsKey,
    refreshToken,
    fetchData,
    isClientMode,
  ])

  // Reload current view with all params preserved (sort + params + searchParams).
  // Used by toolbar refresh button and retry on error.
  const reload = useCallback(() => {
    if (isClientMode) return
    const sort = sorting[0]
    fetchData({
      current: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sort && { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }),
      ...paramsRef.current,
      ...searchParams,
    })
  }, [isClientMode, sorting, pagination.pageIndex, pagination.pageSize, searchParams, fetchData])

  // Reload and reset to page 1. Used by actionRef.reloadAndReset().
  // If already on page 0, setPagination is a no-op (same value → no re-render →
  // the effect won't fire), so we call reload() which fetches current:1 anyway.
  // If on another page, setPagination triggers the effect which fetches page 1.
  const reloadAndReset = useCallback(() => {
    if (isClientMode) return
    if (pagination.pageIndex === 0) {
      reload()
    } else {
      setPagination(prev => ({ ...prev, pageIndex: 0 }))
    }
  }, [isClientMode, pagination.pageIndex, reload])

  const handleSearch = useCallback((params: Record<string, unknown>) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearchParams(params)
  }, [])

  const handleReset = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearchParams({})
  }, [])

  // In client mode: use filteredClientData; in server mode: use serverData
  const tableData = isClientMode ? filteredClientData : serverData
  const serverTotal = isClientMode ? filteredClientData.length : total

  // Identity for detecting data changes (to reset selection)
  const dataIdentity = useMemo(() => {
    return tableData.map((row, i) => {
      if (typeof rowKey === 'function') return rowKey(row)
      const val = (row as Record<string, unknown>)[rowKey as string]
      return val != null ? String(val) : String(i)
    }).join(',')
  }, [tableData, rowKey])

  return {
    isClientMode,
    tableData,
    serverTotal,
    loading: loadingServer,
    fetchError,
    searchParams,
    sorting,
    setSorting,
    pagination,
    setPagination,
    handleSearch,
    handleReset,
    fetchData,
    reload,
    reloadAndReset,
    dataIdentity,
  }
}
