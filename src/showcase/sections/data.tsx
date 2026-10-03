import { useState, useRef, useEffect } from 'react'
import { z } from 'zod'
import {
  Button, Alert, ConfirmModal,
  ProTable, ProForm, ProFormRow,
  ProFormInput, ProFormTextarea, ProFormNumberField,
  ProFormSelect, ProFormCheckbox, ProFormSwitch, ProFormDatePicker,
  ProFormDateRangePicker, ProFormCheckboxGroup, ProFormSlider,
  ProFormTokenField, ProFormList, ProFormDependency,
} from '../../components'
import type { BulkActionDef, ProFormRef } from '../../components'
import { Demo, SectionHeader } from '../shared'
import { useShowcaseSize } from '../context'
import { TABLE_COLS, mockRequest, MOCK } from '../mock-data'
import type { User } from '../mock-data'

export function ProTableSection() {
  const size = useShowcaseSize()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [externalRole, setExternalRole] = useState('')

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

      {/* External filters */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">External filters — <code className="font-mono normal-case">params</code> prop</p>
        <div className="text-xs text-fg-disabled space-y-0.5 mb-2">
          <p>· Filters owned by the page (search box, tabs, URL query) go through <code className="font-mono">params</code> — they are merged into the <code className="font-mono">request</code> argument and refetch on change</p>
          <p>· A closure over page state would <strong>not</strong> refetch: <code className="font-mono">request</code> is held in a ref</p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input
            value={externalRole}
            onChange={(e) => setExternalRole(e.target.value)}
            list="protable-roles"
            placeholder="Filter by role — admin / editor / viewer"
            className="h-9 w-72 rounded-md border border-border bg-surface px-3 text-sm text-fg placeholder:text-fg-disabled"
          />
          <datalist id="protable-roles">
            <option value="admin" />
            <option value="editor" />
            <option value="viewer" />
          </datalist>
          {externalRole && (
            <Button variant="ghost" size="sm" onPress={() => setExternalRole('')}>Clear</Button>
          )}
        </div>
        <ProTable<User>
          columns={TABLE_COLS.filter(c => c.key !== 'actions')}
          request={mockRequest}
          params={{ role: externalRole || undefined }}
          rowKey="id"
          headerTitle="Filtered by the input above"
          size={size}
          search={false}
          pagination={{ defaultPageSize: 5 }}
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

      {/* Server mode with sort + filter + refreshToken reload */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Reload pattern — <code className="font-mono normal-case">refreshToken</code></p>
        <div className="text-xs text-fg-disabled space-y-0.5 mb-2">
          <p>· Bump <code className="font-mono">refreshToken</code> after a mutation to reload the current page without resetting to page 1</p>
          <p>· Click "Simulate mutation" to trigger a reload — sort and filter state is preserved</p>
        </div>
        <ReloadDemo size={size} />
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

function ReloadDemo({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const [refreshToken, setRefreshToken] = useState(0)
  const [reloadCount, setReloadCount] = useState(0)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onPress={() => {
            setRefreshToken(t => t + 1)
            setReloadCount(c => c + 1)
          }}
        >
          Simulate mutation (reload)
        </Button>
        {reloadCount > 0 && (
          <span className="text-xs text-fg-disabled">Reloaded {reloadCount} time{reloadCount !== 1 ? 's' : ''}</span>
        )}
      </div>
      <ProTable<User>
        columns={TABLE_COLS.filter(c => c.key !== 'actions')}
        request={mockRequest}
        rowKey="id"
        refreshToken={refreshToken}
        headerTitle="refreshToken demo"
        size={size}
        search={false}
        pagination={{ defaultPageSize: 5 }}
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

      {/* Async defaultValues edit form */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Async defaultValues — edit form</p>
        <div className="text-xs text-fg-disabled mb-2">
          <p>· <code className="font-mono">defaultValues</code> starts undefined; the form resets when values arrive after a simulated fetch</p>
          <p>· <code className="font-mono">formRef</code> provides programmatic reset/submit</p>
        </div>
        <AsyncEditDemo size={size} onResult={setResult} />
      </div>

      {/* New field types */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">New fields — DateRange, CheckboxGroup, Slider, TokenField</p>
        <Demo label="All new field types" center={false}>
          <ProForm
            schema={z.object({
              dateRange: z.object({ start: z.string(), end: z.string() }).optional(),
              skills: z.array(z.string()).optional(),
              priority: z.number().min(0).max(100).optional(),
              tags: z.array(z.string()).optional(),
            })}
            onFinish={vals => setResult(vals)}
            size={size}
            submitText="Submit"
          >
            <ProFormDateRangePicker name="dateRange" label="Date range" />
            <ProFormCheckboxGroup name="skills" label="Skills" options={[
              { value: 'react', label: 'React' },
              { value: 'ts', label: 'TypeScript' },
              { value: 'node', label: 'Node.js' },
              { value: 'css', label: 'CSS' },
            ]} orientation="horizontal" />
            <ProFormSlider name="priority" label="Priority" min={0} max={100} step={5} />
            <ProFormTokenField name="tags" label="Tags" placeholder="Type and press comma" />
          </ProForm>
        </Demo>
      </div>

      {/* ProFormList */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">ProFormList — repeatable fields</p>
        <Demo label="Dynamic order items" center={false}>
          <ProForm
            schema={z.object({
              items: z.array(z.object({
                product: z.string().min(1, 'Required'),
                quantity: z.number().min(1),
              })).min(1, 'At least 1 item'),
            })}
            defaultValues={{ items: [{ product: '', quantity: 1 }] }}
            onFinish={vals => setResult(vals)}
            size={size}
            submitText="Place order"
          >
            <ProFormList name="items" label="Order items" min={1} max={5} addText="+ Add item">
              {(field, index, { remove }) => (
                <ProFormRow>
                  <ProFormInput name={`${field}.product`} label={`Item ${index + 1}`} placeholder="Product name" required />
                  <div className="flex gap-2 items-end">
                    <ProFormNumberField name={`${field}.quantity`} label="Qty" min={1} />
                    <Button type="button" variant="ghost" size="sm" onPress={remove} className="mb-1 text-danger">✕</Button>
                  </div>
                </ProFormRow>
              )}
            </ProFormList>
          </ProForm>
        </Demo>
      </div>

      {/* ProFormDependency */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-fg-muted uppercase tracking-wider">ProFormDependency — conditional fields</p>
        <Demo label="Show/hide fields based on role" center={false}>
          <ProForm
            schema={z.object({
              role: z.enum(['admin', 'editor', 'viewer']),
              permissions: z.array(z.string()).optional(),
              department: z.string().optional(),
            })}
            defaultValues={{ role: 'viewer' }}
            onFinish={vals => setResult(vals)}
            size={size}
            submitText="Save"
          >
            <ProFormSelect name="role" label="Role" options={roleOptions} required />
            <ProFormDependency name={['role']}>
              {({ role }) => (
                <>
                  {role === 'admin' && (
                    <ProFormCheckboxGroup name="permissions" label="Admin permissions" options={[
                      { value: 'users', label: 'Manage users' },
                      { value: 'billing', label: 'Manage billing' },
                      { value: 'settings', label: 'System settings' },
                    ]} />
                  )}
                  {(role === 'admin' || role === 'editor') && (
                    <ProFormInput name="department" label="Department" placeholder="e.g. Engineering" />
                  )}
                </>
              )}
            </ProFormDependency>
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

function AsyncEditDemo({ size, onResult }: { size: 'sm' | 'md' | 'lg'; onResult: (v: Record<string, unknown>) => void }) {
  type EditValues = z.infer<typeof profileSchema>
  const formRef = useRef<ProFormRef<EditValues>>(null)
  const [defaults, setDefaults] = useState<EditValues | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDefaults({
        name: 'Alice Nguyen',
        email: 'alice@example.com',
        role: 'editor',
        salary: 25000000,
        bio: 'Full-stack developer',
        startDate: '2024-03-15',
        notify: true,
        active: true,
      })
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Demo label={loading ? 'Loading defaults… (1.2s delay)' : 'Edit form — defaults loaded'} center={false}>
      <ProForm<EditValues>
        schema={profileSchema}
        formRef={formRef}
        defaultValues={defaults}
        onFinish={vals => onResult(vals)}
        size={size}
        submitText="Save changes"
        submitter={{
          showReset: true,
          resetText: 'Discard',
        }}
      >
        <ProFormRow>
          <ProFormInput name="name" label="Full name" required />
          <ProFormInput name="email" label="Email" type="email" required />
        </ProFormRow>
        <ProFormRow>
          <ProFormSelect name="role" label="Role" options={roleOptions} />
          <ProFormNumberField name="salary" label="Salary (₫)" min={0} formatOptions={{ style: 'decimal' }} />
        </ProFormRow>
        <ProFormDatePicker name="startDate" label="Start date" />
        <ProFormTextarea name="bio" label="Bio" rows={2} />
        <ProFormRow>
          <ProFormSwitch name="active" label="Active account" />
          <ProFormCheckbox name="notify" label="Email notifications" />
        </ProFormRow>
      </ProForm>
      <div className="mt-2 flex gap-2">
        <Button variant="ghost" size="sm" onPress={() => formRef.current?.reset()}>
          Reset via formRef
        </Button>
        <Button variant="ghost" size="sm" onPress={() => formRef.current?.submit()}>
          Submit via formRef
        </Button>
      </div>
    </Demo>
  )
}

