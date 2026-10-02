import { useState, useMemo, type FormEvent } from 'react'
import { parseDate, type CalendarDate } from '@internationalized/date'
import { Button } from '../button'
import { Input } from '../input'
import { Select } from '../select'
import { DatePicker, DateRangePicker, type DateValue, type DateRange } from '../date-picker'
import { NumberField } from '../number-field'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { type Size } from '../../lib/size'
import type { ProColumnType, SearchConfig, ProTableTexts } from './types'

/** Number of columns in the responsive grid at different breakpoints */
const GRID_COLS = { sm: 2, lg: 3, xl: 4 }

interface SearchFormProps<T> {
  columns: ProColumnType<T>[]
  onSearch: (params: Record<string, unknown>) => void
  onReset: () => void
  size?: Size
  config?: SearchConfig
  texts?: ProTableTexts
}

/**
 * Parse a YYYY-MM-DD string into a CalendarDate, or return undefined.
 */
function toCalendarDate(value: unknown): CalendarDate | undefined {
  if (typeof value !== 'string' || !value) return undefined
  try {
    return parseDate(value)
  } catch {
    return undefined
  }
}

/**
 * Format a DateValue (CalendarDate) to YYYY-MM-DD string, matching the
 * original format emitted by <input type="date">.
 */
function fromDateValue(value: DateValue | null): string {
  if (!value) return ''
  const y = String(value.year).padStart(4, '0')
  const m = String(value.month).padStart(2, '0')
  const d = String(value.day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function SearchForm<T>({
  columns,
  onSearch,
  onReset,
  size = 'sm',
  config,
  texts,
}: SearchFormProps<T>) {
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [isCollapsed, setIsCollapsed] = useState(config?.defaultCollapsed ?? true)

  // Text labels with defaults
  const searchText = texts?.search ?? config?.searchText ?? 'Search'
  const resetText = texts?.reset ?? config?.resetText ?? 'Reset'
  const expandText = texts?.expand ?? config?.expandText ?? 'Expand'
  const collapseText = texts?.collapse ?? config?.collapseText ?? 'Collapse'
  const allText = texts?.all ?? 'All'

  // Filter to searchable columns (exclude 'option' valueType)
  const searchable = useMemo(
    () =>
      columns.filter(
        col =>
          !col.hideInSearch &&
          col.valueType !== 'option' &&
          (col.dataIndex || col.key),
      ),
    [columns],
  )

  if (searchable.length === 0) return null

  // Collapse logic: configurable threshold, default 3 fields (spec requirement)
  const collapsedRows = config?.collapsedRows ?? 1
  // visibleFields config allows explicit override; otherwise use rows * cols
  const collapsedFieldCount = config?.visibleFields ?? (collapsedRows * GRID_COLS.xl)
  // Collapse threshold: default 3 per spec, configurable via collapseThreshold
  const collapseThreshold = config?.collapseThreshold ?? 3
  const shouldShowCollapse = searchable.length > collapseThreshold

  // Fields to display based on collapse state
  const visibleFields = shouldShowCollapse && isCollapsed
    ? searchable.slice(0, collapsedFieldCount)
    : searchable

  const set = (key: string, value: unknown) =>
    setValues(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cleaned: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(values)) {
      if (v !== '' && v !== undefined && v !== null) {
        cleaned[k] = v
      }
    }
    onSearch(cleaned)
  }

  const handleReset = () => {
    setValues({})
    onReset()
  }

  const renderField = (col: ProColumnType<T>) => {
    const key = (col.key ?? col.dataIndex) as string
    const vt = col.valueType ?? 'text'

    // Select with clearable option - add empty "All" option at the start
    if (vt === 'select' && col.valueEnum) {
      const options = [
        { value: '', label: allText }, // Empty option to clear selection
        ...Object.entries(col.valueEnum).map(([value, item]) => ({
          value,
          label: typeof item === 'string' ? item : item.text,
        })),
      ]
      return (
        <Select
          key={key}
          size={size}
          label={col.title}
          placeholder={`${allText} ${col.title}`}
          options={options}
          selectedKey={(values[key] as string) ?? ''}
          onSelectionChange={v => set(key, v)}
        />
      )
    }

    // DateRange using DateRangePicker
    if (vt === 'dateRange') {
      const fromKey = `${key}_from`
      const toKey = `${key}_to`
      const fromDate = toCalendarDate(values[fromKey])
      const toDate = toCalendarDate(values[toKey])
      const rangeValue: DateRange | null =
        fromDate && toDate ? { start: fromDate, end: toDate } : null

      return (
        <DateRangePicker
          key={key}
          label={col.title}
          size={size}
          value={rangeValue}
          onChange={(range: DateRange | null) => {
            set(fromKey, range ? fromDateValue(range.start) : '')
            set(toKey, range ? fromDateValue(range.end) : '')
          }}
        />
      )
    }

    // Number/Money using NumberField - emit number, not string
    if (vt === 'number' || vt === 'money') {
      return (
        <NumberField
          key={key}
          size={size}
          label={col.title}
          placeholder="0"
          value={values[key] as number | undefined}
          onChange={v => set(key, v)}
        />
      )
    }

    // Single date using DatePicker
    if (vt === 'date') {
      const dateValue = toCalendarDate(values[key])
      return (
        <DatePicker
          key={key}
          label={col.title}
          size={size}
          value={dateValue ?? null}
          onChange={(v: DateValue | null) => set(key, fromDateValue(v))}
        />
      )
    }

    // Text (default)
    return (
      <Input
        key={key}
        size={size}
        label={col.title}
        placeholder={`${searchText} ${col.title}`}
        value={(values[key] as string) ?? ''}
        onChange={v => set(key, v)}
      />
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-[var(--base-radius)] p-4 mb-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visibleFields.map(renderField)}
      </div>

      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border-subtle">
        {/* Collapse toggle */}
        <div>
          {shouldShowCollapse && (
            <button
              type="button"
              onClick={() => setIsCollapsed(prev => !prev)}
              className="text-sm text-primary hover:text-primary-600 flex items-center gap-1 transition-colors"
            >
              {isCollapsed ? (
                <>
                  {expandText}
                  <ChevronDown className="w-4 h-4" />
                </>
              ) : (
                <>
                  {collapseText}
                  <ChevronUp className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size={size} onPress={handleReset}>
            {resetText}
          </Button>
          <Button type="submit" variant="primary" size={size}>
            {searchText}
          </Button>
        </div>
      </div>
    </form>
  )
}
