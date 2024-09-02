import React, { useEffect } from 'react'
import { Theme, ThemeProviderContext } from '~/providers/theme_context'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export default function ThemeProvider({
  children,
  defaultTheme,
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  let storedTheme: string | null = null
  let setLocalStorage: any = null

  useEffect(() => {
    storedTheme = localStorage.getItem(storageKey)
  }, [])

  const [theme, setTheme] = React.useState<Theme>(() => (storedTheme as Theme) || defaultTheme)

  console.log('theme', theme)
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}
