import {
  TextField,
  Label,
  Input as RAInput,
  type TextFieldProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface InputProps extends Omit<TextFieldProps, 'className'> {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search'
  className?: string
}

export function Input({ label, placeholder, type, className, ...props }: InputProps) {
  return (
    <TextField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className="text-xs font-medium text-gray-600">{label}</Label>
      )}
      <RAInput
        type={type}
        placeholder={placeholder}
        className={cn(
          'h-9 px-3 text-sm bg-white border border-gray-300 text-gray-900',
          'rounded-[var(--base-radius)]',
          'placeholder:text-gray-400',
          'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          'data-[invalid]:border-danger data-[invalid]:focus:outline-danger',
          'w-full',
        )}
      />
    </TextField>
  )
}
