import { readFile, readdir } from 'node:fs/promises'
import { relative, resolve, sep } from 'node:path'
import hljs from 'highlight.js/lib/common'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export interface DocumentationHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface DocumentationSummary {
  slug: string
  title: string
  description: string
  section: string
  order: number
}

export interface DocumentationPage extends DocumentationSummary {
  html: string
  headings: DocumentationHeading[]
}

interface ParsedFrontmatter {
  title?: string
  description?: string
  section?: string
  order?: number
  draft?: boolean
}

const CONTENT_ROOT = resolve(process.cwd(), 'docs/content')
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_DOCUMENT_BYTES = 256 * 1024
const ALLOWED_TAGS = [
  'a',
  'blockquote',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'span',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'ul',
]
const ALLOWED_ATTRIBUTES = {
  a: ['href', 'title'],
  code: ['class'],
  span: ['class'],
}

let cachedPages: DocumentationPage[] | null = null

function parseScalar(value: string): string {
  const trimmed = value.trim()
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function parseFrontmatter(
  source: string,
  fileName: string
): { meta: ParsedFrontmatter; body: string } {
  if (!source.startsWith('---\n')) {
    throw new Error(`Frontmatter manquant dans ${fileName}`)
  }

  const closingMarker = source.indexOf('\n---\n', 4)
  if (closingMarker < 0) {
    throw new Error(`Frontmatter invalide dans ${fileName}`)
  }

  const rawFrontmatter = source.slice(4, closingMarker)
  const meta: ParsedFrontmatter = {}
  for (const line of rawFrontmatter.split('\n')) {
    const match = /^(title|description|section|order|draft):\s*(.+)$/.exec(line.trim())
    if (!match) continue

    const [, key, rawValue] = match
    if (key === 'order') {
      const order = Number(rawValue)
      if (!Number.isInteger(order) || order < 0 || order > 10000) {
        throw new Error(`Ordre invalide dans ${fileName}`)
      }
      meta.order = order
    } else if (key === 'draft') {
      meta.draft = rawValue.trim() === 'true'
    } else if (key === 'title') {
      meta.title = parseScalar(rawValue)
    } else if (key === 'description') {
      meta.description = parseScalar(rawValue)
    } else if (key === 'section') {
      meta.section = parseScalar(rawValue)
    }
  }

  return { meta, body: source.slice(closingMarker + 5) }
}

function slugifyHeading(text: string, usedIds: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  let id = base
  let suffix = 2
  while (usedIds.has(id)) id = `${base}-${suffix++}`
  usedIds.add(id)
  return id
}

function plainText(value: string): string {
  return value
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function addHeadingIds(html: string, headings: DocumentationHeading[]): string {
  const usedIds = new Set<string>()
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_full, level: string, inner: string) => {
    const text = plainText(inner.replace(/<[^>]+>/g, ''))
    const id = slugifyHeading(text, usedIds)
    headings.push({ id, text, level: Number(level) as 2 | 3 })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/[&<>'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '\"': '&quot;',
    }
    return entities[character]
  })
}

const markdownRenderer = new marked.Renderer()
markdownRenderer.code = ({ text, lang }) => {
  const language = lang?.trim().split(/\s+/)[0].toLowerCase()
  if (language && /^[a-z0-9_+-]+$/.test(language) && hljs.getLanguage(language)) {
    const highlighted = hljs.highlight(text, { language }).value
    return `<pre><code class="hljs language-${escapeHtmlAttribute(language)}">${highlighted}</code></pre>`
  }

  return `<pre><code>${escapeHtmlAttribute(text)}</code></pre>`
}

export function renderDocumentationMarkdown(body: string): {
  html: string
  headings: DocumentationHeading[]
} {
  const headings: DocumentationHeading[] = []
  const rawHtml = marked.parse(body, {
    async: false,
    gfm: true,
    renderer: markdownRenderer,
  }) as string
  const safeHtml = sanitizeHtml(rawHtml, {
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedTags: ALLOWED_TAGS,
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
  })
  return { html: addHeadingIds(safeHtml, headings), headings }
}

function assertInsideContentRoot(filePath: string): void {
  const relativePath = relative(CONTENT_ROOT, filePath)
  if (!relativePath || relativePath.startsWith(`..${sep}`) || relativePath === '..') {
    throw new Error('Chemin documentaire interdit')
  }
}

async function loadPage(fileName: string): Promise<DocumentationPage | null> {
  const filePath = resolve(CONTENT_ROOT, fileName)
  assertInsideContentRoot(filePath)
  const source = await readFile(filePath, 'utf8')
  if (Buffer.byteLength(source, 'utf8') > MAX_DOCUMENT_BYTES) {
    throw new Error(`Document trop volumineux : ${fileName}`)
  }

  const { meta, body } = parseFrontmatter(source, fileName)
  const slug = fileName.replace(/\.md$/, '')
  if (!SLUG_PATTERN.test(slug) || meta.draft) return null
  if (!meta.title || !meta.description || !meta.section || meta.order === undefined) {
    throw new Error(`Métadonnées incomplètes dans ${fileName}`)
  }

  const rendered = renderDocumentationMarkdown(body)
  return {
    slug,
    title: meta.title,
    description: meta.description,
    section: meta.section,
    order: meta.order,
    ...rendered,
  }
}

async function loadPages(): Promise<DocumentationPage[]> {
  const entries = await readdir(CONTENT_ROOT, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort()
  const pages = await Promise.all(files.map(loadPage))
  return pages
    .filter((page): page is DocumentationPage => page !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'fr'))
}

export async function listDocumentation(): Promise<DocumentationSummary[]> {
  const pages = await getDocumentationPages()
  return pages.map(({ html: _html, headings: _headings, ...summary }) => summary)
}

export async function getDocumentationPage(slug: string): Promise<DocumentationPage | null> {
  if (!SLUG_PATTERN.test(slug)) return null
  const pages = await getDocumentationPages()
  return pages.find((page) => page.slug === slug) ?? null
}

export async function getDocumentationPages(): Promise<DocumentationPage[]> {
  if (!cachedPages) cachedPages = await loadPages()
  return cachedPages
}

export function clearDocumentationCache(): void {
  cachedPages = null
}
