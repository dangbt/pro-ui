import {
  ListBox as RAListBox,
  ListBoxItem as RAListBoxItem,
  ListBoxSection as RAListBoxSection,
  Header,
  type ListBoxProps as RAListBoxProps,
  type Selection,
} from 'react-aria-components'
import { Check } from 'lucide-react'
import { cn } from '../lib/cn'
import { inputText, type Size } from '../lib/size'

export interface ListBoxOption {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ListBoxSection {
  id: string
  title: string
  items: ListBoxOption[]
}

interface ListBoxProps extends Omit<RAListBoxProps<ListBoxOption | ListBoxSection>, 'children' | 'className'> {
  items: (ListBoxOption | ListBoxSection)[]
  size?: Size
  className?: string
}

function isSection(item: ListBoxOption | ListBoxSection): item is ListBoxSection {
  return 'items' in item
}

function ListItem({ item, size }: { item: ListBoxOption; size: Size }) {
  return (
    <RAListBoxItem
      id={item.id}
      textValue={item.label}
      isDisabled={item.disabled}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 cursor-pointer outline-none rounded-[var(--base-radius)] mx-1',
        inputText[size],
        'text-gray-700',
        'hover:bg-primary-50 hover:text-primary',
        'focus:bg-primary-50 focus:text-primary',
        'selected:bg-primary-100 selected:text-primary',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      )}
    >
      {({ isSelected }) => (
        <>
          {item.icon && <span className="shrink-0 text-gray-400">{item.icon}</span>}
          <div className="flex-1 min-w-0">
            <div>{item.label}</div>
            {item.description && <div className="text-xs text-gray-400 truncate">{item.description}</div>}
          </div>
          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-primary" />}
        </>
      )}
    </RAListBoxItem>
  )
}

export function ListBox({ items, size = 'md', className, ...props }: ListBoxProps) {
  return (
    <RAListBox
      {...props}
      items={items}
      className={cn(
        'bg-white border border-gray-200 rounded-[var(--base-radius)] shadow-sm py-1 outline-none',
        'max-h-60 overflow-auto',
        className,
      )}
    >
      {(item) => isSection(item) ? (
        <RAListBoxSection id={item.id}>
          <Header className={cn('px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide', inputText[size])}>
            {item.title}
          </Header>
          {item.items.map(opt => <ListItem key={opt.id} item={opt} size={size} />)}
        </RAListBoxSection>
      ) : (
        <ListItem item={item} size={size} />
      )}
    </RAListBox>
  )
}

export type { Selection }
