import { useState, useEffect, useRef, useMemo } from 'react'
import type { RowSelectionState, Table } from '@tanstack/react-table'
import type { ProTableProps } from './types'

interface UseRowSelectionStateOptions {
  /** Used to detect data changes for auto-reset in uncontrolled mode. */
  dataIdentity: unknown
  /** Controlled selected row keys from props. */
  selectedRowKeys?: string[]
  /** When true, don't reset selection on data change. */
  preserveSelectedRowKeys?: boolean
}

/**
 * Row-selection state plus the "reset selection when the underlying data
 * changes" effect. Extracted from pro-table.tsx purely to keep that file under
 * its line budget — behaviour is unchanged.
 *
 * Supports both controlled and uncontrolled modes:
 * - Uncontrolled (no selectedRowKeys): manages internal state, resets on data change
 * - Controlled (selectedRowKeys provided): syncs to prop, never auto-resets
 */
export function useRowSelectionState({
  dataIdentity,
  selectedRowKeys,
  preserveSelectedRowKeys,
}: UseRowSelectionStateOptions) {
  // Internal state for uncontrolled mode
  const [internalState, setInternalState] = useState<RowSelectionState>({})

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
  }, [dataIdentity, isControlled, preserveSelectedRowKeys])

  const state = isControlled ? controlledState! : internalState

  // In controlled mode, the setter doesn't update internal state — the parent must
  // update selectedRowKeys. In uncontrolled mode, it updates internal state normally.
  const setState: React.Dispatch<React.SetStateAction<RowSelectionState>> = isControlled
    ? () => {} // no-op, parent controls state via onChange
    : setInternalState

  return [state, setState, setInternalState] as const
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
