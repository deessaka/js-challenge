import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'

import ThemeProvider from '#components/ui/components/theme_provider'
import DeviceDetector from '#components/device-detector/mb_check'
import Notifications from '#components/notifications/notifications'
import PageProgress from '#components/loader/page_progress'

export default function AppShell({ children }: { children: ReactNode }) {
  const { component } = usePage()

  useEffect(() => window.scrollTo({ top: 0, behavior: 'auto' }), [component])

  return (
    <ThemeProvider defaultTheme="light" storageKey="codojo-theme">
      <DeviceDetector>
        <div className="site-shell min-h-screen overflow-x-hidden">
          <PageProgress />
          <Notifications />
          <a
            href="#main-content"
            className="focus-ring sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Aller au contenu
          </a>
          <AnimatePresence mode="wait">
            <motion.div
              key={component}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex min-h-screen flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
