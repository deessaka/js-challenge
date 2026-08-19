import type { ReactNode } from 'react'

import { cn } from '~/lib/utils'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  leading?: ReactNode
  className?: string
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  leading,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn('flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="flex min-w-0 items-center gap-4">
        {leading}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="display-heading text-4xl uppercase sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
