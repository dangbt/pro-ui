import {
  Tabs as RATabs,
  TabList,
  Tab,
  TabPanel,
  type TabsProps,
} from 'react-aria-components'
import { cn } from '../lib/cn'

export interface TabItem {
  id: string
  label: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps_ extends Omit<TabsProps, 'className' | 'children'> {
  items: TabItem[]
  className?: string
}

export function Tabs({ items, className, ...props }: TabsProps_) {
  return (
    <RATabs {...props} className={cn('flex flex-col', className)}>
      <TabList
        aria-label="tabs"
        className="flex border-b border-border gap-0"
      >
        {items.map(tab => (
          <Tab
            key={tab.id}
            id={tab.id}
            isDisabled={tab.disabled}
            className={cn(
              'px-4 py-2.5 text-sm font-medium text-fg-muted border-b-2 border-transparent -mb-px',
              'cursor-pointer outline-none transition-colors whitespace-nowrap',
              'hover:text-fg-2',
              'selected:text-primary selected:border-primary',
              'disabled:text-fg-disabled disabled:cursor-not-allowed',
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
            )}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {items.map(tab => (
        <TabPanel key={tab.id} id={tab.id} className="pt-4 outline-none">
          {tab.content}
        </TabPanel>
      ))}
    </RATabs>
  )
}
