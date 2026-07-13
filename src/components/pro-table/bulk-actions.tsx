import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { BulkActionDef } from './types'

interface BulkActionsProps<T extends object> {
  selectedKeys: string[]
  selectedOriginals: T[]
  bulkActions?: BulkActionDef<T>[]
  onClear: () => void
}

export function BulkActions<T extends object>({
  selectedKeys,
  selectedOriginals,
  bulkActions,
  onClear,
}: BulkActionsProps<T>) {
  if (selectedKeys.length === 0) return null

  return (
    <>
      <div className="sticky bottom-4 z-10 flex justify-center pointer-events-none -mt-30">
        <div className="pointer-events-auto flex flex-wrap items-center gap-3 px-5 py-3 rounded-2xl bg-fg text-canvas shadow-[0_8px_32px_rgba(0,0,0,0.25)] max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">{selectedKeys.length} selected</span>
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-fg-disabled hover:text-canvas transition-colors underline underline-offset-2"
            >
              Clear
            </button>
          </div>
          {bulkActions && bulkActions.length > 0 && (
            <>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <div className="flex flex-wrap items-center gap-2">
                {bulkActions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => action.onClick(selectedKeys, selectedOriginals)}
                    className={cn(
                      'px-3.5 py-1.5 text-sm rounded-xl font-medium transition-colors',
                      action.danger
                        ? 'bg-red-500 hover:bg-red-400 text-white'
                        : 'bg-canvas hover:bg-surface text-fg',
                    )}
                  >
                    {action.label as ReactNode}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-14" />
    </>
  )
}
