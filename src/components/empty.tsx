import type { ReactNode } from 'react'
import { InboxIcon } from 'lucide-react'
import { cn } from '../lib/cn'

interface EmptyProps {
  /** Custom icon or image. Defaults to an inbox icon. */
  image?: ReactNode
  /** Primary text. Defaults to "No data". */
  description?: ReactNode
  /** Extra content below description (e.g. an action button) */
  children?: ReactNode
  className?: string
}

export function Empty({ image, description = 'No data', children, className }: EmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-gray-400',
        className,
      )}
    >
      <div className="text-gray-300">
        {image ?? <InboxIcon className="w-12 h-12" strokeWidth={1} />}
      </div>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      {children && <div className="mt-1">{children}</div>}
    </div>
  )
}
