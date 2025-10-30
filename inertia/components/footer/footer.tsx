import { Link } from '@inertiajs/react'
import { Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gradient-to-t from-gray-900/50 to-transparent py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Accueil
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              À propos
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="text-sm text-gray-500">
              © {currentYear} JS Challenge. Tous droits réservés.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
