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

interface SliderProps_<T extends number | number[]> extends Omit<SliderProps<T>, 'className'> {
  label?: string
  showOutput?: boolean
  className?: string
}

const thumbClassName = cn(
  'w-5 h-5 top-1/2 bg-canvas border-2 border-primary rounded-full shadow-sm',
  'transition-transform dragging:scale-110',
  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none',
)

export function Slider<T extends number | number[] = number>({
  label,
  showOutput = true,
  className,
  ...props
}: SliderProps_<T>) {
  return (
    <RASlider {...props} className={cn('w-full', className)}>
      {(label || showOutput) && (
        <div className="flex items-center justify-between mb-2">
          {label && <Label className="text-xs font-medium text-fg-muted">{label}</Label>}
          {showOutput && <SliderOutput className="text-xs text-fg-muted tabular-nums" />}
        </div>
      )}
      <SliderTrack className="relative w-full h-5 cursor-pointer">
        {({ state }) => (
          <>
            <div className="absolute inset-x-0 top-1.5 h-2 rounded-full bg-border-subtle" />
            <SliderFill className="absolute top-1.5 h-2 bg-primary rounded-full" />
            {state.values.map((_, i) => (
              <SliderThumb key={i} index={i} className={thumbClassName} />
            ))}
          </>
        )}
      </SliderTrack>
    </RASlider>
  )
}
