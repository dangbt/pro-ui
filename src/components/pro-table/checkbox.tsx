import { useRef, useEffect } from 'react'
import { cn } from '../../lib/cn'

export function IndeterminateCheckbox({
  indeterminate,
  className,
  checked,
  disabled,
  onChange,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)

  // `indeterminate` is a DOM property, not an HTML attribute, so React cannot set it
  // declaratively — assign it imperatively on the native input.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = !!indeterminate
  }, [indeterminate])

  return (
    <label
      className={cn(
        'inline-flex items-center justify-center cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        {...rest}
      />
      <div
        className={cn(
          'w-4 h-4 border-2 rounded-[var(--base-radius)] flex items-center justify-center shrink-0 transition-[colors,transform]',
          'border-border bg-surface',
          (checked || indeterminate) && 'bg-primary border-primary',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1',
          'hover:border-primary-400',
          'active:scale-95',
        )}
      >
        <svg viewBox="0 0 16 16" className="w-full h-full" aria-hidden>
          {indeterminate ? (
            <path
              d="M 3 8 L 13 8"
              stroke="white"
              strokeWidth={2.5}
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M 2.5 8 L 6 12 L 13.5 4"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: '22px',
                strokeDashoffset: checked ? '44px' : '66px',
                transition: 'stroke-dashoffset 200ms ease',
              }}
            />
          )}
        </svg>
      </div>
    </label>
  )
}
