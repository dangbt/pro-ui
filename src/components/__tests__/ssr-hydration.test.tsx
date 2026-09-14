import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeProvider, useTheme, getThemeInitScript } from '../theme-provider'
import { ToastProvider, toast } from '../toast'

/**
 * These tests reproduce the SSR flow: render to an HTML string on the "server",
 * put that markup into the DOM, then hydrate on the "client". If the first
 * client render diverges from the server markup, React calls
 * `onRecoverableError` (the minified #418/#423 errors). We assert it is never
 * called, then flush effects and check the post-mount state.
 */

function ThemeConsumer() {
  const { theme } = useTheme()
  return <span data-testid="theme">{theme}</span>
}

/** Render `element` to string, inject into a container, hydrate, return spy + container. */
function ssrThenHydrate(element: React.ReactElement) {
  const html = renderToString(element)
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  const onRecoverableError = vi.fn()
  let root: ReturnType<typeof hydrateRoot>
  act(() => {
    root = hydrateRoot(container, element, { onRecoverableError })
  })
  roots.push(() => root.unmount())
  return { onRecoverableError, container }
}

const roots: Array<() => void> = []

describe('SSR hydration', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  afterEach(() => {
    // Unmount hydrated roots so their timers/effects (e.g. toast animations)
    // don't fire after the test and trigger act warnings or cross-test leakage.
    act(() => {
      while (roots.length) roots.pop()!()
    })
    document.body.innerHTML = ''
    localStorage.clear()
  })

  describe('ThemeProvider', () => {
    it('does not mismatch when localStorage has pro-ui-theme=dark, then syncs to dark after mount', () => {
      localStorage.setItem('pro-ui-theme', 'dark')

      const element = (
        <StrictMode>
          <ThemeProvider defaultTheme="system">
            <ThemeConsumer />
          </ThemeProvider>
        </StrictMode>
      )

      // Server render must reflect defaultTheme, NOT the stored value.
      expect(renderToString(element)).toContain('>system<')

      const { onRecoverableError, container } = ssrThenHydrate(element)

      // No hydration mismatch during the first client render.
      expect(onRecoverableError).not.toHaveBeenCalled()

      // After effects flush, the consumer reflects the stored theme.
      expect(container.querySelector('[data-testid="theme"]')?.textContent).toBe('dark')
    })

    it('applies the dark class to <html> after mount', () => {
      localStorage.setItem('pro-ui-theme', 'dark')

      const { onRecoverableError } = ssrThenHydrate(
        <ThemeProvider defaultTheme="system">
          <ThemeConsumer />
        </ThemeProvider>,
      )

      expect(onRecoverableError).not.toHaveBeenCalled()
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  describe('ToastProvider', () => {
    it('renders null on the server and does not mismatch on hydration', () => {
      const element = (
        <StrictMode>
          <div>
            <ToastProvider />
          </div>
        </StrictMode>
      )

      // Server output for the provider itself is empty (portal only after mount).
      expect(renderToString(element)).toBe('<div></div>')

      const { onRecoverableError } = ssrThenHydrate(element)
      expect(onRecoverableError).not.toHaveBeenCalled()
    })

    it('shows a toast fired before mount once the provider mounts', () => {
      // Fire before the provider is rendered/mounted.
      const id = toast.success('Hello from SSR', { title: 'Saved' })

      const { onRecoverableError } = ssrThenHydrate(
        <div>
          <ToastProvider />
        </div>,
      )

      expect(onRecoverableError).not.toHaveBeenCalled()
      // Portal mounts into document.body after the effect flushes.
      expect(document.body.textContent).toContain('Hello from SSR')

      // Remove from the singleton store so it doesn't leak into other tests.
      act(() => toast.dismiss(id))
    })
  })

  describe('getThemeInitScript', () => {
    it('returns a script string that reads the default storage key', () => {
      const script = getThemeInitScript()
      expect(script).toContain('"pro-ui-theme"')
      expect(script).toContain("classList.remove('light','dark')")
    })

    it('honours a custom storage key and escapes it safely', () => {
      const script = getThemeInitScript('my-theme')
      expect(script).toContain('"my-theme"')
    })
  })
})
