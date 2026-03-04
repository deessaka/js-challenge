import React, { useEffect } from 'react'
import Header, { HeaderProps } from '#components/header/header'
import Footer from '#components/footer/footer'
import ThemeProvider from '#components/ui/components/theme_provider'
import DeviceDetector from '#components/device-detector/mb_check'
import Notifications from '#components/notifications/notifications'
import PageProgress from '#components/loader/page_progress'
import { motion, AnimatePresence } from 'framer-motion'
import { usePage } from '@inertiajs/react'

interface Props {
  children: React.ReactNode
  headerProps?: HeaderProps
}

export default function BaseLayout({ children, headerProps }: Props) {
  const { component } = usePage()

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [component])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DeviceDetector>
        <div className="relative">
          <PageProgress />
          <Notifications />

          <AnimatePresence mode="wait">
            <motion.div
              key={component}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            >
              <div className="flex flex-col min-h-screen">
                <Header {...headerProps} />
                <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8 relative">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="max-w-7xl mx-auto"
                  >
                    {children}
                  </motion.div>
                </main>
                <Footer />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
