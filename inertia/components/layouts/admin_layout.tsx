import type { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'

import AdminSidebar from '#components/admin/admin_sidebar'
import FlashMessages from '#components/auth/flash_messages'
import BaseLayout from '#components/layouts/base_layout'
import PageHeader from '#components/page/page_header'

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
    <BaseLayout contentClassName="flex flex-1 flex-col gap-8 lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1">
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        <FlashMessages error={flash?.error} success={flash?.success} />
        <div className="mt-8">{children}</div>
      </main>
    </BaseLayout>
  )
}
