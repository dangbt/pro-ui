import {
  Slider as RASlider,
  Label,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  type SliderProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

interface SliderProps_ extends Omit<SliderProps<number>, 'className'> {
  label?: string
  showOutput?: boolean
  className?: string
}

export function Slider({ label, showOutput = true, className, ...props }: SliderProps_) {
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
            <div
              className="absolute top-1.5 left-0 h-2 bg-primary rounded-full"
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            <SliderThumb
              className={cn(
                'w-5 h-5 top-1/2 bg-canvas border-2 border-primary rounded-full shadow-sm',
                'transition-transform dragging:scale-110',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none',
              )}
            />
          </>
        )}
      </SliderTrack>
    </RASlider>
  )
}
