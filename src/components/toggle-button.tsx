import {
  ToggleButton as RAToggleButton,
  ToggleButtonGroup as RAToggleButtonGroup,
  type ToggleButtonProps as RAToggleButtonProps,
  type ToggleButtonGroupProps,
} from 'react-aria-components'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { Size } from '../lib/size'

interface ToggleButtonProps extends Omit<RAToggleButtonProps, 'className' | 'children'> {
  size?: Size
  className?: string
  children?: ReactNode
}

const sizeCls: Record<Size, string> = {
  sm: 'h-[var(--sz-sm)] px-3 text-xs gap-1.5',
  md: 'h-[var(--sz-md)] px-4 text-sm gap-2',
  lg: 'h-[var(--sz-lg)] px-5 text-base gap-2',
}

export function ToggleButton({ size = 'md', className, children, ...props }: ToggleButtonProps) {
  return (
    <RAToggleButton
      {...props}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors cursor-pointer',
        'rounded-[var(--base-radius)] border',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 pressed:bg-gray-100',
        'selected:border-primary selected:bg-primary-50 selected:text-primary selected:hover:bg-primary-100',
        sizeCls[size],
        className,
      )}
    >
      {children}
    </RAToggleButton>
  )
}

interface ToggleGroupProps extends Omit<ToggleButtonGroupProps, 'className'> {
  className?: string
  children: ReactNode
}

export function ToggleButtonGroup({ className, children, ...props }: ToggleGroupProps) {
  return (
    <RAToggleButtonGroup
      {...props}
      className={cn('inline-flex items-center gap-1', className)}
    >
      {children}
    </RAToggleButtonGroup>
  )
}
