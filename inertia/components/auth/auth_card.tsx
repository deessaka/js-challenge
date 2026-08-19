import { Link } from '@inertiajs/react'
import { ArrowLeft, Code2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthCardProps {
  children: React.ReactNode
  title: string
  icon?: ReactNode
  subtitle: string
  showBackButton?: boolean
  isVisible?: boolean
  maxContentHeight?: string
}

export default function AuthCard({
  children,
  title,
  icon,
  subtitle,
  showBackButton = true,
  maxContentHeight = '85vh',
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-160px)] items-center justify-center py-8 sm:py-12">
      <div className="pointer-events-none absolute left-[8%] top-[12%] h-24 w-24 rotate-12 border-2 border-foreground bg-primary" />
      <section
        className="surface relative z-10 w-full max-w-md overflow-hidden rounded-sm"
        style={{ maxHeight: maxContentHeight }}
      >
        {showBackButton && (
          <Link
            href="/"
            className="focus-ring absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Retour
          </Link>
        )}
        <div className="max-h-[inherit] overflow-y-auto px-6 py-10 sm:px-9 sm:py-12">
          <div className="text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
              {icon || <Code2 className="h-5 w-5" aria-hidden="true" />}
            </span>
            <p className="eyebrow mt-6">Codojo</p>
            <h1 className="display-heading mt-3 text-3xl uppercase">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  )
}
