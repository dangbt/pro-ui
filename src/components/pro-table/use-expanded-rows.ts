import { useState, useCallback } from 'react'

/**
 * Owns the set of expanded row keys and the toggle handler, extracted verbatim
 * from pro-table.tsx. Shared by the special expand column and the table body.
 */
export function useExpandedRows(): {
  expandedKeys: Set<string>
  toggleExpand: (key: string) => void
} {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set())
  const toggleExpand = useCallback((key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }, [])
  return { expandedKeys, toggleExpand }
}
