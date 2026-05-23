import {
  NumberField as RANumberField,
  Label,
  Group,
  Input,
  Button,
  type NumberFieldProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface NumberFieldProps_ extends Omit<NumberFieldProps, 'className'> {
  label?: string
  placeholder?: string
  className?: string
}

export function NumberField({ label, placeholder, className, ...props }: NumberFieldProps_) {
  return (
    <RANumberField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <Group
        className={cn(
          'flex w-full h-9 border border-gray-300 bg-white overflow-hidden',
          'rounded-[var(--base-radius)]',
          'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
          'data-[invalid]:border-danger',
        )}
      >
        <Button
          slot="decrement"
          className="shrink-0 px-2.5 text-gray-500 border-r border-gray-300 hover:bg-gray-50 transition-colors text-base leading-none cursor-pointer select-none"
        >
          −
        </Button>
        <Input placeholder={placeholder} className="flex-1 min-w-0 text-sm text-center outline-none bg-transparent text-gray-900 px-2 placeholder:text-gray-400" />
        <Button
          slot="increment"
          className="shrink-0 px-2.5 text-gray-500 border-l border-gray-300 hover:bg-gray-50 transition-colors text-base leading-none cursor-pointer select-none"
        >
          +
        </Button>
      </Group>
    </RANumberField>
  )
}
