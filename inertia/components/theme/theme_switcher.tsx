import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '#components/ui/button'
import { useTheme } from '~/providers/theme_context'

function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="inline-flex items-center gap-1 border-2 border-foreground bg-background p-1">
      <Button
        type="button"
        variant={theme === 'light' ? 'toggleActive' : 'toggle'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('light')}
        aria-label="Mode Clair"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={theme === 'dark' ? 'toggleActive' : 'toggle'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('dark')}
        aria-label="Mode Sombre"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ThemeSwitcher
