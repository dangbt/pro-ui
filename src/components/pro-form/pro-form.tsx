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
import { z } from 'zod'
import { cn } from '../../lib/cn'
import { Button } from '../button'

/* ── Layout context ────────────────────────────────────────── */

type ProFormLayout = 'vertical' | 'horizontal'

const LayoutCtx = createContext<ProFormLayout>('vertical')
const useLayout = () => useContext(LayoutCtx)

/* ── ProForm ────────────────────────────────────────────────── */

interface ProFormProps<T extends FieldValues> {
  schema: z.ZodType<T>
  defaultValues?: DefaultValues<T>
  onFinish: (values: T) => void | Promise<void>
  layout?: ProFormLayout
  submitText?: string
  showReset?: boolean
  resetText?: string
  children: React.ReactNode
  className?: string
}

export function ProForm<T extends FieldValues>({
  schema,
  defaultValues,
  onFinish,
  layout = 'vertical',
  submitText = 'Submit',
  showReset = false,
  resetText = 'Reset',
  children,
  className,
}: ProFormProps<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const methods = useForm<T>({ resolver: zodResolver(schema as any), defaultValues })
  const { handleSubmit, reset, formState: { isSubmitting } } = methods

  return (
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
          <div className="flex items-center gap-2 pt-1">
            <Button type="submit" variant="primary" isDisabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : submitText}
            </Button>
            {showReset && (
              <Button type="button" variant="secondary" onPress={() => reset()}>
                {resetText}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </LayoutCtx.Provider>
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

export function ProFormItem({ name, label, required, description, className, children }: ItemProps) {
  const { formState: { errors } } = useFormContext()
  const layout = useLayout()

  // resolve nested paths like "address.city"
  const error = name.split('.').reduce<Record<string, unknown>>(
    (obj, key) => (obj?.[key] as Record<string, unknown>),
    errors as Record<string, unknown>,
  ) as { message?: string } | undefined

  const field = (
    <div className={cn('flex flex-col gap-1', className)}>
      {layout === 'vertical' && label && (
        <span className="text-xs font-medium text-gray-600">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </span>
      )}
      {children}
      {description && !error?.message && (
        <span className="text-xs text-gray-400">{description}</span>
      )}
      {error?.message && (
        <span className="text-xs text-danger">{String(error.message)}</span>
      )}
    </div>
  )

  if (layout === 'horizontal') {
    return (
      <div className="flex items-start gap-3">
        <span className="w-28 shrink-0 text-xs font-medium text-gray-600 text-right pt-2.5 leading-none">
          {required && <span className="text-danger mr-0.5">*</span>}
          {label}
        </span>
        <div className={cn('flex-1 flex flex-col gap-1', className)}>
          {children}
          {description && !error?.message && (
            <span className="text-xs text-gray-400">{description}</span>
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
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {children}
    </div>
  )
}

/* ── Re-export helpers ──────────────────────────────────────── */

export { Controller, useFormContext }
export type { FieldPath, FieldValues, ProFormLayout }
