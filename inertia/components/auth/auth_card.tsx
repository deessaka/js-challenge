import { Link } from '@inertiajs/react'
import { ArrowLeft, Code2 } from 'lucide-react'

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle: string
  showBackButton?: boolean
  isVisible?: boolean
  maxContentHeight?: string
}

export default function AuthCard({
  children,
  title,
  subtitle,
  showBackButton = true,
  maxContentHeight = '85vh',
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-160px)] items-center justify-center py-8 sm:py-12">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <section
        className="surface relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem]"
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
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Code2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="eyebrow mt-6">JS Challenge</p>
            <h1 className="display-heading mt-3 text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  )
}
