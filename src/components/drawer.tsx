import {
  Modal as RAModal,
  ModalOverlay,
  Dialog,
  Heading,
  type ModalOverlayProps,
} from 'react-aria-components'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'

type DrawerPlacement = 'left' | 'right' | 'bottom'
type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface DrawerProps extends Omit<ModalOverlayProps, 'className' | 'children'> {
  title?: string
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
  footer?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
  /** Which edge the drawer slides in from (default: 'right') */
  placement?: DrawerPlacement
  /** Width (left/right) or max-height (bottom). Default: 'md' */
  size?: DrawerSize
  className?: string
  /** Show overlay backdrop (default: true) */
  withOverlay?: boolean
}

/* Width map for left/right drawers */
const widthMap: Record<DrawerSize, string> = {
  sm:   'w-64',
  md:   'w-80',
  lg:   'w-[480px]',
  xl:   'w-[640px]',
  full: 'w-screen',
}

/* Max-height map for bottom drawer */
const heightMap: Record<DrawerSize, string> = {
  sm:   'max-h-48',
  md:   'max-h-72',
  lg:   'max-h-[50vh]',
  xl:   'max-h-[75vh]',
  full: 'max-h-screen',
}

const placementPanelCls: Record<DrawerPlacement, string> = {
  right:  'inset-y-0 right-0 h-full flex-col entering:slide-in-from-right exiting:slide-out-to-right',
  left:   'inset-y-0 left-0  h-full flex-col entering:slide-in-from-left  exiting:slide-out-to-left',
  bottom: 'inset-x-0 bottom-0 w-full flex-col entering:slide-in-from-bottom exiting:slide-out-to-bottom',
}

export function Drawer({
  title,
  children,
  footer,
  placement = 'right',
  size = 'md',
  className,
  withOverlay = true,
  ...props
}: DrawerProps) {
  const isVertical = placement === 'left' || placement === 'right'

  return (
    <ModalOverlay
      {...props}
      className={cn(
        'fixed inset-0 z-50',
        withOverlay && 'bg-black/40 backdrop-blur-sm',
        'entering:animate-in entering:fade-in',
        'exiting:animate-out exiting:fade-out',
      )}
    >
      <RAModal
        className={cn(
          'fixed bg-white shadow-xl flex duration-200',
          'entering:animate-in exiting:animate-out',
          placementPanelCls[placement],
          isVertical ? widthMap[size] : heightMap[size],
          className,
        )}
      >
        <Dialog className="outline-none flex flex-col flex-1 min-h-0">
          {({ close }) => (
            <>
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
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
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="px-5 py-5 overflow-y-auto flex-1 text-sm text-gray-600">
                {typeof children === 'function' ? children({ close }) : children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
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
