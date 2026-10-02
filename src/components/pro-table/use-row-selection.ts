import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { RowSelectionState, Table, Updater } from '@tanstack/react-table'
import type { ProTableProps } from './types'

interface UseRowSelectionStateOptions<T extends object> {
  /** Used to detect data changes for auto-reset in uncontrolled mode. */
  dataIdentity: unknown
  /** Row selection config from props. */
  rowSelection?: ProTableProps<T>['rowSelection']
  /** Function to get row key from record. */
  getRowKey: (record: T, index: number) => string
  /** Table data for current page (used to resolve records in controlled mode). */
  tableData: T[]
}

/**
 * Row-selection state plus the "reset selection when the underlying data
 * changes" effect. Extracted from pro-table.tsx purely to keep that file under
 * its line budget — behaviour is unchanged.
 *
 * Supports both controlled and uncontrolled modes:
 * - Uncontrolled (no selectedRowKeys): manages internal state, resets on data change
 * - Controlled (selectedRowKeys provided): syncs to prop, calls onChange on interaction
 */
export function useRowSelectionState<T extends object>({
  dataIdentity,
  rowSelection,
  getRowKey,
  tableData,
}: UseRowSelectionStateOptions<T>) {
  const selectedRowKeys = rowSelection?.selectedRowKeys
  const preserveSelectedRowKeys = rowSelection?.preserveSelectedRowKeys
  const onChange = rowSelection?.onChange

  // Internal state for uncontrolled mode
  const [internalState, setInternalState] = useState<RowSelectionState>({})

  // Cache of selected rows for preserveSelectedRowKeys mode
  // Maps rowKey -> record so we can return full records even after they leave current page
  const selectedRowsCacheRef = useRef<Map<string, T>>(new Map())

  // Controlled mode: derive state from prop
  const controlledState = useMemo(() => {
    if (selectedRowKeys === undefined) return undefined
    return selectedRowKeys.reduce<RowSelectionState>((acc, key) => {
      acc[key] = true
      return acc
    }, {})
  }, [selectedRowKeys])

  const isControlled = selectedRowKeys !== undefined

  // Reset selection when the underlying data changes (uncontrolled mode only).
  // Skip if preserveSelectedRowKeys is true or if we're in controlled mode.
  // Also skip the initial run: on mount `internalState` is already empty.
  const dataIdentityIsInitialRef = useRef(true)
  useEffect(() => {
    if (dataIdentityIsInitialRef.current) {
      dataIdentityIsInitialRef.current = false
      return
    }
    if (isControlled || preserveSelectedRowKeys) return
    setInternalState({})
    // Also clear the cache in uncontrolled mode without preserve
    selectedRowsCacheRef.current.clear()
  }, [dataIdentity, isControlled, preserveSelectedRowKeys])

  const state = isControlled ? controlledState! : internalState

  /**
   * Clear selection, calling onChange if in controlled mode.
   * This is used by clearSelected action and bulk action bar clear.
   */
  const clearSelection = useCallback(() => {
    if (isControlled) {
      // In controlled mode, call onChange with empty selection
      onChange?.([], [])
    } else {
      setInternalState({})
    }
    selectedRowsCacheRef.current.clear()
  }, [isControlled, onChange])

  /**
   * Handler for onRowSelectionChange from TanStack Table.
   * In controlled mode, this computes the next state and calls onChange directly.
   * In uncontrolled mode, it just updates internal state.
   */
  const handleRowSelectionChange = useCallback(
    (updater: Updater<RowSelectionState>) => {
      if (!isControlled) {
        // Uncontrolled: update internal state
        setInternalState(updater)
        return
      }

      // Controlled mode: compute next state and call onChange
      const currentState = controlledState ?? {}
      const nextState = typeof updater === 'function' ? updater(currentState) : updater
      const nextKeys = Object.keys(nextState).filter(k => nextState[k])

      // Get records for the next keys
      const nextRecords: T[] = []
      for (const key of nextKeys) {
        // First check cache
        const cached = selectedRowsCacheRef.current.get(key)
        if (cached) {
          nextRecords.push(cached)
        } else {
          // Try to find in current page data
          const idx = tableData.findIndex((r, i) => getRowKey(r, i) === key)
          if (idx !== -1) {
            nextRecords.push(tableData[idx])
          }
        }
      }

      // Call onChange with the computed next state
      onChange?.(nextKeys, nextRecords)
    },
    [isControlled, controlledState, onChange, tableData, getRowKey],
  )

  // Update cache with current page's selected rows
  useEffect(() => {
    if (!preserveSelectedRowKeys) return
    // Add current page rows to cache for any that are selected
    for (let i = 0; i < tableData.length; i++) {
      const row = tableData[i]
      const key = getRowKey(row, i)
      if (state[key]) {
        selectedRowsCacheRef.current.set(key, row)
      }
    }
    // Remove deselected keys from cache
    for (const [key] of selectedRowsCacheRef.current) {
      if (!state[key]) {
        selectedRowsCacheRef.current.delete(key)
      }
    }
  }, [tableData, state, preserveSelectedRowKeys, getRowKey])

  return {
    state,
    handleRowSelectionChange,
    clearSelection,
    isControlled,
    selectedRowsCacheRef,
  }
}

/**
 * Selection-derived keys/rows plus the `rowSelection.onChange` callback effect.
 * Kept in a hook so pro-table.tsx stays under budget; behaviour is unchanged.
 */
export function useSelectionChange<T extends object>({
  table,
  rowSelectionState,
  rowSelection,
  getRowKey,
  isControlled,
  selectedRowsCacheRef,
}: {
  table: Table<T>
  rowSelectionState: RowSelectionState
  rowSelection: ProTableProps<T>['rowSelection']
  getRowKey: (record: T, index: number) => string
  isControlled: boolean
  selectedRowsCacheRef: React.MutableRefObject<Map<string, T>>
}) {
  const preserveSelectedRowKeys = rowSelection?.preserveSelectedRowKeys

  // Current page rows from table model
  const currentPageRows = table.getRowModel().rows

  // Derive selected keys and records
  // With preserveSelectedRowKeys, use the cache to get records not on current page
  const { selectedKeys, selectedOriginals } = useMemo(() => {
    const keys = Object.keys(rowSelectionState).filter(k => rowSelectionState[k])

    if (preserveSelectedRowKeys) {
      // Use cache to get records that may not be on current page
      const records: T[] = []
      for (const key of keys) {
        const cached = selectedRowsCacheRef.current.get(key)
        if (cached) {
          records.push(cached)
        } else {
          const row = currentPageRows.find(r => getRowKey(r.original, r.index) === key)
          if (row) {
            records.push(row.original)
          }
        }
      }
      return { selectedKeys: keys, selectedOriginals: records }
    }

    // Without preserve, only return rows from current page
    const selectedModelRows = table.getSelectedRowModel().rows
    return {
      selectedKeys: selectedModelRows.map(row => getRowKey(row.original, row.index)),
      selectedOriginals: selectedModelRows.map(r => r.original),
    }
  }, [rowSelectionState, preserveSelectedRowKeys, table, currentPageRows, getRowKey, selectedRowsCacheRef])

  // Skip the initial run so `rowSelection.onChange` doesn't fire on mount with `([], [])`
  // — mirrors the `paginationIsInitialRef` guard in use-pro-table-data.ts / types.ts.
  // Note: In controlled mode, we don't use this effect — onChange is called directly
  // in handleRowSelectionChange when user interacts.
  const selectionIsInitialRef = useRef(true)
  useEffect(() => {
    if (selectionIsInitialRef.current) {
      selectionIsInitialRef.current = false
      return
    }
    // In controlled mode, don't fire onChange from the effect — it's already called
    // directly from handleRowSelectionChange when user interacts.
    if (isControlled) return
    rowSelection?.onChange?.(selectedKeys, selectedOriginals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionState, isControlled])

  return { selectedKeys, selectedOriginals }
}
