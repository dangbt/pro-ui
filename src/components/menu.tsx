import {
  MenuTrigger,
  Menu as RAMenu,
  MenuItem,
  Separator,
  Popover,
  type MenuProps,
  type Key,
} from 'react-aria-components'
import { cn } from '../lib/cn'

export interface MenuItemDef {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

interface MenuProps_ extends Omit<MenuProps<MenuItemDef>, 'children' | 'className'> {
  trigger: React.ReactNode
  items: MenuItemDef[]
  onAction?: (key: Key) => void
  className?: string
}

export function Menu({ trigger, items, onAction, className, ...props }: MenuProps_) {
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
          items={items}
          onAction={key => onAction?.(key as string)}
          className="outline-none"
        >
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
        </RAMenu>
      </Popover>
    </MenuTrigger>
  )
}
