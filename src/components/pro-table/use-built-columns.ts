import { useMemo, useRef } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { buildColumns } from './build-columns'
import type { ProColumnType } from './types'

function colKey<T>(c: ProColumnType<T>): string {
  return (c.key ?? c.dataIndex ?? c.title) as string
}

/**
 * Load-bearing memoization machinery, carried over verbatim from pro-table.tsx.
 *
 * Returns:
 *  - `builtColumns`: TanStack column defs, memoized on structure (not identity)
 *    so render closures getting a new identity does NOT rebuild Column instances
 *    (which would remount every cell via flexRender).
 *  - `columnsSignature`: the structural signature used as the memo key; other
 *    hooks (visibility persistence) key on the same value.
 *
 * See types.ts for the full rationale. Do not "simplify" the deps arrays or drop
 * the eslint-disable comments — that machinery is intentional.
 */
export function useBuiltColumns<T>(columnDefs: ProColumnType<T>[]): {
  builtColumns: ColumnDef<T>[]
  columnsSignature: string
} {
  // ─── Live column ref ───
  // Updated synchronously in render (not in useEffect) because cell functions
  // execute during the same render pass — an effect would run too late.
  const liveColumns = useMemo(
    () => new Map(columnDefs.map(c => [colKey(c), c])),
    [columnDefs],
  )
  const liveColumnsRef = useRef(liveColumns)
  liveColumnsRef.current = liveColumns

  // ─── Column structure signature ───
  // Memo builtColumns only when structural fields change, not when render
  // closures get a new identity. This prevents TanStack from rebuilding Column
  // instances (which would remount every cell via flexRender).
  const columnsSignature = useMemo(
    () =>
      JSON.stringify(
        columnDefs.map(c => ({
          key: colKey(c),
          title: c.title,
          dataIndex: c.dataIndex,
          valueType: c.valueType,
          valueEnum: c.valueEnum,
          sortable: c.sortable,
          disableHiding: c.disableHiding,
          pinnable: c.pinnable,
          width: c.width,
          align: c.align,
          hideInTable: c.hideInTable,
          hasRender: !!c.render,
        })),
      ),
    [columnDefs],
  )

  const builtColumns = useMemo(
    () => buildColumns(columnDefs, liveColumnsRef),
    // Keyed on structure, not identity — render closures are read via liveRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnsSignature],
  )

  return { builtColumns, columnsSignature }
}
