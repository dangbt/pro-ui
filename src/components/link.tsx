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

// Active state driven by aria-current (page | true) — no underline, bolder text.
const activeCls: Record<LinkVariant, string> = {
  default: 'aria-[current=page]:text-primary-700 aria-[current=true]:text-primary-700',
  muted:   'aria-[current=page]:text-fg aria-[current=true]:text-fg',
  danger:  'aria-[current=page]:text-danger-700 aria-[current=true]:text-danger-700',
}
const activeBase =
  'aria-[current=page]:font-semibold aria-[current=page]:no-underline ' +
  'aria-[current=true]:font-semibold aria-[current=true]:no-underline'

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
        activeBase,
        activeCls[variant],
        className,
      )}
    >
      {children}
    </RALink>
  )
})

Link.displayName = 'Link'
