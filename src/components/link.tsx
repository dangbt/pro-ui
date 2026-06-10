import { Link as RALink, type LinkProps as RALinkProps } from 'react-aria-components'
import { forwardRef, type ReactNode } from 'react'
import { cn } from '../lib/cn'

type LinkVariant = 'default' | 'muted' | 'danger'

interface LinkProps extends Omit<RALinkProps, 'className'> {
  variant?: LinkVariant
  className?: string
  children?: ReactNode
}

const variantCls: Record<LinkVariant, string> = {
  default: 'text-primary hover:text-primary-700',
  muted:   'text-fg-muted hover:text-fg-2',
  danger:  'text-danger hover:text-danger-700',
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'default', className, children, ...props },
  ref,
) {
  return (
    <RALink
      {...props}
      ref={ref}
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
})

Link.displayName = 'Link'
