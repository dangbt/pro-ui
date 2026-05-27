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
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    return (localStorage.getItem(storageKey) as Theme) ?? defaultTheme
  })

  const getResolved = (t: Theme): 'light' | 'dark' => {
    if (t !== 'system') return t
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    typeof window === 'undefined' ? 'light' : getResolved(theme),
  )

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
 * Returns the current theme context.
 * Must be used inside a <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>')
  return ctx
}
