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
import { ChevronDown } from 'lucide-react'
import { cn } from '../lib/cn'
import { inputHeight, inputPx, inputText, labelText, type Size } from '../lib/size'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<RASelectProps<SelectOption>, 'children' | 'className'> {
  label?: string
  placeholder?: string
  options: SelectOption[]
  size?: Size
  className?: string
}

export function Select({ label, placeholder, options, size = 'md', className, ...props }: SelectProps) {
  return (
    <RASelect {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>
      )}
      <Button
        className={cn(
          'flex items-center justify-between bg-surface border border-border',
          inputHeight[size], inputPx[size], inputText[size],
          'rounded-[var(--base-radius)] cursor-pointer w-full',
          'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-0',
          'hover:border-border transition-colors',
          'pressed:bg-surface-subtle',
          'invalid:border-danger invalid:focus-visible:outline-danger',
        )}
      >
        <SelectValue className="text-fg-2 data-[placeholder]:text-fg-disabled">
          {({ selectedText, isPlaceholder }) => isPlaceholder ? (placeholder ?? 'Select...') : selectedText}
        </SelectValue>
        <ChevronDown className="w-4 h-4 text-fg-disabled shrink-0" />
      </Button>
      <Popover className="w-[var(--trigger-width)] bg-surface border border-border shadow-lg rounded-[var(--base-radius)] overflow-hidden z-50 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox className="py-1 max-h-60 overflow-auto outline-none">
          {options.map(opt => (
            <ListBoxItem
              key={opt.value}
              id={opt.value}
              textValue={opt.label}
              className={cn(
                'px-3 py-2 cursor-pointer outline-none text-fg-2',
                inputText[size],
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
