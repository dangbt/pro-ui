import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProTable } from '../pro-table'
import type { ProColumnType } from '../types'

interface Row {
  id: string
  name: string
  age: number
}

const columns: ProColumnType<Row>[] = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
]

const rows: Row[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
]

// The column-visibility menu is a PortalMenu rendered into document.body. These
// tests exercise the shared PortalMenu behaviour through its real consumer
// (ColumnsPopover in toolbar.tsx): open on trigger click, toggle a column to hide
// its <th>, and close on Escape.
describe('ProTable — column-visibility menu (PortalMenu)', () => {
  function renderTable() {
    return render(
      <ProTable<Row> columns={columns} dataSource={rows} rowKey="id" search={false} />,
    )
  }

  it('opens on trigger click, toggling a column hides its <th>, and Escape closes it', async () => {
    const { container } = renderTable()

    // Both header cells present up front.
    expect(container.querySelectorAll('thead th').length).toBe(2)
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Age')).toBeTruthy()

    // Open the menu via its trigger.
    const trigger = screen.getByRole('button', { name: 'Columns' })
    await act(async () => { fireEvent.click(trigger) })

    // Menu is now open (portalled into document.body) — verify by looking for the Age checkbox
    const ageCheckbox = screen.getByLabelText('Age') as HTMLInputElement
    expect(ageCheckbox).toBeTruthy()

    // Toggle the "Age" column off via its checkbox in the menu.
    expect(ageCheckbox.checked).toBe(true)
    await act(async () => { fireEvent.click(ageCheckbox) })

    // The Age <th> is gone; only Name remains.
    const headerTexts = Array.from(container.querySelectorAll('thead th')).map(
      th => th.textContent,
    )
    expect(container.querySelectorAll('thead th').length).toBe(1)
    expect(headerTexts.some(t => t?.includes('Age'))).toBe(false)
    expect(headerTexts.some(t => t?.includes('Name'))).toBe(true)

    // Escape closes the menu.
    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    // Menu closed — checkbox no longer accessible
    expect(screen.queryByLabelText('Age')).toBeNull()
  })
})
