import { type ColumnDef, type AccessorFnColumnDef, type DisplayColumnDef } from '@tanstack/react-table'
import { renderValue } from './render-value'
import type { ProColumnType } from './types'

export function buildColumns<T>(proColumns: ProColumnType<T>[]): ColumnDef<T>[] {
  return proColumns
    .filter(col => !col.hideInTable)
    .map(col => {
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
            const value = getValue()
            if (col.render) return col.render(value, row.original, row.index)
            return renderValue(value, col.valueType ?? 'text', col.valueEnum)
          },
        }
        return def
      }

      const def: DisplayColumnDef<T, unknown> = {
        id: key,
        header: col.title,
        enableSorting: false,
        enableHiding: !(col.disableHiding ?? false),
        enablePinning: col.pinnable ?? false,
        size: typeof col.width === 'number' ? col.width : undefined,
        meta: { align: col.align ?? 'left' },
        cell: col.render ? ({ row }) => col.render!(undefined, row.original, row.index) : undefined,
      }
      return def
    })
}
