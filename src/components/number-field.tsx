import {
  NumberField as RANumberField,
  Label,
  Group,
  Input,
  Button,
  type NumberFieldProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { inputHeight, inputText, btnPx, labelText, type Size } from '../lib/size'

interface NumberFieldProps_ extends Omit<NumberFieldProps, 'className'> {
  label?: string
  placeholder?: string
  size?: Size
  className?: string
}

export function NumberField({ label, placeholder, size = 'md', className, ...props }: NumberFieldProps_) {
  return (
    <RANumberField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-gray-600', labelText[size])}>{label}</Label>}
      <Group
        className={cn(
          'flex w-full border border-gray-300 bg-white overflow-hidden',
          inputHeight[size],
          'rounded-[var(--base-radius)]',
          'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
          'data-[invalid]:border-danger',
        )}
      >
        <Button
          slot="decrement"
          className={cn('shrink-0 text-gray-500 border-r border-gray-300 hover:bg-gray-50 transition-colors text-base leading-none cursor-pointer select-none', btnPx[size])}
        >
          −
        </Button>
        <Input placeholder={placeholder} className={cn('flex-1 min-w-0 text-center outline-none bg-transparent text-gray-900 px-2 placeholder:text-gray-400', inputText[size])} />
        <Button
          slot="increment"
          className={cn('shrink-0 text-gray-500 border-l border-gray-300 hover:bg-gray-50 transition-colors text-base leading-none cursor-pointer select-none', btnPx[size])}
        >
          +
        </Button>
      </Group>
    </RANumberField>
  )
}
