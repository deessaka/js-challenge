import { usePage } from '@inertiajs/react'

import FlashMessages from '#components/auth/flash_messages'
import DashboardLayout from '#components/layouts/dashboard_layout'

interface AdminLayoutProps {
  title: string
  eyebrow?: string
  description?: string
  children: React.ReactNode
}

export default function AdminLayout({
  title,
  eyebrow = 'Administration Codojo',
  description,
  children,
}: AdminLayoutProps) {
  const { flash } = usePage().props as any

  return (
    <DashboardLayout title={title} eyebrow={eyebrow} description={description}>
      <FlashMessages error={flash?.error} success={flash?.success} />
      <div className="mt-6">{children}</div>
    </DashboardLayout>
  )
}
