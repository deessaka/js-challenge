import React from 'react'
import Header from '#components/header/header'
import ThemeProvider from '#components/ui/components/theme_provider'
import { EditorProvider } from '#components/context/editor_context'
import DeviceDetector from '#components/device-detector/mb_check'

interface Props {
  children: React.ReactNode
}

export default function ExerciseLayout({ children }: Props) {
  const renderContent = () => {
    return (
      <DeviceDetector>
        <div className="min-h-screen bg-gray-100 flex flex-col dark:bg-gray-900 mx-auto px-14 py-8">
          <Header />
          <main className="flex-grow container mx-auto px-5 py-8 max-w-screen-2xl">{children}</main>
        </div>
      </DeviceDetector>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <EditorProvider>{renderContent()}</EditorProvider>
    </ThemeProvider>
  )
}
