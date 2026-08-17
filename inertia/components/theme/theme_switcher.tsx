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
    <div className="inline-flex items-center rounded-lg bg-muted/40 p-1 border border-border/50 backdrop-blur-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-8 w-8 transition-all duration-200 ${
          theme === 'light'
            ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
        }`}
        onClick={() => setTheme('light')}
        aria-label="Mode Clair"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={`h-8 w-8 transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
        }`}
        onClick={() => setTheme('dark')}
        aria-label="Mode Sombre"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ThemeSwitcher
