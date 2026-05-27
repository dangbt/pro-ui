import {
  TextField,
  Label,
  TextArea as RATextArea,
  type TextFieldProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { inputText, inputPx, textareaPy, labelText, type Size } from '../lib/size'

interface TextareaProps extends Omit<TextFieldProps, 'className'> {
  label?: string
  placeholder?: string
  rows?: number
  size?: Size
  className?: string
}

export function Textarea({ label, placeholder, rows = 3, size = 'md', className, ...props }: TextareaProps) {
  return (
    <TextField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
      <RATextArea
        placeholder={placeholder}
        rows={rows}
        className={cn(
          inputPx[size], textareaPy[size], inputText[size],
          'bg-surface border border-border text-fg resize-y',
          'rounded-[var(--base-radius)]',
          'placeholder:text-fg-disabled',
          'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          'disabled:bg-surface-subtle disabled:text-fg-disabled disabled:cursor-not-allowed',
          'data-[invalid]:border-danger data-[invalid]:focus:outline-danger',
          'w-full min-h-[72px]',
        )}
      />
    </TextField>
  )
}
