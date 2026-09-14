import {
  NavigationTree as RANavigationTree,
  NavigationTreeItem as RANavigationTreeItem,
  NavigationTreeItemContent as RANavigationTreeItemContent,
  NavigationTreeSection as RANavigationTreeSection,
  NavigationTreeHeader as RANavigationTreeHeader,
  Button,
  type NavigationTreeProps as RANavigationTreeProps,
  type Key,
} from 'react-aria-components'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'

export interface NavigationTreeNode {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  children?: NavigationTreeNode[]
  isDisabled?: boolean
}

export interface NavigationTreeSectionDef {
  title: string
  items: NavigationTreeNode[]
}

interface NavigationTreeProps
  extends Omit<RANavigationTreeProps<NavigationTreeNode>, 'children' | 'className' | 'items'> {
  /** Flat nodes and/or sections to render. */
  items: (NavigationTreeNode | NavigationTreeSectionDef)[]
  /** Accessible label for the navigation region. */
  'aria-label': string
  className?: string
}

function isSection(
  entry: NavigationTreeNode | NavigationTreeSectionDef,
): entry is NavigationTreeSectionDef {
  return 'title' in entry && 'items' in entry
}

function renderNode(node: NavigationTreeNode): React.ReactNode {
  return (
    <RANavigationTreeItem
      key={node.id}
      id={node.id}
      href={node.href}
      textValue={node.label}
      isDisabled={node.isDisabled}
      className="group/item outline-none"
    >
      <RANavigationTreeItemContent>
        {({ level, hasChildItems, isExpanded, isCurrent, isCurrentAncestor, isDisabled }) => {
          const rowClass = cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded-[var(--base-radius)] text-sm transition-colors',
            'text-fg-muted hover:bg-surface-subtle hover:text-fg-2',
            'group-focus-visible/item:ring-2 group-focus-visible/item:ring-primary group-focus-visible/item:ring-inset',
            node.href && 'cursor-pointer',
            isCurrentAncestor && 'text-fg-2 font-medium',
            isCurrent && 'bg-primary-50 text-primary font-medium hover:bg-primary-50 hover:text-primary',
            isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          )
          const chevron = (
            <Button
              slot="chevron"
              className={cn(
                'w-4 h-4 flex items-center justify-center shrink-0 rounded transition-transform outline-none',
                !hasChildItems && 'invisible',
                isExpanded && 'rotate-90',
              )}
            >
              <ChevronRight className="w-3 h-3 text-fg-disabled" />
            </Button>
          )
          const label = (
            <>
              {node.icon && (
                <span className="shrink-0 w-4 h-4 flex items-center justify-center text-fg-disabled">
                  {node.icon}
                </span>
              )}
              <span className="truncate">{node.label}</span>
            </>
          )

          // The chevron is a sibling of the link/label (never nested inside the
          // anchor) so the link keeps a clean accessible name and stays valid HTML.
          // Nodes with an href render an accessible link carrying aria-current.
          return (
            <div className={rowClass} style={{ paddingLeft: `${(level - 1) * 1 + 0.5}rem` }}>
              {chevron}
              {node.href ? (
                <a
                  href={node.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className="flex items-center gap-1.5 min-w-0 flex-1 outline-none text-inherit no-underline"
                >
                  {label}
                </a>
              ) : (
                <span className="flex items-center gap-1.5 min-w-0 flex-1">{label}</span>
              )}
            </div>
          )
        }}
      </RANavigationTreeItemContent>
      {node.children?.map(child => renderNode(child))}
    </RANavigationTreeItem>
  )
}

export function NavigationTree({ items, className, ...props }: NavigationTreeProps) {
  return (
    <RANavigationTree
      {...props}
      className={cn('outline-none p-1', className)}
    >
      {items.map(entry =>
        isSection(entry) ? (
          <RANavigationTreeSection key={entry.title}>
            <RANavigationTreeHeader className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-fg-disabled">
              {entry.title}
            </RANavigationTreeHeader>
            {entry.items.map(node => renderNode(node))}
          </RANavigationTreeSection>
        ) : (
          renderNode(entry)
        ),
      )}
    </RANavigationTree>
  )
}

export type { Key }
