import {
  TagGroup as RATagGroup,
  TagList,
  Tag,
  Label,
  type TagGroupProps,
  type Selection,
} from 'react-aria-components'
import { cn } from '../lib/cn'

export interface TagItem {
  id: string
  label: string
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface TagGroupProps_ extends Omit<TagGroupProps, 'className' | 'children'> {
  label?: string
  items: TagItem[]
  onRemove?: (keys: Selection) => void
  className?: string
}

const tagColorMap: Record<NonNullable<TagItem['color']>, string> = {
  default:  'bg-surface-subtle text-fg-2    border-border',
  primary:  'bg-primary-100 text-primary-700 border-primary-200',
  success:  'bg-success-100 text-success-700 border-success-200',
  warning:  'bg-warning-100 text-warning-700 border-warning-200',
  danger:   'bg-danger-100  text-danger-700  border-danger-200',
  info:     'bg-info-100    text-info-700    border-info-200',
}

export function TagGroup({ label, items, onRemove, className, ...props }: TagGroupProps_) {
  return (
    <RATagGroup
      {...props}
      onRemove={onRemove}
      className={cn('flex flex-col gap-1.5', className)}
    >
      {label && <Label className="text-xs font-medium text-fg-muted">{label}</Label>}
      <TagList className="flex flex-wrap gap-1.5" items={items}>
        {item => (
          <Tag
            id={item.id}
            textValue={item.label}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border',
              'rounded-[var(--base-radius)] outline-none cursor-default',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              'selected:ring-2 selected:ring-primary',
              tagColorMap[item.color ?? 'default'],
            )}
          >
            {({ allowsRemoving }) => (
              <>
                {item.label}
                {allowsRemoving && (
                  <button
                    slot="remove"
                    className="ml-0.5 -mr-0.5 hover:opacity-70 transition-opacity leading-none"
                    aria-label={`Remove ${item.label}`}
                  >
                    ×
                  </button>
                )}
              </>
            )}
          </Tag>
        )}
      </TagList>
    </RATagGroup>
  )
}
