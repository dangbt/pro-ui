import { useState, useMemo } from 'react'
import { cn } from '../lib/cn'

interface TransferItem {
  key: string
  label: string
  disabled?: boolean
}

interface TransferProps {
  dataSource: TransferItem[]
  targetKeys: string[]
  onChange: (targetKeys: string[], direction: 'left' | 'right', moveKeys: string[]) => void
  showSearch?: boolean
  titles?: [string, string]
  className?: string
}

export function Transfer({
  dataSource,
  targetKeys,
  onChange,
  showSearch,
  titles = ['Source', 'Target'],
  className,
}: TransferProps) {
  const [leftSelected, setLeftSelected] = useState<Set<string>>(new Set())
  const [rightSelected, setRightSelected] = useState<Set<string>>(new Set())
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')

  const targetSet = useMemo(() => new Set(targetKeys), [targetKeys])
  const leftItems = dataSource.filter(i => !targetSet.has(i.key))
  const rightItems = dataSource.filter(i => targetSet.has(i.key))

  const moveRight = () => {
    const keys = [...leftSelected].filter(k => !dataSource.find(i => i.key === k)?.disabled)
    onChange([...targetKeys, ...keys], 'right', keys)
    setLeftSelected(new Set())
  }

  const moveLeft = () => {
    const keys = [...rightSelected].filter(k => !dataSource.find(i => i.key === k)?.disabled)
    onChange(targetKeys.filter(k => !keys.includes(k)), 'left', keys)
    setRightSelected(new Set())
  }

  const toggleItem = (key: string, set: Set<string>, setFn: (s: Set<string>) => void) => {
    const next = new Set(set)
    next.has(key) ? next.delete(key) : next.add(key)
    setFn(next)
  }

  const Panel = ({
    items, selected, setSelected, search, setSearch, title,
  }: {
    items: TransferItem[]; selected: Set<string>; setSelected: (s: Set<string>) => void
    search: string; setSearch: (s: string) => void; title: string
  }) => {
    const filtered = items.filter(i => !search || i.label.toLowerCase().includes(search.toLowerCase()))
    const selectable = filtered.filter(i => !i.disabled)
    const allChecked = selectable.length > 0 && selectable.every(i => selected.has(i.key))

    return (
      <div className="flex-1 flex flex-col border border-border rounded-[var(--base-radius)] overflow-hidden min-w-0">
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-subtle border-b border-border">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={() => {
              if (allChecked) setSelected(new Set())
              else setSelected(new Set(selectable.map(i => i.key)))
            }}
            className="accent-[var(--color-primary)]"
          />
          <span className="text-sm font-medium text-fg-2 flex-1">{title}</span>
          <span className="text-xs text-fg-muted">{selected.size}/{items.length}</span>
        </div>
        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border-b border-border bg-surface outline-none text-fg-2 placeholder:text-fg-muted"
          />
        )}
        <ul className="flex-1 overflow-y-auto max-h-60 py-1">
          {filtered.map(item => (
            <li
              key={item.key}
              className={cn(
                'flex items-center gap-2 px-3 py-1 text-sm cursor-pointer hover:bg-surface-subtle',
                item.disabled && 'opacity-50 cursor-not-allowed',
              )}
              onClick={() => !item.disabled && toggleItem(item.key, selected, setSelected)}
            >
              <input type="checkbox" checked={selected.has(item.key)} disabled={item.disabled} readOnly className="accent-[var(--color-primary)]" />
              <span className="text-fg-2 truncate">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={cn('flex items-stretch gap-2', className)}>
      <Panel items={leftItems} selected={leftSelected} setSelected={setLeftSelected} search={leftSearch} setSearch={setLeftSearch} title={titles[0]} />
      <div className="flex flex-col items-center justify-center gap-1">
        <button type="button" disabled={leftSelected.size === 0} onClick={moveRight} className="px-2 py-1 text-xs border border-border rounded-[var(--base-radius)] bg-surface hover:bg-surface-subtle disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">&gt;</button>
        <button type="button" disabled={rightSelected.size === 0} onClick={moveLeft} className="px-2 py-1 text-xs border border-border rounded-[var(--base-radius)] bg-surface hover:bg-surface-subtle disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">&lt;</button>
      </div>
      <Panel items={rightItems} selected={rightSelected} setSelected={setRightSelected} search={rightSearch} setSearch={setRightSearch} title={titles[1]} />
    </div>
  )
}
