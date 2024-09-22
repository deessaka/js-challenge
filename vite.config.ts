import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
      '!@': `${getDirname(import.meta.url)}/inertia/components/ui/`,
    },
  },
  build: {
    manifest: true,
    outDir: 'build/public/assets',
    rollupOptions: {
      input: {
        main: `${getDirname(import.meta.url)}/inertia/app/app.tsx`,
        ssr: `${getDirname(import.meta.url)}/inertia/app/ssr.tsx`,
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
