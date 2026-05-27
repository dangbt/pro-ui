import {
  DropZone as RADropZone,
  FileTrigger,
  Text,
  type DropZoneProps as RADropZoneProps,
} from 'react-aria-components'
import { Upload } from 'lucide-react'
import { cn } from '../lib/cn'

interface DropZoneProps extends Omit<RADropZoneProps, 'className' | 'children'> {
  label?: string
  description?: string
  accept?: string[]
  allowsMultiple?: boolean
  onFiles?: (files: FileList) => void
  className?: string
}

export function DropZone({
  label = 'Drop files here',
  description,
  accept,
  allowsMultiple,
  onFiles,
  className,
  ...props
}: DropZoneProps) {
  return (
    <RADropZone
      {...props}
      className={({ isDropTarget }) => cn(
        'flex flex-col items-center justify-center gap-3 p-8 text-center',
        'border-2 border-dashed rounded-[var(--base-radius)] transition-colors cursor-pointer outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isDropTarget
          ? 'border-primary bg-primary-50 text-primary'
          : 'border-border bg-surface-subtle text-fg-muted hover:border-border hover:bg-surface-subtle',
        className,
      )}
    >
      <Upload className="w-8 h-8 text-fg-disabled" />
      <div>
        <FileTrigger
          acceptedFileTypes={accept}
          allowsMultiple={allowsMultiple}
          onSelect={(files) => files && onFiles?.(files)}
        >
          <button className="text-sm font-medium text-primary hover:text-primary-700 transition-colors outline-none focus-visible:underline">
            {label}
          </button>
        </FileTrigger>
        {description && (
          <Text slot="description" className="text-xs text-fg-disabled mt-0.5 block">
            {description}
          </Text>
        )}
      </div>
    </RADropZone>
  )
}
