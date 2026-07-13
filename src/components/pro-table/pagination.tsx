import type { Table, PaginationState } from '@tanstack/react-table'
import { cn } from '../../lib/cn'
import { pageSizeCls, PAGE_SIZE_OPTIONS } from './constants'
import type { Size } from '../../lib/size'

interface PaginationProps<T> {
  table: Table<T>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
  serverTotal: number
  size: Size
  pageSizeOptions?: number[]
}

export function Pagination<T>({
  table,
  pagination,
  setPagination,
  serverTotal,
  size,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: PaginationProps<T>) {
  const pageCount = table.getPageCount()
  const canPrev = table.getCanPreviousPage()
  const canNext = table.getCanNextPage()

  const paginationBtnCls = cn(
    'inline-flex items-center justify-center min-w-8 px-2 border border-border bg-surface text-fg-muted',
    'rounded-[var(--base-radius)] hover:bg-surface-subtle transition-colors',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    pageSizeCls[size],
  )

  return (
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
  )
}
