import { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn'
import { inputHeight, inputPx, inputText, labelText, type Size } from '../lib/size'
import { Spinner } from './spinner'

export interface AsyncSelectOption {
  value: string
  label: string
}

export interface AsyncSelectFetchResult<T = AsyncSelectOption> {
  options: T[]
  hasMore: boolean
}

interface AsyncSelectProps<T extends AsyncSelectOption = AsyncSelectOption> {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  defaultLabel?: string
  size?: Size
  className?: string
  value?: string | null
  onChange?: (value: string | null, option: T | null) => void
  fetchOptions: (params: { search: string; page: number; pageSize: number }) => Promise<AsyncSelectFetchResult<T>>
  pageSize?: number
  debounceMs?: number
  isDisabled?: boolean
  isInvalid?: boolean
  onBlur?: () => void
}

const SearchIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="6.5" cy="6.5" r="4" />
    <path d="M10.5 10.5l3 3" />
  </svg>
)

const ClearIcon = ({ className }: { className?: string }) => (
  <svg className={cn('w-3 h-3', className)} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 2l8 8M10 2l-8 8" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={cn('w-4 h-4 text-gray-400 shrink-0 transition-transform duration-150', open && 'rotate-180')}
    viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <path d="M4.5 6.5l3.5 3.5 3.5-3.5" />
  </svg>
)

export function AsyncSelect<T extends AsyncSelectOption = AsyncSelectOption>({
  label,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  defaultLabel,
  size = 'md',
  className,
  value,
  onChange,
  fetchOptions,
  pageSize = 20,
  debounceMs = 300,
  isDisabled = false,
  isInvalid = false,
  onBlur,
}: AsyncSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [fetchParams, setFetchParams] = useState({ search: '', page: 1 })
  const [options, setOptions] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedOption, setSelectedOption] = useState<T | null>(null)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const prevValueRef = useRef(value)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const fetchRef = useRef(fetchOptions)
  fetchRef.current = fetchOptions

  /* ── Sync selectedOption when controlled value changes ── */
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value
      if (!value) {
        setSelectedOption(null)
      } else if (selectedOption?.value !== value) {
        setSelectedOption(null)
      }
    }
  }, [value, selectedOption?.value])

  /* ── Fetch effect ──────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return

    let cancelled = false
    const { search, page } = fetchParams
    const isFirst = page === 1

    const doFetch = async () => {
      if (isFirst) setLoading(true)
      else setLoadingMore(true)
      try {
        const result = await fetchRef.current({ search, page, pageSize })
        if (cancelled) return
        setOptions(prev => isFirst ? result.options : [...prev, ...result.options])
        setHasMore(result.hasMore)
      } finally {
        if (!cancelled) {
          if (isFirst) setLoading(false)
          else setLoadingMore(false)
        }
      }
    }

    const delay = isFirst && search !== '' ? debounceMs : 0
    const timer = setTimeout(doFetch, delay)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [isOpen, fetchParams, pageSize, debounceMs])

  /* ── Infinite scroll ───────────────────────────────────── */
  const triggerLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      setFetchParams(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }, [loading, loadingMore, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !isOpen) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0]?.isIntersecting) triggerLoadMore() },
      { root: listRef.current, threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isOpen, triggerLoadMore])

  /* ── Dropdown position ─────────────────────────────────── */
  const updatePos = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [isOpen, updatePos])

  /* ── Click outside + Escape ────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return
    const onMouse = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node))
        doClose()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') doClose() }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  /* ── Focus search on open ──────────────────────────────── */
  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 0)
  }, [isOpen])

  /* ── Helpers ───────────────────────────────────────────── */
  const doOpen = () => {
    if (isDisabled) return
    setFetchParams({ search: '', page: 1 })
    setIsOpen(true)
  }

  const doClose = () => {
    setIsOpen(false)
    setOptions([])
    setHasMore(false)
    onBlur?.()
  }

  const handleSelect = (opt: T) => {
    setSelectedOption(opt)
    onChange?.(opt.value, opt)
    doClose()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOption(null)
    onChange?.(null, null)
  }

  const displayLabel = selectedOption?.label ?? defaultLabel ?? null
  const activeValue = selectedOption?.value ?? value ?? null

  /* ── Dropdown ──────────────────────────────────────────── */
  const dropdown = (
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 9999 }}
      className="bg-white border border-gray-200 shadow-lg rounded-[var(--base-radius)] overflow-hidden"
    >
      {/* Search bar */}
      <div className="p-2 border-b border-gray-100">
        <div className={cn(
          'flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-[var(--base-radius)] px-2',
          'focus-within:border-primary focus-within:bg-white transition-colors',
          size === 'sm' ? 'h-7' : size === 'lg' ? 'h-10' : 'h-8',
        )}>
          <SearchIcon />
          <input
            ref={searchRef}
            value={fetchParams.search}
            onChange={e => setFetchParams({ search: e.target.value, page: 1 })}
            placeholder={searchPlaceholder}
            className={cn('flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400', inputText[size])}
          />
          {fetchParams.search && (
            <button
              type="button"
              onClick={() => setFetchParams({ search: '', page: 1 })}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* Options list */}
      <div ref={listRef} className="max-h-60 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : options.length === 0 ? (
          <div className={cn('py-8 text-center text-gray-400', inputText[size])}>No results found</div>
        ) : (
          <>
            {options.map(opt => {
              const isSelected = opt.value === activeValue
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    'w-full text-left transition-colors',
                    inputPx[size], inputText[size],
                    size === 'sm' ? 'py-1.5' : size === 'lg' ? 'py-2.5' : 'py-2',
                    isSelected
                      ? 'bg-primary-100 text-primary font-medium'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary',
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
            {/* Sentinel for IntersectionObserver */}
            <div ref={sentinelRef} className="h-px" />
            {loadingMore && (
              <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100">
                <Spinner size="xs" />
                <span className="text-xs text-gray-400">Loading more…</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className={cn('font-medium text-gray-600', labelText[size])}>{label}</span>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={doOpen}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center justify-between bg-white border',
          isInvalid ? 'border-danger' : 'border-gray-300',
          inputHeight[size], inputPx[size], inputText[size],
          'rounded-[var(--base-radius)] w-full transition-colors',
          'hover:border-gray-400',
          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-0',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          isOpen && 'outline-2 outline-primary outline-offset-0 border-transparent',
        )}
      >
        <span className={cn('truncate', displayLabel ? 'text-gray-700' : 'text-gray-400')}>
          {displayLabel ?? placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0 ml-1">
          {displayLabel && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-300 hover:text-gray-500 transition-colors p-0.5 rounded"
              aria-label="Clear selection"
            >
              <ClearIcon className="w-3 h-3" />
            </button>
          )}
          <ChevronIcon open={isOpen} />
        </div>
      </button>
      {createPortal(isOpen ? dropdown : null, document.body)}
    </div>
  )
}
