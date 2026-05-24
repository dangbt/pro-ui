import { useState, useCallback, useEffect, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
  type VisibilityState,
  type ColumnPinningState,
  type ColumnDef,
  type Column,
} from '@tanstack/react-table'
import { Pin, PinOff } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SearchForm } from './search-form'
import { Toolbar, buildColumnToggles } from './toolbar'
import { buildColumns } from './build-columns'
import type { ProTableProps, QueryParams } from './types'

function IndeterminateCheckbox({
  indeterminate,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate ?? false
  }, [indeterminate])
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('w-4 h-4 rounded border-gray-300 cursor-pointer accent-primary', className)}
      {...rest}
    />
  )
}

function PinMenu<T>({ column }: { column: Column<T, unknown> }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pinned = column.getIsPinned()

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          'rounded p-0.5 transition-colors',
          pinned
            ? 'text-primary hover:text-primary-600'
            : 'text-gray-400 hover:text-gray-600',
        )}
        title={pinned ? 'Pinned' : 'Pin column'}
      >
        {pinned ? <Pin className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[120px] rounded-[var(--base-radius)] border border-border bg-white shadow-lg py-1">
          {pinned !== 'left' && (
            <button
              type="button"
              onClick={() => { column.pin('left'); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left"
            >
              <Pin className="w-3 h-3 rotate-45" /> Pin left
            </button>
          )}
          {pinned !== 'right' && (
            <button
              type="button"
              onClick={() => { column.pin('right'); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left"
            >
              <Pin className="w-3 h-3 -rotate-45" /> Pin right
            </button>
          )}
          {pinned && (
            <button
              type="button"
              onClick={() => { column.pin(false); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 text-left"
            >
              <PinOff className="w-3 h-3" /> Unpin
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function getPinnedStyle(column: Column<unknown, unknown>) {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined
  return {
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
  }
}

function getPinnedCls(pinned: false | 'left' | 'right', bg: string) {
  if (!pinned) return ''
  return cn(
    `sticky z-[1] ${bg}`,
    pinned === 'left' && 'shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]',
    pinned === 'right' && 'shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.08)]',
  )
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export function ProTable<T extends object>({
  columns: columnDefs,
  request,
  rowKey,
  headerTitle,
  toolBarRender,
  search = true,
  pagination: paginationConfig,
  rowSelection,
  bulkActions,
}: ProTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: paginationConfig?.defaultPageSize ?? 10,
  })
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    Object.fromEntries(columnDefs.filter(c => c.hideInTable).map(c => [(c.key ?? c.dataIndex ?? c.title) as string, false]))
  )
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({})

  const fetchData = useCallback(
    async (params: QueryParams) => {
      setLoading(true)
      try {
        const result = await request(params)
        if (result.success) {
          setData(result.data)
          setTotal(result.total)
        }
      } finally {
        setLoading(false)
      }
    },
    [request],
  )

  useEffect(() => {
    const sort = sorting[0]
    fetchData({
      current: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sort && { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }),
      ...searchParams,
    })
  }, [pagination.pageIndex, pagination.pageSize, sorting, searchParams, fetchData])

  const handleSearch = useCallback((params: Record<string, unknown>) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearchParams(params)
  }, [])

  const handleReset = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearchParams({})
  }, [])

  useEffect(() => { setRowSelectionState({}) }, [data])

  const selectionColumn: ColumnDef<T> = {
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
  }

  const columns = rowSelection
    ? [selectionColumn, ...buildColumns(columnDefs)]
    : buildColumns(columnDefs)

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, rowSelection: rowSelectionState, columnVisibility, columnPinning },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelectionState,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    rowCount: total,
    enableRowSelection: !!rowSelection,
  })

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record)
    const val = (record as Record<string, unknown>)[rowKey as string]
    return val != null ? String(val) : String(index)
  }

  const selectedModelRows = table.getSelectedRowModel().rows
  const selectedKeys = selectedModelRows.map((row, i) => getRowKey(row.original, i))
  const selectedOriginals = selectedModelRows.map(r => r.original)

  useEffect(() => {
    rowSelection?.onChange?.(selectedKeys, selectedOriginals)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionState])

  const pageSizeOptions = paginationConfig?.pageSizeOptions ?? PAGE_SIZE_OPTIONS
  const pageCount = table.getPageCount()
  const canPrev = table.getCanPreviousPage()
  const canNext = table.getCanNextPage()

  const paginationBtnCls = cn(
    'h-8 min-w-8 px-2 text-sm border border-border bg-white text-gray-600',
    'rounded-[var(--base-radius)] hover:bg-gray-50 transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  )

  const columnToggles = buildColumnToggles(table.getAllLeafColumns() as Column<unknown, unknown>[])

  return (
    <div className="space-y-3">
      {search && (
        <SearchForm
          columns={columnDefs}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      )}

      <div className="bg-white border border-border rounded-[var(--base-radius)] overflow-hidden">
        <Toolbar
          title={headerTitle}
          actions={toolBarRender?.()}
          columnToggles={columnToggles}
          onRefresh={() =>
            fetchData({
              current: pagination.pageIndex + 1,
              pageSize: pagination.pageSize,
              ...searchParams,
            })
          }
        />

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
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
                          'px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap group',
                          header.id === 'select' && 'px-3 text-center',
                          align === 'center' && 'text-center',
                          align === 'right' && 'text-right',
                          canSort && 'cursor-pointer select-none hover:text-gray-700',
                          getPinnedCls(pinned, 'bg-gray-50'),
                        )}
                        style={getPinnedStyle(header.column as Column<unknown, unknown>)}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-gray-300">
                              {header.column.getIsSorted() === 'asc' ? '↑'
                                : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                            </span>
                          )}
                          {canPin && (
                            <PinMenu column={header.column as Column<unknown, unknown>} />
                          )}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-gray-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-gray-400 text-sm">
                    No data
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr key={getRowKey(row.original, i)} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map(cell => {
                      const align = (cell.column.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'
                      const pinned = cell.column.getIsPinned()
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'px-4 py-3 text-gray-700',
                            cell.column.id === 'select' && 'px-3 text-center',
                            align === 'center' && 'text-center',
                            align === 'right' && 'text-right',
                            getPinnedCls(pinned, 'bg-white'),
                          )}
                          style={getPinnedStyle(cell.column as Column<unknown, unknown>)}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-t border-border gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Total {total.toLocaleString()} records</span>
            <select
              value={pagination.pageSize}
              onChange={e => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }))}
              className="h-8 px-2 text-sm border border-border rounded-[var(--base-radius)] bg-white cursor-pointer"
            >
              {pageSizeOptions.map(s => (
                <option key={s} value={s}>{s} / page</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button className={paginationBtnCls} onClick={() => table.firstPage()} disabled={!canPrev} title="First page">«</button>
            <button className={paginationBtnCls} onClick={() => table.previousPage()} disabled={!canPrev} title="Previous page">‹</button>
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              const base = Math.max(0, Math.min(pagination.pageIndex - 2, pageCount - 5))
              const page = base + i
              return (
                <button
                  key={page}
                  className={cn(paginationBtnCls, page === pagination.pageIndex && 'bg-primary text-white border-primary hover:bg-primary-600')}
                  onClick={() => setPagination(prev => ({ ...prev, pageIndex: page }))}
                >
                  {page + 1}
                </button>
              )
            })}
            <button className={paginationBtnCls} onClick={() => table.nextPage()} disabled={!canNext} title="Next page">›</button>
            <button className={paginationBtnCls} onClick={() => table.lastPage()} disabled={!canNext} title="Last page">»</button>
          </div>
        </div>
      </div>

      {/* Bulk action bar — sticky island */}
      {rowSelection && selectedKeys.length > 0 && (
        <div className="sticky bottom-4 z-10 flex justify-center pointer-events-none">
          <div className="pointer-events-auto inline-flex items-center gap-4 px-5 py-3 rounded-2xl bg-gray-900 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{selectedKeys.length} selected</span>
              <button
                type="button"
                onClick={() => setRowSelectionState({})}
                className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-2"
              >
                Clear
              </button>
            </div>
            {bulkActions && bulkActions.length > 0 && (
              <>
                <div className="w-px h-4 bg-white/20" />
                <div className="flex items-center gap-2">
                  {bulkActions.map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => action.onClick(selectedKeys, selectedOriginals)}
                      className={cn(
                        'px-3.5 py-1.5 text-sm rounded-xl font-medium transition-colors',
                        action.danger
                          ? 'bg-red-500 hover:bg-red-400 text-white'
                          : 'bg-white hover:bg-gray-100 text-gray-900',
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
