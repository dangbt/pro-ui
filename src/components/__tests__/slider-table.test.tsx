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

  it('keeps the fill on the 8px rail rather than stretching the full track height', () => {
    const { container } = render(
      <Slider label="Volume" defaultValue={50} minValue={0} maxValue={100} />,
    )
    // RAC SliderFill applies inline `height: 100%`. To avoid it stretching to the
    // 20px track, it must live inside the 8px rail container (h-2), so its 100%
    // resolves against the rail, not the track.
    const fill = container.querySelector('.bg-primary') as HTMLElement | null
    expect(fill).not.toBeNull()
    // SliderFill relies on the rail for height (inset-y-0), never a fixed h-5.
    expect(fill!.className).not.toContain('h-5')
    // RAC forces inline `height: 100%` on the fill; it must therefore resolve
    // against a small rail, not the 20px track.
    expect(fill!.style.height).toBe('100%')
    // Its parent is the rail: a fixed 8px-tall (h-2) container, not the 20px track.
    const rail = fill!.parentElement as HTMLElement
    expect(rail.className).toContain('h-2')
    expect(rail.className).not.toContain('h-5')
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
