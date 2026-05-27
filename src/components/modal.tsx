import React from 'react'
import {
  DialogTrigger,
  Modal as RAModal,
  ModalOverlay,
  Dialog,
  Heading,
  type ModalOverlayProps,
} from 'react-aria-components'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'
import { Button } from './button'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps extends Omit<ModalOverlayProps, 'className' | 'children'> {
  title?: string
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
  footer?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
  size?: ModalSize
  className?: string
  /**
   * Optional trigger element. When provided the modal manages its own open
   * state via DialogTrigger and pressed:scale-95 on the trigger is neutralised
   * (React Aria keeps data-pressed=true while the overlay is open).
   * When omitted, use isOpen / onOpenChange for controlled mode.
   */
  triggerElement?: React.ReactNode
}

const sizeMap: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-full mx-4',
}

function ModalPanel({
  title,
  children,
  footer,
  size = 'md',
  className,
  ...props
}: Omit<ModalProps, 'triggerElement'>) {
  return (
    <ModalOverlay
      {...props}
      className={cn(
        'fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4',
        'entering:animate-in entering:fade-in',
        'exiting:animate-out exiting:fade-out',
      )}
    >
      <RAModal
        className={cn(
          'bg-surface shadow-xl w-full',
          'rounded-[var(--base-radius)]',
          'entering:animate-in entering:zoom-in-95 entering:fade-in',
          'exiting:animate-out exiting:zoom-out-95 exiting:fade-out',
          sizeMap[size],
          className,
        )}
      >
        <Dialog className="outline-none flex flex-col max-h-[90vh]">
          {({ close }) => (
            <>
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                  <Heading slot="title" className="text-base font-semibold text-fg">
                    {title}
                  </Heading>
                  <button
                    onClick={close}
                    className="w-7 h-7 flex items-center justify-center text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-[var(--base-radius)] transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-fg-2">
                {typeof children === 'function' ? children({ close }) : children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle">
                  {typeof footer === 'function' ? footer({ close }) : footer}
                </div>
              )}
            </>
          )}
        </Dialog>
      </RAModal>
    </ModalOverlay>
  )
}

export function Modal({ triggerElement, ...props }: ModalProps) {
  if (triggerElement) {
    // Neutralise pressed:scale-95 — React Aria keeps data-pressed=true on
    // the trigger while the overlay is open, so the button stays scaled down.
    const trigger = React.isValidElement(triggerElement)
      ? React.cloneElement(triggerElement as React.ReactElement<{ className?: string }>, {
          className: cn(
            (triggerElement as React.ReactElement<{ className?: string }>).props.className,
            'pressed:scale-100',
          ),
        })
      : triggerElement

    return (
      <DialogTrigger>
        {trigger}
        <ModalPanel {...props} />
      </DialogTrigger>
    )
  }

  return <ModalPanel {...props} />
}

/* Convenience: ConfirmModal */
interface ConfirmModalProps extends Omit<ModalProps, 'children' | 'footer' | 'size'> {
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  danger?: boolean
}

export function ConfirmModal({
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  danger = false,
  ...props
}: ConfirmModalProps) {
  return (
    <Modal
      {...props}
      size="sm"
      footer={({ close }) => (
        <>
          <Button variant="secondary" onPress={close}>{cancelLabel}</Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onPress={() => { onConfirm?.(); close() }}
          >
            {confirmLabel}
          </Button>
        </>
      )}
    >
      {description && <p>{description}</p>}
    </Modal>
  )
}
