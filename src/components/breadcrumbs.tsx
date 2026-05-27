import {
  Breadcrumbs as RABreadcrumbs,
  Breadcrumb,
  Link,
  type BreadcrumbsProps,
} from 'react-aria-components'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
}

interface BreadcrumbsProps_ extends Omit<BreadcrumbsProps<BreadcrumbItem>, 'className' | 'children'> {
  items: BreadcrumbItem[]
  className?: string
}


export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps_) {
  return (
    <RABreadcrumbs
      {...props}
      items={items}
      className={cn('flex items-center gap-1 flex-wrap', className)}
    >
      {item => (
        <Breadcrumb
          id={item.id}
          className="flex items-center gap-1"
        >
          {({ isCurrent }) => (
            <>
              {isCurrent ? (
                <span className="text-sm font-medium text-fg-2" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href ?? '#'}
                  className="text-sm text-fg-muted hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {item.label}
                </Link>
              )}
              {!isCurrent && <ChevronRight className="w-3.5 h-3.5 text-fg-disabled" />}
            </>
          )}
        </Breadcrumb>
      )}
    </RABreadcrumbs>
  )
}
