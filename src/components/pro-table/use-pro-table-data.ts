import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import type { QueryParams, RequestResult } from './types'

interface UseProTableDataOptions<T extends object> {
  request?: (params: QueryParams) => Promise<RequestResult<T>>
  dataSource?: T[]
  rowKey: keyof T | ((record: T) => string)
  defaultPageSize: number
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
  rowKey,
  defaultPageSize,
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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
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

  const fetchData = useCallback(async (params: QueryParams) => {
    const req = requestRef.current
    if (!req) return
    setLoadingServer(true)
    setFetchError(null)
    try {
      const result = await req(params)
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
    const sort = sorting[0]
    fetchData({
      current: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sort && { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }),
      ...searchParams,
    })
  }, [pagination.pageIndex, pagination.pageSize, sorting, searchParams, fetchData, isClientMode])

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
