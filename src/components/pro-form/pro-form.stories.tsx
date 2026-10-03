import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useRef, useEffect } from 'react'
import { z } from 'zod'
import { ProForm } from './pro-form'
import type { ProFormRef } from './pro-form'
import { ProFormRow } from './pro-form'
import {
  ProFormInput,
  ProFormNumberField,
  ProFormSelect,
  ProFormDateRangePicker,
  ProFormCheckboxGroup,
  ProFormSlider,
  ProFormTokenField,
  ProFormList,
  ProFormDependency,
} from './fields'
import { Button } from '../button'

const meta: Meta<typeof ProForm> = {
  title: 'Data/ProForm',
  component: ProForm,
}

export default meta

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]

export const Basic: StoryObj = {
  render: function Render() {
    const [result, setResult] = useState<string | null>(null)
    return (
      <div className="max-w-lg space-y-4">
        <ProForm
          schema={z.object({
            name: z.string().min(2, 'Required'),
            email: z.string().email(),
            role: z.enum(['admin', 'editor', 'viewer']),
          })}
          defaultValues={{ role: 'viewer' }}
          onFinish={(v) => setResult(JSON.stringify(v, null, 2))}
          submitText="Create user"
          showReset
        >
          <ProFormRow>
            <ProFormInput name="name" label="Name" required />
            <ProFormInput name="email" label="Email" type="email" required />
          </ProFormRow>
          <ProFormSelect name="role" label="Role" options={roleOptions} />
        </ProForm>
        {result && <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">{result}</pre>}
      </div>
    )
  },
}

export const HorizontalLayout: StoryObj = {
  render: () => (
    <div className="max-w-lg">
      <ProForm
        schema={z.object({
          username: z.string().min(3),
          password: z.string().min(8),
        })}
        onFinish={(v) => console.log(v)}
        layout="horizontal"
        submitText="Sign up"
      >
        <ProFormInput name="username" label="Username" required />
        <ProFormInput name="password" label="Password" type="password" required />
      </ProForm>
    </div>
  ),
}

export const AsyncDefaultValues: StoryObj = {
  render: function Render() {
    const formRef = useRef<ProFormRef>(null)
    const [defaults, setDefaults] = useState<Record<string, unknown> | undefined>()

    useEffect(() => {
      const timer = setTimeout(() => {
        setDefaults({ name: 'Alice Nguyen', email: 'alice@example.com', role: 'editor' })
      }, 1000)
      return () => clearTimeout(timer)
    }, [])

    return (
      <div className="max-w-lg space-y-4">
        <ProForm
          schema={z.object({
            name: z.string().min(2),
            email: z.string().email(),
            role: z.enum(['admin', 'editor', 'viewer']),
          })}
          formRef={formRef}
          defaultValues={defaults}
          onFinish={(v) => console.log(v)}
          submitText="Save changes"
        >
          <ProFormInput name="name" label="Name" required />
          <ProFormInput name="email" label="Email" type="email" required />
          <ProFormSelect name="role" label="Role" options={roleOptions} />
        </ProForm>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onPress={() => formRef.current?.reset()}>Reset via ref</Button>
          <Button size="sm" variant="ghost" onPress={() => formRef.current?.submit()}>Submit via ref</Button>
        </div>
      </div>
    )
  },
}

export const NewFieldTypes: StoryObj = {
  render: function Render() {
    const [result, setResult] = useState<string | null>(null)
    return (
      <div className="max-w-lg space-y-4">
        <ProForm
          schema={z.object({
            dateRange: z.object({ start: z.string(), end: z.string() }).optional(),
            skills: z.array(z.string()).optional(),
            priority: z.number().min(0).max(100).optional(),
            tags: z.array(z.string()).optional(),
          })}
          onFinish={(v) => setResult(JSON.stringify(v, null, 2))}
          submitText="Submit"
        >
          <ProFormDateRangePicker name="dateRange" label="Date range" />
          <ProFormCheckboxGroup
            name="skills"
            label="Skills"
            options={[
              { value: 'react', label: 'React' },
              { value: 'ts', label: 'TypeScript' },
              { value: 'node', label: 'Node.js' },
            ]}
            orientation="horizontal"
          />
          <ProFormSlider name="priority" label="Priority" min={0} max={100} step={5} />
          <ProFormTokenField name="tags" label="Tags" placeholder="Type and press comma" />
        </ProForm>
        {result && <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">{result}</pre>}
      </div>
    )
  },
}

export const FormList: StoryObj = {
  render: function Render() {
    const [result, setResult] = useState<string | null>(null)
    return (
      <div className="max-w-lg space-y-4">
        <ProForm
          schema={z.object({
            items: z
              .array(z.object({ product: z.string().min(1, 'Required'), quantity: z.number().min(1) }))
              .min(1, 'At least 1 item'),
          })}
          defaultValues={{ items: [{ product: '', quantity: 1 }] }}
          onFinish={(v) => setResult(JSON.stringify(v, null, 2))}
          submitText="Place order"
        >
          <ProFormList name="items" label="Order items" min={1} max={5} addText="+ Add item">
            {(field, index, { remove }) => (
              <ProFormRow>
                <ProFormInput name={`${field}.product`} label={`Item ${index + 1}`} required />
                <div className="flex gap-2 items-end">
                  <ProFormNumberField name={`${field}.quantity`} label="Qty" min={1} />
                  <Button type="button" variant="ghost" size="sm" onPress={remove} className="mb-1 text-danger">
                    Remove
                  </Button>
                </div>
              </ProFormRow>
            )}
          </ProFormList>
        </ProForm>
        {result && <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">{result}</pre>}
      </div>
    )
  },
}

export const Dependency: StoryObj = {
  render: function Render() {
    const [result, setResult] = useState<string | null>(null)
    return (
      <div className="max-w-lg space-y-4">
        <ProForm
          schema={z.object({
            role: z.enum(['admin', 'editor', 'viewer']),
            permissions: z.array(z.string()).optional(),
          })}
          defaultValues={{ role: 'viewer' }}
          onFinish={(v) => setResult(JSON.stringify(v, null, 2))}
          submitText="Save"
        >
          <ProFormSelect name="role" label="Role" options={roleOptions} />
          <ProFormDependency name={['role']}>
            {({ role }) =>
              role === 'admin' ? (
                <ProFormCheckboxGroup
                  name="permissions"
                  label="Admin permissions"
                  options={[
                    { value: 'users', label: 'Manage users' },
                    { value: 'billing', label: 'Manage billing' },
                  ]}
                />
              ) : null
            }
          </ProFormDependency>
        </ProForm>
        {result && <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">{result}</pre>}
      </div>
    )
  },
}
