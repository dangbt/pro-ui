import { useState } from 'react'
import { Trash2, Edit, Copy } from 'lucide-react'
import {
  Pagination, Title, Text, Paragraph,
  Descriptions, DescriptionsItem, Result,
  Timeline, TimelineItem, Dropdown, Segmented,
  Table, Upload, Transfer, InputOTP, ErrorBoundary,
  Button,
} from '../../components'
import type { DropdownItem } from '../../components'
import { Demo, SectionHeader } from '../shared'

export function PaginationSection() {
  const [page, setPage] = useState(1)
  return (
    <div className="space-y-6">
      <SectionHeader title="Pagination" description="Navigate through paged data." />
      <div className="space-y-4">
        <Demo label="Basic">
          <Pagination current={page} total={100} pageSize={10} onChange={(p) => setPage(p)} />
        </Demo>
        <Demo label="With total & size changer">
          <Pagination current={page} total={200} pageSize={10} onChange={(p, ps) => setPage(p)} showTotal showSizeChanger />
        </Demo>
      </div>
    </div>
  )
}

export function TypographySection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Typography" description="Title, Text, and Paragraph components." />
      <div className="space-y-4">
        <Demo label="Title levels" center={false} className="flex flex-col gap-1">
          <Title level={1}>h1. Title</Title>
          <Title level={3}>h3. Title</Title>
          <Title level={5}>h5. Title</Title>
        </Demo>
        <Demo label="Text variants" center={false} className="flex flex-wrap gap-3">
          <Text>Default</Text>
          <Text type="secondary">Secondary</Text>
          <Text type="success">Success</Text>
          <Text type="danger">Danger</Text>
          <Text strong>Bold</Text>
          <Text code>Code</Text>
          <Text mark>Marked</Text>
          <Text delete>Deleted</Text>
        </Demo>
      </div>
    </div>
  )
}

export function DescriptionsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Descriptions" description="Display key-value metadata." />
      <Demo label="Bordered descriptions" center={false}>
        <Descriptions title="User Info" bordered column={2}>
          <DescriptionsItem label="Name">John Doe</DescriptionsItem>
          <DescriptionsItem label="Email">john@example.com</DescriptionsItem>
          <DescriptionsItem label="Role">Admin</DescriptionsItem>
          <DescriptionsItem label="Status">Active</DescriptionsItem>
        </Descriptions>
      </Demo>
    </div>
  )
}

export function ResultSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Result" description="Outcome pages for operations." />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Demo label="Success" center={false}>
          <Result status="success" title="Payment Complete" subtitle="Order #1234 confirmed." />
        </Demo>
        <Demo label="Error" center={false}>
          <Result status="error" title="Submission Failed" subtitle="Please try again." />
        </Demo>
        <Demo label="404" center={false}>
          <Result status="404" title="Page Not Found" subtitle="The page does not exist." />
        </Demo>
      </div>
    </div>
  )
}

export function TimelineSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Timeline" description="Vertical timeline of events." />
      <Demo label="Basic timeline" center={false}>
        <Timeline>
          <TimelineItem label="2024-01-15">Project created</TimelineItem>
          <TimelineItem color="green" label="2024-02-01">Design approved</TimelineItem>
          <TimelineItem label="2024-03-10">Development started</TimelineItem>
          <TimelineItem color="muted" label="Pending">Release v1.0</TimelineItem>
        </Timeline>
      </Demo>
    </div>
  )
}

export function DropdownSection() {
  const items: DropdownItem[] = [
    { key: 'edit', label: 'Edit', icon: <Edit className="w-4 h-4" /> },
    { key: 'copy', label: 'Duplicate', icon: <Copy className="w-4 h-4" /> },
    { type: 'divider' },
    { key: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, danger: true },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Dropdown" description="Menu triggered by a button." />
      <Demo label="Dropdown with actions">
        <Dropdown items={items}>
          <Button variant="secondary">Actions ▾</Button>
        </Dropdown>
      </Demo>
    </div>
  )
}

export function SegmentedSection() {
  const [value, setValue] = useState('daily')
  return (
    <div className="space-y-6">
      <SectionHeader title="Segmented" description="Segmented control for switching views." />
      <div className="space-y-4">
        <Demo label="Basic">
          <Segmented
            value={value}
            onChange={setValue}
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
          />
        </Demo>
        <Demo label="Block mode">
          <Segmented
            block
            value={value}
            onChange={setValue}
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
          />
        </Demo>
      </div>
    </div>
  )
}

export function BasicTableSection() {
  const data = [
    { name: 'Alice', role: 'Engineer', status: 'Active' },
    { name: 'Bob', role: 'Designer', status: 'Active' },
    { name: 'Charlie', role: 'PM', status: 'Inactive' },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Table" description="Basic data table." />
      <Demo label="Bordered & hoverable" center={false}>
        <Table bordered hoverable>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.name}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.role}</Table.Cell>
                <Table.Cell>{row.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Demo>
    </div>
  )
}

export function UploadSection() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Upload" description="File upload with drag-and-drop." />
      <Demo label="Basic upload" center={false}>
        <Upload accept="image/*" multiple maxCount={3} onChange={(files) => console.log(files)} />
      </Demo>
    </div>
  )
}

export function TransferSection() {
  const [targetKeys, setTargetKeys] = useState<string[]>(['b'])
  const dataSource = [
    { key: 'a', label: 'Item A' },
    { key: 'b', label: 'Item B' },
    { key: 'c', label: 'Item C' },
    { key: 'd', label: 'Item D' },
    { key: 'e', label: 'Item E' },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Transfer" description="Move items between two lists." />
      <Demo label="With search" center={false}>
        <Transfer
          dataSource={dataSource}
          targetKeys={targetKeys}
          onChange={(keys) => setTargetKeys(keys)}
          showSearch
        />
      </Demo>
    </div>
  )
}

export function InputOTPSection() {
  const [otp, setOtp] = useState('')
  return (
    <div className="space-y-6">
      <SectionHeader title="Input OTP" description="One-time password input." />
      <Demo label="6-digit OTP">
        <div className="flex flex-col items-center gap-2">
          <InputOTP length={6} value={otp} onChange={setOtp} />
          <Text type="secondary">Value: {otp || '—'}</Text>
        </div>
      </Demo>
    </div>
  )
}

function BuggyComponent() {
  throw new Error('Oops! This component crashed.')
}

export function ErrorBoundarySection() {
  const [showError, setShowError] = useState(false)
  return (
    <div className="space-y-6">
      <SectionHeader title="Error Boundary" description="Graceful error handling." />
      <Demo label="With fallback" center={false}>
        <ErrorBoundary
          fallback={({ error, reset }) => (
            <div className="text-center py-6">
              <p className="text-sm text-danger mb-2">{error.message}</p>
              <Button size="sm" onPress={reset}>Reset</Button>
            </div>
          )}
        >
          {showError ? <BuggyComponent /> : (
            <div className="text-center py-6">
              <Button size="sm" variant="secondary" onPress={() => setShowError(true)}>
                Trigger Error
              </Button>
            </div>
          )}
        </ErrorBoundary>
      </Demo>
    </div>
  )
}
