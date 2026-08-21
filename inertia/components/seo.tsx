import { Head } from '@inertiajs/react'

export interface SeoProps {
  title?: string
  description?: string
  image?: string
}

export default function Seo({ title, description, image }: SeoProps) {
  const defaultTitle = 'Codojo - Apprenez JavaScript par la pratique'
  const defaultDescription =
    'Le dojo d’entraînement aux katas JavaScript. Moins de théorie, plus de réflexes.'
  const defaultImage = '/codojo-og.png' // L'image par défaut pour les réseaux sociaux (à ajouter dans le dossier public)

  const siteName = 'Codojo'
  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle
  const pageDescription = description || defaultDescription
  const pageImage = image || defaultImage

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta head-key="description" name="description" content={pageDescription} />

      {/* Open Graph */}
      <meta head-key="og:title" property="og:title" content={pageTitle} />
      <meta head-key="og:description" property="og:description" content={pageDescription} />
      <meta head-key="og:site_name" property="og:site_name" content={siteName} />
      <meta head-key="og:type" property="og:type" content="website" />
      <meta head-key="og:image" property="og:image" content={pageImage} />

      {/* Twitter */}
      <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter:title" name="twitter:title" content={pageTitle} />
      <meta head-key="twitter:description" name="twitter:description" content={pageDescription} />
      <meta head-key="twitter:image" name="twitter:image" content={pageImage} />
    </Head>
  )
}
