export type Size = 'sm' | 'md' | 'lg'

export const inputHeight: Record<Size, string> = {
  sm: 'h-[var(--sz)]',
  md: 'h-[var(--sz)]',
  lg: 'h-[var(--sz)]',
}

export const inputText: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export const inputPx: Record<Size, string> = {
  sm: 'px-2',
  md: 'px-3',
  lg: 'px-4',
}

export const textareaPy: Record<Size, string> = {
  sm: 'py-1.5',
  md: 'py-2',
  lg: 'py-3',
}

export const labelText: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
}

export const btnPx: Record<Size, string> = {
  sm: 'px-2',
  md: 'px-2.5',
  lg: 'px-3',
}
