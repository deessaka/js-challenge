import React from 'react'
import ThemeProvider from '#components/ui/components/theme_provider'
import Header from '#components/header/header'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const renderContent = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 mx-auto px-14 py-8 sm:px-16 sm:py-12 lg:px-24 lg:py-16">
        <Header />
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">{children}</div>
        </main>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {renderContent()}
    </ThemeProvider>
  )
}
