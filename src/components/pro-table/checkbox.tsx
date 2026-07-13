import { cn } from '../../lib/cn'

export function IndeterminateCheckbox({
  indeterminate,
  className,
  checked,
  disabled,
  onChange,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }) {
  return (
    <label
      className={cn(
        'inline-flex items-center justify-center cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : !!checked}
    >
      <input
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
