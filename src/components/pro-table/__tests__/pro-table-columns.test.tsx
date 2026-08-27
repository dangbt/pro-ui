import { render, screen, fireEvent, act } from '@testing-library/react'
import { useState, useEffect } from 'react'
import { describe, it, expect } from 'vitest'
import { ProTable } from '../pro-table'
import type { ProColumnType } from '../types'

interface Row {
  id: string
  name: string
}

const data: Row[] = [{ id: '1', name: 'Alice' }]

// ─── (a) No remount when consumer passes inline array ───

describe('ProTable — no cell remount with inline columns', () => {
  it('cell component mounts only once even when columns array has new identity each render', async () => {
    const mountCount = { value: 0 }

    function CellComp({ value }: { value: unknown }) {
      useEffect(() => {
        mountCount.value += 1
      }, [])
      return <span data-testid="cell-comp">{String(value)}</span>
    }

    function Page() {
      const [tick, setTick] = useState(0)

      // Inline array — new identity every render. On old code this causes
      // TanStack to rebuild Column instances → cell remount on every render.
      const columns: ProColumnType<Row>[] = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (value) => <CellComp value={value} />,
        },
      ]

      return (
        <>
          <button data-testid="tick" onClick={() => setTick(t => t + 1)}>tick</button>
          <span data-testid="tick-val">{tick}</span>
          <ProTable<Row>
            columns={columns}
            dataSource={data}
            rowKey="id"
            search={false}
          />
        </>
      )
    }

    render(<Page />)
    expect(screen.getByTestId('cell-comp')).toBeTruthy()
    expect(mountCount.value).toBe(1)

    // Re-render parent twice — cell must NOT remount
    await act(async () => { fireEvent.click(screen.getByTestId('tick')) })
    await act(async () => { fireEvent.click(screen.getByTestId('tick')) })

    expect(screen.getByTestId('tick-val').textContent).toBe('2')
    expect(mountCount.value).toBe(1)
  })
})

// ─── (b) Latest closure when consumer passes inline array ───

describe('ProTable — latest closure with inline columns', () => {
  it('render closure reads fresh state after parent re-renders', async () => {
    function Page() {
      const [count, setCount] = useState(0)

      // Inline array each render — new closure captures new `count`.
      const columns: ProColumnType<Row>[] = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: () => <span data-testid="cell">{`count:${count}`}</span>,
        },
      ]

      return (
        <>
          <button data-testid="inc" onClick={() => setCount(c => c + 1)}>inc</button>
          <ProTable<Row>
            columns={columns}
            dataSource={data}
            rowKey="id"
            search={false}
          />
        </>
      )
    }

    render(<Page />)
    expect(screen.getByTestId('cell').textContent).toBe('count:0')

    await act(async () => { fireEvent.click(screen.getByTestId('inc')) })
    expect(screen.getByTestId('cell').textContent).toBe('count:1')

    await act(async () => { fireEvent.click(screen.getByTestId('inc')) })
    expect(screen.getByTestId('cell').textContent).toBe('count:2')
  })
})

// ─── (c) hideInTable prevents column from rendering ───

describe('ProTable — hideInTable', () => {
  it('column with hideInTable does not produce a table header, but normal columns do', () => {
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Secret', dataIndex: 'id', hideInTable: true },
    ]

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={false}
      />,
    )

    // "Name" column must be present
    expect(screen.getByText('Name')).toBeTruthy()
    // "Secret" column header must NOT be rendered at all
    expect(screen.queryByText('Secret')).toBeNull()
  })
})
