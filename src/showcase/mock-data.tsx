import type { ProColumnType, QueryParams } from '../components'

export type User = {
  id: string; name: string; email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  revenue: number; createdAt: string
}

export const MOCK: User[] = Array.from({ length: 87 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ['Alice Nguyen','Bob Tran','Carol Le','David Pham','Eva Hoang','Frank Do','Grace Bui','Hank Vu'][i % 8]! + ` #${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: (['admin','editor','viewer'] as const)[i % 3]!,
  status: (['active','active','active','inactive','pending'] as const)[i % 5]!,
  revenue: Math.floor(Math.random() * 50_000_000) + 1_000_000,
  createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}))

export function mockRequest(p: QueryParams) {
  return new Promise<{ data: User[]; total: number; success: boolean }>(ok => setTimeout(() => {
    let f = [...MOCK]
    if (p.name)   f = f.filter(u => u.name.toLowerCase().includes(String(p.name).toLowerCase()))
    if (p.status) f = f.filter(u => u.status === p.status)
    if (p.role)   f = f.filter(u => u.role === p.role)
    const total = f.length
    const s = ((p.current as number) - 1) * (p.pageSize as number)
    ok({ data: f.slice(s, s + (p.pageSize as number)), total, success: true })
  }, 350))
}

export const ROLE_ENUM   = { admin: { text: 'Admin', color: 'danger' as const }, editor: { text: 'Editor', color: 'warning' as const }, viewer: { text: 'Viewer', color: 'info' as const } }
export const STATUS_ENUM = { active: { text: 'Active', color: 'success' as const }, inactive: { text: 'Inactive', color: 'default' as const }, pending: { text: 'Pending', color: 'warning' as const } }

export const TABLE_COLS: ProColumnType<User>[] = [
  { title: 'Name',    dataIndex: 'name',      sortable: true, width: 200, disableHiding: true, pinnable: true },
  { title: 'Email',   dataIndex: 'email',     width: 220 },
  { title: 'Role',    dataIndex: 'role',      valueType: 'select', valueEnum: ROLE_ENUM },
  { title: 'Status',  dataIndex: 'status',    valueType: 'select', valueEnum: STATUS_ENUM },
  { title: 'Revenue', dataIndex: 'revenue',   valueType: 'money', sortable: true, align: 'right', hideInSearch: true },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date',  sortable: true, hideInSearch: true },
  {
    title: 'Actions', key: 'actions', hideInSearch: true, align: 'center', width: 120, pinnable: true,
    render: (_v, r) => (
      <div className="flex items-center justify-center gap-1">
        <button onClick={() => alert(`Edit ${r.name}`)} className="text-primary text-xs font-medium px-2 py-1 hover:bg-primary-50 rounded-[var(--base-radius)] transition-colors">Edit</button>
        <button onClick={() => alert(`Delete ${r.name}`)} className="text-danger text-xs font-medium px-2 py-1 hover:bg-danger-50 rounded-[var(--base-radius)] transition-colors">Delete</button>
      </div>
    ),
  },
]

export const THEME_PREVIEW_COLS: ProColumnType<User>[] = [
  { title: 'Name',    dataIndex: 'name',      sortable: true, width: 180, disableHiding: true, pinnable: true },
  { title: 'Role',    dataIndex: 'role',      valueType: 'select', valueEnum: ROLE_ENUM,   sortable: true, pinnable: true },
  { title: 'Status',  dataIndex: 'status',    valueType: 'select', valueEnum: STATUS_ENUM, sortable: true, pinnable: true },
  { title: 'Revenue', dataIndex: 'revenue',   valueType: 'money',  sortable: true, align: 'right', hideInSearch: true, pinnable: true },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date',   sortable: true, hideInSearch: true, pinnable: true },
  {
    title: 'Actions', key: 'actions', hideInSearch: true, align: 'center', width: 100, pinnable: true,
    render: () => (
      <div className="flex items-center justify-center gap-1">
        <button className="text-primary text-xs font-medium px-2 py-1 hover:bg-primary-50 rounded-[var(--base-radius)] transition-colors">Edit</button>
        <button className="text-danger text-xs font-medium px-2 py-1 hover:bg-danger-50 rounded-[var(--base-radius)] transition-colors">Del</button>
      </div>
    ),
  },
]

export const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Bolivia','Brazil','Cambodia','Canada','Chile','China','Colombia',
  'Croatia','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia','Finland',
  'France','Germany','Ghana','Greece','Guatemala','Hungary','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kenya','Kuwait',
  'Malaysia','Mexico','Morocco','Myanmar','Netherlands','New Zealand','Nigeria',
  'Norway','Pakistan','Panama','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Saudi Arabia','Senegal','Singapore','South Africa','South Korea',
  'Spain','Sri Lanka','Sweden','Switzerland','Thailand','Turkey','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Venezuela',
  'Vietnam','Zimbabwe',
].map((label, i) => ({ value: `c${i}`, label }))

export const USERS_ASYNC = Array.from({ length: 120 }, (_, i) => ({
  value: `u${i}`,
  label: ['Alice','Bob','Carol','David','Eva','Frank','Grace','Hank','Iris','Jack'][i % 10]! + ` ${['Nguyen','Tran','Le','Pham','Hoang','Do','Bui','Vu','Dang','Cao'][i % 10]!} #${i + 1}`,
}))

export function fakeSearch<T extends { value: string; label: string }>(
  list: T[],
  { search, page, pageSize }: { search: string; page: number; pageSize: number },
  delay = 400,
) {
  return new Promise<{ options: T[]; hasMore: boolean }>(resolve =>
    setTimeout(() => {
      const filtered = search
        ? list.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : list
      const start = (page - 1) * pageSize
      resolve({ options: filtered.slice(start, start + pageSize), hasMore: start + pageSize < filtered.length })
    }, delay),
  )
}
