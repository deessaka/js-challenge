import { Home, BookOpen, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'

interface RenderIconProps {
  icon: any
  active: boolean
  index: number
}

const Icons = {
  home: <Home className="text-accent-content-light" size={32} />,
  exercises: <BookOpen className="text-accent-content-light" size={32} />,
  settings: <Settings className="text-accent-content-light" size={32} />,
}

const renderIcon = ({ icon, active, index }: RenderIconProps) => {
  return (
    <div
      key={index}
      className={`${active ? 'text-primary-dark border-b-2 border-primary-dark scale-110 ' : ''} hover:scale-125 hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out`}
    >
      {icon}
    </div>
  )
}

function MenuComponent() {
  const [location, setLocation] = useState<string>('')
  useEffect(() => {
    const handleLocationChange = () => {
      const currentLocation = window.location.pathname.split('/')[1]
      setLocation(currentLocation || 'home')
    }
    window.addEventListener('locationchange', handleLocationChange)
    handleLocationChange()
    return () => {
      window.removeEventListener('locationchange', handleLocationChange)
    }
  }, [])

  return (
    <div className="border-b border-gray-200 shadow-md max-w-fit">
      <div className="flex items-center justify-between p-2 gap-4">
        {Object.entries(Icons).map(([key, icon], index) => {
          return renderIcon({
            icon,
            active: key === location,
            index: index,
          })
        })}
      </div>
    </div>
  )
}

export default MenuComponent
