import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

interface PageSectionProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export default function PageSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: PageSectionProps) {
  return (
    <section className={cn('space-y-5', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title && <h2 className="text-xl font-semibold tracking-tight">{title}</h2>}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(contentClassName)}>{children}</div>
    </section>
  )
}
