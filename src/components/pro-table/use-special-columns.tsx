import { useMemo, useRef } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { IndeterminateCheckbox } from './checkbox'

interface UseSpecialColumnsOptions<T> {
  hasExpand: boolean
  hasSelection: boolean
  expandedKeys: Set<string>
  getRowKey: (record: T, index: number) => string
}

/**
 * Builds the leading "expand" and "select" columns with stable identity so
 * TanStack never rebuilds them (which would remount every cell). Both column
 * defs read live state via refs, exactly as they did inline in pro-table.tsx.
 */
export function useSpecialColumns<T>({
  hasExpand,
  hasSelection,
  expandedKeys,
  getRowKey,
}: UseSpecialColumnsOptions<T>): ColumnDef<T>[] {
  // Live refs so the memoized column defs read fresh state without new identity.
  const expandedKeysRef = useRef(expandedKeys)
  expandedKeysRef.current = expandedKeys
  const getRowKeyRef = useRef(getRowKey)
  getRowKeyRef.current = getRowKey

  const expandColumn: ColumnDef<T> = useMemo(() => ({
    id: 'expand',
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    header: () => null,
    cell: ({ row }) => {
      const key = getRowKeyRef.current(row.original, row.index)
      const expanded = expandedKeysRef.current.has(key)
      return (
        <span className="flex items-center justify-center text-fg-disabled">
          {expanded
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />}
        </span>
      )
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  const selectionColumn: ColumnDef<T> = useMemo(() => ({
    id: 'select',
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    header: ({ table }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }), [])

  return useMemo(() => [
    ...(hasExpand ? [expandColumn] : []),
    ...(hasSelection ? [selectionColumn] : []),
  ], [hasExpand, expandColumn, hasSelection, selectionColumn])
}
