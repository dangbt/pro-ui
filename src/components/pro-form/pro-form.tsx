import { createContext, useContext, useState, useEffect, useRef, useId, useImperativeHandle, type Ref } from 'react'
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch,
  Controller,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
  type FieldErrors,
  type UseFormReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '../../lib/cn'
import { Button } from '../button'
import { labelText, type Size } from '../../lib/size'

/* ── Layout context ────────────────────────────────────────── */

type ProFormLayout = 'vertical' | 'horizontal'

const LayoutCtx = createContext<ProFormLayout>('vertical')
const useLayout = () => useContext(LayoutCtx)

/* ── Size context ──────────────────────────────────────────── */

const SizeCtx = createContext<Size>('md')
export const useSize = () => useContext(SizeCtx)

/* ── FormRef type ──────────────────────────────────────────── */

export interface ProFormRef<T extends FieldValues = FieldValues> {
  /** Get form methods from react-hook-form */
  getFormInstance: () => UseFormReturn<T>
  /** Reset form to defaultValues or provided values */
  reset: (values?: DefaultValues<T>) => void
  /** Submit the form programmatically */
  submit: () => void
  /** Get all current form values */
  getValues: () => T
  /** Set field value */
  setValue: (name: FieldPath<T>, value: unknown) => void
}

/* ── Submitter types ───────────────────────────────────────── */

export interface SubmitterProps<T extends FieldValues = FieldValues> {
  /** Form methods from react-hook-form */
  form: UseFormReturn<T>
  /** Whether form is submitting */
  isSubmitting: boolean
  /** Reset form handler */
  reset: () => void
  /** Submit form handler */
  submit: () => void
}

export type SubmitterConfig<T extends FieldValues = FieldValues> =
  | false
  | {
      submitText?: string
      resetText?: string
      showReset?: boolean
      render?: (props: SubmitterProps<T>) => React.ReactNode
    }

/* ── ZodLike schema type ───────────────────────────────────── */

interface ZodLike<T> {
  parse(data: unknown): T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  safeParse(data: unknown): { success: boolean; data?: T; error?: any }
}

/* ── ProForm ────────────────────────────────────────────────── */

interface ProFormProps<T extends FieldValues> {
  /** Zod schema for validation (optional - no validation if not provided) */
  schema?: ZodLike<T>
  /** Default form values */
  defaultValues?: DefaultValues<T>
  /** Called when form is successfully submitted */
  onFinish: (values: T) => void | Promise<void>
  /** Called when validation fails */
  onFinishFailed?: (errors: FieldErrors<T>) => void
  /** Called when any value changes */
  onValuesChange?: (changed: Partial<T>, allValues: T) => void
  /** Called when form is reset */
  onReset?: () => void
  /** Form layout: vertical (labels above) or horizontal (labels beside) */
  layout?: ProFormLayout
  /** Size for form fields */
  size?: Size
  /** Submit button text (alias for submitter.submitText) */
  submitText?: string
  /** Class name for submit button */
  submitClassName?: string
  /** Show reset button (alias for submitter.showReset) */
  showReset?: boolean
  /** Reset button text (alias for submitter.resetText) */
  resetText?: string
  /** Submitter config: false to hide, or object with submitText/resetText/render */
  submitter?: SubmitterConfig<T>
  /** Whether to reset form when defaultValues change */
  resetOnDefaultValuesChange?: boolean
  /** Ref to access form methods */
  formRef?: Ref<ProFormRef<T>>
  children: React.ReactNode
  className?: string
}

export function ProForm<T extends FieldValues>({
  schema,
  defaultValues,
  onFinish,
  onFinishFailed,
  onValuesChange,
  onReset,
  layout = 'vertical',
  size = 'md',
  submitText = 'Submit',
  submitClassName,
  showReset = false,
  resetText = 'Reset',
  submitter,
  resetOnDefaultValuesChange = false,
  formRef,
  children,
  className,
}: ProFormProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<T>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
  })
  const { handleSubmit, reset, formState: { isSubmitting, isDirty } } = methods
  const [submitError, setSubmitError] = useState<string | null>(null)
  // Track whether we've done the first mount with defined defaultValues
  const hasInitializedRef = useRef(false)
  const prevDefaultValuesRef = useRef<string | undefined>(undefined)

  // Define callbacks first (used in useImperativeHandle and renderSubmitter)
  const onSubmit = async (values: T) => {
    setSubmitError(null)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (onFinish as any)(values)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submit failed')
    }
  }

  const onError = (errors: FieldErrors<T>) => {
    onFinishFailed?.(errors)
  }

  const handleReset = () => {
    reset()
    onReset?.()
    setSubmitError(null)
  }

  // Reset form when defaultValues change
  useEffect(() => {
    // Skip if still undefined (waiting for async load)
    if (defaultValues === undefined) return
    
    const serialized = JSON.stringify(defaultValues)
    
    // First time we get defined defaultValues
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      prevDefaultValuesRef.current = serialized
      // If this is truly the first mount and useForm already has the values, no need to reset
      // But if defaultValues was undefined initially and now has a value (async load), we must reset
      // Check: if form values match defaultValues, no need to reset (sync mount)
      // Otherwise reset (async load scenario)
      const currentValues = methods.getValues()
      const currentSerialized = JSON.stringify(currentValues)
      if (currentSerialized !== serialized) {
        reset(defaultValues)
      }
      return
    }
    
    // Check if values actually changed from previous
    if (serialized !== prevDefaultValuesRef.current) {
      prevDefaultValuesRef.current = serialized
      // Reset only if not dirty or resetOnDefaultValuesChange is true
      if (!isDirty || resetOnDefaultValuesChange) {
        reset(defaultValues)
      }
    }
  }, [defaultValues, reset, isDirty, resetOnDefaultValuesChange, methods])

  // Expose form methods via formRef
  useImperativeHandle(formRef, () => ({
    getFormInstance: () => methods,
    reset: (values) => {
      reset(values ?? defaultValues)
      setSubmitError(null)
    },
    submit: () => handleSubmit(onSubmit, onError)(),
    getValues: () => methods.getValues(),
    setValue: (name, value) => methods.setValue(name, value as T[FieldPath<T>]),
  }), [methods, reset, defaultValues, handleSubmit, onSubmit, onError])

  // Resolve submitter config (alias props vs submitter prop)
  const resolvedSubmitter: SubmitterConfig<T> = submitter !== undefined
    ? submitter
    : { submitText, resetText, showReset }

  const renderSubmitter = () => {
    if (resolvedSubmitter === false) return null

    const config = resolvedSubmitter
    const props: SubmitterProps<T> = {
      form: methods,
      isSubmitting,
      reset: handleReset,
      submit: () => handleSubmit(onSubmit, onError)(),
    }

    if (config.render) {
      return config.render(props)
    }

    return (
      <div className={cn('flex items-center gap-2 pt-1', layout === 'horizontal' && 'sm:ml-[calc(7rem+0.75rem)]')}>
        <Button
          type="submit"
          variant="primary"
          size={size}
          loading={isSubmitting}
          className={submitClassName}
        >
          {config.submitText ?? submitText}
        </Button>
        {(config.showReset ?? showReset) && (
          <Button type="button" variant="secondary" size={size} onPress={handleReset}>
            {config.resetText ?? resetText}
          </Button>
        )}
      </div>
    )
  }

  return (
    <SizeCtx.Provider value={size}>
      <LayoutCtx.Provider value={layout}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <FormProvider {...(methods as any)}>
          <ValuesChangeWatcher onValuesChange={onValuesChange} />
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            className={cn('flex flex-col gap-4', className)}
          >
            {children}
            {submitError && (
              <p className="text-xs text-danger" role="alert">{submitError}</p>
            )}
            {renderSubmitter()}
          </form>
        </FormProvider>
      </LayoutCtx.Provider>
    </SizeCtx.Provider>
  )
}

/* ── Values change watcher ──────────────────────────────────── */

function ValuesChangeWatcher<T extends FieldValues>({
  onValuesChange,
}: {
  onValuesChange?: (changed: Partial<T>, allValues: T) => void
}) {
  const { control, getValues } = useFormContext<T>()
  const values = useWatch({ control })
  const prevValuesRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    if (!onValuesChange) return
    if (prevValuesRef.current === undefined) {
      prevValuesRef.current = values as T
      return
    }

    // Find changed fields
    const changed: Partial<T> = {}
    const allValues = getValues()
    for (const key in allValues) {
      if (prevValuesRef.current[key] !== allValues[key]) {
        changed[key as keyof T] = allValues[key]
      }
    }

    if (Object.keys(changed).length > 0) {
      onValuesChange(changed, allValues)
    }

    prevValuesRef.current = allValues
  }, [values, onValuesChange, getValues])

  return null
}

/* ── ProFormItem (internal field wrapper) ───────────────────── */

interface ItemProps {
  name: string
  label?: string
  required?: boolean
  description?: string
  className?: string
  children: React.ReactNode
}

const labelHorizontalPt: Record<Size, string> = {
  sm: 'sm:pt-1.5',
  md: 'sm:pt-2.5',
  lg: 'sm:pt-3.5',
}

/** Context to pass down IDs from ProFormItem to child field */
interface FieldA11yContext {
  labelId?: string
  descriptionId?: string
  errorId?: string
  hasError: boolean
  label?: string
}

const FieldA11yCtx = createContext<FieldA11yContext>({ hasError: false })
export const useFieldA11y = () => useContext(FieldA11yCtx)

export function ProFormItem({ name, label, required, description, className, children }: ItemProps) {
  const { formState: { errors } } = useFormContext()
  const layout = useLayout()
  const size = useSize()
  const baseId = useId()

  // resolve nested paths like "address.city"
  const error = name.split('.').reduce<Record<string, unknown>>(
    (obj, key) => (obj?.[key] as Record<string, unknown>),
    errors as Record<string, unknown>,
  ) as { message?: string } | undefined

  const hasError = !!error?.message
  const labelId = label ? `${baseId}-label` : undefined
  const descriptionId = description && !hasError ? `${baseId}-desc` : undefined
  const errorId = hasError ? `${baseId}-error` : undefined

  const a11yContext: FieldA11yContext = {
    labelId,
    descriptionId,
    errorId,
    hasError,
    label,
  }

  const field = (
    <FieldA11yCtx.Provider value={a11yContext}>
      <div className={cn('flex flex-col gap-1', className)}>
        {layout === 'vertical' && label && (
          <span id={labelId} className={cn('font-medium text-fg-muted', labelText[size])}>
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </span>
        )}
        {children}
        {description && !hasError && (
          <span id={descriptionId} className="text-xs text-fg-disabled">{description}</span>
        )}
        {hasError && (
          <span id={errorId} className="text-xs text-danger" role="alert">{String(error?.message)}</span>
        )}
      </div>
    </FieldA11yCtx.Provider>
  )

  if (layout === 'horizontal') {
    return (
      <FieldA11yCtx.Provider value={a11yContext}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
          <span
            id={labelId}
            className={cn('shrink-0 font-medium text-fg-muted leading-none sm:w-28 sm:text-right', labelText[size], labelHorizontalPt[size])}
          >
            {required && <span className="text-danger mr-0.5">*</span>}
            {label}
          </span>
          <div className={cn('flex-1 flex flex-col gap-1', className)}>
            {children}
            {description && !hasError && (
              <span id={descriptionId} className="text-xs text-fg-disabled">{description}</span>
            )}
            {hasError && (
              <span id={errorId} className="text-xs text-danger" role="alert">{String(error?.message)}</span>
            )}
          </div>
        </div>
      </FieldA11yCtx.Provider>
    )
  }

  return field
}

/* ── ProFormRow (side-by-side fields) ───────────────────────── */

export function ProFormRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-4', className)}>
      {children}
    </div>
  )
}

/* ── Re-export helpers ──────────────────────────────────────── */

export { Controller, useFormContext }
export type { FieldPath, FieldValues, ProFormLayout, FieldErrors }
