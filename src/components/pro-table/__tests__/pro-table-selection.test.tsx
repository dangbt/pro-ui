import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProTable } from '../pro-table'
import type { ProColumnType } from '../types'

interface Row {
  // `key` is intentionally always undefined so getRowKey falls back to String(index).
  key?: string
  name: string
}

const rows: Row[] = [
  { name: 'Row0' },
  { name: 'Row1' },
  { name: 'Row2' },
  { name: 'Row3' },
  { name: 'Row4' },
]

const columns: ProColumnType<Row>[] = [{ title: 'Name', dataIndex: 'name' }]

// ─── (1) Selection key uses the real table row index ───

describe('ProTable — selection key uses row.index', () => {
  it('selecting only the 3rd row of a 5-row table reports key "2" when rowKey is undefined on every row', async () => {
    const onChange = vi.fn<(keys: string[], rows: Row[]) => void>()

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="key"
        search={false}
        rowSelection={{ onChange }}
      />,
    )

    // Row checkboxes: index 0 is the header select-all, 1..5 are the body rows.
    const checkboxes = screen.getAllByRole('checkbox')
    // 5 rows + 1 header = 6 checkboxes
    expect(checkboxes.length).toBe(6)

    // Click the 3rd body row (index 2 → checkbox at position 3 overall).
    await act(async () => { fireEvent.click(checkboxes[3]) })

    expect(onChange).toHaveBeenCalledTimes(1)
    const [keys] = onChange.mock.calls[0]
    expect(keys).toEqual(['2'])
  })
})

// ─── (2) onChange does not fire on mount ───

describe('ProTable — rowSelection.onChange mount behaviour', () => {
  it('does NOT fire on mount, then fires on the first real selection change', async () => {
    const onChange = vi.fn<(keys: string[], rows: Row[]) => void>()

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="key"
        search={false}
        rowSelection={{ onChange }}
      />,
    )

    // No call on mount.
    expect(onChange).not.toHaveBeenCalled()

    const checkboxes = screen.getAllByRole('checkbox')
    await act(async () => { fireEvent.click(checkboxes[1]) })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(['0'])

    await act(async () => { fireEvent.click(checkboxes[2]) })
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange.mock.calls[1][0]).toEqual(['0', '1'])
  })
})
