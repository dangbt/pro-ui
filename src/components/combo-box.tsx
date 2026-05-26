import {
  ComboBox as RAComboBox,
  Label,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  type ComboBoxProps,
} from 'react-aria-components'
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'

export interface ComboBoxOption {
  value: string
  label: string
}

interface ComboBoxProps_<T extends ComboBoxOption> extends Omit<ComboBoxProps<T>, 'children' | 'className'> {
  label?: string
  placeholder?: string
  options: T[]
  className?: string
}

export function ComboBox<T extends ComboBoxOption>({
  label,
  placeholder,
  options,
  className,
  ...props
}: ComboBoxProps_<T>) {
  return (
    <RAComboBox
      {...props}
      items={options}
      className={cn('flex flex-col gap-1', className)}
    >
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <div className="relative">
        <Input
          placeholder={placeholder ?? 'Type to search...'}
          className={cn(
            'h-[var(--sz)] px-3 pr-8 text-sm bg-white border border-gray-300 text-gray-900 w-full',
            'rounded-[var(--base-radius)]',
            'placeholder:text-gray-400',
            'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          )}
        />
        <Button className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      <Popover className="w-[var(--trigger-width)] bg-white border border-gray-200 shadow-lg rounded-[var(--base-radius)] overflow-hidden z-50 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox<T>
          className="py-1 max-h-60 overflow-auto outline-none"
          renderEmptyState={() => (
            <div className="px-3 py-4 text-sm text-center text-gray-400">No results</div>
          )}
        >
          {(item) => (
            <ListBoxItem
              id={item.value}
              textValue={item.label}
              className={cn(
                'px-3 py-2 text-sm text-gray-700 cursor-pointer outline-none',
                'hover:bg-primary-50 hover:text-primary',
                'focus:bg-primary-50 focus:text-primary',
                'selected:bg-primary-100 selected:text-primary selected:font-medium',
              )}
            >
              {item.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RAComboBox>
  )
}
