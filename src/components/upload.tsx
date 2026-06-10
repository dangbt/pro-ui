import { useRef, useState, type DragEvent } from 'react'
import { X, Upload as UploadIcon } from 'lucide-react'
import { cn } from '../lib/cn'

interface UploadProps {
  accept?: string
  multiple?: boolean
  maxCount?: number
  maxSize?: number // bytes
  onChange?: (files: File[]) => void
  onRemove?: (file: File, index: number) => void
  fileList?: File[]
  children?: React.ReactNode
  className?: string
}

export function Upload({
  accept,
  multiple,
  maxCount,
  maxSize,
  onChange,
  onRemove,
  fileList: controlledFiles,
  children,
  className,
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [internalFiles, setInternalFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const files = controlledFiles ?? internalFiles

  const addFiles = (incoming: FileList) => {
    let valid = Array.from(incoming)
    if (maxSize) valid = valid.filter(f => f.size <= maxSize)
    if (maxCount) valid = valid.slice(0, maxCount - files.length)
    const next = [...files, ...valid]
    if (!controlledFiles) setInternalFiles(next)
    onChange?.(next)
  }

  const removeFile = (index: number) => {
    onRemove?.(files[index], index)
    const next = files.filter((_, i) => i !== index)
    if (!controlledFiles) setInternalFiles(next)
    onChange?.(next)
  }

  const handleDrag = (e: DragEvent) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = (e: DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false)
  }
  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-6 text-center cursor-pointer',
          'border-2 border-dashed rounded-[var(--base-radius)] transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border bg-surface-subtle hover:border-primary/50',
        )}
      >
        {children ?? (
          <>
            <UploadIcon className="w-6 h-6 text-fg-muted" />
            <p className="text-sm text-fg-muted">Click or drag files to upload</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) { addFiles(e.target.files); e.target.value = '' } }}
      />

      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center gap-2 px-2 py-1 text-sm text-fg-2 bg-surface-subtle rounded-[var(--base-radius)]">
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-fg-muted">{(file.size / 1024).toFixed(1)}KB</span>
              <button type="button" onClick={() => removeFile(i)} className="text-fg-muted hover:text-danger-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
