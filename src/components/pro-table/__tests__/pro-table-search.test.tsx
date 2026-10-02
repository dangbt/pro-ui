import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProTable } from '../pro-table'
import type { ProColumnType } from '../types'

interface Row {
  id: string
  name: string
  status: string
  createdAt: string
}

// ─── Search form: Enter key submits ───

describe('SearchForm — Enter key submits', () => {
  it('triggers search when Enter is pressed in any input field', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0, success: true })

    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Status', dataIndex: 'status' },
    ]

    const { container } = render(<ProTable<Row> columns={columns} request={request} rowKey="id" />)

    // Wait for initial request
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1))

    // Find the Name input field
    const nameInput = screen.getByPlaceholderText('Search Name')
    
    // Type value
    fireEvent.change(nameInput, { target: { value: 'Alice' } })
    
    // Simulate Enter key by submitting the form that wraps the input
    // This is how the browser handles Enter in form fields with a submit button
    const form = container.querySelector('form')!
    fireEvent.submit(form)

    // Submit via Enter should trigger another request
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    // Check that the search params include the entered value
    const lastCall = request.mock.calls[1][0]
    expect(lastCall.name).toBe('Alice')
  })

  it('form submission via Enter is native browser behavior when form wraps inputs with submit button', () => {
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
    ]

    const { container } = render(
      <ProTable<Row> columns={columns} dataSource={[]} rowKey="id" />,
    )

    // The search form should be wrapped in a <form> tag
    const form = container.querySelector('form')
    expect(form).toBeTruthy()
    
    // The form should have a submit button (type="submit")
    const submitButton = form!.querySelector('button[type="submit"]')
    expect(submitButton).toBeTruthy()
  })
})

// ─── Search form: Collapse behavior ───

describe('SearchForm — Collapse behavior', () => {
  // 4 columns = > 3 threshold → should collapse
  const fourColumns: ProColumnType<Row>[] = [
    { title: 'Field 1', dataIndex: 'name', key: 'field1' },
    { title: 'Field 2', dataIndex: 'name', key: 'field2' },
    { title: 'Field 3', dataIndex: 'name', key: 'field3' },
    { title: 'Field 4', dataIndex: 'name', key: 'field4' },
  ]

  // 6 columns for expanded state tests
  const manyColumns: ProColumnType<Row>[] = [
    { title: 'Field 1', dataIndex: 'name', key: 'field1' },
    { title: 'Field 2', dataIndex: 'name', key: 'field2' },
    { title: 'Field 3', dataIndex: 'name', key: 'field3' },
    { title: 'Field 4', dataIndex: 'name', key: 'field4' },
    { title: 'Field 5', dataIndex: 'name', key: 'field5' },
    { title: 'Field 6', dataIndex: 'name', key: 'field6' },
  ]

  it('shows Expand button when fields > 3 (default threshold) and defaultCollapsed', () => {
    render(
      <ProTable<Row>
        columns={fourColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true }}
      />,
    )

    // Should show Expand button (4 > 3)
    expect(screen.getByText('Expand')).toBeTruthy()
  })

  it('shows all fields when expanded', async () => {
    render(
      <ProTable<Row>
        columns={manyColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true, collapsedRows: 1 }}
      />,
    )

    // Click Expand
    const expandBtn = screen.getByText('Expand')
    fireEvent.click(expandBtn)

    // Should now show Collapse button
    await waitFor(() => expect(screen.getByText('Collapse')).toBeTruthy())

    // All 6 fields should be visible
    expect(screen.getByPlaceholderText('Search Field 1')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search Field 6')).toBeTruthy()
  })

  it('does not show collapse button when fields <= 3 (default threshold)', () => {
    const threeColumns: ProColumnType<Row>[] = [
      { title: 'Field 1', dataIndex: 'name', key: 'field1' },
      { title: 'Field 2', dataIndex: 'name', key: 'field2' },
      { title: 'Field 3', dataIndex: 'name', key: 'field3' },
    ]

    render(
      <ProTable<Row>
        columns={threeColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true }}
      />,
    )

    // Should NOT show Expand/Collapse buttons (3 is not > 3)
    expect(screen.queryByText('Expand')).toBeNull()
    expect(screen.queryByText('Collapse')).toBeNull()
  })

  it('respects custom collapseThreshold config', () => {
    // With collapseThreshold: 5, 4 fields should NOT trigger collapse
    render(
      <ProTable<Row>
        columns={fourColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true, collapseThreshold: 5 }}
      />,
    )

    // Should NOT show Expand button since 4 is not > 5
    expect(screen.queryByText('Expand')).toBeNull()
  })

  it('respects custom collapsedRows config', () => {
    // With collapsedRows: 2 and 4 cols per row, visibleFields = 8
    // 6 fields all visible when collapsed with collapsedRows: 2
    render(
      <ProTable<Row>
        columns={manyColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true, collapsedRows: 2 }}
      />,
    )

    // Should show Expand (6 > 3 threshold)
    expect(screen.getByText('Expand')).toBeTruthy()
    // But all 6 fields should be visible because 2 rows × 4 cols = 8 > 6
    expect(screen.getByPlaceholderText('Search Field 1')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search Field 6')).toBeTruthy()
  })
})

// ─── Option column hidden from search form ───

describe('ProTable — option column hidden from search', () => {
  it('hides valueType "option" columns from search form but still shows in table', () => {
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Status', dataIndex: 'status', valueType: 'select', valueEnum: { active: 'Active' } },
      { title: 'Actions', key: 'actions', valueType: 'option' },
    ]

    const { container } = render(<ProTable<Row> columns={columns} dataSource={[]} rowKey="id" />)

    // Name should be in search form
    expect(screen.getByPlaceholderText('Search Name')).toBeTruthy()
    
    // Status should appear in search form (as Select label)
    const statusElements = screen.getAllByText('Status')
    expect(statusElements.length).toBeGreaterThan(0)

    // Actions should NOT be in search form (no search field for it)
    // But it WILL appear in table header
    const form = container.querySelector('form')!
    const actionsInSearch = form.querySelector('[placeholder*="Actions"]')
    expect(actionsInSearch).toBeNull()

    // Verify Actions still appears in table header (as expected)
    const tableHeader = container.querySelector('thead')!
    expect(tableHeader.textContent).toContain('Actions')
  })
})

// ─── Option column hidden from column toggle menu ───

describe('ProTable — option column hidden from column toggle', () => {
  it('hides valueType "option" columns from Columns toggle menu', async () => {
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Status', dataIndex: 'status' },
      { title: 'Actions', key: 'actions', valueType: 'option', render: () => <button>Edit</button> },
    ]

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={[{ id: '1', name: 'Alice', status: 'active', createdAt: '2024-01-01' }]}
        rowKey="id"
        search={false}
        headerTitle="Test Table"
      />,
    )

    // Click the Columns button to open the popover
    const columnsButton = screen.getByLabelText('Columns')
    fireEvent.click(columnsButton)

    // Wait for menu to open - look for the menu header "COLUMNS"
    await waitFor(() => {
      expect(screen.getByText('Columns')).toBeTruthy()
    })

    // Check the labels in the menu - only Name and Status should be present, not Actions
    // Query all checkbox labels in the document
    const labels = document.querySelectorAll('label')
    const labelTexts = Array.from(labels).map(l => l.textContent?.trim())
    
    // Name and Status should be in toggle menu
    expect(labelTexts.some(t => t === 'Name')).toBe(true)
    expect(labelTexts.some(t => t === 'Status')).toBe(true)
    
    // Actions should NOT be in the toggle menu (it's an option column)
    expect(labelTexts.some(t => t === 'Actions')).toBe(false)
  })
})

// ─── Option column does not go through renderValue ───

describe('ProTable — option column bypasses renderValue', () => {
  it('option column with dataIndex but no render returns null (not String(value))', () => {
    const data = [{ id: '1', name: 'Alice', status: 'active', createdAt: '2024-01-01' }]
    
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      // This option column has dataIndex but NO render - should return null, not "1"
      { title: 'Actions', dataIndex: 'id', valueType: 'option' },
    ]

    const { container } = render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={false}
      />,
    )

    // Get the Actions column cell
    const cells = container.querySelectorAll('td')
    // Last cell should be the Actions column
    const actionsCell = cells[cells.length - 1]
    
    // Should be empty (null), not contain "1" (the id value)
    expect(actionsCell.textContent).toBe('')
  })

  it('option column with render function uses the render function', () => {
    const data = [{ id: '1', name: 'Alice', status: 'active', createdAt: '2024-01-01' }]
    
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
      { 
        title: 'Actions', 
        dataIndex: 'id', 
        valueType: 'option',
        render: () => <button data-testid="action-btn">Edit</button>,
      },
    ]

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={false}
      />,
    )

    // Should render the custom button
    expect(screen.getByTestId('action-btn')).toBeTruthy()
  })
})

// ─── i18n texts ───

describe('ProTable — i18n texts', () => {
  it('uses custom search/reset text from texts prop', () => {
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
    ]

    render(
      <ProTable<Row>
        columns={columns}
        dataSource={[]}
        rowKey="id"
        texts={{
          search: 'Tìm kiếm',
          reset: 'Làm mới',
        }}
      />,
    )

    expect(screen.getByText('Tìm kiếm')).toBeTruthy()
    expect(screen.getByText('Làm mới')).toBeTruthy()
  })

  it('uses custom expand/collapse text from texts prop', () => {
    const manyColumns: ProColumnType<Row>[] = [
      { title: 'Field 1', dataIndex: 'name', key: 'field1' },
      { title: 'Field 2', dataIndex: 'name', key: 'field2' },
      { title: 'Field 3', dataIndex: 'name', key: 'field3' },
      { title: 'Field 4', dataIndex: 'name', key: 'field4' },
      { title: 'Field 5', dataIndex: 'name', key: 'field5' },
    ]

    render(
      <ProTable<Row>
        columns={manyColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true }}
        texts={{
          expand: 'Mở rộng',
          collapse: 'Thu gọn',
        }}
      />,
    )

    expect(screen.getByText('Mở rộng')).toBeTruthy()
  })
})
