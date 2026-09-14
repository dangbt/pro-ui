import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderValue } from '../render-value'
import { DEFAULT_LOCALE, DEFAULT_CURRENCY } from '../constants'
import { ProTable } from '../pro-table'
import type { ProColumnType } from '../types'

// Helper: render a ReactNode and return its text content.
function text(node: React.ReactNode): string {
  const { container } = render(<>{node}</>)
  return container.textContent ?? ''
}

interface Row {
  id: string
  amount: number
  when: string
}

const rows: Row[] = [{ id: '1', amount: 1234.5, when: '2024-01-15' }]

// ─── locale/currency defaults are byte-identical to the pre-prop output ───

describe('renderValue — locale/currency defaults', () => {
  it('money uses vi-VN / VND by default (unchanged for existing consumers)', () => {
    const expected = new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency: DEFAULT_CURRENCY,
    }).format(1234.5)
    expect(text(renderValue(1234.5, 'money'))).toBe(expected)
  })

  it('date uses vi-VN by default', () => {
    const expected = new Date('2024-01-15').toLocaleDateString(DEFAULT_LOCALE)
    expect(text(renderValue('2024-01-15', 'date'))).toBe(expected)
  })

  it('number uses vi-VN grouping by default', () => {
    const expected = (1234.5).toLocaleString(DEFAULT_LOCALE)
    expect(text(renderValue(1234.5, 'number'))).toBe(expected)
  })
})

// ─── explicit locale/currency override the defaults ───

describe('renderValue — locale/currency overrides', () => {
  it('money honours an overridden locale + currency', () => {
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(1234.5)
    expect(text(renderValue(1234.5, 'money', undefined, 'en-US', 'USD'))).toBe(expected)
    // And it differs from the default output (guards against a no-op override).
    expect(text(renderValue(1234.5, 'money', undefined, 'en-US', 'USD'))).not.toBe(
      text(renderValue(1234.5, 'money')),
    )
  })

  it('date honours an overridden locale', () => {
    const expected = new Date('2024-01-15').toLocaleDateString('en-US')
    expect(text(renderValue('2024-01-15', 'date', undefined, 'en-US'))).toBe(expected)
  })
})

// ─── valueType: 'custom' with no render falls back to the em-dash placeholder ───

describe("renderValue — valueType 'custom'", () => {
  it("does not stringify the raw value; shows '—' when no render is supplied", () => {
    expect(text(renderValue('raw', 'custom'))).toBe('—')
    expect(text(renderValue(42, 'custom'))).toBe('—')
  })
})

// ─── The prop threads through ProTable end-to-end ───

describe('ProTable — locale/currency props reach the cells', () => {
  const columns: ProColumnType<Row>[] = [
    { title: 'Amount', dataIndex: 'amount', valueType: 'money' },
  ]

  it('renders money with the default vi-VN/VND when no props are passed', () => {
    const { container } = render(
      <ProTable<Row> columns={columns} dataSource={rows} rowKey="id" search={false} />,
    )
    const expected = new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency: DEFAULT_CURRENCY,
    }).format(1234.5)
    expect(container.textContent).toContain(expected)
  })

  it('renders money with an overridden locale/currency', () => {
    const { container } = render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
        locale="en-US"
        currency="USD"
      />,
    )
    const expected = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(1234.5)
    expect(container.textContent).toContain(expected)
  })
})
