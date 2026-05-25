import { Button as RAButton, type ButtonProps as RAButtonProps } from 'react-aria-components'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<RAButtonProps, 'className' | 'children'> {
  variant?: Variant
  size?: Size
  className?: string
  icon?: ReactNode
  children?: ReactNode
}

const variantCls: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-600 pressed:bg-primary-700 disabled:bg-primary-200 disabled:text-primary-400',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 pressed:bg-gray-100 disabled:text-gray-300',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 pressed:bg-gray-200 disabled:text-gray-300',
  danger:
    'bg-white text-danger-600 border border-danger-300 hover:bg-danger-50 pressed:bg-danger-100 disabled:text-danger-200',
}

const sizeCls: Record<Size, string> = {
  sm: 'h-[var(--sz-sm)] px-3 text-xs gap-1.5',
  md: 'h-[var(--sz-md)] px-4 text-sm gap-2',
  lg: 'h-[var(--sz-lg)] px-5 text-base gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <RAButton
      {...props}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-[colors,transform] cursor-pointer',
        'rounded-[var(--base-radius)]',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed pressed:scale-95',
        variantCls[variant],
        sizeCls[size],
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </RAButton>
  )
}
