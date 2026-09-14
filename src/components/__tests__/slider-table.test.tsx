import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Slider } from '../slider'
import { Table } from '../table'

describe('Slider — range (number[])', () => {
  it('renders two thumbs for a 2-item value array', () => {
    render(
      <Slider<number[]>
        label="Price range"
        defaultValue={[20, 80]}
        minValue={0}
        maxValue={100}
      />,
    )
    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(2)
  })

  it('renders a single thumb for a scalar value', () => {
    render(<Slider label="Volume" defaultValue={50} minValue={0} maxValue={100} />)
    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(1)
  })
})

describe('Table.Foot', () => {
  it('renders a tfoot element containing footer cells', () => {
    const { container } = render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Widget</Table.Cell>
            <Table.Cell>10</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>10</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>,
    )
    const tfoot = container.querySelector('tfoot')
    expect(tfoot).not.toBeNull()
    expect(screen.getByText('Total')).toBeDefined()
    expect(tfoot?.textContent).toContain('Total')
  })
})
