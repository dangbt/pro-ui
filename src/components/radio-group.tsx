import {
  RadioGroup as RARadioGroup,
  Radio as RARadio,
  Label,
  type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps extends Omit<RARadioGroupProps, 'className' | 'children'> {
  label?: string
  options: RadioOption[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function RadioGroup({
  label,
  options,
  orientation = 'vertical',
  className,
  ...props
}: RadioGroupProps) {
  return (
    <RARadioGroup
      {...props}
      className={cn('flex flex-col gap-1', className)}
    >
      {label && (
        <Label className="text-xs font-medium text-fg-muted mb-0.5">{label}</Label>
      )}
      <div
        className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2',
        )}
      >
        {options.map(opt => (
          <RARadio
            key={opt.value}
            value={opt.value}
            isDisabled={opt.disabled}
            className={cn(
              'group flex items-start gap-2 cursor-pointer select-none',
              'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
            )}
          >
            <div
              className={cn(
                'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                'border-border bg-surface',
                'group-data-[selected]:border-primary',
                'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-primary group-data-[focus-visible]:ring-offset-1',
                'group-hover:border-primary-400',
              )}
            >
              <div className="w-2 h-2 rounded-full bg-primary scale-0 group-data-[selected]:scale-100 transition-transform" />
            </div>
            <div>
              <div className="text-sm text-fg-2">{opt.label}</div>
              {opt.description && (
                <div className="text-xs text-fg-muted mt-0.5">{opt.description}</div>
              )}
            </div>
          </RARadio>
        ))}
      </div>
    </RARadioGroup>
  )
}
