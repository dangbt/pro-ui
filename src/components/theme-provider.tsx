import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  /** Current preference: 'light' | 'dark' | 'system' */
  theme: Theme
  /** Resolved value after evaluating 'system' → 'light' | 'dark' */
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeCtx = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
  /** Default theme if nothing is stored in localStorage (default: 'system') */
  defaultTheme?: Theme
  /** localStorage key (default: 'pro-ui-theme') */
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'pro-ui-theme',
}: ThemeProviderProps) {
  // Initial render must be identical on the server and the first client render,
  // so we deliberately do NOT read `localStorage` / `matchMedia` here — that
  // would diverge from the server output and cause a hydration mismatch
  // (React error #418/#423). We start from `defaultTheme` / `'light'` and sync
  // to the stored / system value after mount in the effect below.
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  const getResolved = (t: Theme): 'light' | 'dark' => {
    if (t !== 'system') return t
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /* After mount, adopt the persisted theme (falling back to defaultTheme). */
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null
    if (stored && stored !== theme) {
      setThemeState(stored)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  /* Apply class to <html> whenever theme changes */
  useEffect(() => {
    const root = document.documentElement
    const resolved = getResolved(theme)
    setResolvedTheme(resolved)

    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      // Let the @media query in CSS handle it; add no explicit class.
      // But we still track the resolved value.
    } else {
      root.classList.add(theme)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  /* Re-resolve when system preference changes (only relevant in 'system' mode) */
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolvedTheme(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next)
    setThemeState(next)
  }

  return (
    <ThemeCtx.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

/**
 * Returns an inline `<script>` body that applies the persisted theme class to
 * `<html>` **before** hydration, avoiding a flash of the wrong theme (FOUC).
 *
 * `ThemeProvider` intentionally renders `defaultTheme` on the server and the
 * first client render so hydration never mismatches; it then syncs to the
 * stored theme after mount. Inject this script in your document `<head>`
 * (before your app scripts) so the correct class is present immediately, while
 * hydration itself stays stable.
 *
 * @param storageKey - localStorage key to read (default: `'pro-ui-theme'`).
 * @returns The script body as a string. Assign it to `dangerouslySetInnerHTML`
 *   or a raw `<script>` tag — it does not include the surrounding `<script>`.
 *
 * @example
 * ```tsx
 * // Next.js / React Router / Hydrogen document <head>
 * import { getThemeInitScript } from '@dangbt/pro-ui'
 *
 * <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
 * ```
 */
export function getThemeInitScript(storageKey: string = 'pro-ui-theme'): string {
  // JSON.stringify keeps the key safely quoted/escaped inside the script.
  const key = JSON.stringify(storageKey)
  return `(function(){try{var t=localStorage.getItem(${key});var d=document.documentElement;d.classList.remove('light','dark');if(t==='light'||t==='dark'){d.classList.add(t);}}catch(e){}})();`
}

/**
 * Returns the current theme context.
 * Must be used inside a <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>')
  return ctx
}
