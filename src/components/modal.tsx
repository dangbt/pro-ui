import {
  Modal as RAModal,
  ModalOverlay,
  Dialog,
  Heading,
  type ModalOverlayProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { Button } from './button'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps extends Omit<ModalOverlayProps, 'className' | 'children'> {
  title?: string
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
  footer?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
  size?: ModalSize
  className?: string
}

const sizeMap: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-full mx-4',
}

export function Modal({
  title,
  children,
  footer,
  size = 'md',
  className,
  ...props
}: ModalProps) {
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
          'bg-white shadow-xl w-full',
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <Heading
                    slot="title"
                    className="text-base font-semibold text-gray-800"
                  >
                    {title}
                  </Heading>
                  <button
                    onClick={close}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[var(--base-radius)] transition-colors"
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-5 overflow-y-auto flex-1 text-sm text-gray-600">
                {typeof children === 'function' ? children({ close }) : children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
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
