import type { Size } from '../../lib/size'

export const pageSizeCls: Record<Size, string> = {
  sm: 'h-[var(--sz)] px-2 text-xs',
  md: 'h-[var(--sz)] px-3 text-sm',
  lg: 'h-[var(--sz)] px-3 text-base',
}

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
