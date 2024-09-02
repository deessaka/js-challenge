import ThemeSwitcher from '#components/theme/theme_switcher'
import { GithubIcon, TwitterIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HeaderProps {}
interface RenderItemIconProps {}

const Icons = [
  {
    icon: <GithubIcon className="h-6 w-6" />,
    href: 'https://github.com/ekodev/js-challenge',
    target: '_blank',
  },
  {
    icon: <TwitterIcon className="h-6 w-6" />,
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
    console.log('switcher mounted', isMounted)
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
          className={`cursor-pointer transition-all duration-300 ease-in-out p-1 rounded-md`}
        >
          {icon}
        </a>
      )
    })
  }

  return (
    <div className="border border-gray-200 shadow-md rounded-lg">
      <div className="flex items-center justify-between p-2 gap-4">
        <div className="text-accent-content-light text-2xl font-dmItalic">JS Challenge</div>
        <div className="flex items-center gap-4">
          <RenderItemIcon />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  )
}

export default Header
