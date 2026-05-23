import { useState } from 'react'
import { Button } from '../button'
import { Input } from '../input'
import { Select } from '../select'
import type { ProColumnType } from './types'

interface SearchFormProps<T> {
  columns: ProColumnType<T>[]
  onSearch: (params: Record<string, unknown>) => void
  onReset: () => void
}

export function SearchForm<T>({ columns, onSearch, onReset }: SearchFormProps<T>) {
  const [values, setValues] = useState<Record<string, unknown>>({})

  const searchable = columns.filter(
    col => !col.hideInSearch && (col.dataIndex || col.key),
  )
  if (searchable.length === 0) return null

  const set = (key: string, value: unknown) =>
    setValues(prev => ({ ...prev, [key]: value }))

  const handleSearch = () => {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined && v !== null),
    )
    onSearch(cleaned)
  }

  const handleReset = () => {
    setValues({})
    onReset()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[var(--base-radius)] p-4 mb-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {searchable.map(col => {
          const key = (col.key ?? col.dataIndex) as string
          const vt = col.valueType ?? 'text'

          if (vt === 'select' && col.valueEnum) {
            const options = Object.entries(col.valueEnum).map(([value, item]) => ({
              value,
              label: typeof item === 'string' ? item : item.text,
            }))
            return (
              <Select
                key={key}
                label={col.title}
                placeholder={`All ${col.title}`}
                options={options}
                selectedKey={(values[key] as string) ?? null}
                onSelectionChange={v => set(key, v)}
              />
            )
          }

          if (vt === 'dateRange') {
            return (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-600">{col.title}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={(values[`${key}_from`] as string) ?? ''}
                    onChange={e => set(`${key}_from`, e.target.value)}
                    className="flex-1 h-9 px-2 text-sm border border-gray-300 rounded-[var(--base-radius)] focus:outline-2 focus:outline-primary"
                  />
                  <span className="text-gray-400 text-xs">–</span>
                  <input
                    type="date"
                    value={(values[`${key}_to`] as string) ?? ''}
                    onChange={e => set(`${key}_to`, e.target.value)}
                    className="flex-1 h-9 px-2 text-sm border border-gray-300 rounded-[var(--base-radius)] focus:outline-2 focus:outline-primary"
                  />
                </div>
              </div>
            )
          }

          if (vt === 'number' || vt === 'money') {
            return (
              <Input
                key={key}
                label={col.title}
                inputMode="numeric"
                placeholder="0"
                value={(values[key] as string) ?? ''}
                onChange={v => set(key, v)}
              />
            )
          }

          if (vt === 'date') {
            return (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-600">{col.title}</span>
                <input
                  type="date"
                  value={(values[key] as string) ?? ''}
                  onChange={e => set(key, e.target.value)}
                  className="h-9 px-3 text-sm border border-gray-300 rounded-[var(--base-radius)] focus:outline-2 focus:outline-primary w-full"
                />
              </div>
            )
          }

          return (
            <Input
              key={key}
              label={col.title}
              placeholder={`Search ${col.title}`}
              value={(values[key] as string) ?? ''}
              onChange={v => set(key, v)}
            />
          )
        })}
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
        <Button variant="ghost" size="sm" onPress={handleReset}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onPress={handleSearch}>
          Search
        </Button>
      </div>
    </div>
  )
}
