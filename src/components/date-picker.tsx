import {
  DatePicker as RADatePicker,
  DateRangePicker as RADateRangePicker,
  DateField as RADateField,
  Calendar as RACalendar,
  RangeCalendar as RARangeCalendar,
  Label,
  Group,
  Button,
  DateInput,
  DateSegment,
  Popover,
  Dialog,
  CalendarGrid,
  CalendarGridBody,
  CalendarCell,
  Heading,
  CalendarGridHeader,
  CalendarHeaderCell,
  type DatePickerProps,
  type DateRangePickerProps,
  type DateFieldProps,
  type CalendarProps,
  type RangeCalendarProps,
  type DateValue,
  type DateRange,
} from 'react-aria-components'
import { Calendar as CalendarLucide, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react'
import { cn } from '../lib/cn'
import { inputHeight, inputPx, inputText, labelText, type Size } from '../lib/size'

const getInputGroupCls = (size: Size) => cn(
  'flex items-center border border-border bg-surface gap-1',
  inputHeight[size], inputPx[size],
  'rounded-[var(--base-radius)]',
  'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
)

const getSegmentCls = (size: Size) => cn(
  inputText[size], 'text-fg-2 tabular-nums rounded px-0.5 outline-none',
  'focus:bg-primary focus:text-white',
  'data-[placeholder]:text-fg-disabled',
  'caret-transparent',
)

const calendarPopoverCls = cn(
  'bg-surface border border-border shadow-lg p-3 z-50',
  'rounded-[var(--base-radius)]',
  'entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out',
)

const calendarCellCls = cn(
  'w-8 h-8 mx-auto text-sm flex items-center justify-center rounded-[var(--base-radius)] cursor-pointer outline-none',
  'text-fg-2',
  'hover:bg-primary-100 hover:text-primary-700',
  'focus-visible:ring-2 focus-visible:ring-primary',
  'selected:bg-primary selected:text-white hover:selected:bg-primary-600',
  'disabled:text-fg-disabled disabled:cursor-not-allowed hover:disabled:bg-transparent hover:disabled:text-fg-disabled',
  'unavailable:text-danger-400 unavailable:line-through',
  'outside-month:text-fg-disabled',
)

const calendarNavBtnCls = 'p-1 hover:bg-surface-subtle rounded-[var(--base-radius)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary text-fg-muted hover:text-fg-2 transition-colors'

/* ── shared Calendar inner layout ───────────────────────── */
function CalendarInner({ showNav = true }: { showNav?: boolean }) {
  return (
    <>
      {showNav && (
        <div className="flex items-center justify-between mb-3">
          <Button slot="previous" className={calendarNavBtnCls}>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Heading className="text-sm font-semibold text-fg-2" />
          <Button slot="next" className={calendarNavBtnCls}>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
      <CalendarGrid className="w-full border-separate border-spacing-y-0.5">
        <CalendarGridHeader>
          {day => (
            <CalendarHeaderCell className="h-7 text-xs font-medium text-fg-disabled text-center">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {date => <CalendarCell date={date} className={calendarCellCls} />}
        </CalendarGridBody>
      </CalendarGrid>
    </>
  )
}

function RangeCalendarInner() {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <Button slot="previous" className={calendarNavBtnCls}>
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Heading className="text-sm font-semibold text-fg-2" />
        <Button slot="next" className={calendarNavBtnCls}>
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <CalendarGrid className="w-full border-separate border-spacing-y-0.5">
        <CalendarGridHeader>
          {day => (
            <CalendarHeaderCell className="h-7 text-xs font-medium text-fg-disabled text-center">
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
                'selected:bg-primary-100 selected:text-primary-700 selected:rounded-none',
                'selection-start:bg-primary selection-start:text-white selection-start:rounded-l-[var(--base-radius)]',
                'selection-end:bg-primary selection-end:text-white selection-end:rounded-r-[var(--base-radius)]',
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </>
  )
}

/* ── DatePicker ─────────────────────────────────────────── */

interface DatePickerProps_<T extends DateValue> extends Omit<DatePickerProps<T>, 'className'> {
  label?: string
  size?: Size
  className?: string
}

export function DatePicker<T extends DateValue>({ label, size = 'md', className, ...props }: DatePickerProps_<T>) {
  return (
    <RADatePicker {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
      <Group className={getInputGroupCls(size)}>
        <DateInput className="flex items-center gap-px flex-1">
          {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
        </DateInput>
        <Button className="ml-1 text-fg-disabled hover:text-primary transition-colors">
          <CalendarLucide className="w-4 h-4" />
        </Button>
      </Group>
      <Popover className={calendarPopoverCls}>
        <Dialog className="outline-none">
          <RACalendar className="w-64 outline-none">
            <CalendarInner />
          </RACalendar>
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
      {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
      <Group className={getInputGroupCls(size)}>
        <DateInput slot="start" className="flex items-center gap-px">
          {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
        </DateInput>
        <span className="text-fg-disabled text-sm">–</span>
        <DateInput slot="end" className="flex items-center gap-px flex-1">
          {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
        </DateInput>
        <Button className="ml-1 text-fg-disabled hover:text-primary transition-colors">
          <CalendarLucide className="w-4 h-4" />
        </Button>
      </Group>
      <Popover className={calendarPopoverCls}>
        <Dialog className="outline-none">
          <RARangeCalendar className="w-64 outline-none">
            <RangeCalendarInner />
          </RARangeCalendar>
        </Dialog>
      </Popover>
    </RADateRangePicker>
  )
}

/* ── DateField ──────────────────────────────────────────── */

interface DateFieldProps_<T extends DateValue> extends Omit<DateFieldProps<T>, 'className'> {
  label?: string
  size?: Size
  className?: string
}

export function DateField<T extends DateValue>({ label, size = 'md', className, ...props }: DateFieldProps_<T>) {
  return (
    <RADateField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-fg-muted', labelText[size])}>{label}</Label>}
      <DateInput className={cn(
        'flex items-center gap-px border border-border bg-surface w-fit',
        inputHeight[size], inputPx[size],
        'rounded-[var(--base-radius)]',
        'focus-within:outline focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-0 focus-within:border-transparent',
        'data-[invalid]:border-danger',
      )}>
        {segment => <DateSegment segment={segment} className={getSegmentCls(size)} />}
      </DateInput>
    </RADateField>
  )
}

/* ── Calendar (standalone) ──────────────────────────────── */

interface CalendarProps_<T extends DateValue> extends Omit<CalendarProps<T>, 'className'> {
  className?: string
}

export function Calendar<T extends DateValue>({ className, ...props }: CalendarProps_<T>) {
  return (
    <RACalendar {...props} className={cn('w-64 p-3 bg-surface border border-border rounded-[var(--base-radius)] shadow-sm outline-none', className)}>
      <CalendarInner />
    </RACalendar>
  )
}

/* ── RangeCalendar (standalone) ─────────────────────────── */

interface RangeCalendarProps_<T extends DateValue> extends Omit<RangeCalendarProps<T>, 'className'> {
  className?: string
}

export function RangeCalendar<T extends DateValue>({ className, ...props }: RangeCalendarProps_<T>) {
  return (
    <RARangeCalendar {...props} className={cn('w-64 p-3 bg-surface border border-border rounded-[var(--base-radius)] shadow-sm outline-none', className)}>
      <RangeCalendarInner />
    </RARangeCalendar>
  )
}

export type { DateValue, DateRange }
