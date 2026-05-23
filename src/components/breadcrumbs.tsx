import {
  Breadcrumbs as RABreadcrumbs,
  Breadcrumb,
  Link,
  type BreadcrumbsProps,
} from 'react-aria-components'
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

const ChevronIcon = () => (
  <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 4l4 4-4 4" />
  </svg>
)

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
                <span className="text-sm font-medium text-gray-700" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href ?? '#'}
                  className="text-sm text-gray-400 hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {item.label}
                </Link>
              )}
              {!isCurrent && <ChevronIcon />}
            </>
          )}
        </Breadcrumb>
      )}
    </RABreadcrumbs>
  )
}
