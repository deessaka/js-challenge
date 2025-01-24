import { useCallback, useState } from 'react'
import { router } from '@inertiajs/react'

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message)
    } else if (typeof err === 'string') {
      setError(err)
    } else {
      setError('Une erreur inattendue est survenue')
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

export function useInertiaForm<T>(initialData: T) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const submit = useCallback(
    async (url: string, method: string = 'post') => {
      setIsSubmitting(true)
      try {
        await router.visit(url, {
          method,
          data: initialData,
          onError: (errors) => {
            setErrors(errors)
          },
          onFinish: () => {
            setIsSubmitting(false)
          },
        })
      } catch (error) {
        setIsSubmitting(false)
        throw error
      }
    },
    [initialData]
  )

  return {
    isSubmitting,
    errors,
    submit,
    setErrors,
  }
}
