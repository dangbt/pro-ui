import { useRef, useState, useCallback } from 'react'
import { cn } from '../lib/cn'

interface InputOTPProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  autoFocus?: boolean
  className?: string
}

export function InputOTP({ length = 6, value: controlled, onChange, autoFocus, className }: InputOTPProps) {
  const [internal, setInternal] = useState('')
  const value = controlled ?? internal
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const setValue = useCallback((v: string) => {
    if (controlled === undefined) setInternal(v)
    onChange?.(v)
  }, [controlled, onChange])

  const focusAt = (i: number) => refs.current[i]?.focus()

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return
    const arr = value.split('')
    arr[i] = char
    const next = arr.join('').slice(0, length)
    setValue(next)
    if (char && i < length - 1) focusAt(i + 1)
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[i] && i > 0) { focusAt(i - 1) }
      else {
        const arr = value.split('')
        arr[i] = ''
        setValue(arr.join(''))
      }
    } else if (e.key === 'ArrowLeft' && i > 0) focusAt(i - 1)
    else if (e.key === 'ArrowRight' && i < length - 1) focusAt(i + 1)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    setValue(pasted)
    focusAt(Math.min(pasted.length, length - 1))
  }

  return (
    <div className={cn('inline-flex gap-2', className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          value={value[i] ?? ''}
          onChange={e => handleChange(i, e.target.value.slice(-1))}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={e => e.target.select()}
          className={cn(
            'w-10 h-12 text-center text-lg font-medium rounded-[var(--base-radius)]',
            'border border-border bg-surface text-fg',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            'transition-colors',
          )}
        />
      ))}
    </div>
  )
}
