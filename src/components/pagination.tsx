import { cn } from '../lib/cn'
import { Button } from './button'

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number, pageSize: number) => void
  showSizeChanger?: boolean
  showTotal?: boolean
  pageSizeOptions?: number[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = false,
  showTotal = false,
  pageSizeOptions = [10, 20, 50, 100],
  size = 'md',
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const getPages = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    if (current > 3) pages.push('ellipsis')
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  return (
    <nav className={cn('flex items-center gap-1.5 text-fg', className)}>
      {showTotal && (
        <span className="text-fg-muted text-sm mr-2">Total {total} items</span>
      )}
      <Button size={size} variant="ghost" isDisabled={current <= 1} onPress={() => onChange(current - 1, pageSize)}>
        ‹
      </Button>
      {getPages().map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`e${i}`} className="px-2 text-fg-muted">…</span>
        ) : (
          <Button
            key={page}
            size={size}
            variant={page === current ? 'primary' : 'ghost'}
            onPress={() => onChange(page, pageSize)}
          >
            {page}
          </Button>
        ),
      )}
      <Button size={size} variant="ghost" isDisabled={current >= totalPages} onPress={() => onChange(current + 1, pageSize)}>
        ›
      </Button>
      {showSizeChanger && (
        <select
          value={pageSize}
          onChange={(e) => onChange(1, Number(e.target.value))}
          className="ml-2 h-8 rounded-[var(--base-radius)] border border-border bg-surface px-2 text-sm text-fg"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt} / page</option>
          ))}
        </select>
      )}
    </nav>
  )
}
