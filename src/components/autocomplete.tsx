import {
  Autocomplete as RAAutocomplete,
  SearchField,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  type AutocompleteProps as RAAutocompleteProps,
} from 'react-aria-components'
import { Search } from 'lucide-react'
import { cn } from '../lib/cn'
import { inputHeight, inputText, labelText, type Size } from '../lib/size'

export interface AutocompleteOption {
  id: string
  label: string
  description?: string
}

interface AutocompleteProps extends Omit<RAAutocompleteProps, 'children'> {
  label?: string
  placeholder?: string
  items: AutocompleteOption[]
  size?: Size
  className?: string
}

export function Autocomplete({ label, placeholder = 'Search…', items, size = 'md', className, ...props }: AutocompleteProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <RAAutocomplete {...props}>
        <SearchField className="flex flex-col gap-1">
          {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-disabled pointer-events-none" />
            <Input
              placeholder={placeholder}
              className={cn(
                inputHeight[size], inputText[size],
                'pl-8 pr-8 bg-surface border border-border text-fg w-full',
                'rounded-[var(--base-radius)]',
                'placeholder:text-fg-disabled outline-none',
                'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
              )}
            />
          </div>
        </SearchField>
        <ListBox
          items={items}
          className={cn(
            'bg-surface border border-border shadow-lg rounded-[var(--base-radius)] py-1 outline-none max-h-60 overflow-auto',
            'empty:hidden',
          )}
        >
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.label}
              className={cn(
                'px-3 py-2 cursor-pointer outline-none',
                inputText[size],
                'text-fg-2',
                'hover:bg-primary-50 hover:text-primary',
                'focus:bg-primary-50 focus:text-primary',
                'selected:bg-primary-100 selected:text-primary selected:font-medium',
              )}
            >
              <div>{item.label}</div>
              {item.description && <div className="text-xs text-fg-disabled mt-0.5">{item.description}</div>}
            </ListBoxItem>
          )}
        </ListBox>
      </RAAutocomplete>
    </div>
  )
}
