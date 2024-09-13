import ThemeSwitcher from '#components/theme/theme_switcher'
import { GithubIcon, TwitterIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeaderProps {}
interface RenderItemIconProps {}

const Icons = [
  {
    icon: <GithubIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    href: 'https://github.com/ekodev/js-challenge',
    target: '_blank',
  },
  {
    icon: <TwitterIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    href: 'https://twitter.com/Ekdev237',
    target: '_blank',
  },
]

function Header({}: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const onComponentDidMount = () => {
      setIsMounted(true)
    }
    window.addEventListener('DOMContentLoaded', onComponentDidMount)
    return () => {
      window.removeEventListener('DOMContentLoaded', onComponentDidMount)
    }
  }, [isMounted])

  const RenderItemIcon = ({}: RenderItemIconProps) => {
    return Icons.map(({ icon, href, target }, index: number) => {
      return (
        <a
          href={href}
          target={target}
          key={index}
          className="cursor-pointer transition-all duration-300 ease-in-out p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {icon}
        </a>
      )
    })
  }

  return (
    <header className="max-w-screen-2xl w-full mx-auto border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg sm:rounded-xl bg-transparent p-2 gap-2 sm:gap-4 shadow-black">
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 gap-2 sm:gap-4 mx-auto">
        <div className="text-accent-content-light dark:text-accent-content-dark text-xl sm:text-2xl font-dmItalic">
          JS Challenge
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <RenderItemIcon />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}

export default Header
