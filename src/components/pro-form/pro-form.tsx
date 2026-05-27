import { createContext, useContext } from 'react'
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
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

/* ── ProForm ────────────────────────────────────────────────── */

interface ZodLike<T> {
  parse(data: unknown): T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  safeParse(data: unknown): { success: boolean; data?: T; error?: any }
}

interface ProFormProps<T extends FieldValues> {
  schema: ZodLike<T>
  defaultValues?: DefaultValues<T>
  onFinish: (values: T) => void | Promise<void>
  onReset?: () => void
  layout?: ProFormLayout
  size?: Size
  submitText?: string
  submitClassName?: string
  showReset?: boolean
  resetText?: string
  children: React.ReactNode
  className?: string
}

export function ProForm<T extends FieldValues>({
  schema,
  defaultValues,
  onFinish,
  onReset,
  layout = 'vertical',
  size = 'md',
  submitText = 'Submit',
  submitClassName,
  showReset = false,
  resetText = 'Reset',
  children,
  className,
}: ProFormProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<T>({ resolver: zodResolver(schema as any), defaultValues })
  const { handleSubmit, reset, formState: { isSubmitting } } = methods

  return (
    <SizeCtx.Provider value={size}>
    <LayoutCtx.Provider value={layout}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FormProvider {...(methods as any)}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={handleSubmit(onFinish as any)}
          noValidate
          className={cn('flex flex-col gap-4', className)}
        >
          {children}
          <div className={cn('flex items-center gap-2 pt-1', layout === 'horizontal' && 'sm:ml-[calc(7rem+0.75rem)]')}>
            <Button type="submit" variant="primary" size={size} loading={isSubmitting} className={submitClassName}>
              {submitText}
            </Button>
            {showReset && (
              <Button type="button" variant="secondary" size={size} onPress={() => { reset(); onReset?.() }}>
                {resetText}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </LayoutCtx.Provider>
    </SizeCtx.Provider>
  )
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

export function ProFormItem({ name, label, required, description, className, children }: ItemProps) {
  const { formState: { errors } } = useFormContext()
  const layout = useLayout()
  const size = useSize()

  // resolve nested paths like "address.city"
  const error = name.split('.').reduce<Record<string, unknown>>(
    (obj, key) => (obj?.[key] as Record<string, unknown>),
    errors as Record<string, unknown>,
  ) as { message?: string } | undefined

  const field = (
    <div className={cn('flex flex-col gap-1', className)}>
      {layout === 'vertical' && label && (
        <span className={cn('font-medium text-fg-muted', labelText[size])}>
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </span>
      )}
      {children}
      {description && !error?.message && (
        <span className="text-xs text-fg-disabled">{description}</span>
      )}
      {error?.message && (
        <span className="text-xs text-danger">{String(error.message)}</span>
      )}
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
        <span className={cn('shrink-0 font-medium text-fg-muted leading-none sm:w-28 sm:text-right', labelText[size], labelHorizontalPt[size])}>
          {required && <span className="text-danger mr-0.5">*</span>}
          {label}
        </span>
        <div className={cn('flex-1 flex flex-col gap-1', className)}>
          {children}
          {description && !error?.message && (
            <span className="text-xs text-fg-disabled">{description}</span>
          )}
          {error?.message && (
            <span className="text-xs text-danger">{String(error.message)}</span>
          )}
        </div>
      </div>
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
export type { FieldPath, FieldValues, ProFormLayout }
