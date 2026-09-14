import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import { CalendarDate } from '@internationalized/date'
import { Calendar, DatePicker } from '../date-picker'

// jsdom does not implement CSS.escape, which React Aria's selection manager
// calls when a ListBox mounts. Polyfill it so the month/year dropdowns work.
beforeAll(() => {
  if (typeof globalThis.CSS === 'undefined') {
    // @ts-expect-error minimal shim
    globalThis.CSS = {}
  }
  if (typeof globalThis.CSS.escape !== 'function') {
    globalThis.CSS.escape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&')
  }
})

/**
 * The RAC CalendarGrid renders a `role="grid"` whose accessible name is the
 * visible month + year (e.g. "June 2020"). Picking a different year from the
 * year dropdown moves the focused date and therefore relabels the grid.
 */
function gridLabel(): string {
  return screen.getByRole('grid').getAttribute('aria-label') ?? ''
}

describe('Calendar — showMonthYearPicker', () => {
  it('does not render month/year comboboxes by default', () => {
    render(<Calendar defaultValue={new CalendarDate(2020, 6, 15)} />)
    // No Select triggers (comboboxes) in the header when the picker is off.
    expect(screen.queryByRole('button', { name: /month/i })).toBeNull()
    expect(screen.queryAllByRole('button', { name: /show suggestions/i })).toHaveLength(0)
  })

  it('renders month + year picker buttons when enabled', () => {
    render(
      <Calendar
        showMonthYearPicker
        defaultValue={new CalendarDate(2020, 6, 15)}
      />,
    )
    const monthTrigger = screen.getByRole('button', { name: /month/i })
    const yearTrigger = screen.getByRole('button', { name: /year/i })
    expect(monthTrigger).toBeDefined()
    expect(yearTrigger).toBeDefined()
  })

  it('changes the calendar grid label to the selected year', () => {
    render(
      <Calendar
        showMonthYearPicker
        defaultValue={new CalendarDate(2020, 6, 15)}
      />,
    )

    expect(gridLabel()).toContain('2020')

    // Open the year picker and choose 2023.
    const yearTrigger = screen.getByRole('button', { name: /year/i })
    fireEvent.click(yearTrigger)

    const listbox = screen.getByRole('listbox')
    const option = within(listbox).getByRole('option', { name: '2023' })
    fireEvent.click(option)

    expect(gridLabel()).toContain('2023')
    expect(gridLabel()).not.toContain('2020')
  })

  it('does not offer years outside minValue / maxValue', () => {
    render(
      <Calendar
        showMonthYearPicker
        defaultValue={new CalendarDate(2020, 6, 15)}
        minValue={new CalendarDate(2019, 1, 1)}
        maxValue={new CalendarDate(2021, 12, 31)}
      />,
    )

    const yearTrigger = screen.getByRole('button', { name: /year/i })
    fireEvent.click(yearTrigger)

    const listbox = screen.getByRole('listbox')
    const years = within(listbox)
      .getAllByRole('option')
      .map(o => o.textContent?.trim())

    expect(years).toContain('2019')
    expect(years).toContain('2021')
    expect(years).not.toContain('2018')
    expect(years).not.toContain('2022')
  })
})

describe('DatePicker — showMonthYearPicker', () => {
  it('shows month/year pickers in the popover when enabled', () => {
    render(
      <DatePicker
        label="Pick a date"
        showMonthYearPicker
        defaultValue={new CalendarDate(2020, 6, 15)}
      />,
    )

    // Open the calendar popover via the field's calendar button.
    const triggers = screen.getAllByRole('button')
    fireEvent.click(triggers[triggers.length - 1])

    expect(screen.getByRole('button', { name: /month/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /year/i })).toBeDefined()
  })
})
