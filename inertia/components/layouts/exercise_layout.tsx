import { PropsWithChildren } from 'react'

import DeviceDetector from '#components/device-detector/mb_check'
import ThemeProvider from '#components/ui/components/theme_provider'
import { ErrorBoundary } from '#components/hoc/withErrorBoundary'

function ExerciseErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#11182B] px-6 text-white">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#86E3C0]">
        Atelier indisponible
      </p>
      <h2 className="text-center text-2xl font-semibold">Une erreur a interrompu cet exercice.</h2>
      <p className="max-w-md text-center text-sm leading-6 text-white/60">
        Rechargez la page ou revenez au catalogue pour reprendre votre parcours.
      </p>
      {error && (
        <pre className="max-w-xl overflow-auto rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-red-200">
          {error.message}
        </pre>
      )}
      <a
        href="/home"
        className="focus-ring mt-2 rounded-full bg-[#F4D35E] px-5 py-3 text-sm font-semibold text-[#11182B] transition-transform duration-150 hover:-translate-y-0.5"
      >
        Retour aux challenges
      </a>
    </div>
  )
}

export default function ExerciseLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="js-challenge-theme">
      <DeviceDetector>
        <div className="min-h-screen bg-[#11182B] text-white">
          <ErrorBoundary fallback={(error) => <ExerciseErrorFallback error={error} />}>
            <main className="min-h-screen">{children}</main>
          </ErrorBoundary>
        </div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
