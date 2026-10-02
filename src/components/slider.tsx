import {
  Slider as RASlider,
  Label,
  SliderTrack,
  SliderThumb,
  SliderFill,
  SliderOutput,
  type SliderProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import type { Size } from '../lib/size'

interface SliderProps_<T extends number | number[]> extends Omit<SliderProps<T>, 'className'> {
  label?: string
  showOutput?: boolean
  className?: string
  /** Visual size — controls thumb and label size. */
  size?: Size
  /** Marks the slider as invalid for form validation feedback. */
  isInvalid?: boolean
}

const thumbSize: Record<Size, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const labelSize: Record<Size, string> = {
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
}

function getThumbClassName(size: Size, isInvalid?: boolean) {
  return cn(
    thumbSize[size],
    'top-1/2 bg-canvas border-2 rounded-full shadow-sm',
    isInvalid ? 'border-danger' : 'border-primary',
    'transition-transform dragging:scale-110',
    'focus-visible:ring-2 focus-visible:ring-offset-1 outline-none',
    isInvalid ? 'focus-visible:ring-danger' : 'focus-visible:ring-primary',
  )
}

export function Slider<T extends number | number[] = number>({
  label,
  showOutput = true,
  className,
  size = 'md',
  isInvalid,
  ...props
}: SliderProps_<T>) {
  return (
    <RASlider
      {...props}
      className={cn('w-full', className)}
      data-invalid={isInvalid || undefined}
    >
      {(label || showOutput) && (
        <div className="flex items-center justify-between mb-2">
          {label && <Label className={cn('font-medium text-fg-muted', labelSize[size])}>{label}</Label>}
          {showOutput && <SliderOutput className={cn('text-fg-muted tabular-nums', labelSize[size])} />}
        </div>
      )}
      <SliderTrack className="relative w-full h-5 cursor-pointer">
        {({ state }) => (
          <>
            <div className={cn(
              'absolute inset-x-0 top-1.5 h-2 rounded-full overflow-hidden',
              isInvalid ? 'bg-danger-100' : 'bg-border-subtle',
            )}>
              {/* SliderFill sets an inline `height: 100%`; nesting it in this 8px rail
                  keeps the fill 8px tall (100% of the rail) instead of the 20px track. */}
              <SliderFill className={cn(
                'absolute inset-y-0 rounded-full',
                isInvalid ? 'bg-danger' : 'bg-primary',
              )} />
            </div>
            {state.values.map((_, i) => (
              <SliderThumb key={i} index={i} className={getThumbClassName(size, isInvalid)} />
            ))}
          </>
        )}
      </SliderTrack>
    </RASlider>
  )
}
