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
  CalendarMonthPicker,
  CalendarYearPicker,
  Select,
  SelectValue,
  ListBox,
  ListBoxItem,
  type DatePickerProps,
  type DateRangePickerProps,
  type DateFieldProps,
  type CalendarProps,
  type RangeCalendarProps,
  type DateValue,
  type DateRange,
  type Key,
} from 'react-aria-components'
import { Calendar as CalendarLucide, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ChevronDown as ChevronDownIcon } from 'lucide-react'
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

/* ── month / year picker dropdown (built on RAC Select) ──── */

const pickerTriggerCls = cn(
  'flex items-center gap-1 h-7 px-2 text-sm font-semibold text-fg-2 bg-transparent',
  'rounded-[var(--base-radius)] cursor-pointer outline-none',
  'hover:bg-surface-subtle transition-colors',
  'focus-visible:ring-2 focus-visible:ring-primary',
  'pressed:bg-surface-subtle',
)

const pickerPopoverCls = cn(
  'w-[var(--trigger-width)] min-w-max bg-surface border border-border shadow-lg z-50',
  'rounded-[var(--base-radius)] overflow-hidden',
  'entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out',
)

const pickerListBoxCls = 'py-1 max-h-56 overflow-auto outline-none'

const pickerItemCls = cn(
  'px-3 py-1.5 text-sm cursor-pointer outline-none text-fg-2 whitespace-nowrap',
  'hover:bg-primary-50 hover:text-primary',
  'focus:bg-primary-50 focus:text-primary',
  'selected:bg-primary-100 selected:text-primary selected:font-medium',
)

type PickerItem = { id: number; formatted: string }
type PickerRenderProps = {
  'aria-label': string
  value: Key
  onChange: (key: Key | null) => void
  items: PickerItem[]
}

/** Renders a RAC Select bound to a Calendar month/year picker's aria render props. */
function PickerSelect({ 'aria-label': ariaLabel, value, onChange, items }: PickerRenderProps) {
  return (
    <Select
      aria-label={ariaLabel}
      selectedKey={value}
      onSelectionChange={key => onChange(key)}
    >
      <Button className={pickerTriggerCls}>
        <SelectValue />
        <ChevronDownIcon className="w-3.5 h-3.5 text-fg-disabled shrink-0" />
      </Button>
      <Popover className={pickerPopoverCls}>
        <ListBox className={pickerListBoxCls} items={items}>
          {item => (
            <ListBoxItem id={item.id} textValue={item.formatted} className={pickerItemCls}>
              {item.formatted}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  )
}

/** Calendar header with prev/next buttons and (optionally) month + year dropdowns. */
function CalendarHeaderNav({ showMonthYearPicker }: { showMonthYearPicker?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', showMonthYearPicker && 'gap-1')}>
      <Button slot="previous" className={calendarNavBtnCls}>
        <ChevronLeftIcon className="w-4 h-4" />
      </Button>
      {showMonthYearPicker ? (
        <div className="flex items-center gap-1">
          <CalendarMonthPicker>
            {renderProps => <PickerSelect {...renderProps} />}
          </CalendarMonthPicker>
          <CalendarYearPicker>
            {renderProps => <PickerSelect {...renderProps} />}
          </CalendarYearPicker>
        </div>
      ) : (
        <Heading className="text-sm font-semibold text-fg-2" />
      )}
      <Button slot="next" className={calendarNavBtnCls}>
        <ChevronRightIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}

/* ── shared Calendar inner layout ───────────────────────── */
function CalendarInner({ showNav = true, showMonthYearPicker }: { showNav?: boolean; showMonthYearPicker?: boolean }) {
  return (
    <>
      {showNav && <CalendarHeaderNav showMonthYearPicker={showMonthYearPicker} />}
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

function RangeCalendarInner({ showMonthYearPicker }: { showMonthYearPicker?: boolean }) {
  return (
    <>
      <CalendarHeaderNav showMonthYearPicker={showMonthYearPicker} />
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
  /** Show month + year dropdown pickers in the calendar header. @default false */
  showMonthYearPicker?: boolean
}

export function DatePicker<T extends DateValue>({ label, size = 'md', className, showMonthYearPicker, ...props }: DatePickerProps_<T>) {
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
            <CalendarInner showMonthYearPicker={showMonthYearPicker} />
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
  /** Show month + year dropdown pickers in the calendar header. @default false */
  showMonthYearPicker?: boolean
}

export function DateRangePicker<T extends DateValue>({
  label,
  size = 'md',
  className,
  showMonthYearPicker,
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
            <RangeCalendarInner showMonthYearPicker={showMonthYearPicker} />
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
  /** Show month + year dropdown pickers in the calendar header. @default false */
  showMonthYearPicker?: boolean
}

export function Calendar<T extends DateValue>({ className, showMonthYearPicker, ...props }: CalendarProps_<T>) {
  return (
    <RACalendar {...props} className={cn('w-64 p-3 bg-surface border border-border rounded-[var(--base-radius)] shadow-sm outline-none', className)}>
      <CalendarInner showMonthYearPicker={showMonthYearPicker} />
    </RACalendar>
  )
}

/* ── RangeCalendar (standalone) ─────────────────────────── */

interface RangeCalendarProps_<T extends DateValue> extends Omit<RangeCalendarProps<T>, 'className'> {
  className?: string
  /** Show month + year dropdown pickers in the calendar header. @default false */
  showMonthYearPicker?: boolean
}

export function RangeCalendar<T extends DateValue>({ className, showMonthYearPicker, ...props }: RangeCalendarProps_<T>) {
  return (
    <RARangeCalendar {...props} className={cn('w-64 p-3 bg-surface border border-border rounded-[var(--base-radius)] shadow-sm outline-none', className)}>
      <RangeCalendarInner showMonthYearPicker={showMonthYearPicker} />
    </RARangeCalendar>
  )
}

export type { DateValue, DateRange }
