import type { ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '../button'

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
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
