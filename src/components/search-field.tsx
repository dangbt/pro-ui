import {
  SearchField as RASearchField,
  Label,
  Input,
  Button,
  type SearchFieldProps,
} from 'react-aria-components'
import { Search, X } from 'lucide-react'
import { cn } from '../lib/cn'

interface SearchFieldProps_ extends Omit<SearchFieldProps, 'className' | 'children'> {
  label?: string
  placeholder?: string
  className?: string
}

export function SearchField({ label, placeholder, className, ...props }: SearchFieldProps_) {
  return (
    <RASearchField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <Input
          placeholder={placeholder ?? 'Search...'}
          className={cn(
            'h-[var(--sz-md)] pl-9 pr-8 text-sm bg-white border border-gray-300 text-gray-900 w-full',
            'rounded-[var(--base-radius)]',
            'placeholder:text-gray-400',
            'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          )}
        />
        <Button className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hidden group-data-[empty]:hidden data-[empty=false]:flex">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </RASearchField>
  )
}
