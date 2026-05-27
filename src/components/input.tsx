import {
  TextField,
  Label,
  Input as RAInput,
  FieldError,
  Text,
  type TextFieldProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { inputHeight, inputText, inputPx, labelText, type Size } from '../lib/size'

interface InputProps extends Omit<TextFieldProps, 'className'> {
  label?: string
  description?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search'
  size?: Size
  className?: string
}

export function Input({ label, description, placeholder, type, size = 'md', className, ...props }: InputProps) {
  return (
    <TextField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <Label className={cn('font-medium text-gray-600', labelText[size])}>{label}</Label>
      )}
      <RAInput
        type={type}
        placeholder={placeholder}
        className={cn(
          inputHeight[size], inputPx[size], inputText[size],
          'bg-white border border-gray-300 text-gray-900',
          'rounded-[var(--base-radius)]',
          'placeholder:text-gray-400',
          'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          'data-[invalid]:border-danger data-[invalid]:focus:outline-danger',
          'w-full',
        )}
      />
      {description && (
        <Text slot="description" className="text-xs text-gray-400">{description}</Text>
      )}
      <FieldError className="text-xs text-danger" />
    </TextField>
  )
}
