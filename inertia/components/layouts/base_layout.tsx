import React from 'react'
import Header from '#components/header/header'
import ThemeProvider from '#components/ui/components/theme_provider'
import DeviceDetector from '#components/device-detector/mb_check'
import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
}

export default function BaseLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DeviceDetector>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </motion.div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
