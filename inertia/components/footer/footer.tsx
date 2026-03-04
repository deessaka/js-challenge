import { Link } from '@inertiajs/react'
import { Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-card/30 py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              Accueil
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              À propos
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <a
              href="https://github.com/Ekole237/js-challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono">GitHub</span>
            </a>
            <span className="text-xs font-medium text-muted-foreground/60 border-l border-border/50 pl-8">
              © {currentYear} JS Challenge. Built with passion.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
