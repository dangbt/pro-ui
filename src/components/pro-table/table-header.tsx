import { flexRender, type Table, type Column } from '@tanstack/react-table'
import { cn } from '../../lib/cn'
import { PinMenu, getPinnedStyle, getPinnedCls } from './pin-menu'

interface TableHeaderProps<T> {
  table: Table<T>
  /** Extra classes for the <thead> (sticky positioning etc.). */
  theadClassName?: string
  theadStyle?: React.CSSProperties
  /**
   * Render the interactive <PinMenu>. Only the real header sets this: the
   * sticky window-scroll clone is aria-hidden with pointer-events:none, so a
   * menu there would be unreachable.
   */
  withPinMenu?: boolean
  /**
   * Emit explicit width/minWidth on each <th> from header.getSize(). Only the
   * fixed clone needs this — it lives in a separate <table> and must match the
   * real table's column widths for visual alignment.
   */
  withExplicitWidths?: boolean
  /**
   * Add `pointer-events-auto` to each header cell's inner <span>. Only the
   * fixed clone needs this: its wrapper sets pointer-events:none, so without
   * this override a click on the stuck header text wouldn't reach the <th>'s
   * sort handler — and in window-scroll mode the clone is the only header on
   * screen once stuck, so sorting would be impossible while scrolled down.
   */
  interactiveOverlay?: boolean
}

export function TableHeader<T>({
  table,
  theadClassName,
  theadStyle,
  withPinMenu = false,
  withExplicitWidths = false,
  interactiveOverlay = false,
}: TableHeaderProps<T>) {
  return (
    <thead className={theadClassName} style={theadStyle}>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'
            const canSort = header.column.getCanSort()
            const canPin = header.column.getCanPin()
            const pinned = header.column.getIsPinned()
            return (
              <th
                key={header.id}
                className={cn(
                  'px-4 py-2.5 text-xs font-semibold text-fg-muted uppercase tracking-wide whitespace-nowrap group',
                  header.id === 'select' && 'px-3 text-center',
                  align === 'center' && 'text-center',
                  align === 'right' && 'text-right',
                  canSort && 'cursor-pointer select-none hover:text-fg-2',
                  getPinnedCls(pinned, 'bg-surface-subtle'),
                )}
                style={{
                  ...getPinnedStyle(header.column as Column<unknown, unknown>),
                  ...(withExplicitWidths
                    ? { width: header.getSize(), minWidth: header.getSize() }
                    : {}),
                }}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                aria-sort={canSort ? (header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none') : undefined}
              >
                <span className={cn('inline-flex items-center gap-1', interactiveOverlay && 'pointer-events-auto')}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {canSort && (
                    <span className="text-fg-disabled">
                      {header.column.getIsSorted() === 'asc' ? '↑'
                        : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                    </span>
                  )}
                  {withPinMenu && canPin && (
                    <PinMenu column={header.column as Column<unknown, unknown>} />
                  )}
                </span>
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
