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
  className?: string
}

export function NumberField({ label, className, ...props }: NumberFieldProps_) {
  return (
    <RANumberField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <Group
        className={cn(
          'flex h-9 border border-gray-300 bg-white overflow-hidden',
          'rounded-[var(--base-radius)]',
          'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
        )}
      >
        <Button
          slot="decrement"
          className="px-2.5 text-gray-500 border-r border-gray-300 hover:bg-gray-50 transition-colors text-base leading-none cursor-pointer select-none"
        >
          −
        </Button>
        <Input className="flex-1 text-sm text-center outline-none bg-transparent text-gray-900 px-2" />
        <Button
          slot="increment"
          className="px-2.5 text-gray-500 border-l border-gray-300 hover:bg-gray-50 transition-colors text-base leading-none cursor-pointer select-none"
        >
          +
        </Button>
      </Group>
    </RANumberField>
  )
}
