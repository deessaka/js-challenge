import React, { useEffect, useState } from 'react'
import { ThemeProviderContext, type Theme } from '~/providers/theme_context'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export default function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'js-challenge-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme
    return (localStorage.getItem(storageKey) as Theme | null) || defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme
  }, [theme])

  const setTheme = (nextTheme: Theme) => {
    localStorage.setItem(storageKey, nextTheme)
    setThemeState(nextTheme)
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
