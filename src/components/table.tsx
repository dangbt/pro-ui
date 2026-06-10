import { createContext, useContext } from 'react'
import { cn } from '../lib/cn'

type Size = 'sm' | 'md' | 'lg'

interface TableContextValue {
  bordered?: boolean
  striped?: boolean
  hoverable?: boolean
  size?: Size
}

const TableCtx = createContext<TableContextValue>({})

const cellPad: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  bordered?: boolean
  striped?: boolean
  hoverable?: boolean
  size?: Size
}

function TableRoot({ bordered, striped, hoverable, size = 'md', className, children, ...props }: TableProps) {
  return (
    <TableCtx.Provider value={{ bordered, striped, hoverable, size }}>
      <table className={cn('w-full text-fg-2 border-collapse', bordered && 'border border-border', className)} {...props}>
        {children}
      </table>
    </TableCtx.Provider>
  )
}

function Head({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-border', className)} {...props} />
}

function Body({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />
}

function Row({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  const { striped, hoverable, bordered } = useContext(TableCtx)
  return (
    <tr
      className={cn(
        bordered && 'border-b border-border',
        striped && 'even:bg-surface-subtle',
        hoverable && 'hover:bg-surface-subtle',
        className,
      )}
      {...props}
    />
  )
}

function HeaderCell({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  const { size = 'md', bordered } = useContext(TableCtx)
  return (
    <th
      className={cn(
        'text-left font-medium text-fg-muted bg-surface-subtle',
        cellPad[size],
        bordered && 'border border-border',
        className,
      )}
      {...props}
    />
  )
}

function Cell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  const { size = 'md', bordered } = useContext(TableCtx)
  return (
    <td className={cn(cellPad[size], bordered && 'border border-border', className)} {...props} />
  )
}

export const Table = Object.assign(TableRoot, { Head, Body, Row, HeaderCell, Cell })
