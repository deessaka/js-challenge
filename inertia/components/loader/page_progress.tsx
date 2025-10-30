import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'

export default function PageProgress() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleFinish = () => setIsLoading(false)

    const removeStartListener = router.on('start', handleStart)
    const removeFinishListener = router.on('finish', handleFinish)

    return () => {
      removeStartListener()
      removeFinishListener()
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="h-1 bg-primary/20">
        <div className="h-full w-1/3 bg-primary animate-progress-indeterminate" />
      </div>
    </div>
  )
}
