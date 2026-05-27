import { Controller, useFormContext } from 'react-hook-form'
import { parseDate } from '@internationalized/date'
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
import { ProFormItem, useSize } from './pro-form'
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
        render={({ field, fieldState }) => (
          <Input
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder}
            isDisabled={isDisabled}
            type={type}
            size={effectiveSize}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            className="w-full"
            inputClassName={inputClassName}
          />
        )}
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
        render={({ field, fieldState }) => (
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
          />
        )}
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
        render={({ field, fieldState }) => (
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
          />
        )}
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
        render={({ field }) => (
          <Select
            selectedKey={field.value ?? null}
            onSelectionChange={key => field.onChange(key ? String(key) : undefined)}
            onBlur={field.onBlur}
            placeholder={placeholder ?? 'Select…'}
            isDisabled={isDisabled}
            size={effectiveSize}
            options={options}
            className="w-full"
          />
        )}
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
        render={({ field, fieldState }) => (
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
          />
        )}
      />
    </ProFormItem>
  )
}

/* ── ProFormComboBox ─────────────────────────────────────────── */

interface ProFormComboBoxProps extends BaseProps {
  options: ComboBoxOption[]
}

export function ProFormComboBox({ name, label, required, description, placeholder, className, isDisabled, options }: ProFormComboBoxProps) {
  const { control } = useFormContext()
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <ComboBox
            selectedKey={field.value ?? null}
            onSelectionChange={key => field.onChange(key ? String(key) : '')}
            inputValue={field.value ?? ''}
            onInputChange={field.onChange}
            onBlur={field.onBlur}
            placeholder={placeholder ?? 'Type to search…'}
            isDisabled={isDisabled}
            options={options}
            className="w-full"
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

export function ProFormRadioGroup({ name, label, required, description, options, orientation = 'vertical', className, isDisabled }: ProFormRadioGroupProps) {
  const { control } = useFormContext()
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <RadioGroup
            value={field.value ?? ''}
            onChange={field.onChange}
            isDisabled={isDisabled}
            orientation={orientation}
            options={options}
          />
        )}
      />
    </ProFormItem>
  )
}

/* ── ProFormCheckbox ─────────────────────────────────────────── */

interface ProFormCheckboxProps {
  name: string
  label: string
  description?: string
  className?: string
  isDisabled?: boolean
}

export function ProFormCheckbox({ name, label, description, className, isDisabled }: ProFormCheckboxProps) {
  const { control } = useFormContext()
  return (
    <ProFormItem name={name} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Checkbox
            isSelected={!!field.value}
            onChange={field.onChange}
            isDisabled={isDisabled}
          >
            {label}
          </Checkbox>
        )}
      />
    </ProFormItem>
  )
}

/* ── ProFormSwitch ───────────────────────────────────────────── */

interface ProFormSwitchProps {
  name: string
  label: string
  description?: string
  className?: string
  isDisabled?: boolean
}

export function ProFormSwitch({ name, label, description, className, isDisabled }: ProFormSwitchProps) {
  const { control } = useFormContext()
  return (
    <ProFormItem name={name} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Switch
            isSelected={!!field.value}
            onChange={field.onChange}
            isDisabled={isDisabled}
          >
            {label}
          </Switch>
        )}
      />
    </ProFormItem>
  )
}

/* ── ProFormDatePicker ───────────────────────────────────────── */

interface ProFormDatePickerProps extends BaseProps {
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
}

export function ProFormDatePicker({ name, label, required, description, size, className, isDisabled, minValue, maxValue, isDateUnavailable }: ProFormDatePickerProps) {
  const { control } = useFormContext()
  const ctxSize = useSize()
  const effectiveSize = size ?? ctxSize
  return (
    <ProFormItem name={name} label={label} required={required} description={description} className={className}>
      <Controller
        name={name}
        control={control}
        defaultValue={undefined}
        render={({ field }) => (
          <DatePicker
            value={field.value ? parseDate(field.value) : null}
            onChange={(date: DateValue | null) => field.onChange(date ? date.toString() : undefined)}
            onBlur={field.onBlur}
            isDisabled={isDisabled}
            size={effectiveSize}
            minValue={minValue}
            maxValue={maxValue}
            isDateUnavailable={isDateUnavailable}
            className="w-full"
          />
        )}
      />
    </ProFormItem>
  )
}
