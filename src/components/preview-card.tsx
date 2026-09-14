import {
  PreviewTrigger,
  Popover as RAPopover,
  Dialog,
  OverlayArrow,
  type PreviewTriggerProps,
  type Placement,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface PreviewCardProps
  extends Pick<
    PreviewTriggerProps,
    'delay' | 'closeDelay' | 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'isDisabled'
  > {
  /** The trigger element (e.g. a `Link` or `Button`). Must be focusable. */
  children: React.ReactNode
  /** Content rendered inside the preview card overlay. May contain interactive elements. */
  content: React.ReactNode
  /**
   * Delay in ms before the card opens on hover/focus.
   * @default 600
   */
  delay?: number
  /**
   * Delay in ms before the card closes.
   * @default 300
   */
  closeDelay?: number
  /**
   * Placement of the card relative to the trigger.
   * @default 'bottom'
   */
  placement?: Placement
  /** Render an arrow pointing at the trigger. */
  showArrow?: boolean
  /** Extra classes for the overlay panel. */
  className?: string
}

/**
 * A popover that opens on hover, focus, or long-press of its trigger and may contain
 * interactive content (links, buttons). Built on React Aria `PreviewTrigger`.
 *
 * Typical use: GitHub-style user/link preview cards.
 */
export function PreviewCard({
  children,
  content,
  delay = 600,
  closeDelay = 300,
  placement = 'bottom',
  showArrow = false,
  className,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDisabled,
}: PreviewCardProps) {
  return (
    <PreviewTrigger
      delay={delay}
      closeDelay={closeDelay}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isDisabled={isDisabled}
    >
      {children}
      <RAPopover
        placement={placement}
        offset={8}
        className={cn(
          'bg-surface-raised border border-border shadow-lg rounded-[var(--base-radius)] z-50 min-w-[220px] max-w-[320px]',
          'entering:animate-in entering:fade-in entering:zoom-in-95',
          'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
          'placement-bottom:origin-top placement-top:origin-bottom',
          'placement-left:origin-right placement-right:origin-left',
          className,
        )}
      >
        {showArrow && (
          <OverlayArrow>
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              className="fill-surface stroke-border stroke-[0.5px] placement-bottom:rotate-180 placement-left:-rotate-90 placement-right:rotate-90"
            >
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          </OverlayArrow>
        )}
        <Dialog aria-label="Preview" className="outline-none p-4">{content}</Dialog>
      </RAPopover>
    </PreviewTrigger>
  )
}

export type { PreviewCardProps }
