import {
  MenuTrigger,
  Menu as RAMenu,
  MenuItem,
  MenuLoadMoreItem,
  Separator,
  Popover,
  Collection,
  type MenuProps,
  type Key,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { Spinner } from './spinner'

export interface MenuItemDef {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

interface MenuProps_
  extends Omit<MenuProps<MenuItemDef>, 'children' | 'className' | 'renderEmptyState'> {
  trigger: React.ReactNode
  items: MenuItemDef[]
  onAction?: (key: Key) => void
  className?: string
  /** Called when the load-more sentinel scrolls into view. Enables async paging. */
  onLoadMore?: () => void
  /** Whether more items are currently loading. Shows a spinner in the load-more row and empty state. */
  isLoading?: boolean
  /** Content shown when `items` is empty. Defaults to "No items". */
  emptyContent?: React.ReactNode
}

export function Menu({
  trigger,
  items,
  onAction,
  className,
  onLoadMore,
  isLoading,
  emptyContent = 'No items',
  ...props
}: MenuProps_) {
  const isAsync = onLoadMore !== undefined

  const renderEmptyState = () => (
    <div className="flex items-center justify-center px-3 py-4 text-sm text-fg-muted">
      {isLoading ? <Spinner size="sm" /> : emptyContent}
    </div>
  )

  return (
    <MenuTrigger>
      {trigger}
      <Popover
        className={cn(
          'min-w-40 bg-surface-raised border border-border shadow-lg py-1 z-50',
          'rounded-[var(--base-radius)]',
          'entering:animate-in entering:fade-in entering:zoom-in-95',
          'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
          className,
        )}
      >
        <RAMenu<MenuItemDef>
          {...props}
          onAction={key => onAction?.(key as string)}
          renderEmptyState={renderEmptyState}
          className={cn('outline-none', isAsync && 'max-h-72 overflow-auto')}
        >
          <Collection items={items}>
            {item =>
              item.separator ? (
                <Separator className="my-1 border-t border-border-subtle" />
              ) : (
                <MenuItem
                  id={item.id}
                  isDisabled={item.disabled}
                  textValue={typeof item.label === 'string' ? item.label : item.id}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 text-sm outline-none cursor-pointer',
                    'text-fg-2',
                    item.danger
                      ? 'hover:bg-danger-50 hover:text-danger-600 focus:bg-danger-50 focus:text-danger-600'
                      : 'hover:bg-primary-50 hover:text-primary focus:bg-primary-50 focus:text-primary',
                    'disabled:text-fg-disabled disabled:cursor-not-allowed hover:disabled:bg-transparent',
                  )}
                >
                  {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="text-xs text-fg-muted font-mono">{item.shortcut}</kbd>
                  )}
                </MenuItem>
              )
            }
          </Collection>
          {isAsync && (
            <MenuLoadMoreItem
              isLoading={isLoading && items.length > 0}
              onLoadMore={onLoadMore}
              className="flex items-center justify-center py-2"
            >
              <Spinner size="sm" />
            </MenuLoadMoreItem>
          )}
        </RAMenu>
      </Popover>
    </MenuTrigger>
  )
}
