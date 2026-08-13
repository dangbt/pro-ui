import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import type { QueryParams, RequestResult } from './types'

interface UseProTableDataOptions<T extends object> {
  request?: (params: QueryParams) => Promise<RequestResult<T>>
  dataSource?: T[]
  params?: Record<string, unknown>
  rowKey: keyof T | ((record: T) => string)
  defaultPageSize: number
  defaultCurrent?: number
  onPaginationChange?: (page: number, pageSize: number) => void
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
  dataIdentity: string
}

export function useProTableData<T extends object>({
  request,
  dataSource,
  params,
  rowKey,
  defaultPageSize,
  defaultCurrent,
  onPaginationChange,
}: UseProTableDataOptions<T>): UseProTableDataReturn<T> {
  const isClientMode = !request && dataSource !== undefined

  // Server-side state
  const [serverData, setServerData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loadingServer, setLoadingServer] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})

  // Shared state
  const [sorting, setSorting] = useState<SortingState>([])
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

  const fetchData = useCallback(async (queryParams: QueryParams) => {
    const req = requestRef.current
    if (!req) return
    setLoadingServer(true)
    setFetchError(null)
    try {
      const result = await req(queryParams)
      if (result.success) {
        setServerData(result.data)
        setTotal(result.total)
      }
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoadingServer(false)
    }
  }, [])

  useEffect(() => {
    if (isClientMode) return

    // New filters mean a different result set, so start from page 1 — page 5 of the
    // previous filter is rarely a valid page of the new one. Returning early lets the
    // pagination update re-run this effect instead of firing a throwaway request.
    if (prevParamsKeyRef.current !== paramsKey) {
      prevParamsKeyRef.current = paramsKey
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
    searchParams,
    paramsKey,
    fetchData,
    isClientMode,
  ])

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
    dataIdentity,
  }
}
