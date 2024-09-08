import React, { useState, useEffect } from 'react'

const DeviceDetector = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDeviceOrTablet = () => {
      setIsMobile(window.innerWidth < 768) // Considère les écrans < 768px comme mobiles
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1366) // Considère les écrans >= 768px et < 1366px comme tablettes
    }

    checkDeviceOrTablet()
    window.addEventListener('resize', checkDeviceOrTablet)

    return () => window.removeEventListener('resize', checkDeviceOrTablet)
  }, [])

  if (isMobile || isTablet) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="text-center bg-white p-8 rounded-lg shadow-md dark:bg-gray-900">
          <h1 className="text-2xl font-bold mb-4">Appareil non supporté</h1>
          <p className="mb-4">
            Désolé, cette application est optimisée pour les ordinateurs. Veuillez utiliser un
            appareil avec un écran plus grand.
          </p>
          <p className="text-sm text-gray-500">
            Largeur d'écran minimale recommandée : 768px (tablette) ou 1366px (ordinateur)
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default DeviceDetector
