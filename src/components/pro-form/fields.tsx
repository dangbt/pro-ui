import { Controller, useFormContext, useFieldArray, useWatch } from 'react-hook-form'
import { parseDate, today, getLocalTimeZone, type CalendarDate } from '@internationalized/date'
import { useState, useEffect, useRef, memo, type ReactNode } from 'react'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { NumberField } from '../number-field'
import { Select } from '../select'
import { AsyncSelect } from '../async-select'
import { ComboBox } from '../combo-box'
import { RadioGroup } from '../radio-group'
import { Checkbox, CheckboxGroup } from '../checkbox'
import { Switch } from '../switch'
import { DatePicker, DateRangePicker, type DateRange } from '../date-picker'
import { Slider } from '../slider'
import { TokenField, TagFieldValue } from '../token-field'
import { Button } from '../button'
import { ProFormItem, useSize, useFieldA11y } from './pro-form'
import type { SelectOption } from '../select'
import type { AsyncSelectOption, AsyncSelectFetchResult } from '../async-select'
import type { ComboBoxOption } from '../combo-box'
import type { DateValue } from '../date-picker'
import type { TokenSegment } from '../token-field'
import type { Size } from '../../lib/size'

/* ── shared base props ─────────────────────────────────────── */

interface BaseProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  placeholder?: string
  size?: Size
  className?: string
  isDisabled?: boolean
}

/* ── Helper to build aria-describedby ─────────────────────── */

function useA11yProps() {
  const { labelId, descriptionId, errorId, hasError, label } = useFieldA11y()
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  return {
    'aria-label': !labelId ? label : undefined,
    'aria-labelledby': labelId,
    'aria-describedby': describedBy,
    'aria-invalid': hasError ? true : undefined,
  }
}

/* ── ProFormInput ───────────────────────────────────────────── */

interface ProFormInputProps extends BaseProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'datetime-local'
  inputClassName?: string
}

export function ProFormInput({ name, label, required, description, placeholder, size, className, isDisabled, type = 'text', inputClassName }: ProFormInputProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <Input
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              isDisabled={isDisabled}
              type={type}
              size={effectiveSize}
              isInvalid={!!fieldState.error}
              className="w-full"
              inputClassName={inputClassName}
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormTextarea ─────────────────────────────────────────── */

interface ProFormTextareaProps extends BaseProps {
  rows?: number
}

export function ProFormTextarea({ name, label, required, description, placeholder, size, className, isDisabled, rows }: ProFormTextareaProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <Textarea
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              rows={rows}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormNumberField ──────────────────────────────────────── */

interface ProFormNumberFieldProps extends BaseProps {
  min?: number
  max?: number
  step?: number
  formatOptions?: Intl.NumberFormatOptions
}

export function ProFormNumberField({ name, label, required, description, placeholder, size, className, isDisabled, min, max, step, formatOptions }: ProFormNumberFieldProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={undefined}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <NumberField
              value={field.value}
              onChange={val => field.onChange(isNaN(val) ? undefined : val)}
              onBlur={field.onBlur}
              placeholder={placeholder}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              minValue={min}
              maxValue={max}
              step={step}
              formatOptions={formatOptions}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormSelect ───────────────────────────────────────────── */

interface ProFormSelectProps extends BaseProps {
  options: SelectOption[]
}

export function ProFormSelect({ name, label, required, description, placeholder, size, className, isDisabled, options }: ProFormSelectProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={undefined}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <Select
              selectedKey={field.value ?? null}
              onSelectionChange={key => field.onChange(key ? String(key) : undefined)}
              onBlur={field.onBlur}
              placeholder={placeholder ?? 'Select…'}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              options={options}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormAsyncSelect ──────────────────────────────────────── */

interface ProFormAsyncSelectProps<T extends AsyncSelectOption = AsyncSelectOption> extends BaseProps {
  fetchOptions: (params: { search: string; page: number; pageSize: number }) => Promise<AsyncSelectFetchResult<T>>
  pageSize?: number
  debounceMs?: number
  defaultLabel?: string
}

export function ProFormAsyncSelect<T extends AsyncSelectOption = AsyncSelectOption>({
  name, label, required, description, placeholder, size, className, isDisabled,
  fetchOptions, pageSize, debounceMs, defaultLabel,
}: ProFormAsyncSelectProps<T>) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={undefined}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <AsyncSelect<T>
              value={field.value ?? null}
              onChange={(val) => field.onChange(val ?? undefined)}
              onBlur={field.onBlur}
              placeholder={placeholder ?? 'Select…'}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              fetchOptions={fetchOptions}
              pageSize={pageSize}
              debounceMs={debounceMs}
              defaultLabel={defaultLabel}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormComboBox ─────────────────────────────────────────── */

interface ProFormComboBoxProps extends BaseProps {
  options: ComboBoxOption[]
}

/** Inner component for ComboBox to properly use hooks outside Controller render */
interface ComboBoxInnerProps {
  field: {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
  }
  fieldState: { error?: { message?: string } }
  options: ComboBoxOption[]
  placeholder?: string
  isDisabled?: boolean
  size: Size
}

const ComboBoxInner = memo(function ComboBoxInner({
  field,
  fieldState,
  options,
  placeholder,
  isDisabled,
  size,
}: ComboBoxInnerProps) {
  const { descriptionId, errorId, hasError, label, labelId } = useFieldA11y()
  
  // Local inputValue state - separate from field.value (which stores the key)
  const [inputValue, setInputValue] = useState(() => {
    // Initialize with label of selected option if value exists
    const selected = options.find(opt => opt.value === field.value)
    return selected?.label ?? ''
  })

  // Track the previous field.value to detect external changes (e.g., reset)
  const prevFieldValueRef = useRef(field.value)

  // Sync inputValue when field.value changes externally (e.g., reset)
  // Compare by value to avoid resetting while user types
  useEffect(() => {
    if (prevFieldValueRef.current !== field.value) {
      const selected = options.find(opt => opt.value === field.value)
      setInputValue(selected?.label ?? '')
      prevFieldValueRef.current = field.value
    }
  }, [field.value, options])

  // Build aria props for the input only (not the whole ComboBox)
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const inputA11yProps = {
    'aria-label': !labelId ? label : undefined,
    'aria-labelledby': labelId,
    'aria-describedby': describedBy,
    'aria-invalid': hasError ? true : undefined,
  }

  return (
    <ComboBox
      selectedKey={field.value ?? null}
      onSelectionChange={key => {
        const newKey = key ? String(key) : ''
        field.onChange(newKey)
        // Update input to show label of selected option
        const selected = options.find(opt => opt.value === newKey)
        setInputValue(selected?.label ?? '')
        prevFieldValueRef.current = newKey
      }}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onBlur={field.onBlur}
      placeholder={placeholder ?? 'Type to search…'}
      isDisabled={isDisabled}
      isInvalid={!!fieldState.error}
      size={size}
      options={options}
      className="w-full"
      inputProps={inputA11yProps}
    />
  )
})

export function ProFormComboBox({ name, label, required, description, placeholder, size, className, isDisabled, options }: ProFormComboBoxProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <ComboBoxInner
            field={field}
            fieldState={fieldState}
            options={options}
            placeholder={placeholder}
            isDisabled={isDisabled}
            size={effectiveSize}
          />
        )}
      />
    </ProFormItem>
  )
}

/* ── ProFormRadioGroup ───────────────────────────────────────── */

interface RadioOption { value: string; label: string; description?: string; disabled?: boolean }
interface ProFormRadioGroupProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  options: RadioOption[]
  orientation?: 'horizontal' | 'vertical'
  size?: Size
  className?: string
  isDisabled?: boolean
}

export function ProFormRadioGroup({ name, label, required, description, options, orientation = 'vertical', size, className, isDisabled }: ProFormRadioGroupProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <RadioGroup
              value={field.value ?? ''}
              onChange={field.onChange}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              orientation={orientation}
              options={options}
              size={effectiveSize}
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormCheckbox ─────────────────────────────────────────── */

interface ProFormCheckboxProps {
  name: string
  label: string
  description?: string
  size?: Size
  className?: string
  isDisabled?: boolean
}

export function ProFormCheckbox({ name, label, description, size, className, isDisabled }: ProFormCheckboxProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <Checkbox
              isSelected={!!field.value}
              onChange={field.onChange}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              {...a11yProps}
            >
              {label}
            </Checkbox>
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormSwitch ───────────────────────────────────────────── */

interface ProFormSwitchProps {
  name: string
  label: string
  description?: string
  size?: Size
  className?: string
  isDisabled?: boolean
}

export function ProFormSwitch({ name, label, description, size, className, isDisabled }: ProFormSwitchProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <Switch
              isSelected={!!field.value}
              onChange={field.onChange}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              {...a11yProps}
            >
              {label}
            </Switch>
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── Helper: Safe date parsing ────────────────────────────────── */

function safeParseDateValue(value: unknown): CalendarDate | null {
  if (!value) return null

  try {
    // Handle Date object
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return null
      const iso = value.toISOString().slice(0, 10) // YYYY-MM-DD
      return parseDate(iso)
    }

    // Handle string
    if (typeof value === 'string') {
      // Extract YYYY-MM-DD from various formats
      // ISO datetime: 2024-01-15T10:30:00.000Z
      // ISO date: 2024-01-15
      const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
      if (match) {
        return parseDate(match[1])
      }
      return null
    }

    return null
  } catch {
    return null
  }
}

/* ── ProFormDatePicker ───────────────────────────────────────── */

interface ProFormDatePickerProps extends BaseProps {
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
}

export function ProFormDatePicker({ name, label, required, description, placeholder, size, className, isDisabled, minValue, maxValue, isDateUnavailable }: ProFormDatePickerProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  
  // Parse placeholder string to CalendarDate for placeholderValue
  // If placeholder is a valid date string (YYYY-MM-DD), use it; otherwise use today
  const placeholderValue = (() => {
    if (placeholder) {
      try {
        const match = placeholder.match(/^(\d{4}-\d{2}-\d{2})/)
        if (match) {
          return parseDate(match[1])
        }
      } catch {
        // Invalid date, fall through to default
      }
    }
    // Default: use today's date as placeholder
    return today(getLocalTimeZone())
  })()

  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={undefined}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          const dateValue = safeParseDateValue(field.value)
          return (
            <DatePicker
              value={dateValue}
              onChange={(date: DateValue | null) => field.onChange(date ? date.toString() : undefined)}
              onBlur={field.onBlur}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              minValue={minValue}
              maxValue={maxValue}
              isDateUnavailable={isDateUnavailable}
              placeholderValue={placeholderValue}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormDateRangePicker ─────────────────────────────────── */

interface DateRangeValue {
  start: string
  end: string
}

interface ProFormDateRangePickerProps extends BaseProps {
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  showMonthYearPicker?: boolean
}

export function ProFormDateRangePicker({
  name,
  label,
  required,
  description,
  size,
  className,
  isDisabled,
  minValue,
  maxValue,
  isDateUnavailable,
  showMonthYearPicker,
}: ProFormDateRangePickerProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize

  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={undefined}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          
          // Convert {start, end} string format to DateRange
          const dateRangeValue: DateRange | null = (() => {
            if (!field.value) return null
            const val = field.value as DateRangeValue
            try {
              if (val.start && val.end) {
                return {
                  start: parseDate(val.start.slice(0, 10)),
                  end: parseDate(val.end.slice(0, 10)),
                }
              }
            } catch {
              // Invalid date format
            }
            return null
          })()

          return (
            <DateRangePicker
              value={dateRangeValue}
              onChange={(range: DateRange | null) => {
                if (range) {
                  field.onChange({
                    start: range.start.toString(),
                    end: range.end.toString(),
                  })
                } else {
                  field.onChange(undefined)
                }
              }}
              onBlur={field.onBlur}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              size={effectiveSize}
              minValue={minValue}
              maxValue={maxValue}
              isDateUnavailable={isDateUnavailable}
              showMonthYearPicker={showMonthYearPicker}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormCheckboxGroup ───────────────────────────────────── */

interface CheckboxGroupOption {
  value: string
  label: string
  disabled?: boolean
}

interface ProFormCheckboxGroupProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  options: CheckboxGroupOption[]
  orientation?: 'horizontal' | 'vertical'
  size?: Size
  className?: string
  isDisabled?: boolean
}

export function ProFormCheckboxGroup({
  name,
  label,
  required,
  description,
  options,
  orientation = 'vertical',
  size,
  className,
  isDisabled,
}: ProFormCheckboxGroupProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize

  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          return (
            <CheckboxGroup
              value={field.value ?? []}
              onChange={field.onChange}
              isDisabled={isDisabled}
              isInvalid={!!fieldState.error}
              options={options}
              orientation={orientation}
              size={effectiveSize}
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormSlider ──────────────────────────────────────────── */

interface ProFormSliderProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  min?: number
  max?: number
  step?: number
  showOutput?: boolean
  className?: string
  isDisabled?: boolean
  /** If true, value is [number, number] for range; otherwise single number */
  isRange?: boolean
}

export function ProFormSlider({
  name,
  label,
  required,
  description,
  min = 0,
  max = 100,
  step = 1,
  showOutput = true,
  className,
  isDisabled,
  isRange = false,
}: ProFormSliderProps) {
  const { control } = useFormContext()

  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={isRange ? [min, max] : min}
        render={({ field }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          
          if (isRange) {
            return (
              <Slider<number[]>
                value={field.value ?? [min, max]}
                onChange={field.onChange}
                minValue={min}
                maxValue={max}
                step={step}
                showOutput={showOutput}
                isDisabled={isDisabled}
                className="w-full"
                {...a11yProps}
              />
            )
          }
          
          return (
            <Slider<number>
              value={field.value ?? min}
              onChange={field.onChange}
              minValue={min}
              maxValue={max}
              step={step}
              showOutput={showOutput}
              isDisabled={isDisabled}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}

/* ── ProFormTokenField ──────────────────────────────────────── */

interface ProFormTokenFieldProps extends BaseProps {
  /** Customise how a token's content is rendered */
  renderToken?: (token: TokenSegment) => React.ReactNode
}

export function ProFormTokenField({
  name,
  label,
  required,
  description,
  placeholder,
  size,
  className,
  isDisabled,
  renderToken,
}: ProFormTokenFieldProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize

  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          
          // Convert string[] to TagFieldValue for the TokenField
          const tokenValue = (() => {
            const arr = field.value as string[] ?? []
            const segments = arr.map(text => ({ type: 'token' as const, text }))
            return new TagFieldValue(segments)
          })()

          return (
            <TokenField
              value={tokenValue}
              onChange={(val) => {
                // Extract string[] from TagFieldValue segments
                const tokens = val.segments
                  .filter((seg): seg is TokenSegment => seg.type === 'token')
                  .map(seg => seg.text)
                field.onChange(tokens)
              }}
              placeholder={placeholder}
              isDisabled={isDisabled}
              size={effectiveSize}
              errorMessage={fieldState.error?.message}
              renderToken={renderToken}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}


/* ── ProFormList ────────────────────────────────────────────── */

interface ProFormListChildrenProps {
  /** Field name prefix, e.g. "items.0" */
  field: string
  /** Index of this item in the array */
  index: number
  /** Remove this item from the list */
  remove: () => void
}

interface ProFormListProps {
  /** Field name for the array */
  name: string
  /** Label for the list */
  label?: string
  /** Description text */
  description?: string
  /** Render function for each list item */
  children: (props: ProFormListChildrenProps) => ReactNode
  /** Minimum number of items (prevents removal below this) */
  min?: number
  /** Maximum number of items (hides add button when reached) */
  max?: number
  /** Text for the add button */
  addText?: string
  /** Whether to show the add button */
  showAdd?: boolean
  /** Custom add button renderer */
  addRender?: (props: { onAdd: () => void; disabled: boolean }) => ReactNode
  /** Class name for the list container */
  className?: string
  /** Initial value for new items (defaults to {}) */
  initialValue?: Record<string, unknown>
}

export function ProFormList({
  name,
  label,
  description,
  children,
  min = 0,
  max,
  addText = '+ Add item',
  showAdd = true,
  addRender,
  className,
  initialValue = {},
}: ProFormListProps) {
  const { control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })
  const size = useSize()

  const canRemove = fields.length > min
  const canAdd = max === undefined || fields.length < max

  // Get array-level error (e.g., "Must have at least 1 item")
  const arrayError = errors[name]?.message || errors[name]?.root?.message

  const handleAdd = () => {
    if (canAdd) {
      append(initialValue)
    }
  }

  const handleRemove = (index: number) => {
    if (canRemove) {
      remove(index)
    }
  }

  return (
    <div className={className}>
      {label && (
        <span className="block font-medium text-fg-muted text-sm mb-2">
          {label}
        </span>
      )}
      {description && (
        <span className="block text-xs text-fg-disabled mb-2">{description}</span>
      )}
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="relative">
            {children({
              field: `${name}.${index}`,
              index,
              remove: () => handleRemove(index),
            })}
          </div>
        ))}
      </div>
      {typeof arrayError === 'string' && (
        <span className="text-xs text-danger mt-1 block" role="alert">
          {arrayError}
        </span>
      )}
      {showAdd && (
        <div className="mt-2">
          {addRender ? (
            addRender({ onAdd: handleAdd, disabled: !canAdd })
          ) : (
            <Button
              type="button"
              variant="secondary"
              size={size}
              onPress={handleAdd}
              isDisabled={!canAdd}
            >
              {addText}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

/* ── ProFormDependency ──────────────────────────────────────── */

interface ProFormDependencyProps<T extends string[]> {
  /** Field names to watch */
  name: T
  /** Render function that receives the watched values */
  children: (values: { [K in T[number]]?: unknown }) => ReactNode
}

export function ProFormDependency<T extends string[]>({
  name: watchNames,
  children,
}: ProFormDependencyProps<T>) {
  const { control } = useFormContext()
  
  // Watch all specified fields
  const watchedValues = useWatch({
    control,
    name: watchNames,
  })

  // Build an object mapping field names to their values
  const values = watchNames.reduce(
    (acc, fieldName, index) => {
      acc[fieldName as T[number]] = watchedValues[index]
      return acc
    },
    {} as { [K in T[number]]?: unknown }
  )

  return <>{children(values)}</>
}
