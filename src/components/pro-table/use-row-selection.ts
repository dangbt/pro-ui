import { useState, useEffect, useRef } from 'react'
import type { RowSelectionState, Table } from '@tanstack/react-table'
import type { ProTableProps } from './types'

/**
 * Row-selection state plus the "reset selection when the underlying data
 * changes" effect. Extracted from pro-table.tsx purely to keep that file under
 * its line budget — behaviour is unchanged.
 */
export function useRowSelectionState(dataIdentity: unknown) {
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})

  // Reset selection when the underlying data changes, but skip the initial run: on mount
  // `rowSelectionState` is already empty, and resetting it to a fresh `{}` would trigger
  // an extra render that fires `rowSelection.onChange` with `([], [])`.
  const dataIdentityIsInitialRef = useRef(true)
  useEffect(() => {
    if (dataIdentityIsInitialRef.current) {
      dataIdentityIsInitialRef.current = false
      return
    }
    setRowSelectionState({})
  }, [dataIdentity])

  return [rowSelectionState, setRowSelectionState] as const
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
}: {
  table: Table<T>
  rowSelectionState: RowSelectionState
  rowSelection: ProTableProps<T>['rowSelection']
  getRowKey: (record: T, index: number) => string
}) {
  const selectedModelRows = table.getSelectedRowModel().rows
  const selectedKeys = selectedModelRows.map(row => getRowKey(row.original, row.index))
  const selectedOriginals = selectedModelRows.map(r => r.original)

  // Skip the initial run so `rowSelection.onChange` doesn't fire on mount with `([], [])`
  // — mirrors the `paginationIsInitialRef` guard in use-pro-table-data.ts / types.ts.
  const selectionIsInitialRef = useRef(true)
  useEffect(() => {
    if (selectionIsInitialRef.current) {
      selectionIsInitialRef.current = false
      return
    }
    rowSelection?.onChange?.(selectedKeys, selectedOriginals)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionState])

  return { selectedKeys, selectedOriginals }
}
