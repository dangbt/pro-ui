import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useRef } from 'react'
import { ProTable } from './pro-table'
import { Button } from '../button'
import type { ProColumnType, ProTableActions, QueryParams } from './types'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

const MOCK: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `u${i + 1}`,
  name: ['Alice Nguyen', 'Bob Tran', 'Carol Le', 'David Pham', 'Eva Hoang'][i % 5]! + ` #${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3]!,
  status: (['active', 'active', 'inactive'] as const)[i % 3]!,
  createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
}))

const columns: ProColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', sortable: true, pinnable: true },
  { title: 'Email', dataIndex: 'email' },
  {
    title: 'Role',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: {
      admin: { text: 'Admin', color: 'danger' },
      editor: { text: 'Editor', color: 'warning' },
      viewer: { text: 'Viewer', color: 'info' },
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      active: { text: 'Active', color: 'success' },
      inactive: { text: 'Inactive', color: 'default' },
    },
  },
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date', sortable: true, hideInSearch: true },
]

function mockRequest(p: QueryParams) {
  return new Promise<{ data: User[]; total: number; success: boolean }>((resolve) =>
    setTimeout(() => {
      let filtered = [...MOCK]
      if (p.name) filtered = filtered.filter((u) => u.name.toLowerCase().includes(String(p.name).toLowerCase()))
      if (p.status) filtered = filtered.filter((u) => u.status === p.status)
      if (p.role) filtered = filtered.filter((u) => u.role === p.role)
      const start = ((p.current as number) - 1) * (p.pageSize as number)
      resolve({ data: filtered.slice(start, start + (p.pageSize as number)), total: filtered.length, success: true })
    }, 300),
  )
}

const meta: Meta<typeof ProTable> = {
  title: 'Data/ProTable',
  component: ProTable,
}

export default meta

export const ServerMode: StoryObj = {
  render: () => (
    <ProTable<User>
      columns={columns}
      request={mockRequest}
      rowKey="id"
      headerTitle="Users (server mode)"
      toolBarRender={() => [<Button key="add" variant="primary" size="sm">+ Add</Button>]}
      rowSelection={{ onChange: (keys) => console.log('selected:', keys) }}
      bulkActions={[{ label: 'Delete', danger: true, onClick: (keys) => console.log('delete', keys) }]}
    />
  ),
}

export const ClientMode: StoryObj = {
  render: () => (
    <ProTable<User>
      columns={columns}
      dataSource={MOCK.slice(0, 20)}
      rowKey="id"
      headerTitle="Users (client mode)"
      search
    />
  ),
}

export const WithRefreshToken: StoryObj = {
  render: function Render() {
    const [token, setToken] = useState(0)
    return (
      <div className="space-y-2">
        <Button variant="primary" size="sm" onPress={() => setToken((t) => t + 1)}>
          Reload (token: {token})
        </Button>
        <ProTable<User>
          columns={columns}
          request={mockRequest}
          rowKey="id"
          refreshToken={token}
          headerTitle="Reload demo"
          search={false}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    )
  },
}

export const StickyHeader: StoryObj = {
  render: () => (
    <ProTable<User>
      columns={columns}
      dataSource={MOCK}
      rowKey="id"
      headerTitle="Sticky header"
      sticky={{ maxHeight: 400 }}
      search={false}
    />
  ),
}

export const ExpandedRows: StoryObj = {
  render: () => (
    <ProTable<User>
      columns={columns}
      dataSource={MOCK.slice(0, 10)}
      rowKey="id"
      headerTitle="Expandable rows"
      search={false}
      expandedRowRender={(r) => (
        <div className="px-4 py-2 text-xs text-fg-muted">
          <strong>Email:</strong> {r.email} · <strong>Role:</strong> {r.role}
        </div>
      )}
    />
  ),
}

export const WithActionRef: StoryObj = {
  render: function Render() {
    const actionRef = useRef<ProTableActions>(null)
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onPress={() => actionRef.current?.reload()}>
            reload()
          </Button>
          <Button variant="secondary" size="sm" onPress={() => actionRef.current?.reloadAndReset()}>
            reloadAndReset()
          </Button>
          <Button variant="ghost" size="sm" onPress={() => actionRef.current?.reset()}>
            reset()
          </Button>
          <Button variant="ghost" size="sm" onPress={() => actionRef.current?.clearSelected()}>
            clearSelected()
          </Button>
        </div>
        <ProTable<User>
          columns={columns}
          request={mockRequest}
          rowKey="id"
          actionRef={actionRef}
          headerTitle="actionRef demo"
          rowSelection={{ onChange: (keys) => console.log('selected:', keys) }}
          pagination={{ defaultPageSize: 5 }}
        />
      </div>
    )
  },
}

export const DefaultSort: StoryObj = {
  render: () => (
    <ProTable<User>
      columns={columns}
      request={mockRequest}
      rowKey="id"
      headerTitle="Default sort by name (asc)"
      defaultSort={{ field: 'name', order: 'asc' }}
      onSortChange={(sort) => console.log('sort:', sort)}
      search={false}
      pagination={{ defaultPageSize: 5 }}
    />
  ),
}

export const CustomEmptyText: StoryObj = {
  render: () => (
    <ProTable<User>
      columns={columns}
      dataSource={[]}
      rowKey="id"
      headerTitle="Empty table"
      search={false}
      emptyText="No users found. Try adjusting your filters."
    />
  ),
}
