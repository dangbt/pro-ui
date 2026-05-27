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
      {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
      <Group
        className={cn(
          'flex w-full border border-border bg-surface overflow-hidden',
          inputHeight[size],
          'rounded-[var(--base-radius)]',
          'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
          'data-[invalid]:border-danger',
        )}
      >
        <Button
          slot="decrement"
          className={cn('shrink-0 text-fg-muted border-r border-border hover:bg-surface-subtle transition-colors text-base leading-none cursor-pointer select-none', btnPx[size])}
        >
          −
        </Button>
        <Input placeholder={placeholder} className={cn('flex-1 min-w-0 text-center outline-none bg-transparent text-fg px-2 placeholder:text-fg-disabled', inputText[size])} />
        <Button
          slot="increment"
          className={cn('shrink-0 text-fg-muted border-l border-border hover:bg-surface-subtle transition-colors text-base leading-none cursor-pointer select-none', btnPx[size])}
        >
          +
        </Button>
      </Group>
    </RANumberField>
  )
}
