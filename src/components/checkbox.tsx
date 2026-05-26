import {
  Checkbox as RACheckbox,
  CheckboxGroup as RACheckboxGroup,
  Label,
  type CheckboxProps as RACheckboxProps,
  type CheckboxGroupProps as RACheckboxGroupProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

type CheckboxSize = 'sm' | 'md' | 'lg'

interface CheckboxProps extends Omit<RACheckboxProps, 'className' | 'children'> {
  children?: React.ReactNode
  size?: CheckboxSize
  className?: string
}

const cbBoxSize: Record<CheckboxSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4   h-4',
  lg: 'w-5   h-5',
}
const cbLabelText: Record<CheckboxSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function Checkbox({ children, size = 'md', className, ...props }: CheckboxProps) {
  return (
    <RACheckbox
      {...props}
      className={cn(
        'group flex items-center gap-2 cursor-pointer select-none',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          <div
            className={cn(
              'border-2 rounded-[var(--base-radius)] flex items-center justify-center shrink-0 transition-[colors,transform]',
              cbBoxSize[size],
              'border-gray-300 bg-white',
              'group-data-[selected]:bg-primary group-data-[selected]:border-primary',
              'group-data-[indeterminate]:bg-primary group-data-[indeterminate]:border-primary',
              'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-primary group-data-[focus-visible]:ring-offset-1',
              'group-hover:border-primary-400',
              'group-data-[pressed]:scale-95',
            )}
          >
            <svg viewBox="0 0 16 16" className="w-full h-full" aria-hidden>
              {isIndeterminate ? (
                // Filled minus bar for indeterminate state
                <path
                  d="M 3 8 L 13 8"
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                // Animated checkmark via stroke-dasharray draw-on technique
                // Path length ≈ 16px; dasharray 22px > path → fully drawn when offset=44
                <path
                  d="M 2.5 8 L 6 12 L 13.5 4"
                  fill="none"
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: '22px',
                    strokeDashoffset: isSelected ? '44px' : '66px',
                    transition: 'stroke-dashoffset 200ms ease',
                  }}
                />
              )}
            </svg>
          </div>
          {children && (
            <span className={cn(cbLabelText[size], 'text-gray-700')}>{children}</span>
          )}
        </>
      )}
    </RACheckbox>
  )
}

interface CheckboxGroupProps extends Omit<RACheckboxGroupProps, 'className' | 'children'> {
  label?: string
  options: { value: string; label: string; disabled?: boolean }[]
  orientation?: 'horizontal' | 'vertical'
  size?: CheckboxSize
  className?: string
}

export function CheckboxGroup({
  label,
  options,
  orientation = 'vertical',
  size = 'md',
  className,
  ...props
}: CheckboxGroupProps) {
  return (
    <RACheckboxGroup {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className={cn('font-medium text-gray-600 mb-0.5', cbLabelText[size])}>{label}</Label>
      )}
      <div
        className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2',
        )}
      >
        {options.map(opt => (
          <Checkbox key={opt.value} value={opt.value} size={size} isDisabled={opt.disabled}>
            {opt.label}
          </Checkbox>
        ))}
      </div>
    </RACheckboxGroup>
  )
}
