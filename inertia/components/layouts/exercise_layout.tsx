
import ThemeProvider from '#components/ui/components/theme_provider'
import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'
import DeviceDetector from '#components/device-detector/mb_check'
import { ErrorBoundary } from '#components/hoc/withErrorBoundary'


/** Full-screen fallback rendered by the ErrorBoundary when the exercise workspace crashes. */
function ExerciseErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-center text-gray-400">
        An unexpected error occurred while loading this exercise. Please refresh the page or go back
        to the exercise list.
      </p>
      {error && (
        <pre className="max-w-xl overflow-auto rounded bg-gray-800 p-4 text-sm text-red-400">
          {error.message}
        </pre>
      )}
      <a
        href="/home"
        className="mt-2 rounded bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
      >
        Back to exercises
      </a>
    </div>
  )
}

export default function ExerciseLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <DeviceDetector>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
        >
          <div className="flex flex-col min-h-screen">
            {/* CRITICAL-06: catch any render crash inside the exercise workspace
                and show a graceful fallback instead of a blank/broken page. */}
            <ErrorBoundary fallback={(err) => <ExerciseErrorFallback error={err} />}>
              <main className="flex-grow">{children}</main>
            </ErrorBoundary>
          </div>
        </motion.div>
      </DeviceDetector>
    </ThemeProvider>
  )
}
