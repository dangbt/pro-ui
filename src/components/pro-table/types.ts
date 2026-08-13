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
   * Make the table header sticky relative to the nearest scroll container.
   * - `true`: sticky relative to the page scroll (top: 0). Không có scroll ngang
   *   (dùng `overflow-x: clip` để header bám theo trang).
   * - `{ offsetTop: number }`: sticky với offset trên (ví dụ cho fixed navbar).
   * - `{ maxHeight }`: bảng cuộn TRONG khung có chiều cao giới hạn → header vẫn
   *   dính (trong khung) VÀ **có lại scroll ngang** cho bảng nhiều cột. Nhận:
   *   - số (px) hoặc chuỗi CSS (vd `'70vh'`, `'calc(100vh - 15rem)'`);
   *   - `'fit'`: tự tính chiều cao để bảng **fit màn hình** (fill từ vị trí bảng
   *     tới đáy viewport), tự cập nhật khi resize/layout đổi.
   * - `{ windowScroll: true, offsetTop?: number }`: header dính theo **window scroll**
   *   VÀ vẫn cho phép **scroll ngang**. Không set height cố định cho table — table
   *   auto fit nội dung. Dùng IntersectionObserver để detect sticky state, header
   *   clone được `position: fixed` và sync `scrollLeft` với wrapper.
   */
  sticky?: boolean | { offsetTop?: number; maxHeight?: number | string; windowScroll?: boolean }
}
