import { useCallback, useState } from 'react'
import { router } from '@inertiajs/react'

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

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
    async (url: string, method: Method = 'post') => {
      setIsSubmitting(true)
      try {
        router.visit(url, {
          method,
          data: initialData as Record<string, any>,
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
