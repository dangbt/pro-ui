import { Badge } from '../badge'
import { DEFAULT_LOCALE, DEFAULT_CURRENCY } from './constants'
import type { ValueType, ValueEnum, ValueEnumItem } from './types'

function getEnumItem(valueEnum: ValueEnum, value: unknown): ValueEnumItem | undefined {
  return valueEnum[String(value)]
}

function formatDate(value: unknown, locale: string): string {
  // `renderValue` already returns the em-dash placeholder for null/undefined/''
  // before this runs, so the only falsy values that reach here are `0` and `false`.
  // Feed them to `new Date(...)` as-is: `0` is the epoch (a valid date) and `false`
  // coerces to `NaN` → handled by the isNaN guard below.
  const d = new Date(value as string | number)
  return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(locale)
}

function formatMoney(value: unknown, locale: string, currency: string): string {
  const n = Number(value)
  if (isNaN(n)) return '—'
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)
}

export function renderValue(
  value: unknown,
  valueType: ValueType = 'text',
  valueEnum?: ValueEnum,
  locale: string = DEFAULT_LOCALE,
  currency: string = DEFAULT_CURRENCY,
): React.ReactNode {
  if (value === null || value === undefined || value === '') return <span className="text-fg-disabled">—</span>

  switch (valueType) {
    case 'date':
      return <span>{formatDate(value, locale)}</span>

    case 'money':
      return <span className="tabular-nums">{formatMoney(value, locale, currency)}</span>

    case 'number':
      return <span className="tabular-nums">{Number(value).toLocaleString(locale)}</span>

    case 'select': {
      if (!valueEnum) return <span>{String(value)}</span>
      const item = getEnumItem(valueEnum, value)
      if (!item) return <span className="text-fg-disabled">{String(value)}</span>
      if (typeof item === 'string') return <Badge>{item}</Badge>
      return <Badge color={item.color ?? 'default'}>{item.text}</Badge>
    }

    // A `'custom'` column is expected to supply its own `render` (handled in
    // build-columns.tsx before renderValue is ever called). If it reaches here
    // it has no renderer, so there's nothing meaningful to show — fall back to
    // the em-dash placeholder rather than stringifying the raw value.
    case 'custom':
      return <span className="text-fg-disabled">—</span>

    default:
      return <span>{String(value)}</span>
  }
}
