import { type ColumnDef, type AccessorFnColumnDef, type DisplayColumnDef } from '@tanstack/react-table'
import { renderValue } from './render-value'
import type { ProColumnType } from './types'

export function buildColumns<T>(
  proColumns: ProColumnType<T>[],
  liveRef: React.MutableRefObject<Map<string, ProColumnType<T>>>,
): ColumnDef<T>[] {
  return proColumns.filter(col => !col.hideInTable).map(col => {
    const key = (col.key ?? col.dataIndex ?? col.title) as string

    if (col.dataIndex) {
      const field = col.dataIndex
      const def: AccessorFnColumnDef<T, unknown> = {
        id: key,
        header: col.title,
        enableSorting: col.sortable ?? false,
        enableHiding: !(col.disableHiding ?? false),
        enablePinning: col.pinnable ?? false,
        size: typeof col.width === 'number' ? col.width : undefined,
        meta: { align: col.align ?? 'left' },
        accessorFn: (row: T) => (row as Record<string, unknown>)[field],
        cell: ({ getValue, row }) => {
          // Read from live ref so the consumer's latest closure is always used,
          // even when the column array is memoized with stable identity.
          const live = liveRef.current.get(key) ?? col
          const value = getValue()
          if (live.render) return live.render(value, row.original, row.index)
          return renderValue(value, live.valueType ?? 'text', live.valueEnum)
        },
      }
      return def
    }

    // Display column (no dataIndex) — always assign `cell` so adding/removing
    // `render` later doesn't change column structure and trigger remount.
    const def: DisplayColumnDef<T, unknown> = {
      id: key,
      header: col.title,
      enableSorting: false,
      enableHiding: !(col.disableHiding ?? false),
      enablePinning: col.pinnable ?? false,
      size: typeof col.width === 'number' ? col.width : undefined,
      meta: { align: col.align ?? 'left' },
      cell: ({ row }) => {
        const live = liveRef.current.get(key) ?? col
        if (!live.render) return null
        return live.render(undefined, row.original, row.index)
      },
    }
    return def
  })
}
