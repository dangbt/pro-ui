import {
  Checkbox as RACheckbox,
  CheckboxGroup as RACheckboxGroup,
  Label,
  type CheckboxProps as RACheckboxProps,
  type CheckboxGroupProps as RACheckboxGroupProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface CheckboxProps extends Omit<RACheckboxProps, 'className' | 'children'> {
  children?: React.ReactNode
  className?: string
}

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <RACheckbox
      {...props}
      className={cn(
        'group flex items-center gap-2 cursor-pointer select-none',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
    >
      <div
        className={cn(
          'w-4 h-4 border-2 rounded-[var(--base-radius)] flex items-center justify-center shrink-0 transition-colors',
          'border-gray-300 bg-white',
          'group-data-[selected]:bg-primary group-data-[selected]:border-primary',
          'group-data-[indeterminate]:bg-primary group-data-[indeterminate]:border-primary',
          'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-primary group-data-[focus-visible]:ring-offset-1',
          'group-hover:border-primary-400',
        )}
      >
        {/* checkmark */}
        <svg
          className="w-2.5 h-2.5 text-white hidden group-data-[selected]:block"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1.5,5 4,7.5 8.5,2.5" />
        </svg>
        {/* indeterminate dash */}
        <svg
          className="w-2.5 h-2.5 text-white hidden group-data-[indeterminate]:block"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <rect x="1.5" y="4" width="7" height="2" rx="1" />
        </svg>
      </div>
      {children && <span className="text-sm text-gray-700">{children}</span>}
    </RACheckbox>
  )
}

interface CheckboxGroupProps extends Omit<RACheckboxGroupProps, 'className' | 'children'> {
  label?: string
  options: { value: string; label: string; disabled?: boolean }[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function CheckboxGroup({
  label,
  options,
  orientation = 'vertical',
  className,
  ...props
}: CheckboxGroupProps) {
  return (
    <RACheckboxGroup {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className="text-xs font-medium text-gray-600 mb-0.5">{label}</Label>
      )}
      <div
        className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2',
        )}
      >
        {options.map(opt => (
          <Checkbox key={opt.value} value={opt.value} isDisabled={opt.disabled}>
            {opt.label}
          </Checkbox>
        ))}
      </div>
    </RACheckboxGroup>
  )
}
