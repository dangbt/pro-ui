import { Link as RALink, type LinkProps as RALinkProps } from 'react-aria-components'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type LinkVariant = 'default' | 'muted' | 'danger'

interface LinkProps extends Omit<RALinkProps, 'className'> {
  variant?: LinkVariant
  className?: string
  children?: ReactNode
}

const variantCls: Record<LinkVariant, string> = {
  default: 'text-primary hover:text-primary-700',
  muted:   'text-gray-500 hover:text-gray-700',
  danger:  'text-danger hover:text-danger-700',
}

export function Link({ variant = 'default', className, children, ...props }: LinkProps) {
  return (
    <RALink
      {...props}
      className={cn(
        'underline underline-offset-2 transition-colors cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm',
        variantCls[variant],
        className,
      )}
    >
      {children}
    </RALink>
  )
}
