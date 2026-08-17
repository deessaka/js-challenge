import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'

import SiteHeader, { type HeaderProps } from '#components/header/header'
import Footer from '#components/footer/footer'
import ThemeProvider from '#components/ui/components/theme_provider'
import DeviceDetector from '#components/device-detector/mb_check'
import Notifications from '#components/notifications/notifications'
import PageProgress from '#components/loader/page_progress'
import { cn } from '~/lib/utils'

interface Props {
  children: React.ReactNode
  headerProps?: HeaderProps
  contentClassName?: string
}

export default function BaseLayout({ children, headerProps, contentClassName }: Props) {
  const { component } = usePage()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [component])

  return (
    <ThemeProvider defaultTheme="light" storageKey="js-challenge-theme">
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
              <SiteHeader {...headerProps} />
              <main id="main-content" className="flex-1">
                <div
                  className={cn(
                    'mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12',
                    contentClassName
                  )}
                >
                  {children}
                </div>
              </main>
              <Footer />
            </motion.div>
          </AnimatePresence>
        </div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
