import type { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'

import AdminSidebar from '#components/admin/admin_sidebar'
import AdminHeader from '#components/admin/admin_header'
import FlashMessages from '#components/auth/flash_messages'
import AppShell from '#components/layouts/app_shell'
import PageHeader from '#components/page/page_header'
import Seo from '#components/seo'

type AdminLayoutProps = {
  title: string
  eyebrow?: string
  description?: string
  children: ReactNode
}

export default function AdminLayout({
  title,
  eyebrow = 'Administration',
  description,
  children,
}: AdminLayoutProps) {
  const { flash } = usePage().props as any

  return (
    <AppShell>
      <Seo title={`Admin - ${title}`} description={description} />
      <AdminHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[1440px] flex-1 gap-8 px-5 py-8 sm:px-8 lg:px-12 lg:py-12"
      >
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <PageHeader eyebrow={eyebrow} title={title} description={description} />
          <FlashMessages error={flash?.error} success={flash?.success} />
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </AppShell>
  )
}
