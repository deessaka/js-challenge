import React, { useEffect, useState } from 'react'
import Header from '#components/header/header'
import MenuComponent from '#components/menu/menu'
import ThemeProvider from '#components/ui/components/theme_provider'

interface Props {
  children: React.ReactNode
}

export default function BaseLayout({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkTablet = () => {
      setIsTablet(window.innerWidth < 1366)
    }

    // Check on initial load
    checkMobile()
    checkTablet()

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    window.addEventListener('resize', checkTablet)

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', checkTablet)
    }
  }, [])

  const renderContent = () => {
    if (isMobile || isTablet) {
      return (
        <div className="flex flex-col min-h-screen items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Mobile Not Supported</h1>
          <p>We apologize, but this application is currently optimized for desktop use only.</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col min-h-screen h-[100vh]">
        <div className="flex-1 flex flex-col mx-auto px-4 md:px-14 w-full relative py-4">
          <Header />
          <main className="container mx-auto max-h-full h-full my-2 overflow-auto">{children}</main>
          {/* <div className="flex justify-center fixed bottom-6 left-0 right-0 z-10">
            <MenuComponent />
          </div> */}
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {renderContent()}
    </ThemeProvider>
  )
}
