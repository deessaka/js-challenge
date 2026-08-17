import { Link } from '@inertiajs/react'
import { Code2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '#components/ui/button'
import { cn } from '~/lib/utils'

interface WorkspaceHeaderProps {
  eyebrow: string
  title: string
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
}

export default function WorkspaceHeader({
  eyebrow,
  title,
  leading,
  trailing,
  className,
}: WorkspaceHeaderProps) {
  return (
    <header
      className={cn(
        'border-b border-workspace-border bg-workspace-background/95 text-workspace-foreground backdrop-blur-xl',
        className
      )}
    >
      <nav
        className="mx-auto flex h-[72px] w-full items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Navigation de l’atelier"
      >
        <div className="flex min-w-0 items-center gap-3">
          {leading || (
            <Button asChild variant="ghost" size="icon" className="text-workspace-muted hover:bg-workspace-panel hover:text-workspace-foreground">
              <Link href="/home" aria-label="Retour au catalogue">
                <Code2 aria-hidden="true" />
              </Link>
            </Button>
          )}
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-workspace-accent">
              {eyebrow}
            </p>
            <h1 className="truncate text-sm font-semibold text-workspace-foreground">{title}</h1>
          </div>
        </div>
        {trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
      </nav>
    </header>
  )
}
