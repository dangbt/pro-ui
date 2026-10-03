import { useState, useMemo, useCallback, useImperativeHandle } from 'react'
import { createPortal } from 'react-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnPinningState,
  type Column,
} from '@tanstack/react-table'
import { cn } from '../../lib/cn'
import { SearchForm } from './search-form'
import { Toolbar, buildColumnToggles } from './toolbar'
import { Pagination } from './pagination'
import { BulkActions } from './bulk-actions'
import { TableHeader } from './table-header'
import { TableBody } from './table-body'
import { useBuiltColumns } from './use-built-columns'
import { useSpecialColumns } from './use-special-columns'
import { useColumnVisibility } from './use-column-visibility'
import { useExpandedRows } from './use-expanded-rows'
import { useRowSelectionState, useSelectionChange } from './use-row-selection'
import { useSticky } from './use-sticky'
import { useProTableData } from './use-pro-table-data'
import { PAGE_SIZE_OPTIONS } from './constants'
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
  locale,
  currency,
  actionRef,
  defaultSort,
  onSortChange,
  emptyText,
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
    wsTableRef,
    wsIsSticky,
    wsScrollLeft,
    wsTableWidth,
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
    sorting,
    setSorting,
    pagination,
    setPagination,
    handleSearch,
    handleReset,
    formResetKey,
    reload,
    reloadAndReset,
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
    defaultSort,
    onSortChange,
  })

  const loading = loadingProp ?? loadingData

  // ─── Built columns (load-bearing memo machinery — see use-built-columns.ts) ───
  const { builtColumns, columnsSignature } = useBuiltColumns(columnDefs, locale, currency)

  // ─── Column visibility persistence ───
  const [columnVisibility, setColumnVisibility] = useColumnVisibility<T>({
    columnDefs,
    columnsSignature,
    persistColumnVisibility,
    headerTitle,
  })
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({})

  // ─── Row key (needed early for row selection) ───
  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record)
    const val = (record as Record<string, unknown>)[rowKey as string]
    return val != null ? String(val) : String(index)
  }, [rowKey])

  // ─── Row selection ───
  const {
    state: rowSelectionState,
    handleRowSelectionChange,
    clearSelection,
    isControlled: isSelectionControlled,
    selectedRowsCacheRef,
  } = useRowSelectionState<T>({
    dataIdentity,
    rowSelection,
    getRowKey,
    tableData,
  })

  // ─── Imperative handle (actionRef) ───
  useImperativeHandle(actionRef, () => ({
    reload,
    reloadAndReset,
    reset: handleReset,
    clearSelected: clearSelection,
  }), [reload, reloadAndReset, handleReset, clearSelection])

  // ─── Expand ───
  const { expandedKeys, toggleExpand } = useExpandedRows()

  // ─── Leading expand / selection columns (stable identity) ───
  const hasExpand = !!expandedRowRender
  const hasSelection = !!rowSelection
  const specialColumns = useSpecialColumns<T>({
    hasExpand,
    hasSelection,
    expandedKeys,
    getRowKey,
  })

  // ─── Merged columns array ───
  const columns = useMemo(
    () => [...specialColumns, ...builtColumns],
    [specialColumns, builtColumns],
  )

  // ─── Table instance ───
  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, pagination, rowSelection: rowSelectionState, columnVisibility, columnPinning },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    // Server mode: manualSorting prevents client re-sorting server-ordered data.
    // Client mode: sort in-browser.
    ...(isClientMode
      ? { getSortedRowModel: getSortedRowModel() }
      : { manualSorting: true }),
    ...(isClientMode
      ? { getPaginationRowModel: getPaginationRowModel() }
      : { manualPagination: true, rowCount: serverTotal }),
    enableRowSelection: !!rowSelection,
    // Use rowKey for row identity so selection state keys match the record's key,
    // not the row's index in the current page.
    getRowId: (row, index) => getRowKey(row, index),
  })

  // ─── Selection derived state ───
  const { selectedKeys, selectedOriginals } = useSelectionChange<T>({
    table,
    rowSelectionState,
    rowSelection,
    getRowKey,
    isControlled: isSelectionControlled,
    selectedRowsCacheRef,
  })

  const columnToggles = buildColumnToggles(table.getAllLeafColumns() as Column<unknown, unknown>[])
  const pageSizeOptions = paginationConfig?.pageSizeOptions ?? PAGE_SIZE_OPTIONS

  // ─── Render ───
  return (
    <div className="space-y-3">
      {search && (
        <SearchForm
          key={formResetKey}
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
          onRefresh={isClientMode ? undefined : reload}
        />

        {/* Sentinel for window-scroll sticky detection */}
        {stickyWindowScroll && <div ref={wsSentinelRef as unknown as React.Ref<HTMLDivElement>} className="h-0 w-full" />}

        {/* Fixed header clone for window-scroll sticky mode */}
        {stickyWindowScroll && wsIsSticky && createPortal(
          <div style={wsStyle} aria-hidden="true">
            <table
              className="w-full text-sm bg-surface-subtle border-b border-border"
              style={{
                width: wsTableWidth,
                transform: `translateX(-${wsScrollLeft}px)`,
              }}
            >
              <TableHeader
                table={table}
                theadClassName="bg-surface-subtle border-b border-border shadow-[0_2px_4px_rgba(0,0,0,0.08)]"
                // The clone lives in its own <table>; it needs explicit column
                // widths to stay aligned with the real one. No PinMenu: the
                // wrapper is aria-hidden + pointer-events:none, so it'd be dead.
                withExplicitWidths
                // The wrapper is pointer-events:none; re-enable hit-testing on
                // the header text so clicking the stuck clone still sorts.
                interactiveOverlay
              />
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
            <TableHeader
              table={table}
              theadClassName={cn(
                'bg-surface-subtle border-b border-border',
                stickyEnabled && !stickyWindowScroll && 'sticky z-[3]',
              )}
              theadStyle={stickyEnabled && !stickyWindowScroll ? { top: stickyOffsetTop } : undefined}
              // Real header: interactive PinMenu is reachable here.
              withPinMenu
            />

            <TableBody
              table={table}
              size={size}
              loading={loading}
              fetchError={fetchError}
              onRetry={reload}
              getRowKey={getRowKey}
              expandedKeys={expandedKeys}
              toggleExpand={toggleExpand}
              expandedRowRender={expandedRowRender}
              rowClassName={rowClassName}
              onRow={onRow}
              emptyText={emptyText}
            />
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
          onClear={clearSelection}
        />
      )}
      </div>
    </div>
  )
}
