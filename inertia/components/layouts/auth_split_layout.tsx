import { Link } from '@inertiajs/react'
import { Code2 } from 'lucide-react'
import type { ReactNode } from 'react'

import AppShell from '#components/layouts/app_shell'
import Seo, { type SeoProps } from '#components/seo'

interface AuthSplitLayoutProps {
  children: ReactNode
  seo?: SeoProps
}

export default function AuthSplitLayout({ children, seo }: AuthSplitLayoutProps) {
  return (
    <AppShell>
      <Seo {...seo} />
      <main
        id="main-content"
        className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden"
      >
        <div className="dot-grid relative hidden shrink-0 flex-col justify-between overflow-hidden bg-brand-ink px-12 py-12 text-brand-paper lg:flex lg:w-[44%] xl:w-[42%]">
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rotate-12 border-2 border-brand-paper/20 bg-primary" />

          <div className="relative z-10 max-w-sm">
            <p className="eyebrow text-brand-green-soft">Apprendre en construisant</p>
            <h2 className="display-heading mt-4 text-4xl uppercase text-brand-paper xl:text-5xl">
              Le code se comprend mieux en pratique.
            </h2>
            <p className="mt-5 text-sm leading-7 text-brand-paper/60">
              Des challenges JavaScript courts et progressifs, à résoudre directement dans votre
              terminal.
            </p>
          </div>

          <div className="terminal-window relative z-10 border-brand-paper/15 bg-brand-editor text-brand-paper shadow-none">
            <div className="flex items-center justify-between border-b border-brand-paper/10 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-paper/10">
                  <Code2 className="h-3 w-3" aria-hidden="true" />
                </span>
                reduce.js
              </div>
              <span className="text-[10px] text-brand-paper/40">JavaScript</span>
            </div>
            <div className="space-y-1.5 p-4 font-mono text-xs leading-6 text-brand-paper/80">
              <div>
                <span className="text-brand-green-soft">function</span>{' '}
                <span className="text-brand-yellow">countValues</span>(items) {'{'}
              </div>
              <div className="pl-4 text-brand-paper/35">// votre solution ici</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10 sm:px-8">
            <Link
              href="/"
              className="focus-ring mb-8 inline-flex w-fit items-center gap-3 rounded-md"
            >
              <span className="flex h-9 w-9 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_hsl(var(--foreground))]">
                <Code2 className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="font-mono text-[15px] font-semibold uppercase tracking-[-0.03em]">
                Codojo<span className="text-primary">_</span>
              </span>
            </Link>

            {children}
          </div>
        </div>
      </main>
    </AppShell>
  )
}
