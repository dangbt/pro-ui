import { Badge } from '../badge'
import type { ValueType, ValueEnum, ValueEnumItem } from './types'

function getEnumItem(valueEnum: ValueEnum, value: unknown): ValueEnumItem | undefined {
  return valueEnum[String(value)]
}

function formatDate(value: unknown): string {
  if (!value) return '—'
  const d = new Date(value as string | number)
  return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('vi-VN')
}

function formatMoney(value: unknown): string {
  const n = Number(value)
  if (isNaN(n)) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

export function renderValue(
  value: unknown,
  valueType: ValueType = 'text',
  valueEnum?: ValueEnum,
): React.ReactNode {
  if (value === null || value === undefined || value === '') return <span className="text-gray-300">—</span>

  switch (valueType) {
    case 'date':
      return <span>{formatDate(value)}</span>

    case 'money':
      return <span className="tabular-nums">{formatMoney(value)}</span>

    case 'number':
      return <span className="tabular-nums">{Number(value).toLocaleString('vi-VN')}</span>

    case 'select': {
      if (!valueEnum) return <span>{String(value)}</span>
      const item = getEnumItem(valueEnum, value)
      if (!item) return <span className="text-gray-400">{String(value)}</span>
      if (typeof item === 'string') return <Badge>{item}</Badge>
      return <Badge color={item.color ?? 'default'}>{item.text}</Badge>
    }

    default:
      return <span>{String(value)}</span>
  }
}
