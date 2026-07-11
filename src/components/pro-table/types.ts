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
   * Called on every page/sort/search change.
   */
  request?: (params: QueryParams) => Promise<RequestResult<T>>
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
    pageSizeOptions?: number[]
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
   *   dính (trong khung) VÀ **có lại scroll ngang** cho bảng nhiều cột. Nhận số
   *   (px) hoặc chuỗi CSS (vd `'70vh'`, `'calc(100vh - 15rem)'`).
   */
  sticky?: boolean | { offsetTop?: number; maxHeight?: number | string }
}
