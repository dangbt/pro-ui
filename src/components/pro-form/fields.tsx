import { Controller, useFormContext } from 'react-hook-form'
import { parseDate, type CalendarDate } from '@internationalized/date'
import { useState, useEffect } from 'react'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { NumberField } from '../number-field'
import { Select } from '../select'
import { AsyncSelect } from '../async-select'
import { ComboBox } from '../combo-box'
import { RadioGroup } from '../radio-group'
import { Checkbox } from '../checkbox'
import { Switch } from '../switch'
import { DatePicker } from '../date-picker'
import { ProFormItem, useSize, useFieldA11y } from './pro-form'
import type { SelectOption } from '../select'
import type { AsyncSelectOption, AsyncSelectFetchResult } from '../async-select'
import type { ComboBoxOption } from '../combo-box'
import type { DateValue } from '../date-picker'
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
        render={({ field, fieldState }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const a11yProps = useA11yProps()
          // Local inputValue state - separate from field.value (which stores the key)
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [inputValue, setInputValue] = useState(() => {
            // Initialize with label of selected option if value exists
            const selected = options.find(opt => opt.value === field.value)
            return selected?.label ?? ''
          })

          // Sync inputValue when field.value changes externally (e.g., reset)
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            const selected = options.find(opt => opt.value === field.value)
            setInputValue(selected?.label ?? '')
          }, [field.value, options])

          return (
            <ComboBox
              selectedKey={field.value ?? null}
              onSelectionChange={key => {
                const newKey = key ? String(key) : ''
                field.onChange(newKey)
                // Update input to show label of selected option
                const selected = options.find(opt => opt.value === newKey)
                setInputValue(selected?.label ?? '')
              }}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onBlur={field.onBlur}
              placeholder={placeholder ?? 'Type to search…'}
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

export function ProFormRadioGroup({ name, label, required, description, options, orientation = 'vertical', size: _size, className, isDisabled }: ProFormRadioGroupProps) {
  const { control } = useFormContext()
  // RadioGroup component doesn't have a size prop, but we accept it for API consistency
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
              // RadioGroup doesn't accept size prop directly, but we keep effectiveSize available
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
              placeholderValue={placeholder ? undefined : undefined}
              className="w-full"
              {...a11yProps}
            />
          )
        }}
      />
    </ProFormItem>
  )
}
