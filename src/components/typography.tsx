import { cn } from '../lib/cn'
import type { ReactNode } from 'react'

/* ─── Title ─── */
interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5
  className?: string
  children?: ReactNode
}

const titleSize: Record<number, string> = {
  1: 'text-4xl font-bold',
  2: 'text-3xl font-bold',
  3: 'text-2xl font-semibold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
}

export function Title({ level = 1, className, children }: TitleProps) {
  const Tag = `h${level}` as const
  return <Tag className={cn('text-fg', titleSize[level], className)}>{children}</Tag>
}

/* ─── Text ─── */
interface TextProps {
  type?: 'secondary' | 'success' | 'warning' | 'danger'
  strong?: boolean
  italic?: boolean
  underline?: boolean
  delete?: boolean
  code?: boolean
  mark?: boolean
  className?: string
  children?: ReactNode
}

const typeCls: Record<string, string> = {
  secondary: 'text-fg-muted',
  success: 'text-success-600',
  warning: 'text-warning-600',
  danger: 'text-danger-600',
}

function buildTextClass(props: TextProps) {
  return cn(
    'text-fg',
    props.type && typeCls[props.type],
    props.strong && 'font-semibold',
    props.italic && 'italic',
    props.underline && 'underline',
    props.delete && 'line-through',
    props.code && 'px-1 py-0.5 rounded bg-surface-subtle font-mono text-[0.875em]',
    props.mark && 'bg-warning-100 px-0.5',
    props.className,
  )
}

export function Text(props: TextProps) {
  return <span className={buildTextClass(props)}>{props.children}</span>
}

/* ─── Paragraph ─── */
export function Paragraph(props: TextProps) {
  return <p className={cn(buildTextClass(props), 'mb-4')}>{props.children}</p>
}
