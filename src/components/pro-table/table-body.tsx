import { Fragment } from 'react'
import { flexRender, type Table, type Column } from '@tanstack/react-table'
import { cn } from '../../lib/cn'
import { rowPyCls, cellTextCls } from './constants'
import { getPinnedStyle, getPinnedCls } from './pin-menu'
import type { Size } from '../../lib/size'

interface TableBodyProps<T> {
  table: Table<T>
  size: Size
  loading: boolean
  fetchError: string | null
  onRetry: () => void
  getRowKey: (record: T, index: number) => string
  expandedKeys: Set<string>
  toggleExpand: (key: string) => void
  expandedRowRender?: (record: T) => React.ReactNode
  rowClassName?: (record: T, index: number) => string | undefined
  onRow?: (record: T, index: number) => {
    onClick?: React.MouseEventHandler<HTMLTableRowElement>
    onDoubleClick?: React.MouseEventHandler<HTMLTableRowElement>
    onContextMenu?: React.MouseEventHandler<HTMLTableRowElement>
  } | undefined
}

export function TableBody<T>({
  table,
  size,
  loading,
  fetchError,
  onRetry,
  getRowKey,
  expandedKeys,
  toggleExpand,
  expandedRowRender,
  rowClassName,
  onRow,
}: TableBodyProps<T>) {
  // Computed once and reused by every full-width branch below.
  const colSpan = table.getVisibleLeafColumns().length

  return (
    <tbody className="divide-y divide-border-subtle">
      {loading ? (
        <tr>
          <td colSpan={colSpan} className="py-16 text-center text-fg-disabled text-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              Loading...
            </div>
          </td>
        </tr>
      ) : fetchError ? (
        <tr>
          <td colSpan={colSpan} className="py-16 text-center text-sm">
            <div className="flex flex-col items-center gap-2">
              <p className="text-danger font-medium">Failed to load</p>
              <p className="text-fg-disabled text-xs max-w-xs">{fetchError}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-1 px-3 py-1.5 text-xs font-medium rounded-[var(--base-radius)] bg-primary text-white hover:bg-primary-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </td>
        </tr>
      ) : table.getRowModel().rows.length === 0 ? (
        <tr>
          <td colSpan={colSpan} className="py-16 text-center text-fg-disabled text-sm">
            No data
          </td>
        </tr>
      ) : (
        table.getRowModel().rows.map((row, i) => {
          const key = getRowKey(row.original, i)
          const expanded = expandedKeys.has(key)
          const rowHandlers = onRow?.(row.original, i)
          const rowCls = cn(
            'hover:bg-surface-subtle transition-colors',
            (expandedRowRender || rowHandlers?.onClick) && 'cursor-pointer',
            rowClassName?.(row.original, i),
          )
          const handleRowClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
            const interactive = (e.target as HTMLElement).closest(
              'button, a, input, select, textarea, [role="button"], [role="menuitem"], [role="option"], [data-no-expand]',
            )
            if (expandedRowRender && !interactive) toggleExpand(key)
            rowHandlers?.onClick?.(e)
          }
          return (
            <Fragment key={key}>
              <tr
                onClick={expandedRowRender || rowHandlers?.onClick ? handleRowClick : undefined}
                onDoubleClick={rowHandlers?.onDoubleClick}
                onContextMenu={rowHandlers?.onContextMenu}
                className={rowCls}
              >
                {row.getVisibleCells().map(cell => {
                  const align = (cell.column.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'
                  const pinned = cell.column.getIsPinned()
                  return (
                    <td
                      key={cell.id}
                      className={cn(
                        'px-4 text-fg-2',
                        rowPyCls[size],
                        cellTextCls[size],
                        cell.column.id === 'select' && 'px-3 text-center',
                        cell.column.id === 'expand' && 'px-2 text-center',
                        align === 'center' && 'text-center',
                        align === 'right' && 'text-right',
                        getPinnedCls(pinned, 'bg-surface'),
                      )}
                      style={getPinnedStyle(cell.column as Column<unknown, unknown>)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}
              </tr>
              {expandedRowRender && expanded && (
                <tr className="bg-surface-subtle">
                  <td colSpan={colSpan} className="px-0 py-0">
                    {expandedRowRender(row.original)}
                  </td>
                </tr>
              )}
            </Fragment>
          )
        })
      )}
    </tbody>
  )
}
