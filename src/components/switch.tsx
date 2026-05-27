import { Switch as RASwitch, type SwitchProps as RASwitchProps } from 'react-aria-components'
import { cn } from '../lib/cn'

type SwitchSize = 'sm' | 'md' | 'lg'

interface SwitchProps extends Omit<RASwitchProps, 'className' | 'children'> {
  children?: React.ReactNode
  size?: SwitchSize
  className?: string
}

const trackSize: Record<SwitchSize, string> = {
  sm: 'w-8  h-4',
  md: 'w-11 h-6',
  lg: 'w-14 h-7',
}

const thumbSize: Record<SwitchSize, string> = {
  sm: 'w-3 h-3 group-data-[selected]:translate-x-4',
  md: 'w-4 h-4 group-data-[selected]:translate-x-5',
  lg: 'w-5 h-5 group-data-[selected]:translate-x-8',
}

const switchLabelText: Record<SwitchSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function Switch({ children, size = 'md', className, ...props }: SwitchProps) {
  return (
    <RASwitch
      {...props}
      className={cn(
        'group flex items-center gap-2 cursor-pointer select-none',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
    >
      <div
        className={cn(
          'relative rounded-full transition-colors duration-200 flex items-center p-0.5',
          'bg-border',
          'group-data-[selected]:bg-primary',
          'group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-primary group-data-[focus-visible]:ring-offset-1',
          trackSize[size],
        )}
      >
        <div
          className={cn(
            'bg-canvas rounded-full shadow-sm transition-transform duration-200 translate-x-0',
            thumbSize[size],
          )}
        />
      </div>
      {children && <span className={`${switchLabelText[size]} text-fg-2`}>{children}</span>}
    </RASwitch>
  )
}
