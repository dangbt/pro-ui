import React from 'react'
import {
  SheetTrigger,
  SheetOverlay,
  Sheet as RACSheet,
  SheetBackdrop,
  SheetContent,
  Heading,
  type SheetOverlayProps,
} from 'react-aria-components'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'

type SheetPosition = 'bottom' | 'top' | 'left' | 'right' | 'start' | 'end' | 'center'
type SheetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type SheetNode = React.ReactNode | ((props: { close: () => void }) => React.ReactNode)

export interface SheetProps
  extends Omit<SheetOverlayProps, 'className' | 'children' | 'style' | 'position'> {
  title?: string
  children: SheetNode
  footer?: SheetNode
  /** Edge the sheet slides in from (default: 'bottom') */
  position?: SheetPosition
  /** Width (left/right/start/end/center) or max-height (bottom/top). Default: 'md' */
  size?: SheetSize
  /** Show the dimmed backdrop (default: true) */
  withBackdrop?: boolean
  /** Show drag handle bar (default: true for bottom/top) */
  showHandle?: boolean
  /** Accessible name used when there is no title (default: 'Sheet') */
  'aria-label'?: string
  className?: string
  /**
   * Optional trigger element. When provided the sheet manages its own open
   * state via SheetTrigger. When omitted, use isOpen / onOpenChange.
   */
  triggerElement?: React.ReactNode
}

const widthMap: Record<SheetSize, string> = {
  sm: 'w-64',
  md: 'w-80',
  lg: 'w-[480px]',
  xl: 'w-[640px]',
  full: 'w-screen',
}

const heightMap: Record<SheetSize, string> = {
  sm: 'max-h-48',
  md: 'max-h-72',
  lg: 'max-h-[50vh]',
  xl: 'max-h-[75vh]',
  full: 'max-h-screen',
}

const centerWidthMap: Record<SheetSize, string> = {
  sm: 'w-72',
  md: 'w-96',
  lg: 'w-[520px]',
  xl: 'w-[680px]',
  full: 'w-screen',
}

type ResolvedPosition = 'bottom' | 'top' | 'left' | 'right' | 'center'

const panelCls: Record<ResolvedPosition, string> = {
  bottom: 'fixed inset-x-0 bottom-0 w-full rounded-t-xl',
  top: 'fixed inset-x-0 top-0 w-full rounded-b-xl',
  left: 'fixed inset-y-0 left-0 h-full',
  right: 'fixed inset-y-0 right-0 h-full',
  center: 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl max-w-[calc(100vw-2rem)]',
}

function sizeCls(position: ResolvedPosition, size: SheetSize) {
  if (position === 'center') return centerWidthMap[size]
  return position === 'top' || position === 'bottom' ? heightMap[size] : widthMap[size]
}

function SheetPanel({
  title,
  children,
  footer,
  position = 'bottom',
  size = 'md',
  withBackdrop = true,
  showHandle,
  className,
  'aria-label': ariaLabel,
  ...overlayProps
}: Omit<SheetProps, 'triggerElement'>) {
  const isEdgeVertical = position === 'bottom' || position === 'top'
  const handle = showHandle ?? isEdgeVertical

  return (
    <SheetOverlay
      {...overlayProps}
      position={position}
      className="fixed inset-0 z-50"
    >
      {withBackdrop && (
        <SheetBackdrop
          className={({ stackIndex }) =>
            cn(
              'absolute inset-0 bg-black/40 backdrop-blur-sm',
              'entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out',
              stackIndex > 0 && 'bg-black/20 backdrop-blur-none',
            )
          }
        />
      )}
      <RACSheet
        className={({ position: pos, isExpanded, hasDescendants }) =>
          cn(
            'bg-surface shadow-xl flex flex-col outline-none duration-200',
            'entering:animate-in exiting:animate-out',
            panelCls[pos],
            sizeCls(pos, size),
            pos === 'center' && 'entering:fade-in entering:zoom-in-95 exiting:fade-out exiting:zoom-out-95',
            isExpanded && 'shadow-2xl',
            hasDescendants && 'brightness-95',
            className,
          )
        }
      >
        <SheetContent
          aria-label={title ? undefined : (ariaLabel ?? 'Sheet')}
          className="outline-none flex flex-col flex-1 min-h-0"
        >
          {({ close }) => (
            <>
              {handle && (
                <div className="flex justify-center pt-2 shrink-0" aria-hidden="true">
                  <div className="h-1.5 w-10 rounded-full bg-border" data-slot="sheet-handle" />
                </div>
              )}
              {title ? (
                <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle shrink-0">
                  <Heading slot="title" className="text-base font-semibold text-fg">
                    {title}
                  </Heading>
                  <CloseButton onPress={close} />
                </div>
              ) : (
                <div className="absolute top-3 right-3">
                  <CloseButton onPress={close} />
                </div>
              )}
              <div className="px-5 py-5 overflow-y-auto flex-1 text-sm text-fg-2">
                {typeof children === 'function' ? children({ close }) : children}
              </div>
              {footer && (
                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border-subtle shrink-0">
                  {typeof footer === 'function' ? footer({ close }) : footer}
                </div>
              )}
            </>
          )}
        </SheetContent>
      </RACSheet>
    </SheetOverlay>
  )
}

function CloseButton({ onPress }: { onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-7 h-7 flex items-center justify-center text-fg-muted hover:text-fg-2 hover:bg-surface-subtle rounded-[var(--base-radius)] transition-colors"
      aria-label="Close"
    >
      <X className="w-4 h-4" />
    </button>
  )
}

export function Sheet({ triggerElement, ...props }: SheetProps) {
  if (triggerElement) {
    // Neutralise pressed:scale-95 — React Aria keeps data-pressed=true on
    // the trigger while the overlay is open.
    const trigger = React.isValidElement(triggerElement)
      ? React.cloneElement(triggerElement as React.ReactElement<{ className?: string }>, {
          className: cn(
            (triggerElement as React.ReactElement<{ className?: string }>).props.className,
            'pressed:scale-100',
          ),
        })
      : triggerElement

    return (
      <SheetTrigger>
        {trigger}
        <SheetPanel {...props} />
      </SheetTrigger>
    )
  }
  return <SheetPanel {...props} />
}
