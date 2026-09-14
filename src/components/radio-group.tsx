import {
  RadioGroup as RARadioGroup,
  RadioField as RARadioField,
  RadioButton as RARadioButton,
  Label,
  Text,
  FieldError,
  type RadioGroupProps as RARadioGroupProps,
} from 'react-aria-components'
import { type ReactNode } from 'react'
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
  /** Help text rendered below the group and linked via `aria-describedby`. */
  description?: ReactNode
  /** Error text shown when the group is invalid. */
  errorMessage?: ReactNode
}

export function RadioGroup({
  label,
  options,
  orientation = 'vertical',
  className,
  description,
  errorMessage,
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
          <RARadioField key={opt.value} value={opt.value} isDisabled={opt.disabled}>
            <RARadioButton
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
                  'group-data-[invalid]:border-danger',
                  'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-primary group-data-[focus-visible]:ring-offset-1',
                  'group-hover:border-primary-400',
                )}
              >
                <div className="w-2 h-2 rounded-full bg-primary scale-0 group-data-[selected]:scale-100 transition-transform" />
              </div>
              <span className="text-sm text-fg-2">{opt.label}</span>
            </RARadioButton>
            {opt.description && (
              <Text slot="description" className="text-xs text-fg-muted ml-6">
                {opt.description}
              </Text>
            )}
          </RARadioField>
        ))}
      </div>
      {description && (
        <Text slot="description" className="text-xs text-fg-muted">{description}</Text>
      )}
      <FieldError className="text-xs text-danger">
        {errorMessage || undefined}
      </FieldError>
    </RARadioGroup>
  )
}
