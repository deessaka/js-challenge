import React from 'react'
import AnimatedBackground from '#components/animated_bg_comp/animated_bg_component'
import ThemeProvider from '#components/ui/components/theme_provider'
import Header from '#components/header/header'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const renderContent = () => {
    return (
      <AnimatedBackground videoSrc={''}>
        <div className="min-h-screen flex flex-col mx-auto px-14 py-8 sm:px-16 sm:py-12 lg:px-24 lg:py-16 max-w-lg min-w-lg">
          <Header />
          <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">{children}</div>
          </main>
        </div>
      </AnimatedBackground>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {renderContent()}
    </ThemeProvider>
  )
}
