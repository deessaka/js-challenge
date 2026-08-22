import { Link } from '@inertiajs/react'
import { ArrowRight, BookOpen, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import DocsShell, { type DocumentationSummary } from '#components/docs/docs_shell'
import BaseLayout from '#components/layouts/base_layout'
import { Card, CardContent } from '#components/ui/card'

interface DocsIndexProps {
  documents: DocumentationSummary[]
}

export default function DocsIndex({ documents }: DocsIndexProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('fr')
  const filteredDocuments = useMemo(
    () =>
      normalizedQuery
        ? documents.filter((document) =>
            `${document.title} ${document.description} ${document.section}`
              .toLocaleLowerCase('fr')
              .includes(normalizedQuery)
          )
        : documents,
    [documents, normalizedQuery]
  )

  return (
    <DocsShell documents={documents}>
      <div className="space-y-10">
        <header className="max-w-3xl space-y-5">
          <p className="eyebrow">Documentation Codojo</p>
          <h1 className="display-heading text-4xl sm:text-5xl">
            Apprendre JavaScript en pratiquant.
          </h1>
          <p className="text-base leading-8 text-muted-foreground">
            Retrouvez les parcours, les conventions de challenge et les outils qui vous aident à
            progresser dans Codojo.
          </p>
        </header>

        <label className="relative block max-w-2xl">
          <span className="sr-only">Rechercher dans la documentation</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher dans la documentation…"
            className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-sm text-muted-foreground">
              Aucun document ne correspond à « {query} ».
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredDocuments.map((document) => (
              <Link key={document.slug} href={`/docs/${document.slug}`} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/50">
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <ArrowRight
                        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="eyebrow">{document.section}</p>
                      <h2 className="mt-2 text-lg font-semibold">{document.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {document.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DocsShell>
  )
}

DocsIndex.layout = (page: React.ReactNode) => (
  <BaseLayout
    seo={{
      title: 'Documentation',
      description: 'Guides et références pour apprendre et utiliser Codojo.',
      canonical: '/docs',
    }}
  >
    {page}
  </BaseLayout>
)
