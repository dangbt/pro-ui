import { Controller, useFormContext } from 'react-hook-form'
import { parseDate } from '@internationalized/date'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { NumberField } from '../number-field'
import { Select } from '../select'
import { Checkbox } from '../checkbox'
import { Switch } from '../switch'
import { DatePicker } from '../date-picker'
import { ProFormItem } from './pro-form'
import type { SelectOption } from '../select'
import type { DateValue } from '../date-picker'

/* ── shared base props ─────────────────────────────────────── */

interface BaseProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  placeholder?: string
  className?: string
  isDisabled?: boolean
}

/* ── ProFormInput ───────────────────────────────────────────── */

interface ProFormInputProps extends BaseProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
}

export function ProFormInput({ name, label, required, description, placeholder, className, isDisabled, type = 'text' }: ProFormInputProps) {
  const { control } = useFormContext()
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
            isInvalid={!!fieldState.error}
            className="w-full"
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

export function ProFormTextarea({ name, label, required, description, placeholder, className, isDisabled, rows }: ProFormTextareaProps) {
  const { control } = useFormContext()
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

export function ProFormNumberField({ name, label, required, description, placeholder, className, isDisabled, min, max, step, formatOptions }: ProFormNumberFieldProps) {
  const { control } = useFormContext()
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

export function ProFormSelect({ name, label, required, description, placeholder, className, isDisabled, options }: ProFormSelectProps) {
  const { control } = useFormContext()
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
            options={options}
            className="w-full"
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

export function ProFormDatePicker({ name, label, required, description, className, isDisabled, minValue, maxValue, isDateUnavailable }: ProFormDatePickerProps) {
  const { control } = useFormContext()
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
