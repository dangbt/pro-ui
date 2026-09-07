import type { Size } from '../../lib/size'

export const rowPyCls: Record<Size, string> = {
  sm: 'py-1.5',
  md: 'py-2.5',
  lg: 'py-3.5',
}

export const cellTextCls: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

/**
 * Default value-formatting locale/currency for `renderValue`. Preserves the
 * original hardcoded output for consumers that pass neither `locale` nor
 * `currency` to `ProTable`.
 */
export const DEFAULT_LOCALE = 'vi-VN'
export const DEFAULT_CURRENCY = 'VND'
