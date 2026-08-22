import { Link } from '@inertiajs/react'
import type { ReactElement } from 'react'
import { ArrowLeft, ArrowRight, List } from 'lucide-react'

import DocsShell, { type DocumentationSummary } from '#components/docs/docs_shell'
import BaseLayout from '#components/layouts/base_layout'

interface DocumentationHeading {
  id: string
  text: string
  level: 2 | 3
}

interface DocumentationPage {
  slug: string
  title: string
  description: string
  section: string
  order: number
  html: string
  headings: DocumentationHeading[]
}

interface DocsShowProps {
  document: DocumentationPage
  documents: DocumentationSummary[]
}

export default function DocsShow({ document, documents }: DocsShowProps) {
  const index = documents.findIndex((entry) => entry.slug === document.slug)
  const previous = index > 0 ? documents[index - 1] : undefined
  const next = index >= 0 && index < documents.length - 1 ? documents[index + 1] : undefined

  return (
    <DocsShell documents={documents} currentSlug={document.slug}>
      <article className="docs-article">
        <header className="mb-10 max-w-3xl space-y-4">
          <p className="eyebrow">{document.section}</p>
          <h1 className="display-heading text-4xl sm:text-5xl">{document.title}</h1>
          <p className="text-base leading-8 text-muted-foreground">{document.description}</p>
        </header>

        {document.headings.length > 0 && (
          <nav
            aria-label="Sur cette page"
            className="mb-10 rounded-sm border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_hsl(var(--foreground))] lg:hidden"
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <List className="h-4 w-4 text-primary" aria-hidden="true" />
              Sur cette page
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {document.headings.map((heading) => (
                <li key={heading.id} className={heading.level === 3 ? 'pl-4' : undefined}>
                  <a className="hover:text-foreground" href={`#${heading.id}`}>
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="docs-article-body" dangerouslySetInnerHTML={{ __html: document.html }} />

        <nav
          aria-label="Navigation documentaire"
          className="mt-14 grid gap-4 border-t border-border pt-6 sm:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/docs/${previous.slug}`}
              className="group rounded-sm border-2 border-foreground bg-card p-5 shadow-[3px_3px_0_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_hsl(var(--foreground))]"
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Précédent
              </span>
              <span className="mt-2 block font-semibold group-hover:text-primary">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group rounded-sm border-2 border-foreground bg-card p-5 text-left shadow-[3px_3px_0_hsl(var(--foreground))] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0_hsl(var(--foreground))] sm:text-right"
            >
              <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                Suivant
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold group-hover:text-primary">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      </article>
    </DocsShell>
  )
}

DocsShow.layout = (page: ReactElement<DocsShowProps>) => (
  <BaseLayout
    seo={{
      title: page.props.document.title,
      description: page.props.document.description,
      canonical: `/docs/${page.props.document.slug}`,
    }}
  >
    {page}
  </BaseLayout>
)
