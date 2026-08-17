import { Link } from '@inertiajs/react'
import { ArrowUpRight, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-foreground/10 bg-background/60" aria-label="Pied de page">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="focus-ring text-sm font-semibold text-foreground transition-colors duration-150 hover:text-primary"
          >
            Codojo
          </Link>
          <span className="text-xs text-muted-foreground">© {currentYear}</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link
            href="/about"
            className="focus-ring transition-colors duration-150 hover:text-foreground"
          >
            À propos
          </Link>
          <a
            href="https://github.com/Ekole237/js-challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-foreground"
            aria-label="Voir le dépôt GitHub"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
