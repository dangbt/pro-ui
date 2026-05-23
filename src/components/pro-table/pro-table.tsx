import { useState, useCallback, useEffect, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
  type ColumnDef,
} from '@tanstack/react-table'
import { cn } from '../../lib/cn'
import { SearchForm } from './search-form'
import { Toolbar } from './toolbar'
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

  // Reset selection when data changes (page/search change)
  useEffect(() => { setRowSelectionState({}) }, [data])

  const selectionColumn: ColumnDef<T> = {
    id: 'select',
    size: 40,
    enableSorting: false,
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
    state: { sorting, pagination, rowSelection: rowSelectionState },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelectionState,
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
    'h-8 min-w-8 px-2 text-sm border border-gray-200 bg-white text-gray-600',
    'rounded-[var(--base-radius)] hover:bg-gray-50 transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
  )

  return (
    <div className="space-y-3">
      {search && (
        <SearchForm
          columns={columnDefs}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      )}

      <div className="bg-white border border-gray-200 rounded-[var(--base-radius)] overflow-hidden">
        <Toolbar
          title={headerTitle}
          actions={toolBarRender?.()}
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
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'
                    const canSort = header.column.getCanSort()
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap',
                          header.id === 'select' && 'px-3 text-center',
                          align === 'center' && 'text-center',
                          align === 'right' && 'text-right',
                          canSort && 'cursor-pointer select-none hover:text-gray-700',
                        )}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-gray-300">
                              {header.column.getIsSorted() === 'asc'
                                ? '↑'
                                : header.column.getIsSorted() === 'desc'
                                  ? '↓'
                                  : '↕'}
                            </span>
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
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center text-gray-400 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-16 text-center text-gray-400 text-sm"
                  >
                    No data
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={getRowKey(row.original, i)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => {
                      const align =
                        (cell.column.columnDef.meta as { align?: string } | undefined)?.align ??
                        'left'
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            'px-4 py-3 text-gray-700',
                            cell.column.id === 'select' && 'px-3 text-center',
                            align === 'center' && 'text-center',
                            align === 'right' && 'text-right',
                          )}
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
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-t border-gray-100 gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Total {total.toLocaleString()} records</span>
            <select
              value={pagination.pageSize}
              onChange={e =>
                setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }))
              }
              className="h-8 px-2 text-sm border border-gray-200 rounded-[var(--base-radius)] bg-white cursor-pointer"
            >
              {pageSizeOptions.map(s => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              className={paginationBtnCls}
              onClick={() => table.firstPage()}
              disabled={!canPrev}
              title="First page"
            >
              «
            </button>
            <button
              className={paginationBtnCls}
              onClick={() => table.previousPage()}
              disabled={!canPrev}
              title="Previous page"
            >
              ‹
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              const base = Math.max(0, Math.min(pagination.pageIndex - 2, pageCount - 5))
              const page = base + i
              return (
                <button
                  key={page}
                  className={cn(
                    paginationBtnCls,
                    page === pagination.pageIndex &&
                      'bg-primary text-white border-primary hover:bg-primary-600',
                  )}
                  onClick={() => setPagination(prev => ({ ...prev, pageIndex: page }))}
                >
                  {page + 1}
                </button>
              )
            })}

            <button
              className={paginationBtnCls}
              onClick={() => table.nextPage()}
              disabled={!canNext}
              title="Next page"
            >
              ›
            </button>
            <button
              className={paginationBtnCls}
              onClick={() => table.lastPage()}
              disabled={!canNext}
              title="Last page"
            >
              »
            </button>
          </div>
        </div>
      </div>
      {/* Bulk action bar — fixed bottom, visible when rows are selected */}
      {rowSelection && selectedKeys.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3.5 bg-gray-900 text-white shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              {bulkActions.map((action, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => action.onClick(selectedKeys, selectedOriginals)}
                  className={cn(
                    'px-3.5 py-1.5 text-sm rounded-[var(--base-radius)] font-medium transition-colors',
                    action.danger
                      ? 'bg-red-500 hover:bg-red-400 text-white'
                      : 'bg-white hover:bg-gray-100 text-gray-900',
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
