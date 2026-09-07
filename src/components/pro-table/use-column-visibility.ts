import { useState, useEffect, useMemo } from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import type { ProColumnType } from './types'

function colKey<T>(c: ProColumnType<T>): string {
  return (c.key ?? c.dataIndex ?? c.title) as string
}

interface UseColumnVisibilityOptions<T> {
  columnDefs: ProColumnType<T>[]
  /** Structural signature — used as the memo key, exactly as inline before. */
  columnsSignature: string
  persistColumnVisibility: boolean | string
  headerTitle?: React.ReactNode
}

/**
 * Owns column-visibility state plus its localStorage persistence, carried over
 * verbatim from pro-table.tsx. Returns the state tuple TanStack needs.
 */
export function useColumnVisibility<T>({
  columnDefs,
  columnsSignature,
  persistColumnVisibility,
  headerTitle,
}: UseColumnVisibilityOptions<T>): [VisibilityState, React.Dispatch<React.SetStateAction<VisibilityState>>] {
  const persistVisibility = persistColumnVisibility !== false
  const visibilityStorageKey = useMemo(() => {
    if (typeof persistColumnVisibility === 'string') return persistColumnVisibility
    const cols = columnDefs.map(c => colKey(c)).join(',')
    return `pro-table:colvis:${headerTitle ?? ''}:${cols}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistColumnVisibility, columnsSignature, headerTitle])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const defaults = Object.fromEntries(
      columnDefs.filter(c => c.hideInTable).map(c => [colKey(c), false]),
    )
    if (!persistVisibility || typeof window === 'undefined') return defaults
    try {
      const stored = window.localStorage.getItem(visibilityStorageKey)
      if (stored) return { ...defaults, ...(JSON.parse(stored) as VisibilityState) }
    } catch {
      /* ignore */
    }
    return defaults
  })

  useEffect(() => {
    if (!persistVisibility || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(visibilityStorageKey, JSON.stringify(columnVisibility))
    } catch {
      /* storage may be full or unavailable */
    }
  }, [persistVisibility, visibilityStorageKey, columnVisibility])

  return [columnVisibility, setColumnVisibility]
}
