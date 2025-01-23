import React from 'react'
import Header from '#components/header/header'
import ThemeProvider from '#components/ui/components/theme_provider'
import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import DeviceDetector from '#components/device-detector/mb_check'

interface Props {
  children: React.ReactNode
}

export default function ExerciseLayout({ children }: PropsWithChildren) {
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
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </motion.div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
