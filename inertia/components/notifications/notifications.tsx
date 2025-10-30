import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'

export default function Notifications() {
  const { props } = usePage()
  const { flash } = props

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
    if (flash?.warning) {
      toast.warning(flash.warning)
    }
    if (flash?.info) {
      toast.info(flash.info)
    }
  }, [flash])

  return (
    <Toaster
      position="top-right"
      richColors
      expand
      closeButton
      theme="dark"
      toastOptions={{
        className: 'toast',
        style: {
          background: 'rgb(17, 24, 39)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
        },
      }}
    />
  )
}
