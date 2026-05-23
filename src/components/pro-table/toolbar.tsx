import type { ReactNode } from 'react'
import { Button } from '../button'

const RefreshIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 8a5.5 5.5 0 1 1-1-3.18" />
    <path d="M13.5 2v3h-3" />
  </svg>
)

interface ToolbarProps {
  title?: string
  actions?: ReactNode[]
  onRefresh?: () => void
}

export function Toolbar({ title, actions, onRefresh }: ToolbarProps) {
  if (!title && !actions?.length && !onRefresh) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-800">{title ?? ''}</h3>
      <div className="flex items-center gap-2">
        {actions?.map((action, i) => (
          <span key={i}>{action}</span>
        ))}
        {onRefresh && (
          <Button variant="ghost" size="sm" onPress={onRefresh} aria-label="Refresh">
            <RefreshIcon />
          </Button>
        )}
      </div>
    </div>
  )
}
