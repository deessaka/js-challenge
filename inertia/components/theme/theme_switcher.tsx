import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '~/providers/theme_context'

interface Props {}

function ThemeSwitcher(props: Props) {
  const {} = props
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 p-1 text-sm">
      <button
        className={`rounded-full p-1.5 transition-colors ${
          theme === 'light'
            ? 'bg-white text-primary shadow-sm dark:bg-primary dark:text-white'
            : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light'
        }`}
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        className={`rounded-full p-1.5 transition-colors ${
          theme === 'dark'
            ? 'bg-white text-primary shadow-sm dark:bg-primary dark:text-white'
            : 'text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light'
        }`}
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  )
}

export default ThemeSwitcher
