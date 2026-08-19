import SiteHeader, { type HeaderProps } from '#components/header/header'
import Footer from '#components/footer/footer'
import AppShell from '#components/layouts/app_shell'
import { cn } from '~/lib/utils'

interface Props {
  children: React.ReactNode
  headerProps?: HeaderProps
  contentClassName?: string
}

export default function BaseLayout({ children, headerProps, contentClassName }: Props) {
  return (
    <AppShell>
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
    </AppShell>
  )
}
