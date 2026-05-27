import { useState } from 'react'
import { z } from 'zod'
import {
  Button, Alert, ConfirmModal,
  ProTable, ProForm, ProFormRow,
  ProFormInput, ProFormTextarea, ProFormNumberField,
  ProFormSelect, ProFormCheckbox, ProFormSwitch, ProFormDatePicker,
} from '../../components'
import type { BulkActionDef } from '../../components'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'
import { TABLE_COLS, mockRequest, MOCK } from '../mock-data'
import type { User } from '../mock-data'

export function ProTableSection() {
  const size = useShowcaseSize()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const bulkActions: BulkActionDef<User>[] = [
    {
      label: 'Export CSV',
      onClick: (keys) => showToast(`Exported ${keys.length} users as CSV`),
    },
    {
      label: 'Change status',
      onClick: (keys) => showToast(`Updated status for ${keys.length} users`),
    },
    {
      label: 'Delete selected',
      danger: true,
      onClick: () => setConfirmDelete(true),
    },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="ProTable"
        description="Data table with auto search form, pagination, sorting, column visibility/pinning, row selection, and bulk actions. Supports both server-side (request) and client-side (dataSource) modes."
      />

      {toast && <Alert variant="success" closable>{toast}</Alert>}

      {/* Server-side mode */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Server-side mode — <code className="font-mono normal-case">request</code> prop</p>
        <div className="text-xs text-fg-disabled space-y-0.5 mb-2">
          <p>· <strong>Sort</strong> — click column headers · <strong>Pin</strong> — hover header → pin left/right</p>
          <p>· <strong>Visibility</strong> — toolbar columns icon · <strong>Select rows</strong> → sticky bulk action bar</p>
        </div>
        <ProTable<User>
          columns={TABLE_COLS}
          request={mockRequest}
          rowKey="id"
          headerTitle="User Management"
          size={size}
          toolBarRender={() => [
            <Button key="add" variant="primary" size={size}>+ Add User</Button>,
            <Button key="exp" variant="secondary" size={size}>Export</Button>,
          ]}
          rowSelection={{ onChange: (keys) => setSelectedKeys(keys) }}
          bulkActions={bulkActions}
          expandedRowRender={(r) => (
            <div className="px-6 py-4 text-xs text-fg-muted space-y-1 bg-surface-subtle">
              <p><strong>ID:</strong> {r.id}</p>
              <p><strong>Email:</strong> {r.email}</p>
              <p><strong>Revenue:</strong> ₫{r.revenue.toLocaleString()}</p>
            </div>
          )}
        />
      </div>

      {/* Client-side mode */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Client-side mode — <code className="font-mono normal-case">dataSource</code> prop</p>
        <div className="text-xs text-fg-disabled mb-2">
          <p>· Pagination, sort, and search all run in-browser — no network requests</p>
          <p>· <code className="font-mono">rowClassName</code> highlights admin rows · <code className="font-mono">onRow.onDoubleClick</code> opens an alert</p>
        </div>
        <ProTable<User>
          columns={TABLE_COLS.filter(c => c.dataIndex !== 'email')}
          dataSource={MOCK.slice(0, 30)}
          rowKey="id"
          headerTitle="Static Data (client-side)"
          size={size}
          search
          rowClassName={(r) => r.role === 'admin' ? 'bg-primary-50/40' : ''}
          onRow={(r) => ({
            onDoubleClick: () => alert(`Double-clicked: ${r.name}`),
          })}
        />
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete selected users"
        description={`Are you sure you want to delete ${selectedKeys.length} selected user${selectedKeys.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Yes, delete"
        danger
        onConfirm={() => {
          showToast(`Deleted ${selectedKeys.length} users`)
          setConfirmDelete(false)
        }}
      />
    </div>
  )
}

const profileSchema = z.object({
  name:      z.string().min(2, 'At least 2 characters'),
  email:     z.string().email('Invalid email'),
  role:      z.enum(['admin', 'editor', 'viewer']).optional(),
  salary:    z.number().min(0).optional(),
  bio:       z.string().max(200, 'Max 200 characters').optional(),
  startDate: z.string().optional(),
  notify:    z.boolean().default(false),
  active:    z.boolean().default(true),
})

const roleOptions = [
  { value: 'admin',  label: 'Admin'  },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

export function ProFormSection() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const size = useShowcaseSize()

  return (
    <div className="space-y-6">
      <SectionHeader title="ProForm" description="Schema-driven forms with React Hook Form + Zod. Validation, error display, and all field types wired automatically." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Demo label="Vertical layout (default)" center={false}>
          <ProForm
            schema={profileSchema}
            defaultValues={{ role: 'viewer', notify: false, active: true }}
            onFinish={vals => setResult(vals)}
            submitText="Save profile"
            size={size}
            showReset
          >
            <ProFormRow>
              <ProFormInput name="name"  label="Full name"  placeholder="Alice Nguyen" required />
              <ProFormInput name="email" label="Email"      placeholder="alice@example.com" type="email" required />
            </ProFormRow>
            <ProFormRow>
              <ProFormSelect       name="role"   label="Role"   options={roleOptions} required />
              <ProFormNumberField  name="salary" label="Salary (₫)" min={0} formatOptions={{ style: 'decimal' }} />
            </ProFormRow>
            <ProFormDatePicker name="startDate" label="Start date" />
            <ProFormTextarea   name="bio"       label="Bio" placeholder="A short bio…" rows={3} />
            <ProFormRow>
              <ProFormSwitch   name="active"  label="Active account" />
              <ProFormCheckbox name="notify"  label="Email notifications" />
            </ProFormRow>
          </ProForm>
        </Demo>

        <Demo label="Horizontal layout" center={false}>
          <ProForm
            schema={z.object({
              username: z.string().min(3, 'Min 3 chars'),
              password: z.string().min(8, 'Min 8 chars'),
              confirm:  z.string(),
            }).refine(d => d.password === d.confirm, {
              message: 'Passwords do not match',
              path: ['confirm'],
            })}
            onFinish={vals => setResult(vals)}
            layout="horizontal"
            size={size}
            submitText="Sign up"
          >
            <ProFormInput name="username" label="Username" placeholder="alice" required />
            <ProFormInput name="password" label="Password" type="password" placeholder="••••••••" required />
            <ProFormInput name="confirm"  label="Confirm"  type="password" placeholder="••••••••" required />
          </ProForm>
        </Demo>

      </div>

      <Demo label="ProForm — size=sm" center={false}>
        <ProForm
          schema={z.object({ name: z.string().min(2), role: z.enum(['admin','editor','viewer']).optional() })}
          defaultValues={{ role: 'viewer' }}
          onFinish={() => {}}
          size="sm"
          submitText="Submit"
        >
          <ProFormRow>
            <ProFormInput name="name" label="Full name" placeholder="Alice Nguyen" required />
            <ProFormSelect name="role" label="Role" options={roleOptions} />
          </ProFormRow>
        </ProForm>
      </Demo>

      {result && (
        <div className="bg-gray-900 rounded-[var(--base-radius)] p-4 text-sm font-mono text-green-400 overflow-auto">
          <div className="text-fg-disabled text-xs mb-2">onFinish output:</div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

