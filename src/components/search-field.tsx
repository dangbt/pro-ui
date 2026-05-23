import {
  SearchField as RASearchField,
  Label,
  Input,
  Button,
  type SearchFieldProps,
} from 'react-aria-components'
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
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 L13.5 13.5" />
        </svg>
        <Input
          placeholder={placeholder ?? 'Search...'}
          className={cn(
            'h-9 pl-9 pr-8 text-sm bg-white border border-gray-300 text-gray-900 w-full',
            'rounded-[var(--base-radius)]',
            'placeholder:text-gray-400',
            'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          )}
        />
        <Button className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hidden group-data-[empty]:hidden data-[empty=false]:flex">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Button>
      </div>
    </RASearchField>
  )
}
