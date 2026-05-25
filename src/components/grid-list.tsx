import {
  GridList as RAGridList,
  GridListItem as RAGridListItem,
  Checkbox,
  type GridListProps as RAGridListProps,
  type Selection,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { inputText, type Size } from '../lib/size'

export interface GridListOption {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface GridListProps extends Omit<RAGridListProps<GridListOption>, 'children' | 'className'> {
  items: GridListOption[]
  size?: Size
  className?: string
}

export function GridList({ items, size = 'md', className, ...props }: GridListProps) {
  return (
    <RAGridList
      {...props}
      items={items}
      className={cn(
        'border border-gray-200 rounded-[var(--base-radius)] overflow-hidden outline-none divide-y divide-gray-100',
        className,
      )}
    >
      {(item) => (
        <RAGridListItem
          id={item.id}
          textValue={item.label}
          isDisabled={item.disabled}
          className={cn(
            'flex items-center gap-3 px-4 py-3 bg-white outline-none cursor-pointer',
            inputText[size],
            'text-gray-700',
            'hover:bg-gray-50',
            'focus-visible:bg-primary-50',
            'selected:bg-primary-50',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          {({ selectionMode, isSelected }) => (
            <>
              {selectionMode !== 'none' && (
                <Checkbox
                  slot="selection"
                  className="group flex items-center shrink-0"
                >
                  <div className={cn(
                    'w-4 h-4 border-2 rounded flex items-center justify-center transition-colors',
                    'border-gray-300',
                    'group-data-[selected]:bg-primary group-data-[selected]:border-primary',
                  )}>
                    {isSelected && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2 text-white fill-white stroke-white">
                        <path d="M1 4l3 3 5-6" strokeWidth="1.5" fill="none" />
                      </svg>
                    )}
                  </div>
                </Checkbox>
              )}
              {item.icon && <span className="shrink-0 text-gray-400">{item.icon}</span>}
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                {item.description && <div className="text-xs text-gray-400 mt-0.5 truncate">{item.description}</div>}
              </div>
            </>
          )}
        </RAGridListItem>
      )}
    </RAGridList>
  )
}

export type { Selection }
