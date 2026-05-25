import {
  Tree as RATree,
  TreeItem as RATreeItem,
  TreeItemContent as RATreeItemContent,
  Button,
  Checkbox,
  type TreeProps as RATreeProps,
  type Key,
  type Selection,
} from 'react-aria-components'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'

export interface TreeNode {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
}

interface TreeProps extends Omit<RATreeProps<TreeNode>, 'children' | 'className'> {
  items: TreeNode[]
  className?: string
}

function renderNode(item: TreeNode): React.ReactNode {
  return (
    <RATreeItem
      key={item.id}
      id={item.id}
      textValue={item.label}
      className="group outline-none"
    >
      <RATreeItemContent>
        {({ level, hasChildItems, isExpanded, isSelected, selectionMode }) => (
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-1.5 rounded-[var(--base-radius)] text-sm text-gray-700 cursor-pointer',
              'hover:bg-gray-100',
              'group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-inset',
              isSelected && 'bg-primary-50 text-primary',
            )}
            style={{ paddingLeft: `${(level - 1) * 1.25 + 0.5}rem` }}
          >
            {selectionMode !== 'none' && (
              <Checkbox slot="selection" className="group/cb flex items-center shrink-0 mr-1">
                <div className={cn(
                  'w-3.5 h-3.5 border-2 rounded flex items-center justify-center transition-colors shrink-0',
                  'border-gray-300',
                  'group-data-[selected]/cb:bg-primary group-data-[selected]/cb:border-primary',
                  'group-data-[indeterminate]/cb:bg-primary group-data-[indeterminate]/cb:border-primary',
                )}>
                  {isSelected && <svg viewBox="0 0 10 8" className="w-2 h-1.5 fill-white stroke-white"><path d="M1 4l3 3 5-6" strokeWidth="1.5" fill="none" /></svg>}
                </div>
              </Checkbox>
            )}
            <Button
              slot="chevron"
              className={cn(
                'w-4 h-4 flex items-center justify-center shrink-0 rounded transition-transform outline-none',
                !hasChildItems && 'invisible',
                isExpanded && 'rotate-90',
              )}
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </Button>
            {item.icon && <span className="shrink-0 text-gray-400 w-4 h-4 flex items-center justify-center">{item.icon}</span>}
            <span className="truncate">{item.label}</span>
          </div>
        )}
      </RATreeItemContent>
      {item.children?.map(child => renderNode(child))}
    </RATreeItem>
  )
}

export function Tree({ items, className, ...props }: TreeProps) {
  return (
    <RATree
      {...props}
      className={cn('outline-none p-1', className)}
    >
      {items.map(item => renderNode(item))}
    </RATree>
  )
}

export type { Key, Selection }
