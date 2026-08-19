import { Link } from '@inertiajs/react'
import { ArrowUpRight, Github } from 'lucide-react'
import { Button } from '#components/ui/button'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-foreground bg-background" aria-label="Pied de page">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <Button asChild variant="nav" size="nav">
            <Link href="/">Codojo_</Link>
          </Button>
          <span className="text-xs text-muted-foreground">© {currentYear}</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Button asChild variant="nav" size="nav">
            <Link href="/about">À propos</Link>
          </Button>
          <Button asChild variant="nav" size="nav">
            <a
              href="https://github.com/Ekole237/js-challenge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Voir le dépôt GitHub"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
