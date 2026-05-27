import { Fragment, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
  type VisibilityState,
  type ColumnPinningState,
  type ColumnDef,
  type Column,
} from '@tanstack/react-table'
import { Pin, PinOff, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SearchForm } from './search-form'
import { Toolbar, buildColumnToggles } from './toolbar'
import { buildColumns } from './build-columns'
import type { ProTableProps, QueryParams } from './types'
import type { Size } from '../../lib/size'

const pageSizeCls: Record<Size, string> = {
  sm: 'h-[var(--sz)] px-2 text-xs',
  md: 'h-[var(--sz)] px-3 text-sm',
  lg: 'h-[var(--sz)] px-3 text-base',
}

const rowPyCls: Record<Size, string> = {
  sm: 'py-1.5',
  md: 'py-2.5',
  lg: 'py-3.5',
}

const cellTextCls: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

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
      className={cn('w-4 h-4 rounded border-border cursor-pointer accent-primary', className)}
      {...rest}
    />
  )
}

function PinMenu<T>({ column }: { column: Column<T, unknown> }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pinned = column.getIsPinned()

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setPos({ top: rect.bottom + 4, left: rect.left })
    setOpen(v => !v)
  }

  return (
    <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={cn(
          'flex items-center rounded p-0.5 transition-colors',
          pinned
            ? 'text-primary hover:text-primary-600'
            : 'text-fg-disabled hover:text-fg-2',
        )}
        title={pinned ? 'Pinned' : 'Pin column'}
      >
        {pinned ? <Pin className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="fixed min-w-[120px] rounded-[var(--base-radius)] border border-border bg-surface shadow-lg py-1"
          style={{ top: pos.top, left: pos.left, zIndex: 9999 }}
        >
          {pinned !== 'left' && (
            <button
              type="button"
              onClick={() => { column.pin('left'); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-fg-2 hover:bg-surface-subtle text-left"
            >
              <Pin className="w-3 h-3 rotate-45" /> Pin left
            </button>
          )}
          {pinned !== 'right' && (
            <button
              type="button"
              onClick={() => { column.pin('right'); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-fg-2 hover:bg-surface-subtle text-left"
            >
              <Pin className="w-3 h-3 -rotate-45" /> Pin right
            </button>
          )}
          {pinned && (
            <button
              type="button"
              onClick={() => { column.pin(false); setOpen(false) }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-fg-2 hover:bg-surface-subtle text-left"
            >
              <PinOff className="w-3 h-3" /> Unpin
            </button>
          )}
        </div>,
        document.body,
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
  dataSource,
  rowKey,
  headerTitle,
  toolBarRender,
  search = true,
  loading: loadingProp,
  pagination: paginationConfig,
  rowSelection,
  bulkActions,
  expandedRowRender,
  rowClassName,
  onRow,
  size = 'sm',
}: ProTableProps<T>) {
  const isClientMode = !request && dataSource !== undefined

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // Server-side state
  const [serverData, setServerData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loadingServer, setLoadingServer] = useState(false)
  const [searchParams, setSearchParams] = useState<Record<string, unknown>>({})

  // Shared state
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

  // Client-side: filter dataSource by searchParams
  const filteredClientData = useMemo(() => {
    if (!isClientMode || !dataSource) return []
    if (Object.keys(searchParams).length === 0) return dataSource
    return dataSource.filter(row => {
      return Object.entries(searchParams).every(([key, val]) => {
        if (val === undefined || val === null || val === '') return true
        const cell = (row as Record<string, unknown>)[key]
        return String(cell ?? '').toLowerCase().includes(String(val).toLowerCase())
      })
    })
  }, [isClientMode, dataSource, searchParams])

  const loading = loadingProp ?? loadingServer

  const fetchData = useCallback(
    async (params: QueryParams) => {
      if (!request) return
      setLoadingServer(true)
      try {
        const result = await request(params)
        if (result.success) {
          setServerData(result.data)
          setTotal(result.total)
        }
      } finally {
        setLoadingServer(false)
      }
    },
    [request],
  )

  useEffect(() => {
    if (isClientMode) return
    const sort = sorting[0]
    fetchData({
      current: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      ...(sort && { sort: sort.id, order: sort.desc ? 'desc' : 'asc' }),
      ...searchParams,
    })
  }, [pagination.pageIndex, pagination.pageSize, sorting, searchParams, fetchData, isClientMode])

  const handleSearch = useCallback((params: Record<string, unknown>) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearchParams(params)
  }, [])

  const handleReset = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearchParams({})
  }, [])

  // In client mode: use filteredClientData; in server mode: use serverData
  const tableData = isClientMode ? filteredClientData : serverData
  const serverTotal = isClientMode ? filteredClientData.length : total

  useEffect(() => { setRowSelectionState({}) }, [tableData])

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

  const expandColumn: ColumnDef<T> = {
    id: 'expand',
    size: 40,
    enableSorting: false,
    enableHiding: false,
    enablePinning: false,
    header: () => null,
    cell: ({ row }) => {
      const key = getRowKey(row.original, row.index)
      const expanded = expandedKeys.has(key)
      return (
        <span className="flex items-center justify-center text-fg-disabled">
          {expanded
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />}
        </span>
      )
    },
  }

  const columns = [
    ...(expandedRowRender ? [expandColumn] : []),
    ...(rowSelection ? [selectionColumn] : []),
    ...buildColumns(columnDefs),
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, pagination, rowSelection: rowSelectionState, columnVisibility, columnPinning },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelectionState,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Client mode: table handles pagination internally
    ...(isClientMode
      ? { getPaginationRowModel: getPaginationRowModel() }
      : { manualPagination: true, rowCount: serverTotal }),
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
    'inline-flex items-center justify-center min-w-8 px-2 border border-border bg-surface text-fg-muted',
    'rounded-[var(--base-radius)] hover:bg-surface-subtle transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    pageSizeCls[size],
  )

  const columnToggles = buildColumnToggles(table.getAllLeafColumns() as Column<unknown, unknown>[])

  return (
    <div className="space-y-3">
      {search && (
        <SearchForm
          columns={columnDefs}
          onSearch={handleSearch}
          onReset={handleReset}
          size={size}
        />
      )}

      <div className="bg-surface border border-border rounded-[var(--base-radius)] overflow-hidden">
        <Toolbar
          title={headerTitle}
          actions={toolBarRender?.()}
          columnToggles={columnToggles}
          onRefresh={isClientMode ? undefined : () =>
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
            <thead className="bg-surface-subtle border-b border-border sticky top-0 z-[1]">
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
                        style={getPinnedStyle(header.column as Column<unknown, unknown>)}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-fg-disabled">
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

            <tbody className="divide-y divide-border-subtle">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-fg-disabled text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-fg-disabled text-sm">
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
                    // Don't expand when clicking interactive elements (buttons, links, inputs…)
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
                          <td colSpan={columns.length} className="px-0 py-0">
                            {expandedRowRender(row.original)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-center sm:justify-between px-4 py-2.5 border-t border-border gap-2">
          <div className="flex items-center gap-2 text-sm text-fg-muted">
            <span>Total {serverTotal.toLocaleString()} records</span>
            <select
              value={pagination.pageSize}
              onChange={e => setPagination(prev => ({ ...prev, pageSize: Number(e.target.value), pageIndex: 0 }))}
              className={cn(pageSizeCls[size], 'border border-border rounded-[var(--base-radius)] bg-surface text-fg cursor-pointer')}
            >
              {pageSizeOptions.map(s => (
                <option key={s} value={s}>{s} / page</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button className={cn(paginationBtnCls, 'hidden sm:inline-flex')} onClick={() => table.firstPage()} disabled={!canPrev} title="First page">«</button>
            <button className={paginationBtnCls} onClick={() => table.previousPage()} disabled={!canPrev} title="Previous page">‹</button>
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              const total5 = Math.min(pageCount, 5)
              const base = Math.max(0, Math.min(pagination.pageIndex - 2, pageCount - total5))
              const page = base + i
              const isOuter = total5 === 5 && (i === 0 || i === total5 - 1)
              return (
                <button
                  key={page}
                  className={cn(
                    paginationBtnCls,
                    page === pagination.pageIndex && 'bg-primary text-white border-primary hover:bg-primary-600',
                    isOuter && page !== pagination.pageIndex && 'hidden sm:inline-flex',
                  )}
                  onClick={() => setPagination(prev => ({ ...prev, pageIndex: page }))}
                >
                  {page + 1}
                </button>
              )
            })}
            <button className={paginationBtnCls} onClick={() => table.nextPage()} disabled={!canNext} title="Next page">›</button>
            <button className={cn(paginationBtnCls, 'hidden sm:inline-flex')} onClick={() => table.lastPage()} disabled={!canNext} title="Last page">»</button>
          </div>
        </div>
      </div>

      {/* Bulk action bar — sticky island */}
      {rowSelection && selectedKeys.length > 0 && (
        <div className="sticky bottom-4 z-10 flex justify-center pointer-events-none">
          <div className="pointer-events-auto flex flex-wrap items-center gap-3 px-5 py-3 rounded-2xl bg-fg text-canvas shadow-[0_8px_32px_rgba(0,0,0,0.25)] max-w-[calc(100vw-2rem)]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{selectedKeys.length} selected</span>
              <button
                type="button"
                onClick={() => setRowSelectionState({})}
                className="text-xs text-fg-disabled hover:text-canvas transition-colors underline underline-offset-2"
              >
                Clear
              </button>
            </div>
            {bulkActions && bulkActions.length > 0 && (
              <>
                <div className="hidden sm:block w-px h-4 bg-white/20" />
                <div className="flex flex-wrap items-center gap-2">
                  {bulkActions.map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => action.onClick(selectedKeys, selectedOriginals)}
                      className={cn(
                        'px-3.5 py-1.5 text-sm rounded-xl font-medium transition-colors',
                        action.danger
                          ? 'bg-red-500 hover:bg-red-400 text-white'
                          : 'bg-canvas hover:bg-surface text-fg',
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
