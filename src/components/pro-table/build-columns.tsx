import type { ReactNode } from 'react'
import { type ColumnDef, type AccessorFnColumnDef, type DisplayColumnDef } from '@tanstack/react-table'
import { renderValue } from './render-value'
import type { ProColumnType } from './types'

/**
 * Column metadata passed through TanStack Table's meta field.
 * Used by table-header.tsx and table-body.tsx for rendering.
 */
export interface ColumnMeta {
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  tooltip?: ReactNode
  /** String representation of title for column toggle when title is ReactNode */
  titleString?: string
}

export function buildColumns<T>(
  proColumns: ProColumnType<T>[],
  liveRef: React.MutableRefObject<Map<string, ProColumnType<T>>>,
  locale?: string,
  currency?: string,
): ColumnDef<T>[] {
  return proColumns.filter(col => !col.hideInTable).map(col => {
    const key = (col.key ?? col.dataIndex ?? (typeof col.title === 'string' ? col.title : '')) as string

    if (!import.meta.env.PROD && !key) {
      // eslint-disable-next-line no-console
      console.warn(
        '[ProTable] A column has a ReactNode title but no `key` or `dataIndex`. ' +
          'Multiple such columns will share an empty id, causing unexpected behavior. ' +
          'Add a unique `key` to each column.',
      )
    }

    // Derive string title for column toggle UI when title is ReactNode
    const titleString = typeof col.title === 'string'
      ? col.title
      : col.key ?? col.dataIndex ?? undefined

    const meta: ColumnMeta = {
      align: col.align ?? 'left',
      ellipsis: col.ellipsis,
      tooltip: col.tooltip,
      titleString: titleString as string | undefined,
    }

    if (col.dataIndex) {
      const field = col.dataIndex
      const def: AccessorFnColumnDef<T, unknown> = {
        id: key,
        header: typeof col.title === 'string' ? col.title : () => col.title,
        enableSorting: col.sortable ?? false,
        enableHiding: !(col.disableHiding ?? false),
        enablePinning: col.pinnable ?? false,
        size: typeof col.width === 'number' ? col.width : undefined,
        meta,
        accessorFn: (row: T) => (row as Record<string, unknown>)[field],
        cell: ({ getValue, row }) => {
          // Read from live ref so the consumer's latest closure is always used,
          // even when the column array is memoized with stable identity.
          const live = liveRef.current.get(key) ?? col
          const value = getValue()
          if (live.render) return live.render(value, row.original, row.index)
          return renderValue(value, live.valueType ?? 'text', live.valueEnum, locale, currency)
        },
      }
      return def
    }

    // Display column (no dataIndex) — always assign `cell` so adding/removing
    // `render` later doesn't change column structure and trigger remount.
    const def: DisplayColumnDef<T, unknown> = {
      id: key,
      header: typeof col.title === 'string' ? col.title : () => col.title,
      enableSorting: false,
      enableHiding: !(col.disableHiding ?? false),
      enablePinning: col.pinnable ?? false,
      size: typeof col.width === 'number' ? col.width : undefined,
      meta,
      cell: ({ row }) => {
        const live = liveRef.current.get(key) ?? col
        if (!live.render) return null
        return live.render(undefined, row.original, row.index)
      },
    }
    return def
  })
}
