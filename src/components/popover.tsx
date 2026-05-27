import React from 'react'
import {
  DialogTrigger,
  Popover as RAPopover,
  Dialog,
  OverlayArrow,
  type PopoverProps as RAPopoverProps,
  type DialogProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface PopoverProps extends Omit<RAPopoverProps, 'className' | 'children' | 'trigger'> {
  triggerElement: React.ReactNode
  children: React.ReactNode
  showArrow?: boolean
  className?: string
}

export function Popover({ triggerElement, children, showArrow = false, className, ...props }: PopoverProps) {
  // Neutralise pressed:scale-95 on the trigger — React Aria keeps data-pressed=true
  // while the overlay is open, so the button would stay scaled down permanently.
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
      <RAPopover
        {...props}
        className={cn(
          'bg-surface-raised border border-border shadow-lg rounded-[var(--base-radius)] z-50 min-w-[180px]',
          'entering:animate-in entering:fade-in entering:zoom-in-95',
          'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
          'placement-bottom:origin-top placement-top:origin-bottom',
          'placement-left:origin-right placement-right:origin-left',
          className,
        )}
      >
        {showArrow && (
          <OverlayArrow>
            <svg width={12} height={12} viewBox="0 0 12 12" className="fill-white stroke-gray-200 stroke-[0.5px] placement-bottom:rotate-180 placement-left:-rotate-90 placement-right:rotate-90">
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
        )}
        <Dialog className="outline-none p-3">{children}</Dialog>
      </RAPopover>
    </DialogTrigger>
  )
}

export type { DialogProps }
