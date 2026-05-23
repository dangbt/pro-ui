import {
  TooltipTrigger,
  Tooltip as RATooltip,
  OverlayArrow,
  type TooltipProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface TooltipProps_ extends Omit<TooltipProps, 'className' | 'children'> {
  children: React.ReactNode
  content: React.ReactNode
  delay?: number
  className?: string
}

export function Tooltip({ children, content, delay = 400, className, ...props }: TooltipProps_) {
  return (
    <TooltipTrigger delay={delay}>
      {children}
      <RATooltip
        {...props}
        offset={8}
        className={cn(
          'bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg',
          'entering:animate-in entering:fade-in entering:zoom-in-95',
          'exiting:animate-out exiting:fade-out exiting:zoom-out-95',
          'placement-bottom:slide-in-from-top-1',
          'placement-top:slide-in-from-bottom-1',
          className,
        )}
      >
        <OverlayArrow>
          {({ placement }) => (
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              className={cn(
                'fill-gray-900',
                placement === 'top' && 'rotate-180',
                placement === 'left' && '-rotate-90',
                placement === 'right' && 'rotate-90',
              )}
            >
              <path d="M0 8 L4 4 L8 8 Z" />
            </svg>
          )}
        </OverlayArrow>
        {content}
      </RATooltip>
    </TooltipTrigger>
  )
}
