import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { ProForm, ProFormInput, ProFormDatePicker, ProFormComboBox, ProFormSelect, ProFormCheckbox, ProFormSwitch, type ProFormRef } from '../index'

/**
 * Returns every element referenced by the target's `aria-describedby`, joined by
 * space — mirrors how assistive tech resolves the description.
 */
function describedByText(el: Element | null): string {
  const ids = el?.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? []
  return ids
    .map(id => document.getElementById(id)?.textContent ?? '')
    .join(' ')
    .trim()
}

const simpleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

const datePickerSchema = z.object({
  date: z.string().min(1, 'Date is required'),
})

describe('ProForm — submit success', () => {
  it('calls onFinish with valid data', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm schema={simpleSchema} onFinish={onFinish} defaultValues={{ name: '', email: '' }}>
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })

    const submitBtn = screen.getByRole('button', { name: 'Submit' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com' })
    })
  })

  it('works without schema (no validation)', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm onFinish={onFinish} defaultValues={{ name: '' }}>
        <ProFormInput name="name" label="Name" />
      </ProForm>
    )

    // Submit with empty value should still work when no schema
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ name: '' })
    })
  })
})

describe('ProForm — zod validation errors', () => {
  it('displays error message and sets aria-invalid on invalid field', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm schema={simpleSchema} onFinish={onFinish} defaultValues={{ name: '', email: '' }}>
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    // Submit without filling required fields
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeDefined()
    })

    // Check aria-invalid
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput.getAttribute('aria-invalid')).toBe('true')
    expect(describedByText(nameInput)).toContain('Name is required')
  })

  it('calls onFinishFailed with errors', async () => {
    const onFinish = vi.fn()
    const onFinishFailed = vi.fn()
    render(
      <ProForm
        schema={simpleSchema}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        defaultValues={{ name: '', email: '' }}
      >
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onFinishFailed).toHaveBeenCalled()
      expect(onFinish).not.toHaveBeenCalled()
    })

    const errors = onFinishFailed.mock.calls[0][0]
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
  })
})

describe('ProForm — onFinish throws error shows submitError', () => {
  it('displays error message when onFinish throws', async () => {
    const errorMessage = 'Server error: Failed to save'
    const onFinish = vi.fn().mockRejectedValue(new Error(errorMessage))
    render(
      <ProForm schema={simpleSchema} onFinish={onFinish} defaultValues={{ name: 'Test', email: 'test@test.com' }}>
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeDefined()
      expect(screen.getByRole('alert')).toBeDefined()
    })
  })
})

describe('ProForm — reset', () => {
  it('resets form values when reset button is clicked', async () => {
    const onReset = vi.fn()
    render(
      <ProForm
        schema={simpleSchema}
        onFinish={vi.fn()}
        onReset={onReset}
        showReset
        defaultValues={{ name: 'Initial', email: 'initial@test.com' }}
      >
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    expect(nameInput.value).toBe('Initial')

    // Change value
    fireEvent.change(nameInput, { target: { value: 'Changed' } })
    expect(nameInput.value).toBe('Changed')

    // Reset
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    await waitFor(() => {
      expect(nameInput.value).toBe('Initial')
      expect(onReset).toHaveBeenCalled()
    })
  })
})

describe('ProForm — DatePicker ISO handling', () => {
  it('handles ISO datetime string safely and parses to YYYY-MM-DD', async () => {
    const onFinish = vi.fn()
    // ISO datetime that would crash parseDate if not handled
    const isoDatetime = '2024-01-15T10:30:00.000Z'

    render(
      <ProForm schema={datePickerSchema} onFinish={onFinish} defaultValues={{ date: isoDatetime }}>
        <ProFormDatePicker name="date" label="Date" />
      </ProForm>
    )

    // Should render without crashing
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled()
      // Should submit the date value (could be ISO or YYYY-MM-DD depending on implementation)
      const submittedDate = onFinish.mock.calls[0][0].date
      expect(submittedDate).toBeDefined()
      // The date should contain 2024-01-15 (the parsed value)
      expect(submittedDate).toContain('2024-01-15')
    })
  })

  it('handles invalid date string gracefully', () => {
    // Invalid date that would throw if parseDate is called directly
    const invalidDate = 'not-a-date'

    // Should render without crashing
    expect(() => {
      render(
        <ProForm schema={datePickerSchema} onFinish={vi.fn()} defaultValues={{ date: invalidDate }}>
          <ProFormDatePicker name="date" label="Date" />
        </ProForm>
      )
    }).not.toThrow()
  })
})

describe('ProForm — ComboBox', () => {
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ]

  it('displays label when default key is set', async () => {
    render(
      <ProForm onFinish={vi.fn()} defaultValues={{ country: 'us' }}>
        <ProFormComboBox name="country" label="Country" options={countryOptions} />
      </ProForm>
    )

    // The input should show the label, not the key
    const input = screen.getByLabelText('Country') as HTMLInputElement
    await waitFor(() => {
      expect(input.value).toBe('United States')
    })
  })

  it('shows label in input but submits key when option is selected', async () => {
    const onFinish = vi.fn()
    render(
      <ProForm onFinish={onFinish} defaultValues={{ country: 'uk' }}>
        <ProFormComboBox name="country" label="Country" options={countryOptions} />
      </ProForm>
    )

    const input = screen.getByLabelText('Country') as HTMLInputElement
    
    // With default value 'uk', input should show 'United Kingdom' (the label)
    await waitFor(() => {
      expect(input.value).toBe('United Kingdom')
    })
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    
    await waitFor(() => {
      // onFinish should receive the key (value), not the label
      expect(onFinish).toHaveBeenCalledWith({ country: 'uk' })
    })
  })

  it('can be found via getByLabelText', () => {
    render(
      <ProForm onFinish={vi.fn()} defaultValues={{ country: '' }}>
        <ProFormComboBox name="country" label="Country" options={countryOptions} />
      </ProForm>
    )

    // getByLabelText should find exactly one element
    expect(screen.getByLabelText('Country')).toBeDefined()
  })
})

describe('ProForm — a11y labels', () => {
  it('links label to input via aria-labelledby', async () => {
    render(
      <ProForm schema={simpleSchema} onFinish={vi.fn()} defaultValues={{ name: '', email: '' }}>
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    // getByLabelText should find the input
    expect(screen.getByLabelText('Name')).toBeDefined()
    expect(screen.getByLabelText('Email')).toBeDefined()
  })

  it('links description to input via aria-describedby', async () => {
    render(
      <ProForm onFinish={vi.fn()} defaultValues={{ name: '' }}>
        <ProFormInput name="name" label="Name" description="Enter your full name" />
      </ProForm>
    )

    const input = screen.getByLabelText('Name')
    expect(describedByText(input)).toContain('Enter your full name')
  })
})

describe('ProForm — submitter', () => {
  it('hides submit button when submitter is false', () => {
    render(
      <ProForm submitter={false} onFinish={vi.fn()} defaultValues={{ name: '' }}>
        <ProFormInput name="name" label="Name" />
      </ProForm>
    )

    expect(screen.queryByRole('button', { name: 'Submit' })).toBeNull()
  })

  it('uses custom submitText from submitter config', () => {
    render(
      <ProForm submitter={{ submitText: 'Save' }} onFinish={vi.fn()} defaultValues={{ name: '' }}>
        <ProFormInput name="name" label="Name" />
      </ProForm>
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeDefined()
  })

  it('renders custom submitter via render function', () => {
    render(
      <ProForm
        submitter={{
          render: ({ submit }) => (
            <button type="button" onClick={submit}>Custom Submit</button>
          ),
        }}
        onFinish={vi.fn()}
        defaultValues={{ name: '' }}
      >
        <ProFormInput name="name" label="Name" />
      </ProForm>
    )

    expect(screen.getByRole('button', { name: 'Custom Submit' })).toBeDefined()
  })
})

describe('ProForm — formRef', () => {
  it('exposes form methods via formRef', async () => {
    const FormWithRef = () => {
      const formRef = useRef<ProFormRef>(null)
      return (
        <div>
          <ProForm
            formRef={formRef}
            onFinish={vi.fn()}
            defaultValues={{ name: 'Initial' }}
          >
            <ProFormInput name="name" label="Name" />
          </ProForm>
          <button type="button" onClick={() => formRef.current?.reset()}>
            External Reset
          </button>
          <button type="button" onClick={() => formRef.current?.setValue('name', 'Programmatic')}>
            Set Value
          </button>
        </div>
      )
    }

    render(<FormWithRef />)

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    expect(nameInput.value).toBe('Initial')

    // Change value
    fireEvent.change(nameInput, { target: { value: 'Changed' } })
    expect(nameInput.value).toBe('Changed')

    // Reset via ref
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'External Reset' }))
    })
    await waitFor(() => {
      expect(nameInput.value).toBe('Initial')
    })

    // Set value via ref
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Set Value' }))
    })
    await waitFor(() => {
      expect(nameInput.value).toBe('Programmatic')
    })
  })
})

describe('ProForm — defaultValues sync', () => {
  it('resets form when defaultValues change and form is not dirty', async () => {
    const TestComponent = () => {
      const [defaults, setDefaults] = useState({ name: 'Initial' })
      return (
        <div>
          <ProForm onFinish={vi.fn()} defaultValues={defaults}>
            <ProFormInput name="name" label="Name" />
          </ProForm>
          <button type="button" onClick={() => setDefaults({ name: 'Updated' })}>
            Update Defaults
          </button>
        </div>
      )
    }

    render(<TestComponent />)

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    expect(nameInput.value).toBe('Initial')

    // Change defaultValues
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Update Defaults' }))
    })

    // Should update to new defaultValues since form was not dirty
    await waitFor(() => {
      expect(nameInput.value).toBe('Updated')
    })
  })

  it('handles async defaultValues (undefined → loaded)', async () => {
    // Simulates the pattern: defaultValues={data} where data is undefined initially
    const TestComponent = () => {
      const [data, setData] = useState<{ name: string } | undefined>(undefined)
      return (
        <div>
          <ProForm onFinish={vi.fn()} defaultValues={data}>
            <ProFormInput name="name" label="Name" />
          </ProForm>
          <button type="button" onClick={() => setData({ name: 'Loaded' })}>
            Load Data
          </button>
        </div>
      )
    }

    render(<TestComponent />)

    const nameInput = screen.getByLabelText('Name') as HTMLInputElement
    // Initially empty (undefined defaultValues)
    expect(nameInput.value).toBe('')

    // Simulate async load - wait for click to complete
    fireEvent.click(screen.getByRole('button', { name: 'Load Data' }))

    // Should update to loaded value (give more time for re-render cycles)
    await waitFor(() => {
      expect(nameInput.value).toBe('Loaded')
    }, { timeout: 2000 })
  })
})

describe('ProForm — aria-invalid on various fields', () => {
  const selectSchema = z.object({
    status: z.string().min(1, 'Status required'),
  })

  const comboBoxSchema = z.object({
    country: z.string().min(1, 'Country required'),
  })

  const dateSchema = z.object({
    date: z.string().min(1, 'Date required'),
  })

  const checkboxSchema = z.object({
    agree: z.boolean().refine(val => val === true, { message: 'Must agree' }),
  })

  const switchSchema = z.object({
    active: z.boolean().refine(val => val === true, { message: 'Must be active' }),
  })

  it('sets aria-invalid on Select when invalid', async () => {
    render(
      <ProForm schema={selectSchema} onFinish={vi.fn()} defaultValues={{ status: '' }}>
        <ProFormSelect
          name="status"
          label="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Status required')).toBeDefined()
    })

    // Select button should have aria-invalid or data-invalid
    const selectButton = screen.getByRole('button', { name: /Status|Select/ })
    // React Aria components use data-invalid attribute
    const isInvalid = selectButton.getAttribute('aria-invalid') === 'true' ||
                      selectButton.closest('[data-invalid]') !== null ||
                      selectButton.getAttribute('data-invalid') !== null
    expect(isInvalid).toBe(true)
  })

  it('sets aria-invalid on ComboBox when invalid', async () => {
    render(
      <ProForm schema={comboBoxSchema} onFinish={vi.fn()} defaultValues={{ country: '' }}>
        <ProFormComboBox
          name="country"
          label="Country"
          options={[
            { value: 'us', label: 'United States' },
            { value: 'uk', label: 'United Kingdom' },
          ]}
        />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Country required')).toBeDefined()
    })

    // ComboBox input should have aria-invalid
    const comboInput = screen.getByLabelText('Country')
    expect(comboInput.getAttribute('aria-invalid')).toBe('true')
  })

  it('sets aria-invalid on DatePicker when invalid', async () => {
    render(
      <ProForm schema={dateSchema} onFinish={vi.fn()} defaultValues={{ date: '' }}>
        <ProFormDatePicker name="date" label="Date" />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Date required')).toBeDefined()
    })

    // DatePicker group should have data-invalid (React Aria pattern)
    const datePickerGroup = screen.getByRole('group')
    const isInvalid = datePickerGroup.getAttribute('aria-invalid') === 'true' ||
                      datePickerGroup.getAttribute('data-invalid') !== null ||
                      datePickerGroup.closest('[data-invalid]') !== null
    expect(isInvalid).toBe(true)
  })

  it('sets aria-invalid on Checkbox when invalid', async () => {
    render(
      <ProForm schema={checkboxSchema} onFinish={vi.fn()} defaultValues={{ agree: false }}>
        <ProFormCheckbox name="agree" label="I agree to terms" />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Must agree')).toBeDefined()
    })

    // Checkbox should have data-invalid (React Aria pattern)
    const checkbox = screen.getByRole('checkbox')
    // React Aria uses data-invalid attribute
    const isInvalid = checkbox.getAttribute('aria-invalid') === 'true' ||
                      checkbox.closest('[data-invalid]') !== null
    expect(isInvalid).toBe(true)
  })

  it('sets aria-invalid on Switch when invalid', async () => {
    render(
      <ProForm schema={switchSchema} onFinish={vi.fn()} defaultValues={{ active: false }}>
        <ProFormSwitch name="active" label="Active status" />
      </ProForm>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Must be active')).toBeDefined()
    })

    // Switch should have data-invalid (React Aria pattern)
    const switchEl = screen.getByRole('switch')
    // React Aria uses data-invalid attribute
    const isInvalid = switchEl.getAttribute('aria-invalid') === 'true' ||
                      switchEl.closest('[data-invalid]') !== null
    expect(isInvalid).toBe(true)
  })
})

describe('ProForm — onValuesChange', () => {
  it('calls onValuesChange when field value changes', async () => {
    const onValuesChange = vi.fn()
    render(
      <ProForm
        onFinish={vi.fn()}
        onValuesChange={onValuesChange}
        defaultValues={{ name: '', email: '' }}
      >
        <ProFormInput name="name" label="Name" />
        <ProFormInput name="email" label="Email" />
      </ProForm>
    )

    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'John' } })

    await waitFor(() => {
      expect(onValuesChange).toHaveBeenCalled()
      const [changed, allValues] = onValuesChange.mock.calls[onValuesChange.mock.calls.length - 1]
      expect(changed).toEqual({ name: 'John' })
      expect(allValues.name).toBe('John')
    })
  })
})
