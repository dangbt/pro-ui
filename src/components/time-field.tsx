import {
  TimeField as RATimeField,
  Label,
  DateInput,
  DateSegment,
  type TimeFieldProps,
  type TimeValue,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { inputHeight, inputPx, inputText, labelText, type Size } from '../lib/size'

interface TimeFieldProps_<T extends TimeValue> extends Omit<TimeFieldProps<T>, 'className'> {
  label?: string
  size?: Size
  className?: string
}

export function TimeField<T extends TimeValue>({ label, size = 'md', className, ...props }: TimeFieldProps_<T>) {
  return (
    <RATimeField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className={cn('font-medium text-gray-600', labelText[size])}>{label}</Label>
      )}
      <DateInput
        className={cn(
          'flex items-center gap-px border border-gray-300 bg-white w-fit',
          inputHeight[size], inputPx[size],
          'rounded-[var(--base-radius)]',
          'focus-within:outline focus-within:outline-2 focus-within:outline-primary',
          'focus-within:outline-offset-0 focus-within:border-transparent',
        )}
      >
        {segment => (
          <DateSegment
            segment={segment}
            className={cn(
              inputText[size],
              'text-gray-700 tabular-nums rounded px-0.5 outline-none',
              'focus:bg-primary focus:text-white',
              'data-[placeholder]:text-gray-400',
              'caret-transparent',
            )}
          />
        )}
      </DateInput>
    </RATimeField>
  )
}

export type { TimeValue }
