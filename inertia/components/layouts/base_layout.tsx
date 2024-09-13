import React from 'react'
import Header from '#components/header/header'
import ThemeProvider from '#components/ui/components/theme_provider'
import DeviceDetector from '#components/device-detector/mb_check'

interface Props {
  children: React.ReactNode
}

export default function BaseLayout({ children }: Props) {
  const renderContent = () => {
    return (
      <>
        <DeviceDetector>
          <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 mx-auto px-14 py-8 overflow-auto">
            <Header />
            <main className="flex-grow mx-auto px-4 py-8 max-w-screen-2xl">
              <div className="flex flex-col lg:flex-row gap-8">{children}</div>
            </main>
          </div>
        </DeviceDetector>
      </>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {renderContent()}
    </ThemeProvider>
  )
}
