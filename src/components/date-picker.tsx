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
import { Calendar as CalendarLucide, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { cn } from '../lib/cn'
import { inputHeight, inputPx, inputText, labelText, type Size } from '../lib/size'

const getInputGroupCls = (size: Size) => cn(
  'flex items-center border border-gray-300 bg-white gap-1',
  inputHeight[size], inputPx[size],
  'rounded-[var(--base-radius)]',
  'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
)

const getSegmentCls = (size: Size) => cn(
  inputText[size], 'text-gray-700 tabular-nums rounded px-0.5 outline-none',
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
  size?: Size
  className?: string
}

export function DatePicker<T extends DateValue>({ label, size = 'md', className, ...props }: DatePickerProps_<T>) {
  return (
    <RADatePicker {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-gray-600', labelText[size])}>{label}</Label>}
      <Group className={getInputGroupCls(size)}>
        <DateInput className="flex items-center gap-px flex-1">
          {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
        </DateInput>
        <Button className="ml-1 hover:text-primary transition-colors">
          <CalendarLucide className="w-4 h-4 text-gray-400" />
        </Button>
      </Group>
      <Popover className={calendarPopoverCls}>
        <Dialog className="outline-none">
          <Calendar className="w-64">
            <div className="flex items-center justify-between mb-3">
              <Button slot="previous" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronLeftIcon className="w-4 h-4" /></Button>
              <Heading className="text-sm font-semibold text-gray-700" />
              <Button slot="next" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronRightIcon className="w-4 h-4" /></Button>
            </div>
            <CalendarGrid className="w-full border-separate border-spacing-y-0.5">
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
  size?: Size
  className?: string
}

export function DateRangePicker<T extends DateValue>({
  label,
  size = 'md',
  className,
  ...props
}: DateRangePickerProps_<T>) {
  return (
    <RADateRangePicker {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-gray-600', labelText[size])}>{label}</Label>}
      <Group className={getInputGroupCls(size)}>
        <DateInput slot="start" className="flex items-center gap-px">
          {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
        </DateInput>
        <span className="text-gray-300 text-sm">–</span>
        <DateInput slot="end" className="flex items-center gap-px flex-1">
          {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
        </DateInput>
        <Button className="ml-1 hover:text-primary transition-colors">
          <CalendarLucide className="w-4 h-4 text-gray-400" />
        </Button>
      </Group>
      <Popover className={calendarPopoverCls}>
        <Dialog className="outline-none">
          <RangeCalendar className="w-64">
            <div className="flex items-center justify-between mb-3">
              <Button slot="previous" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronLeftIcon className="w-4 h-4" /></Button>
              <Heading className="text-sm font-semibold text-gray-700" />
              <Button slot="next" className="p-1 hover:bg-gray-100 rounded-[var(--base-radius)] cursor-pointer"><ChevronRightIcon className="w-4 h-4" /></Button>
            </div>
            <CalendarGrid className="w-full border-separate border-spacing-y-0.5">
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
