import type { ReactNode } from 'react'

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
  /** hide from table */
  hideInTable?: boolean
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
  request: (params: QueryParams) => Promise<RequestResult<T>>
  rowKey: keyof T | ((record: T) => string)
  headerTitle?: string
  toolBarRender?: () => ReactNode[]
  /** set false to hide search form entirely */
  search?: boolean
  pagination?: {
    defaultPageSize?: number
    pageSizeOptions?: number[]
  }
  rowSelection?: {
    onChange?: (selectedKeys: string[], selectedRows: T[]) => void
  }
  bulkActions?: BulkActionDef<T>[]
}
