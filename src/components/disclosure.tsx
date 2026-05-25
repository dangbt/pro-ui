import { createContext, useContext } from 'react'
import {
  Disclosure as RADisclosure,
  DisclosureGroup as RADisclosureGroup,
  DisclosurePanel,
  Button,
  Heading,
  type DisclosureProps as RADisclosureProps,
  type DisclosureGroupProps,
} from 'react-aria-components'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

const InAccordionCtx = createContext(false)

/* ── Disclosure (standalone collapsible) ──────────────── */

interface DisclosureProps extends Omit<RADisclosureProps, 'className' | 'children'> {
  title: string
  children: ReactNode
  className?: string
}

export function Disclosure({ title, children, className, ...props }: DisclosureProps) {
  const inAccordion = useContext(InAccordionCtx)
  return (
    <RADisclosure
      {...props}
      className={cn(
        'overflow-hidden',
        !inAccordion && 'border border-border rounded-[var(--base-radius)]',
        className,
      )}
    >
      {({ isExpanded }) => (
        <>
          <Heading level={3} className="m-0">
            <Button
              slot="trigger"
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 pressed:bg-gray-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
            >
              <span>{title}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </Button>
          </Heading>
          <DisclosurePanel style={{ display: 'block' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 200ms ease',
              }}
            >
              <div className="overflow-hidden">
                <div className="px-4 py-3 text-sm text-gray-600 border-t border-border">{children}</div>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </RADisclosure>
  )
}

/* ── Accordion (grouped disclosures) ─────────────────── */

interface AccordionProps extends Omit<DisclosureGroupProps, 'className'> {
  className?: string
  children: ReactNode
}

export function Accordion({ className, children, ...props }: AccordionProps) {
  return (
    <InAccordionCtx.Provider value={true}>
      <RADisclosureGroup
        {...props}
        className={cn(
          'border border-border rounded-[var(--base-radius)] overflow-hidden divide-y divide-border',
          className,
        )}
      >
        {children}
      </RADisclosureGroup>
    </InAccordionCtx.Provider>
  )
}
