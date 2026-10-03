import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { createRef, useState } from 'react'
import { ProTable } from '../pro-table'
import type { ProColumnType, ProTableActions, SortState } from '../types'

interface Row {
  id: string
  name: string
  description: string
}

const rows: Row[] = [
  { id: '1', name: 'Alice', description: 'A very long description that should be truncated' },
  { id: '2', name: 'Bob', description: 'Short desc' },
]

const columns: ProColumnType<Row>[] = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Description', dataIndex: 'description', ellipsis: true },
]

// ─────────────────────────────────────────────────────────────────────────────
// actionRef tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — actionRef', () => {
  it('exposes reload, reloadAndReset, reset, clearSelected methods', async () => {
    const actionRef = createRef<ProTableActions>()

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
        actionRef={actionRef}
      />,
    )

    // After render, actionRef.current should be set
    await waitFor(() => {
      expect(actionRef.current).not.toBeNull()
    })

    expect(typeof actionRef.current?.reload).toBe('function')
    expect(typeof actionRef.current?.reloadAndReset).toBe('function')
    expect(typeof actionRef.current?.reset).toBe('function')
    expect(typeof actionRef.current?.clearSelected).toBe('function')
  })

  it('actionRef.reload() calls request again with same params', async () => {
    const request = vi.fn().mockResolvedValue({
      data: rows,
      total: 2,
      success: true,
    })
    const actionRef = createRef<ProTableActions>()

    render(
      <ProTable<Row>
        columns={columns}
        request={request}
        rowKey="id"
        search={false}
        actionRef={actionRef}
      />,
    )

    // Wait for initial request
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    // Call reload
    await act(async () => {
      actionRef.current?.reload()
    })

    // Should have been called again
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    // Both calls should have same params (page 1)
    expect(request.mock.calls[0][0]).toMatchObject({ current: 1, pageSize: 10 })
    expect(request.mock.calls[1][0]).toMatchObject({ current: 1, pageSize: 10 })
  })

  it('actionRef.reset() clears search form inputs and re-fetches without filters', async () => {
    const searchableColumns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Description', dataIndex: 'description' },
    ]
    const request = vi.fn().mockResolvedValue({
      data: rows,
      total: 2,
      success: true,
    })
    const actionRef = createRef<ProTableActions>()

    const { container } = render(
      <ProTable<Row>
        columns={searchableColumns}
        request={request}
        rowKey="id"
        search={true}
        actionRef={actionRef}
      />,
    )

    // Wait for initial request
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    // Type "foo" into the Name search input
    const searchForm = container.querySelector('.grid')!
    const nameInput = within(searchForm as HTMLElement).getByPlaceholderText('Search Name')
    fireEvent.change(nameInput, { target: { value: 'foo' } })

    // Click Search button
    const searchButton = screen.getByText('Search')
    await act(async () => {
      fireEvent.click(searchButton)
    })

    // Wait for request with filter
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
    expect(request.mock.calls[1][0]).toMatchObject({ name: 'foo' })

    // Now call reset via actionRef
    await act(async () => {
      actionRef.current?.reset()
    })

    // Request should fire without filters
    await waitFor(() => expect(request).toHaveBeenCalledTimes(3))
    expect(request.mock.calls[2][0]).not.toHaveProperty('name')

    // The search input should be cleared (form remounted)
    const newNameInput = within(container.querySelector('.grid')! as HTMLElement).getByPlaceholderText('Search Name')
    expect((newNameInput as HTMLInputElement).value).toBe('')
  })

  it('actionRef.clearSelected() clears selection in uncontrolled mode and calls onChange', async () => {
    const onChange = vi.fn()
    const actionRef = createRef<ProTableActions>()

    const { container } = render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
        actionRef={actionRef}
        rowSelection={{ onChange }}
      />,
    )

    // Wait for actionRef to be set
    await waitFor(() => expect(actionRef.current).not.toBeNull())

    // Find and click a row checkbox to select (skip header checkbox at index 0)
    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(1)

    await act(async () => {
      fireEvent.click(checkboxes[1])
    })

    // Wait for onChange to be called with the selected row
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['1'], [rows[0]])
    })

    // Clear call count
    onChange.mockClear()

    // Now call clearSelected
    await act(async () => {
      actionRef.current?.clearSelected()
    })

    // onChange should be called with empty arrays
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([], [])
    })
  })

  it('actionRef.clearSelected() in controlled mode calls onChange with empty selection', async () => {
    const onChange = vi.fn()
    const actionRef = createRef<ProTableActions>()

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys: ['1', '2'],
          onChange,
        }}
      />,
    )

    await waitFor(() => expect(actionRef.current).not.toBeNull())

    // Call clearSelected in controlled mode
    await act(async () => {
      actionRef.current?.clearSelected()
    })

    // onChange should be called with empty arrays
    expect(onChange).toHaveBeenCalledWith([], [])
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Controlled selection tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — controlled selection', () => {
  it('syncs selection state from selectedRowKeys prop', () => {
    const onChange = vi.fn()

    const { container } = render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
        rowSelection={{
          selectedRowKeys: ['1'],
          onChange,
        }}
      />,
    )

    // The row with id='1' should have its checkbox checked
    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    const rowCheckboxes = Array.from(checkboxes).slice(1) // Skip header checkbox

    expect(rowCheckboxes.length).toBe(2)
    expect((rowCheckboxes[0] as HTMLInputElement).checked).toBe(true)
    expect((rowCheckboxes[1] as HTMLInputElement).checked).toBe(false)
  })

  it('clicking checkbox in controlled mode calls onChange with next state', async () => {
    const onChange = vi.fn()

    // Use a component that actually updates selectedRowKeys on change
    function ControlledTable() {
      const [selectedKeys, setSelectedKeys] = useState<string[]>([])

      return (
        <ProTable<Row>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          search={false}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (keys, records) => {
              setSelectedKeys(keys)
              onChange(keys, records)
            },
          }}
        />
      )
    }

    const { container } = render(<ControlledTable />)

    // Find row checkboxes (skip header)
    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes.length).toBeGreaterThan(1)

    // Click first row checkbox
    await act(async () => {
      fireEvent.click(checkboxes[1])
    })

    // onChange should be called with the selected row
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['1'], [rows[0]])
    })

    // The checkbox should now be checked (since we update state)
    await waitFor(() => {
      expect((checkboxes[1] as HTMLInputElement).checked).toBe(true)
    })
  })

  it('clicking already selected checkbox in controlled mode deselects it', async () => {
    const onChange = vi.fn()

    function ControlledTable() {
      const [selectedKeys, setSelectedKeys] = useState<string[]>(['1'])

      return (
        <ProTable<Row>
          columns={columns}
          dataSource={rows}
          rowKey="id"
          search={false}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (keys, records) => {
              setSelectedKeys(keys)
              onChange(keys, records)
            },
          }}
        />
      )
    }

    const { container } = render(<ControlledTable />)

    const checkboxes = container.querySelectorAll('input[type="checkbox"]')

    // First row checkbox should be checked initially
    expect((checkboxes[1] as HTMLInputElement).checked).toBe(true)

    // Click to deselect
    await act(async () => {
      fireEvent.click(checkboxes[1])
    })

    // onChange should be called with empty selection
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([], [])
    })
  })

  it('does not reset selection on data change when preserveSelectedRowKeys=true', async () => {
    const onChange = vi.fn()

    function TestComponent({ data }: { data: Row[] }) {
      return (
        <ProTable<Row>
          columns={columns}
          dataSource={data}
          rowKey="id"
          search={false}
          rowSelection={{
            onChange,
            preserveSelectedRowKeys: true,
          }}
        />
      )
    }

    const { container, rerender } = render(<TestComponent data={rows} />)

    // Select first row
    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    await act(async () => {
      fireEvent.click(checkboxes[1])
    })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(['1'], [rows[0]])
    })

    onChange.mockClear()

    // Change data - selection should persist
    const newRows: Row[] = [
      { id: '1', name: 'Alice Updated', description: 'Updated desc' },
      { id: '3', name: 'Charlie', description: 'New row' },
    ]

    rerender(<TestComponent data={newRows} />)

    // The first row (id='1') should still be selected
    await waitFor(() => {
      const updatedCheckboxes = container.querySelectorAll('input[type="checkbox"]')
      expect((updatedCheckboxes[1] as HTMLInputElement).checked).toBe(true)
    })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// defaultSort / onSortChange tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — defaultSort / onSortChange', () => {
  const sortableColumns: ProColumnType<Row>[] = [
    { title: 'Name', dataIndex: 'name', sortable: true },
    { title: 'Description', dataIndex: 'description' },
  ]

  it('applies defaultSort on initial render', async () => {
    const request = vi.fn().mockResolvedValue({
      data: rows,
      total: 2,
      success: true,
    })

    render(
      <ProTable<Row>
        columns={sortableColumns}
        request={request}
        rowKey="id"
        search={false}
        defaultSort={{ field: 'name', order: 'desc' }}
      />,
    )

    // Wait for initial request
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    // Request should include sort params
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        sort: 'name',
        order: 'desc',
      }),
    )
  })

  it('calls onSortChange when user clicks sortable column', async () => {
    const onSortChange = vi.fn()

    render(
      <ProTable<Row>
        columns={sortableColumns}
        dataSource={rows}
        rowKey="id"
        search={false}
        onSortChange={onSortChange}
      />,
    )

    // Find and click the sortable Name column header
    const nameHeader = screen.getByText('Name')
    await act(async () => {
      fireEvent.click(nameHeader)
    })

    // onSortChange should be called with sort state
    await waitFor(() => {
      expect(onSortChange).toHaveBeenCalled()
    })

    const [sortState] = onSortChange.mock.calls[0] as [SortState | undefined]
    expect(sortState?.field).toBe('name')
    expect(['asc', 'desc']).toContain(sortState?.order)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ellipsis tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — column ellipsis', () => {
  it('applies truncate class to cells with ellipsis=true', () => {
    const { container } = render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
      />,
    )

    // Find cells in the description column (second column, has ellipsis)
    const cells = container.querySelectorAll('tbody td')

    // Description cells should have truncate class
    // Cells are: [name1, desc1, name2, desc2]
    expect(cells.length).toBeGreaterThanOrEqual(4)
    expect(cells[1].classList.contains('truncate')).toBe(true)
    expect(cells[3].classList.contains('truncate')).toBe(true)
  })

  it('adds native title attribute for tooltip on ellipsis cells with string content', () => {
    const { container } = render(
      <ProTable<Row>
        columns={columns}
        dataSource={rows}
        rowKey="id"
        search={false}
      />,
    )

    const cells = container.querySelectorAll('tbody td')

    // Description cells should have title attribute with the text content
    expect(cells.length).toBeGreaterThanOrEqual(2)
    const descCell = cells[1] as HTMLElement
    expect(descCell.title).toBe('A very long description that should be truncated')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// column tooltip tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — column header tooltip', () => {
  const columnsWithTooltip: ProColumnType<Row>[] = [
    { title: 'Name', dataIndex: 'name', tooltip: 'User full name' },
    { title: 'Description', dataIndex: 'description' },
  ]

  it('renders tooltip icon next to header with tooltip prop', () => {
    const { container } = render(
      <ProTable<Row>
        columns={columnsWithTooltip}
        dataSource={rows}
        rowKey="id"
        search={false}
      />,
    )

    // Find the info icon button in the header
    const infoButtons = container.querySelectorAll('thead button[aria-label="Column info"]')
    expect(infoButtons.length).toBe(1)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// emptyText tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — emptyText', () => {
  it('shows custom emptyText when table is empty', () => {
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={[]}
        rowKey="id"
        search={false}
        emptyText="No records found"
      />,
    )

    expect(screen.getByText('No records found')).toBeTruthy()
  })

  it('shows default "No data" when emptyText is not provided', () => {
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={[]}
        rowKey="id"
        search={false}
      />,
    )

    expect(screen.getByText('No data')).toBeTruthy()
  })

  it('supports ReactNode as emptyText', () => {
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={[]}
        rowKey="id"
        search={false}
        emptyText={<span data-testid="custom-empty">Custom empty state</span>}
      />,
    )

    expect(screen.getByTestId('custom-empty')).toBeTruthy()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// title as ReactNode tests
// ─────────────────────────────────────────────────────────────────────────────

describe('ProTable — title as ReactNode', () => {
  const columnsWithReactNodeTitle: ProColumnType<Row>[] = [
    {
      title: <span data-testid="custom-title">Custom Name</span>,
      dataIndex: 'name',
      key: 'name',
    },
    { title: 'Description', dataIndex: 'description' },
  ]

  it('renders ReactNode title in header', () => {
    render(
      <ProTable<Row>
        columns={columnsWithReactNodeTitle}
        dataSource={rows}
        rowKey="id"
        search={false}
      />,
    )

    expect(screen.getByTestId('custom-title')).toBeTruthy()
  })
})
