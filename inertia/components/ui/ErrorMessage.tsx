import { cn } from '~/lib/utils'

interface ErrorMessageProps {
  message?: string
  className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null

  return (
    <div
      className={cn(
        'rounded-md bg-destructive/15 p-3 text-sm text-destructive',
        className
      )}
    >
      {message}
    </div>
  )
}
