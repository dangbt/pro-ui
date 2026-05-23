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
          {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
          {showOutput && <SliderOutput className="text-xs text-gray-500 tabular-nums" />}
        </div>
      )}
      <SliderTrack className="relative h-2 w-full rounded-full bg-gray-200 cursor-pointer">
        {({ state }) => (
          <>
            <div
              className="absolute h-full bg-primary rounded-full"
              style={{ width: `${state.getThumbPercent(0) * 100}%` }}
            />
            <SliderThumb
              className={cn(
                'w-5 h-5 bg-white border-2 border-primary rounded-full shadow-sm',
                'top-1/2 -translate-y-1/2',
                'transition-transform',
                'dragging:scale-110',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 outline-none',
              )}
            />
          </>
        )}
      </SliderTrack>
    </RASlider>
  )
}
