import { MenuTrigger, Menu, MenuItem, Popover, Separator } from 'react-aria-components'
import { cn } from '../lib/cn'

export type DropdownItem =
  | { key: string; label: React.ReactNode; icon?: React.ReactNode; danger?: boolean; disabled?: boolean; onAction?: () => void }
  | { type: 'divider' }

interface DropdownProps {
  items: DropdownItem[]
  children: React.ReactNode
  className?: string
}

export function Dropdown({ items, children, className }: DropdownProps) {
  return (
    <MenuTrigger>
      {children}
      <Popover
        className={cn(
          'min-w-40 bg-surface-raised border border-border shadow-lg py-1 z-50',
          'rounded-[var(--base-radius)]',
          'entering:animate-in entering:fade-in entering:zoom-in-95',
          'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
          className,
        )}
      >
        <Menu className="outline-none" onAction={(key) => {
          const item = items.find(i => 'key' in i && i.key === key)
          if (item && 'onAction' in item) item.onAction?.()
        }}>
          {items.map((item, i) =>
            'type' in item ? (
              <Separator key={`sep-${i}`} className="my-1 border-t border-border-subtle" />
            ) : (
              <MenuItem
                key={item.key}
                id={item.key}
                isDisabled={item.disabled}
                textValue={typeof item.label === 'string' ? item.label : item.key}
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
              </MenuItem>
            ),
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
