import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { Checkbox } from '../checkbox'
import { Switch } from '../switch'
import { RadioGroup } from '../radio-group'

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

describe('Checkbox — description & errorMessage', () => {
  it('renders description and links it via aria-describedby', () => {
    render(<Checkbox description="We will email you">Subscribe</Checkbox>)
    expect(screen.getByText('We will email you')).toBeDefined()
    const input = screen.getByRole('checkbox')
    expect(describedByText(input)).toContain('We will email you')
  })

  it('renders errorMessage when isInvalid', () => {
    render(
      <Checkbox isInvalid errorMessage="You must accept">
        Accept terms
      </Checkbox>,
    )
    const error = screen.getByText('You must accept')
    expect(error).toBeDefined()
    const input = screen.getByRole('checkbox')
    expect(describedByText(input)).toContain('You must accept')
  })

  it('does not render errorMessage when valid', () => {
    render(<Checkbox errorMessage="You must accept">Accept terms</Checkbox>)
    expect(screen.queryByText('You must accept')).toBeNull()
  })

  it('forwards ref to an HTMLLabelElement', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Checkbox ref={ref}>Ref test</Checkbox>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('has displayName', () => {
    expect(Checkbox.displayName).toBe('Checkbox')
  })
})

describe('Switch — description & errorMessage', () => {
  it('renders description and links it via aria-describedby', () => {
    render(<Switch description="Syncs across devices">Sync</Switch>)
    expect(screen.getByText('Syncs across devices')).toBeDefined()
    const input = screen.getByRole('switch')
    expect(describedByText(input)).toContain('Syncs across devices')
  })

  it('renders errorMessage when isInvalid', () => {
    render(
      <Switch isInvalid errorMessage="This setting is required">
        Enable
      </Switch>,
    )
    expect(screen.getByText('This setting is required')).toBeDefined()
    const input = screen.getByRole('switch')
    expect(describedByText(input)).toContain('This setting is required')
  })

  it('does not render errorMessage when valid', () => {
    render(<Switch errorMessage="This setting is required">Enable</Switch>)
    expect(screen.queryByText('This setting is required')).toBeNull()
  })

  it('forwards ref to an HTMLLabelElement', () => {
    const ref = createRef<HTMLLabelElement>()
    render(<Switch ref={ref}>Ref test</Switch>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it('has displayName', () => {
    expect(Switch.displayName).toBe('Switch')
  })
})

describe('RadioGroup — description & errorMessage', () => {
  const options = [
    { value: 'free', label: 'Free', description: 'Up to 5 projects' },
    { value: 'pro', label: 'Pro', description: 'Unlimited projects' },
  ]

  it('links each option description via the radio input aria-describedby', () => {
    render(<RadioGroup label="Plan" options={options} />)
    const free = screen.getByRole('radio', { name: /Free/ })
    expect(describedByText(free)).toContain('Up to 5 projects')
    const pro = screen.getByRole('radio', { name: /Pro/ })
    expect(describedByText(pro)).toContain('Unlimited projects')
  })

  it('renders group-level description linked to the group', () => {
    render(
      <RadioGroup label="Plan" description="Choose a billing plan" options={options} />,
    )
    expect(screen.getByText('Choose a billing plan')).toBeDefined()
    const group = screen.getByRole('radiogroup')
    expect(describedByText(group)).toContain('Choose a billing plan')
  })

  it('renders group-level errorMessage when isInvalid', () => {
    render(
      <RadioGroup
        label="Plan"
        options={options}
        isInvalid
        errorMessage="Please select a plan"
      />,
    )
    expect(screen.getByText('Please select a plan')).toBeDefined()
    const group = screen.getByRole('radiogroup')
    expect(describedByText(group)).toContain('Please select a plan')
  })

  it('does not render errorMessage when valid', () => {
    render(<RadioGroup label="Plan" options={options} errorMessage="Please select a plan" />)
    expect(screen.queryByText('Please select a plan')).toBeNull()
  })
})
