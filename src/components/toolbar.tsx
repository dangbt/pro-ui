import {
  Toolbar as RAToolbar,
  Separator,
  type ToolbarProps as RAToolbarProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface ToolbarProps extends Omit<RAToolbarProps, 'className'> {
  children: React.ReactNode
  className?: string
}

export function Toolbar({ children, className, ...props }: ToolbarProps) {
  return (
    <RAToolbar
      {...props}
      className={cn(
        'flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-[var(--base-radius)]',
        'flex-wrap',
        className,
      )}
    >
      {children}
    </RAToolbar>
  )
}

export function ToolbarSeparator({ className }: { className?: string }) {
  return (
    <Separator
      orientation="vertical"
      className={cn('w-px h-5 bg-gray-200 mx-1 self-center shrink-0', className)}
    />
  )
}
