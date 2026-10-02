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

    // Find the Name input field and type
    const nameInput = screen.getByPlaceholderText('Search Name')
    fireEvent.change(nameInput, { target: { value: 'Alice' } })

    // Submit the form directly (simulating Enter key in a form)
    const form = container.querySelector('form')!
    fireEvent.submit(form)

    // Submit via form should trigger another request
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))

    // Check that the search params include the entered value
    const lastCall = request.mock.calls[1][0]
    expect(lastCall.name).toBe('Alice')
  })

  it('search form wraps inputs in a form element', () => {
    const columns: ProColumnType<Row>[] = [
      { title: 'Name', dataIndex: 'name' },
    ]

    const { container } = render(
      <ProTable<Row> columns={columns} dataSource={[]} rowKey="id" />,
    )

    // The search form should be wrapped in a <form> tag
    const form = container.querySelector('form')
    expect(form).toBeTruthy()
  })
})

// ─── Search form: Collapse behavior ───

describe('SearchForm — Collapse behavior', () => {
  const manyColumns: ProColumnType<Row>[] = [
    { title: 'Field 1', dataIndex: 'name', key: 'field1' },
    { title: 'Field 2', dataIndex: 'name', key: 'field2' },
    { title: 'Field 3', dataIndex: 'name', key: 'field3' },
    { title: 'Field 4', dataIndex: 'name', key: 'field4' },
    { title: 'Field 5', dataIndex: 'name', key: 'field5' },
    { title: 'Field 6', dataIndex: 'name', key: 'field6' },
  ]

  it('shows Expand button when fields > threshold and defaultCollapsed', () => {
    render(
      <ProTable<Row>
        columns={manyColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true, collapsedRows: 1 }}
      />,
    )

    // Should show Expand button
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

  it('does not show collapse button when fields <= threshold', () => {
    const fewColumns: ProColumnType<Row>[] = [
      { title: 'Field 1', dataIndex: 'name', key: 'field1' },
      { title: 'Field 2', dataIndex: 'name', key: 'field2' },
    ]

    render(
      <ProTable<Row>
        columns={fewColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true }}
      />,
    )

    // Should NOT show Expand/Collapse buttons
    expect(screen.queryByText('Expand')).toBeNull()
    expect(screen.queryByText('Collapse')).toBeNull()
  })

  it('respects custom collapsedRows config', () => {
    // With collapsedRows: 2 and xl grid = 4 cols, threshold = 8 fields
    // 6 fields should NOT trigger collapse
    render(
      <ProTable<Row>
        columns={manyColumns}
        dataSource={[]}
        rowKey="id"
        search={{ defaultCollapsed: true, collapsedRows: 2 }}
      />,
    )

    // Should NOT show Expand button since 6 <= 8
    expect(screen.queryByText('Expand')).toBeNull()
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
