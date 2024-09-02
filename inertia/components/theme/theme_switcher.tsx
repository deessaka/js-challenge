import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '~/providers/theme_context'
interface Props {}

function ThemeSwitcher(props: Props) {
  const {} = props
  const themes = ['light', 'dark']
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [toggleTheme, setToggleTheme] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  const toggleThemeHandler = () => {
    setToggleTheme(!toggleTheme)
    setTheme(toggleTheme ? 'dark' : 'light')
  }

  return (
    <div className="inline-flex items-center rounded-3xl bg-accent-foreground dark:bg-primary-light p-[1px] text-sm transition-all duration-75 ease-in-out">
      {themes.map((t) => {
        const isActive = t === theme
        return (
          <button
            key={t}
            className={`${isActive ? 'bg-primary-dark border border-primary-dark' : 'dark:text-primary-light'} rounded-3xl p-1 cursor-pointer`}
            onClick={toggleThemeHandler}
          >
            {t === 'light' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )
      })}
    </div>
  )
}

export default ThemeSwitcher
