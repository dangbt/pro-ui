import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from 'react-aria-components'
import { Sheet } from '../sheet'

describe('Sheet', () => {
  it('opens via triggerElement and closes with the X button', async () => {
    render(
      <Sheet title="Filters" triggerElement={<Button>Open</Button>}>
        body
      </Sheet>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByText('Open'))
    expect(await screen.findByRole('dialog')).toBeDefined()
    fireEvent.click(screen.getByLabelText('Close'))
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('title becomes the dialog heading', async () => {
    render(
      <Sheet title="Filters" triggerElement={<Button>Open</Button>}>
        body
      </Sheet>,
    )
    fireEvent.click(screen.getByText('Open'))
    const dialog = await screen.findByRole('dialog')
    const heading = screen.getByRole('heading', { name: 'Filters' })
    expect(dialog.contains(heading)).toBe(true)
  })

  it('controlled mode calls onOpenChange when closed', async () => {
    const onOpenChange = vi.fn()
    render(
      <Sheet title="T" isOpen onOpenChange={onOpenChange}>
        body
      </Sheet>,
    )
    await screen.findByRole('dialog')
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('render fn children receives close', async () => {
    const onOpenChange = vi.fn()
    render(
      <Sheet isOpen onOpenChange={onOpenChange}>
        {({ close }) => <button onClick={close}>Done</button>}
      </Sheet>,
    )
    fireEvent.click(await screen.findByText('Done'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('has an aria-label when there is no title', async () => {
    render(
      <Sheet isOpen aria-label="Menu">
        body
      </Sheet>,
    )
    expect((await screen.findByRole('dialog')).getAttribute('aria-label')).toBe('Menu')
  })
})
