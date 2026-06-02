import { useRef, useState, type DragEvent } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '../lib/cn'

interface DropZoneProps {
  label?: string
  description?: string
  accept?: string[]
  allowsMultiple?: boolean
  onFiles?: (files: FileList) => void
  className?: string
  isDisabled?: boolean
}

/**
 * Drag-and-drop file upload zone with click-to-browse support.
 * Clicking anywhere in the zone opens the native file picker.
 *
 * NOTE: This component uses a plain <div> + hidden <input type="file"> instead of
 * react-aria DropZone because RADropZone overrides the onClick prop with its own
 * handler (which only focuses an internal hidden button, not the FileTrigger).
 */
export function DropZone({
  label = 'Drop files here',
  description,
  accept,
  allowsMultiple,
  onFiles,
  className,
  isDisabled = false,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isDisabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Only clear when leaving the zone entirely (not entering a child element)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (isDisabled) return
    if (e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files)
  }

  const handleClick = () => {
    if (!isDisabled) inputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={label}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-drop-target={isDragOver || undefined}
      data-disabled={isDisabled || undefined}
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-8 text-center',
        'border-2 border-dashed rounded-[var(--base-radius)] transition-colors cursor-pointer outline-none select-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isDragOver
          ? 'border-primary bg-primary/5 text-primary'
          : 'border-border bg-surface-subtle text-fg-muted hover:border-primary/50 hover:bg-surface',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <Upload className="w-8 h-8 text-fg-disabled pointer-events-none" />
      <div className="pointer-events-none">
        <p className="text-sm font-medium text-primary">{label}</p>
        {description && (
          <p className="text-xs text-fg-disabled mt-0.5">{description}</p>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept?.join(',')}
        multiple={allowsMultiple}
        disabled={isDisabled}
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          if (e.target.files?.length) {
            onFiles?.(e.target.files)
            // Reset so same file can be re-selected
            e.target.value = ''
          }
        }}
      />
    </div>
  )
}
