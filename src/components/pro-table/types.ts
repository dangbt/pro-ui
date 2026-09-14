import type { ReactNode } from 'react'
import type { Size } from '../../lib/size'

export type { Size }

export interface BulkActionDef<T extends object = object> {
  label: ReactNode
  onClick: (selectedKeys: string[], selectedRows: T[]) => void
  danger?: boolean
}

export type ValueType =
  | 'text'
  | 'number'
  | 'date'
  | 'dateRange'
  | 'select'
  | 'money'
  | 'custom'

export type ValueEnumItem =
  | string
  | { text: string; color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }

export type ValueEnum = Record<string, ValueEnumItem>

export interface ProColumnType<T> {
  title: string
  dataIndex?: keyof T & string
  key?: string
  valueType?: ValueType
  valueEnum?: ValueEnum
  /** hide from search form */
  hideInSearch?: boolean
  /** hide from table by default */
  hideInTable?: boolean
  /** prevent this column from being hidden via the column toggle */
  disableHiding?: boolean
  /** allow this column to be pinned left/right */
  pinnable?: boolean
  /** custom cell renderer — overrides valueType */
  render?: (value: unknown, record: T, index: number) => ReactNode
  sortable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
}

export interface QueryParams {
  current: number
  pageSize: number
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: unknown
}

export interface RequestResult<T> {
  data: T[]
  total: number
  success: boolean
}

export interface ProTableProps<T extends object> {
  /**
   * Column definitions for the table. ProTable internally memoizes the built column
   * structure by *value* (not reference identity), so passing an inline array literal
   * on every render is cheap and does **not** cause cell remounts.
   *
   * **Do not** wrap `columns` in `useMemo` or declare it at module scope if any column's
   * `render` function closes over component state or props. A frozen array means frozen
   * closures — cells will read stale values forever. This is the only remaining cause of
   * the "render doesn't see updated state" symptom.
   *
   * A module-scope or `useMemo(…, [])` array is safe only when no `render` reads anything
   * from the component's scope.
   */
  columns: ProColumnType<T>[]
  /**
   * Server-side data fetcher. Mutually exclusive with `dataSource`.
   * Called on every page/sort/search change, and whenever `params` changes.
   *
   * The function itself is held in a ref, so replacing it does **not** refetch — filters
   * that live outside the table must be passed through `params`, not captured in a closure.
   */
  request?: (params: QueryParams) => Promise<RequestResult<T>>
  /**
   * External filters owned by the page (search box, tabs, date range, URL query).
   * Merged into the argument passed to `request`, and a refetch is triggered whenever
   * their values change — resetting to the first page, since a new filter means a new
   * result set. Compared by value, so an inline object literal is safe.
   *
   * Ignored in client-side (`dataSource`) mode.
   */
  params?: Record<string, unknown>
  /**
   * Refetch the page the user is on whenever this value changes — unlike `params`, it does
   * not send them back to page 1, because the result set is the same one, just newer.
   *
   * This is the "reload what I'm looking at" input: bump it after a mutation, on a poll
   * tick, or from a cache-invalidation signal. Restricted to a primitive on purpose —
   * compared with `Object.is`, so an object literal would refetch on every render.
   *
   * Ignored in client-side (`dataSource`) mode.
   */
  refreshToken?: string | number
  /**
   * Client-side static data. Mutually exclusive with `request`.
   * Pagination, sorting, and filtering run in-browser.
   */
  dataSource?: T[]
  rowKey: keyof T | ((record: T) => string)
  headerTitle?: string
  toolBarRender?: () => ReactNode[]
  /** set false to hide search form entirely */
  search?: boolean
  /** override loading state (applies to request mode) */
  loading?: boolean
  pagination?: {
    defaultPageSize?: number
    /**
     * Page to open on, 1-based. Read once on mount — later changes are ignored, so the
     * table keeps owning its own paging afterwards and can't be yanked back mid-browse.
     *
     * Use it to restore a page persisted elsewhere (typically the URL) on reload.
     */
    defaultCurrent?: number
    pageSizeOptions?: number[]
    /**
     * Fires after the user changes page or page size — never on mount, so mirroring the
     * values straight back into `defaultCurrent`/`defaultPageSize` doesn't loop.
     * `page` is 1-based.
     */
    onChange?: (page: number, pageSize: number) => void
  }
  rowSelection?: {
    onChange?: (selectedKeys: string[], selectedRows: T[]) => void
  }
  bulkActions?: BulkActionDef<T>[]
  /**
   * Persist column visibility (show/hide toggles) to `localStorage`.
   * - `true` (default): persist under an auto-derived key based on the table's
   *   title and column keys.
   * - `false`: don't persist; visibility resets on every mount.
   * - `string`: persist under this explicit key (use it to share/scope state
   *   across remounts or to avoid collisions between similar tables).
   */
  persistColumnVisibility?: boolean | string
  /** render additional content below a row when expanded; row becomes clickable to toggle */
  expandedRowRender?: (record: T) => ReactNode
  /** add CSS classes to a row based on the record */
  rowClassName?: (record: T, index: number) => string
  /** row event handlers */
  onRow?: (record: T, index: number) => {
    onClick?: React.MouseEventHandler<HTMLTableRowElement>
    onDoubleClick?: React.MouseEventHandler<HTMLTableRowElement>
    onContextMenu?: React.MouseEventHandler<HTMLTableRowElement>
  }
  size?: Size
  /**
   * BCP-47 locale tag used to format `date` and `number`/`money` columns.
   * Defaults to `'vi-VN'`, preserving the output for existing consumers. Set it to
   * match your audience (e.g. `'en-US'`, `'de-DE'`) instead of writing a custom
   * `render` per column.
   */
  locale?: string
  /**
   * ISO-4217 currency code used by `valueType: 'money'`. Defaults to `'VND'`.
   * Pair it with `locale` to control both the currency and its formatting
   * (e.g. `locale="en-US" currency="USD"`).
   */
  currency?: string
  /**
   * Make the table header sticky relative to the nearest scroll container.
   * - `true`: sticky relative to the page scroll (top: 0). No horizontal scroll
   *   (uses `overflow-x: clip` so the header tracks the page).
   * - `{ offsetTop: number }`: sticky with a top offset (e.g. for a fixed navbar).
   * - `{ maxHeight }`: the table scrolls INSIDE a height-limited box → the header
   *   stays stuck (within the box) AND horizontal scroll is restored for wide
   *   tables. Accepts:
   *   - a number (px) or a CSS string (e.g. `'70vh'`, `'calc(100vh - 15rem)'`);
   *   - `'fit'`: auto-computes a height so the table **fits the screen** (fills from
   *     the table's position down to the bottom of the viewport), updating on
   *     resize/layout changes.
   * - `{ windowScroll: true, offsetTop?: number }`: the header sticks to **window
   *   scroll** AND horizontal scroll is still allowed. No fixed table height — the
   *   table auto-fits its content. Uses an IntersectionObserver to detect the sticky
   *   state; the header clone is `position: fixed` and syncs `scrollLeft` with the
   *   wrapper.
   */
  sticky?: boolean | { offsetTop?: number; maxHeight?: number | string; windowScroll?: boolean }
}
