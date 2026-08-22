// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  root: './',
  site: 'https://docs.codojo.ekodevs.com',
  vite: {
    resolve: {
      tsconfigPaths: false,
    },
  },
  integrations: [
    starlight({
      title: 'Codojo Docs',
      description: 'Apprendre JavaScript avec Codojo, sur le Web et dans le terminal.',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Ekole237/js-challenge',
        },
      ],
      sidebar: [
        {
          label: 'Premiers pas',
          items: [
            { label: 'Découvrir Codojo', slug: 'getting-started/what-is-codojo' },
            { label: 'Votre premier challenge', slug: 'getting-started/first-challenge' },
          ],
        },
        {
          label: 'Challenges',
          items: [
            { label: 'Comment fonctionnent les challenges', slug: 'challenges/how-it-works' },
            { label: 'Exécuter les tests', slug: 'challenges/running-tests' },
            { label: 'Soumettre une solution', slug: 'challenges/submitting' },
          ],
        },
        {
          label: 'VS Code',
          items: [{ label: 'État de l’intégration', slug: 'vscode' }],
        },
        {
          label: 'CLI',
          items: [
            { label: 'Installation', slug: 'cli/installation' },
            { label: 'Authentification', slug: 'cli/authentication' },
            { label: 'Commandes', slug: 'cli/commands' },
            { label: 'Mise à jour', slug: 'cli/update' },
          ],
        },
        {
          label: 'Progression',
          items: [{ label: 'Score et progression', slug: 'progress' }],
        },
        {
          label: 'Référence',
          items: [
            { label: 'Configuration', slug: 'reference/configuration' },
            { label: 'Dépannage', slug: 'reference/troubleshooting' },
          ],
        },
      ],
    }),
  ],
})
