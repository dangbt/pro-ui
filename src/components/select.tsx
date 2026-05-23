import {
  Select as RASelect,
  Label,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  type SelectProps as RASelectProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<RASelectProps<SelectOption>, 'children' | 'className'> {
  label?: string
  placeholder?: string
  options: SelectOption[]
  className?: string
}

export function Select({ label, placeholder, options, className, ...props }: SelectProps) {
  return (
    <RASelect {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className="text-xs font-medium text-gray-600">{label}</Label>
      )}
      <Button
        className={cn(
          'flex items-center justify-between h-9 px-3 text-sm bg-white border border-gray-300',
          'rounded-[var(--base-radius)] cursor-pointer w-full',
          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-0',
          'hover:border-gray-400 transition-colors',
          'pressed:bg-gray-50',
        )}
      >
        <SelectValue className="text-gray-700 data-[placeholder]:text-gray-400">
          {({ selectedText, isPlaceholder }) => isPlaceholder ? (placeholder ?? 'Select...') : selectedText}
        </SelectValue>
        <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.5 6.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
      <Popover className="w-[--trigger-width] bg-white border border-gray-200 shadow-lg rounded-[var(--base-radius)] overflow-hidden z-50 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox className="py-1 max-h-60 overflow-auto outline-none">
          {options.map(opt => (
            <ListBoxItem
              key={opt.value}
              id={opt.value}
              textValue={opt.label}
              className={cn(
                'px-3 py-2 text-sm text-gray-700 cursor-pointer outline-none',
                'hover:bg-primary-50 hover:text-primary',
                'focus:bg-primary-50 focus:text-primary',
                'selected:bg-primary-100 selected:text-primary selected:font-medium',
              )}
            >
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RASelect>
  )
}
