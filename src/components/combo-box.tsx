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
import { inputHeight, inputPx, inputText, labelText, type Size } from '../lib/size'

export interface ComboBoxOption {
  value: string
  label: string
}

interface ComboBoxProps_<T extends ComboBoxOption> extends Omit<ComboBoxProps<T>, 'children' | 'className'> {
  label?: string
  placeholder?: string
  options: T[]
  size?: Size
  isInvalid?: boolean
  className?: string
  /** Props to spread onto the input element (useful for a11y attributes) */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & {
    'aria-label'?: string
    'aria-labelledby'?: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }
}

export function ComboBox<T extends ComboBoxOption>({
  label,
  placeholder,
  options,
  size = 'md',
  isInvalid,
  className,
  inputProps,
  ...props
}: ComboBoxProps_<T>) {
  return (
    <RAComboBox
      {...props}
      items={options}
      isInvalid={isInvalid}
      className={cn('flex flex-col gap-1', className)}
    >
      {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
      <div className="relative">
        <Input
          placeholder={placeholder ?? 'Type to search...'}
          className={cn(
            'bg-surface border text-fg w-full',
            inputHeight[size], inputPx[size], inputText[size],
            'pr-8',
            'rounded-[var(--base-radius)]',
            'placeholder:text-fg-disabled',
            'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
            isInvalid ? 'border-danger focus:outline-danger' : 'border-border',
          )}
          {...inputProps}
        />
        <Button className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-fg-disabled hover:text-fg-2">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      <Popover className="w-[var(--trigger-width)] bg-surface border border-border shadow-lg rounded-[var(--base-radius)] overflow-hidden z-50 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out">
        <ListBox<T>
          className="py-1 max-h-60 overflow-auto outline-none"
          renderEmptyState={() => (
            <div className={cn('px-3 py-4 text-center text-fg-disabled', inputText[size])}>No results</div>
          )}
        >
          {(item) => (
            <ListBoxItem
              id={item.value}
              textValue={item.label}
              className={cn(
                'px-3 py-2 text-fg-2 cursor-pointer outline-none',
                inputText[size],
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
