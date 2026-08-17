import { Link } from '@inertiajs/react'
import type { PropsWithChildren } from 'react'

import DeviceDetector from '#components/device-detector/mb_check'
import ThemeProvider from '#components/ui/components/theme_provider'
import { ErrorBoundary } from '#components/hoc/withErrorBoundary'
import { Button } from '#components/ui/button'

function ExerciseErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-workspace-background px-6 text-workspace-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-workspace-accent">
        Atelier indisponible
      </p>
      <h2 className="text-center text-2xl font-semibold">Une erreur a interrompu cet exercice.</h2>
      <p className="max-w-md text-center text-sm leading-6 text-workspace-muted">
        Rechargez la page ou revenez au catalogue pour reprendre votre parcours.
      </p>
      {error && (
        <pre className="max-w-xl overflow-auto rounded-xl border border-workspace-border bg-workspace-editor p-4 text-xs text-red-200">
          {error.message}
        </pre>
      )}
      <Button
        asChild
        className="mt-2 rounded-full bg-workspace-warning px-5 py-3 text-sm font-semibold text-workspace-background hover:bg-workspace-warning/90"
      >
        <Link href="/home">Retour aux challenges</Link>
      </Button>
    </div>
  )
}

export default function ExerciseLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="js-challenge-workspace-theme">
      <DeviceDetector>
        <div className="min-h-screen bg-workspace-background text-workspace-foreground">
          <ErrorBoundary fallback={(error) => <ExerciseErrorFallback error={error} />}>
            <main className="min-h-screen">{children}</main>
          </ErrorBoundary>
        </div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
