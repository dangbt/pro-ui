import {
  ColorPicker as RAColorPicker,
  ColorArea as RAColorArea,
  ColorThumb,
  ColorWheel as RAColorWheel,
  ColorWheelTrack,
  ColorSlider as RAColorSlider,
  SliderTrack,
  ColorField as RAColorField,
  ColorSwatch as RAColorSwatch,
  ColorSwatchPicker as RAColorSwatchPicker,
  ColorSwatchPickerItem,
  Label,
  Input,
  DialogTrigger,
  Popover,
  Dialog,
  type ColorPickerProps,
  type ColorAreaProps,
  type ColorWheelProps,
  type ColorSliderProps,
  type ColorFieldProps,
  type ColorSwatchProps,
  type ColorSwatchPickerProps,
  type Color,
} from 'react-aria-components'
import { cn } from '../lib/cn'
import { labelText, type Size } from '../lib/size'

/* ── ColorSwatch ─────────────────────────────────────────── */

interface ColorSwatchProps_ extends Omit<ColorSwatchProps, 'className'> {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const swatchSize = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-9 h-9' }

export function ColorSwatch({ size = 'md', className, ...props }: ColorSwatchProps_) {
  return (
    <RAColorSwatch
      {...props}
      className={cn(
        swatchSize[size],
        'rounded-[var(--base-radius)] border border-black/10',
        className,
      )}
    />
  )
}

/* ── ColorSwatchPicker ───────────────────────────────────── */

interface ColorSwatchPickerProps_ extends Omit<ColorSwatchPickerProps, 'className' | 'children'> {
  colors: string[]
  swatchSize?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ColorSwatchPicker({ colors, swatchSize: sz = 'md', className, ...props }: ColorSwatchPickerProps_) {
  return (
    <RAColorSwatchPicker {...props} className={cn('flex flex-wrap gap-1.5', className)}>
      {colors.map(color => (
        <ColorSwatchPickerItem
          key={color}
          color={color}
          className={cn(
            swatchSize[sz],
            'rounded-[var(--base-radius)] border border-black/10 cursor-pointer outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            'selected:ring-2 selected:ring-primary selected:ring-offset-1',
          )}
        >
          <RAColorSwatch className="w-full h-full rounded-[calc(var(--base-radius)-1px)]" />
        </ColorSwatchPickerItem>
      ))}
    </RAColorSwatchPicker>
  )
}

/* ── ColorField (hex input) ──────────────────────────────── */

interface ColorFieldProps_ extends Omit<ColorFieldProps, 'className'> {
  label?: string
  size?: Size
  className?: string
}

export function ColorField({ label, size = 'md', className, ...props }: ColorFieldProps_) {
  return (
    <RAColorField {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className={cn('font-medium text-gray-600', labelText[size])}>{label}</Label>}
      <Input
        className={cn(
          'h-9 px-3 text-sm font-mono bg-white border border-gray-300 text-gray-900 rounded-[var(--base-radius)] w-full',
          'focus:outline-2 focus:outline-primary focus:outline-offset-0 focus:border-transparent',
          'data-[invalid]:border-danger',
        )}
      />
    </RAColorField>
  )
}

/* ── ColorArea (2D saturation/brightness) ────────────────── */

interface ColorAreaProps_ extends Omit<ColorAreaProps, 'className'> {
  className?: string
}

export function ColorArea({ className, ...props }: ColorAreaProps_) {
  return (
    <RAColorArea
      {...props}
      className={cn('w-full h-40 rounded-[var(--base-radius)] outline-none', className)}
    >
      <ColorThumb className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary" />
    </RAColorArea>
  )
}

/* ── ColorWheel (hue) ───────────────────────────────────── */

interface ColorWheelProps_ extends Omit<ColorWheelProps, 'className'> {
  className?: string
}

export function ColorWheel({ className, ...props }: ColorWheelProps_) {
  return (
    <RAColorWheel {...props} outerRadius={80} innerRadius={60} className={cn('outline-none', className)}>
      <ColorWheelTrack />
      <ColorThumb className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary" />
    </RAColorWheel>
  )
}

/* ── ColorSlider (single channel) ───────────────────────── */

interface ColorSliderProps_ extends Omit<ColorSliderProps, 'className'> {
  label?: string
  className?: string
}

export function ColorSlider({ label, className, ...props }: ColorSliderProps_) {
  return (
    <RAColorSlider {...props} className={cn('flex flex-col gap-1', className)}>
      {label && <Label className="text-xs font-medium text-gray-600">{label}</Label>}
      <SliderTrack className="h-3 rounded-full outline-none relative">
        <ColorThumb className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary" />
      </SliderTrack>
    </RAColorSlider>
  )
}

/* ── ColorPicker (full picker with popover) ─────────────── */

interface ColorPickerProps_ extends Omit<ColorPickerProps, 'className' | 'children'> {
  label?: string
  presetColors?: string[]
  className?: string
}

export function ColorPicker({ label, presetColors, className, ...props }: ColorPickerProps_) {
  return (
    <RAColorPicker {...props}>
      {({ color }) => (
        <div className={cn('flex flex-col gap-1', className)}>
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          <DialogTrigger>
            <button className="flex items-center gap-2 h-9 px-3 bg-white border border-gray-300 rounded-[var(--base-radius)] cursor-pointer hover:border-gray-400 transition-colors focus-visible:outline-2 focus-visible:outline-primary">
              <RAColorSwatch color={color} className="w-5 h-5 rounded border border-black/10 shrink-0" />
              <span className="text-sm font-mono text-gray-700">{color.toString('hex')}</span>
            </button>
            <Popover
              placement="bottom start"
              className="bg-white border border-gray-200 shadow-xl rounded-[var(--base-radius)] z-50 p-4 w-64 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out"
            >
              <Dialog className="outline-none flex flex-col gap-3">
                <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
                <ColorSlider colorSpace="hsb" channel="hue" />
                <ColorSlider channel="alpha" label="Opacity" />
                <ColorField label="Hex" />
                {presetColors && presetColors.length > 0 && (
                  <ColorSwatchPicker colors={presetColors} swatchSize="sm" />
                )}
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      )}
    </RAColorPicker>
  )
}

export type { Color }
