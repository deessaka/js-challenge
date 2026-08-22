import { Link } from '@inertiajs/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#components/ui/button'

export interface DocumentationSummary {
  slug: string
  title: string
  description: string
  section: string
  order: number
}

interface DocsShellProps {
  documents: DocumentationSummary[]
  currentSlug?: string
  children: React.ReactNode
}

function groupDocuments(documents: DocumentationSummary[]) {
  return documents.reduce<Record<string, DocumentationSummary[]>>((groups, document) => {
    groups[document.section] ??= []
    groups[document.section].push(document)
    return groups
  }, {})
}

export default function DocsShell({ documents, currentSlug, children }: DocsShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const groups = groupDocuments(documents)

  const navigation = (
    <nav aria-label="Documentation" className="space-y-6">
      {Object.entries(groups).map(([section, entries]) => (
        <div key={section}>
          <p className="eyebrow mb-3">{section}</p>
          <div className="space-y-1">
            {entries.map((document) => {
              const active = document.slug === currentSlug
              return (
                <Link
                  key={document.slug}
                  href={`/docs/${document.slug}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {document.title}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4 lg:hidden">
        <p className="text-sm font-semibold">Documentation Codojo</p>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={mobileOpen ? 'Fermer la navigation' : 'Ouvrir la navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <aside className={`${mobileOpen ? 'block' : 'hidden'} lg:sticky lg:top-28 lg:block`}>
          {navigation}
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
