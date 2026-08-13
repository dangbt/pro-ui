import { Fragment, useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type RowSelectionState,
  type VisibilityState,
  type ColumnPinningState,
  type ColumnDef,
  type Column,
} from '@tanstack/react-table'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SearchForm } from './search-form'
import { Toolbar, buildColumnToggles } from './toolbar'
import { buildColumns } from './build-columns'
import { IndeterminateCheckbox } from './checkbox'
import { PinMenu, getPinnedStyle, getPinnedCls } from './pin-menu'
import { Pagination } from './pagination'
import { BulkActions } from './bulk-actions'
import { useSticky } from './use-sticky'
import { useProTableData } from './use-pro-table-data'
import { rowPyCls, cellTextCls, PAGE_SIZE_OPTIONS } from './constants'
import type { ProTableProps } from './types'

export function ProTable<T extends object>({
  columns: columnDefs,
  request,
  dataSource,
  params,
  refreshToken,
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
  persistColumnVisibility = true,
  sticky = false,
}: ProTableProps<T>) {
  // ─── Sticky ───
  const {
    stickyEnabled,
    stickyOffsetTop,
    stickyWindowScroll,
    stickyMaxHeight,
    effectiveMaxHeight,
    scrollRef,
    wsSentinelRef,
    wsWrapperRef,
    wsTheadRef,
    wsTableRef,
    wsIsSticky,
    wsScrollLeft,
    wsStyle,
    wsHandleScroll,
  } = useSticky({ sticky })

  // ─── Data ───
  const {
    isClientMode,
    tableData,
    serverTotal,
    loading: loadingData,
    fetchError,
    searchParams,
    sorting,
    setSorting,
    pagination,
    setPagination,
    handleSearch,
    handleReset,
    fetchData,
    dataIdentity,
  } = useProTableData({
    request,
    dataSource,
    params,
    refreshToken,
    rowKey,
    defaultPageSize: paginationConfig?.defaultPageSize ?? 10,
    defaultCurrent: paginationConfig?.defaultCurrent,
    onPaginationChange: paginationConfig?.onChange,
  })

  const loading = loadingProp ?? loadingData

  // ─── Column visibility persistence ───
  const persistVisibility = persistColumnVisibility !== false
  const visibilityStorageKey = useMemo(() => {
    if (typeof persistColumnVisibility === 'string') return persistColumnVisibility
    const cols = columnDefs.map(c => (c.key ?? c.dataIndex ?? c.title) as string).join(',')
    return `pro-table:colvis:${headerTitle ?? ''}:${cols}`
  }, [persistColumnVisibility, columnDefs, headerTitle])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const defaults = Object.fromEntries(
      columnDefs.filter(c => c.hideInTable).map(c => [(c.key ?? c.dataIndex ?? c.title) as string, false]),
    )
    if (!persistVisibility || typeof window === 'undefined') return defaults
    try {
      const stored = window.localStorage.getItem(visibilityStorageKey)
      if (stored) return { ...defaults, ...(JSON.parse(stored) as VisibilityState) }
    } catch {
      /* ignore */
    }
    return defaults
  })
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({})

  useEffect(() => {
    if (!persistVisibility || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(visibilityStorageKey, JSON.stringify(columnVisibility))
    } catch {
      /* storage may be full or unavailable */
    }
  }, [persistVisibility, visibilityStorageKey, columnVisibility])

  // ─── Row selection ───
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})
  useEffect(() => { setRowSelectionState({}) }, [dataIdentity])

  // ─── Expand ───
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  // ─── Columns ───
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record)
    const val = (record as Record<string, unknown>)[rowKey as string]
    return val != null ? String(val) : String(index)
  }

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

  const builtColumns = useMemo(() => buildColumns(columnDefs), [columnDefs])

  const columns = [
    ...(expandedRowRender ? [expandColumn] : []),
    ...(rowSelection ? [selectionColumn] : []),
    ...builtColumns,
  ]

  // ─── Table instance ───
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
    ...(isClientMode
      ? { getPaginationRowModel: getPaginationRowModel() }
      : { manualPagination: true, rowCount: serverTotal }),
    enableRowSelection: !!rowSelection,
  })

  // ─── Selection derived state ───
  const selectedModelRows = table.getSelectedRowModel().rows
  const selectedKeys = selectedModelRows.map((row, i) => getRowKey(row.original, i))
  const selectedOriginals = selectedModelRows.map(r => r.original)

  useEffect(() => {
    rowSelection?.onChange?.(selectedKeys, selectedOriginals)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelectionState])

  const columnToggles = buildColumnToggles(table.getAllLeafColumns() as Column<unknown, unknown>[])
  const pageSizeOptions = paginationConfig?.pageSizeOptions ?? PAGE_SIZE_OPTIONS

  // ─── Render ───
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

      {/* Table wrapper */}
      <div>
      <div className={cn(
        'bg-surface border border-border rounded-[var(--base-radius)]',
        stickyEnabled && !stickyMaxHeight && !stickyWindowScroll ? 'overflow-x-clip' : 'overflow-hidden',
      )}>
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

        {/* Sentinel for window-scroll sticky detection */}
        {stickyWindowScroll && <div ref={wsSentinelRef as unknown as React.Ref<HTMLDivElement>} className="h-0 w-full" />}

        {/* Fixed header clone for window-scroll sticky mode */}
        {stickyWindowScroll && wsIsSticky && createPortal(
          <div style={wsStyle} aria-hidden="true">
            <table
              className="w-full text-sm bg-surface-subtle border-b border-border"
              style={{
                width: wsTableRef.current?.offsetWidth,
                transform: `translateX(-${wsScrollLeft}px)`,
              }}
            >
              <thead className="bg-surface-subtle border-b border-border shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      const align = (header.column.columnDef.meta as { align?: string } | undefined)?.align ?? 'left'
                      const canSort = header.column.getCanSort()
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
                            width: header.getSize(),
                            minWidth: header.getSize(),
                          }}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        >
                          <span className="inline-flex items-center gap-1 pointer-events-auto">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span className="text-fg-disabled">
                                {header.column.getIsSorted() === 'asc' ? '↑'
                                  : header.column.getIsSorted() === 'desc' ? '↓' : '↕'}
                              </span>
                            )}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
            </table>
          </div>,
          document.body,
        )}

        {/* Table scroll container */}
        <div
          ref={(el) => {
            (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el
            if (stickyWindowScroll) (wsWrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          }}
          className={
            stickyWindowScroll
              ? 'overflow-x-auto'
              : stickyMaxHeight
                ? 'overflow-auto'
                : stickyEnabled
                  ? 'overflow-x-clip'
                  : 'overflow-x-auto'
          }
          style={effectiveMaxHeight ? { maxHeight: effectiveMaxHeight } : undefined}
          onScroll={stickyWindowScroll ? wsHandleScroll : undefined}
        >
          <table ref={stickyWindowScroll ? wsTableRef as unknown as React.Ref<HTMLTableElement> : undefined} className="w-full text-sm">
            <thead ref={stickyWindowScroll ? wsTheadRef as unknown as React.Ref<HTMLTableSectionElement> : undefined} className={cn(
              'bg-surface-subtle border-b border-border',
              stickyEnabled && !stickyWindowScroll && 'sticky z-[3]',
            )} style={stickyEnabled && !stickyWindowScroll ? { top: stickyOffsetTop } : undefined}>
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
                        aria-sort={canSort ? (header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none') : undefined}
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
              ) : fetchError ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-danger font-medium">Failed to load</p>
                      <p className="text-fg-disabled text-xs max-w-xs">{fetchError}</p>
                      <button
                        type="button"
                        onClick={() => fetchData({ current: pagination.pageIndex + 1, pageSize: pagination.pageSize, ...searchParams })}
                        className="mt-1 px-3 py-1.5 text-xs font-medium rounded-[var(--base-radius)] bg-primary text-white hover:bg-primary-600 transition-colors"
                      >
                        Retry
                      </button>
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
        <Pagination
          table={table}
          pagination={pagination}
          setPagination={setPagination}
          serverTotal={serverTotal}
          size={size}
          pageSizeOptions={pageSizeOptions}
        />
      </div>

      {/* Bulk action bar */}
      {rowSelection && (
        <BulkActions
          selectedKeys={selectedKeys}
          selectedOriginals={selectedOriginals}
          bulkActions={bulkActions}
          onClear={() => setRowSelectionState({})}
        />
      )}
      </div>
    </div>
  )
}
