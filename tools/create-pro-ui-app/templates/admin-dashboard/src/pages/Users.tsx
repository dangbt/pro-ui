import { ProTable, Button, toast } from '@dangbt/pro-ui'
import type { ProColumnType } from '@dangbt/pro-ui'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive'
  createdAt: string
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: '2026-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user', status: 'active', createdAt: '2026-02-20' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer', status: 'inactive', createdAt: '2026-03-10' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'user', status: 'active', createdAt: '2026-04-05' },
]

const columns: ProColumnType<User>[] = [
  { title: 'Name', dataIndex: 'name', sortable: true },
  { title: 'Email', dataIndex: 'email' },
  {
    title: 'Role',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: {
      admin: { text: 'Admin', color: 'primary' },
      user: { text: 'User', color: 'default' },
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
  { title: 'Created', dataIndex: 'createdAt', valueType: 'date' },
  {
    title: 'Actions',
    key: 'actions',
    hideInSearch: true,
    disableHiding: true,
    render: (_, record) => (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" onPress={() => toast.info(`Edit ${record.name}`)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onPress={() => toast.error(`Deleted ${record.name}`)}>
          Delete
        </Button>
      </div>
    ),
  },
]

export function UsersPage() {
  return (
    <ProTable<User>
      headerTitle="Users"
      columns={columns}
      rowKey="id"
      dataSource={MOCK_USERS}
      toolBarRender={() => [
        <Button key="add" variant="solid" onPress={() => toast.info('Add user modal coming soon')}>
          + Add User
        </Button>,
      ]}
      rowSelection={{
        onChange: (keys) => console.log('selected:', keys),
      }}
      bulkActions={[
        {
          label: 'Deactivate selected',
          onClick: (keys) => toast.warning(`Deactivated ${keys.length} users`),
        },
        {
          label: 'Delete selected',
          danger: true,
          onClick: (keys) => toast.error(`Deleted ${keys.length} users`),
        },
      ]}
    />
  )
}
