import { describe, it, expect } from 'vitest'
import { cn } from '../cn'

describe('cn (tailwind-merge 3.x)', () => {
  it('merges basic conflicting classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('preserves non-conflicting classes', () => {
    expect(cn('p-4', 'mt-2')).toBe('p-4 mt-2')
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('handles custom theme tokens (bg-surface, text-fg-*)', () => {
    // These should be treated as background/text color classes
    expect(cn('bg-surface', 'bg-red-500')).toBe('bg-red-500')
    expect(cn('bg-red-500', 'bg-surface')).toBe('bg-surface')
    expect(cn('text-fg-muted', 'text-red-500')).toBe('text-red-500')
    expect(cn('text-red-500', 'text-fg-muted')).toBe('text-fg-muted')
  })

  it('handles rounded with CSS variables', () => {
    // rounded-[var(--base-radius)] should override other rounded classes
    expect(cn('rounded-md', 'rounded-[var(--base-radius)]')).toBe('rounded-[var(--base-radius)]')
    expect(cn('rounded-[var(--base-radius)]', 'rounded-lg')).toBe('rounded-lg')
  })

  it('handles arbitrary values', () => {
    expect(cn('w-[100px]', 'w-[200px]')).toBe('w-[200px]')
    expect(cn('p-[10px]', 'p-4')).toBe('p-4')
  })

  it('handles conditional classes', () => {
    expect(cn('p-4', false && 'mt-2')).toBe('p-4')
    expect(cn('p-4', true && 'mt-2')).toBe('p-4 mt-2')
    expect(cn('p-4', undefined, 'mt-2')).toBe('p-4 mt-2')
    expect(cn('p-4', null, 'mt-2')).toBe('p-4 mt-2')
  })

  it('handles array and object syntax', () => {
    expect(cn(['p-4', 'mt-2'])).toBe('p-4 mt-2')
    expect(cn({ 'p-4': true, 'mt-2': false })).toBe('p-4')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined, '')).toBe('')
  })

  it('merges responsive variants correctly', () => {
    expect(cn('md:p-4', 'md:p-8')).toBe('md:p-8')
    expect(cn('lg:text-sm', 'lg:text-lg')).toBe('lg:text-lg')
  })

  it('preserves different responsive breakpoints', () => {
    expect(cn('p-4', 'md:p-8', 'lg:p-12')).toBe('p-4 md:p-8 lg:p-12')
  })

  it('merges state variants correctly', () => {
    expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500')
    expect(cn('focus:ring-2', 'focus:ring-4')).toBe('focus:ring-4')
  })
})
