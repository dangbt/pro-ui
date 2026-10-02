import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { ProTable } from '../pro-table'
import { TableHeader } from '../table-header'
import type { ProColumnType } from '../types'

interface Row {
  id: string
  name: string
  age: number
}

const columns: ProColumnType<Row>[] = [
  { title: 'Name', dataIndex: 'name', sortable: true },
  { title: 'Age', dataIndex: 'age' },
]

const rows: Row[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
]

// ─── Header: one <th> per visible column ───

describe('ProTable render — header', () => {
  it('renders exactly one <th> per visible column', () => {
    const { container } = render(
      <ProTable<Row> columns={columns} dataSource={rows} rowKey="id" search={false} />,
    )
    // Two data columns → two header cells (no selection/expand columns here).
    const ths = container.querySelectorAll('thead th')
    expect(ths.length).toBe(2)
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Age')).toBeTruthy()
  })

  it('shows a sort indicator on sortable columns', () => {
    render(<ProTable<Row> columns={columns} dataSource={rows} rowKey="id" search={false} />)
    // Sortable "Name" column renders the neutral ↕ indicator.
    expect(screen.getByText('↕')).toBeTruthy()
  })
})

// ─── Body: loading branch ───

describe('ProTable render — loading branch', () => {
  it('renders the loading branch while a request promise is pending', async () => {
    // A request that never resolves keeps the table in the loading state.
    const request = vi.fn(() => new Promise<never>(() => {}))
    render(<ProTable<Row> columns={columns} request={request} rowKey="id" search={false} />)

    await waitFor(() => expect(screen.getByText('Loading...')).toBeTruthy())
  })
})

// ─── Body: empty branch ───

describe('ProTable render — empty branch', () => {
  it('renders "No data" for an empty dataSource', () => {
    render(<ProTable<Row> columns={columns} dataSource={[]} rowKey="id" search={false} />)
    expect(screen.getByText('No data')).toBeTruthy()
  })
})

// ─── Body: error branch + working Retry ───

describe('ProTable render — error branch', () => {
  it('renders "Failed to load" plus a Retry button that refetches when request rejects', async () => {
    const request = vi.fn().mockRejectedValue(new Error('boom'))
    render(<ProTable<Row> columns={columns} request={request} rowKey="id" search={false} />)

    await waitFor(() => expect(screen.getByText('Failed to load')).toBeTruthy())
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    const retry = screen.getByRole('button', { name: 'Retry' })
    expect(retry).toBeTruthy()

    await act(async () => { fireEvent.click(retry) })

    // Clicking Retry triggers another fetch.
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
  })
})

// ─── Sticky clone header keeps pointer-events-auto so it can still sort ───

// The fixed window-scroll clone lives under a wrapper with pointer-events:none.
// `interactiveOverlay` re-enables hit-testing on the header text span so a click
// on the stuck clone still reaches the sort handler. The real header never sets
// it. We drive TableHeader directly (via a real TanStack table) because the clone
// only mounts once an IntersectionObserver marks it sticky, which jsdom can't fake.

describe('ProTable render — sticky clone interactiveOverlay', () => {
  function Harness({ interactiveOverlay }: { interactiveOverlay: boolean }) {
    const table = useReactTable<Row>({
      data: rows,
      columns: [{ id: 'name', header: 'Name', accessorKey: 'name' }],
      getCoreRowModel: getCoreRowModel(),
    })
    return (
      <table>
        <TableHeader table={table} interactiveOverlay={interactiveOverlay} />
      </table>
    )
  }

  it('adds pointer-events-auto to the header span on the clone, and omits it on the real header', () => {
    const { container: cloneC } = render(<Harness interactiveOverlay />)
    const cloneSpan = cloneC.querySelector('thead th span')
    expect(cloneSpan?.className).toContain('pointer-events-auto')

    const { container: realC } = render(<Harness interactiveOverlay={false} />)
    const realSpan = realC.querySelector('thead th span')
    expect(realSpan?.className).not.toContain('pointer-events-auto')
  })
})


// ─── Server mode: client does NOT re-sort the data ───

describe('ProTable render — server mode does not re-sort data', () => {
  it('preserves server-returned order when sortable column is clicked (manualSorting)', async () => {
    // Server returns data in a specific order: Bob first, then Alice.
    // Even after clicking the Name sort header, the *displayed* order should
    // remain Bob, Alice — because server mode uses manualSorting: true.
    const serverData: Row[] = [
      { id: '2', name: 'Bob', age: 25 },
      { id: '1', name: 'Alice', age: 30 },
    ]

    const request = vi.fn().mockResolvedValue({
      data: serverData,
      total: 2,
      success: true,
    })

    render(
      <ProTable<Row>
        columns={columns}
        request={request}
        rowKey="id"
        search={false}
      />,
    )

    // Wait for initial load
    await waitFor(() => expect(screen.getByText('Bob')).toBeTruthy())

    // Get all cells in the Name column (first data column)
    const getCellOrder = () => {
      const tbody = document.querySelector('tbody')
      const rows = tbody?.querySelectorAll('tr') ?? []
      return Array.from(rows)
        .map(row => row.querySelectorAll('td')[0]?.textContent)
        .filter(Boolean)
    }

    // Initial order: Bob first (as server returned)
    expect(getCellOrder()).toEqual(['Bob', 'Alice'])

    // Click the sortable Name header to toggle sort
    const nameHeader = screen.getByText('Name')
    await act(async () => { fireEvent.click(nameHeader) })

    // Wait for any re-renders
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    // Order should STILL be what server returned (Bob, Alice)
    // NOT alphabetically re-sorted to (Alice, Bob) by the client
    expect(getCellOrder()).toEqual(['Bob', 'Alice'])
  })

  it('client mode DOES re-sort data locally', async () => {
    // In client mode, clicking sort should re-order locally
    const clientData: Row[] = [
      { id: '2', name: 'Bob', age: 25 },
      { id: '1', name: 'Alice', age: 30 },
    ]

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={clientData}
        rowKey="id"
        search={false}
      />,
    )

    // Wait for render
    await waitFor(() => expect(screen.getByText('Bob')).toBeTruthy())

    const getCellOrder = () => {
      const tbody = document.querySelector('tbody')
      const rows = tbody?.querySelectorAll('tr') ?? []
      return Array.from(rows)
        .map(row => row.querySelectorAll('td')[0]?.textContent)
        .filter(Boolean)
    }

    // Initial order: Bob first (as provided)
    expect(getCellOrder()).toEqual(['Bob', 'Alice'])

    // Click the sortable Name header to sort ascending
    const nameHeader = screen.getByText('Name')
    await act(async () => { fireEvent.click(nameHeader) })

    // In client mode, should be re-sorted alphabetically: Alice, Bob
    await waitFor(() => expect(getCellOrder()).toEqual(['Alice', 'Bob']))
  })
})
