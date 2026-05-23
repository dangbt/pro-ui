import {
  DatePicker as RADatePicker,
  DateRangePicker as RADateRangePicker,
  Label,
  Group,
  Button,
  DateInput,
  DateSegment,
  Popover,
  Dialog,
  Calendar,
  CalendarGrid,
  CalendarGridBody,
  CalendarCell,
  Heading,
  CalendarGridHeader,
  CalendarHeaderCell,
  RangeCalendar,
  type DatePickerProps,
  type DateRangePickerProps,
  type DateValue,
  type DateRange,
} from 'react-aria-components'
import { cn } from '../lib/cn'

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
    <path d="M1.5 6.5h13M5.5 1v3M10.5 1v3" />
  </svg>
)

const ChevronLeft = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9.5 11L6.5 8l3-3"/></svg>
)
const ChevronRight = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6.5 11L9.5 8l-3-3"/></svg>
)

const inputGroupCls = cn(
  'flex items-center h-9 border border-gray-300 bg-white px-3 gap-1',
  'rounded-[var(--base-radius)]',
  'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
)

const segmentCls = cn(
  'text-sm text-gray-700 tabular-nums rounded px-0.5 outline-none',
  'focus:bg-primary focus:text-white',
  'data-[placeholder]:text-gray-400',
  'caret-transparent',
)

const calendarPopoverCls = cn(
  'bg-white border border-gray-200 shadow-lg p-3 z-50',
  'rounded-[var(--base-radius)]',
  'entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out',
)

const calendarCellCls = cn(
  'w-8 h-8 mx-auto text-sm flex items-center justify-center rounded-[var(--base-radius)] cursor-pointer outline-none',
  'text-gray-700',
  'hover:bg-primary-100',
  'focus-visible:ring-2 focus-visible:ring-primary',
  'selected:bg-primary selected:text-white hover:selected:bg-primary-600',
  'disabled:text-gray-300 disabled:cursor-not-allowed hover:disabled:bg-transparent',
  'unavailable:text-danger-400 unavailable:line-through',
  'outside-month:text-gray-300',
)

/* ── DatePicker ─────────────────────────────────────────── */

interface DatePickerProps_<T extends DateValue> extends Omit<DatePickerProps<T>, 'className'> {
  label?: string
  className?: string
}

export function DatePicker<T extends DateValue>({ label, className, ...props }: DatePickerProps_<T>) {
  return (
    <RADatePicker {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <Group className={inputGroupCls}>
        <DateInput className="flex items-center gap-px flex-1">
          {segment => <DateSegment segment={segment} className={segmentCls} />}
        </DateInput>
        <Button className="ml-1 hover:text-primary transition-colors">
          <CalendarIcon />
        </Button>
      </Group>
      <Popover className={calendarPopoverCls}>
        <Dialog className="outline-none">
          <Calendar className="w-64">
            <div className="flex items-center justify-between mb-3">
              <Button slot="previous" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronLeft /></Button>
              <Heading className="text-sm font-semibold text-gray-700" />
              <Button slot="next" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronRight /></Button>
            </div>
            <CalendarGrid className="w-full">
              <CalendarGridHeader>
                {day => (
                  <CalendarHeaderCell className="h-7 text-xs font-medium text-gray-400 text-center">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {date => <CalendarCell date={date} className={calendarCellCls} />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </RADatePicker>
  )
}

/* ── DateRangePicker ────────────────────────────────────── */

interface DateRangePickerProps_<T extends DateValue> extends Omit<DateRangePickerProps<T>, 'className'> {
  label?: string
  className?: string
}

export function DateRangePicker<T extends DateValue>({
  label,
  className,
  ...props
}: DateRangePickerProps_<T>) {
  return (
    <RADateRangePicker {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <Group className={cn(inputGroupCls, 'gap-1')}>
        <DateInput slot="start" className="flex items-center gap-px">
          {segment => <DateSegment segment={segment} className={segmentCls} />}
        </DateInput>
        <span className="text-gray-300 text-sm">–</span>
        <DateInput slot="end" className="flex items-center gap-px flex-1">
          {segment => <DateSegment segment={segment} className={segmentCls} />}
        </DateInput>
        <Button className="ml-1 hover:text-primary transition-colors">
          <CalendarIcon />
        </Button>
      </Group>
      <Popover className={calendarPopoverCls}>
        <Dialog className="outline-none">
          <RangeCalendar className="w-64">
            <div className="flex items-center justify-between mb-3">
              <Button slot="previous" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronLeft /></Button>
              <Heading className="text-sm font-semibold text-gray-700" />
              <Button slot="next" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronRight /></Button>
            </div>
            <CalendarGrid className="w-full">
              <CalendarGridHeader>
                {day => (
                  <CalendarHeaderCell className="h-7 text-xs font-medium text-gray-400 text-center">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {date => (
                  <CalendarCell
                    date={date}
                    className={cn(
                      calendarCellCls,
                      'selected:bg-primary-100 selected:text-primary selected:rounded-none',
                      'selection-start:bg-primary selection-start:text-white selection-start:rounded-l-[var(--base-radius)]',
                      'selection-end:bg-primary selection-end:text-white selection-end:rounded-r-[var(--base-radius)]',
                    )}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </RADateRangePicker>
  )
}

export type { DateValue, DateRange }
