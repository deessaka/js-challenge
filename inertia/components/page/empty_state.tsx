import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card, CardContent } from '#components/ui/card'
import { Button } from '#components/ui/button'
import { cn } from '~/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed bg-card/60', className)}>
      <CardContent className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon || <Inbox className="h-5 w-5" aria-hidden="true" />}
        </span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="mt-1">{action}</div>}
      </CardContent>
    </Card>
  )
}
