import { Component, ComponentType, ReactNode } from 'react'
import { ErrorMessage } from '../ui/ErrorMessage'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Optional custom fallback UI. Receives the caught error so callers can
   * render context-appropriate recovery UI (e.g. full-screen for exercises).
   * Defaults to a small inline ErrorMessage when omitted.
   */
  fallback?: (error: Error | null) => ReactNode
}

// CRITICAL-06: export the class directly so it can be used standalone
// (e.g. wrapping the exercise workspace in ExerciseLayout) in addition to
// being used via the withErrorBoundary HOC.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log the boundary-caught error so it appears in server/client logs
    // rather than silently disappearing after the boundary catches it.
    console.error('[ErrorBoundary] Caught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error)
      }
      return (
        <div className="p-4">
          <ErrorMessage message={this.state.error?.message} />
        </div>
      )
    }

    return this.props.children
  }
}

export function withErrorBoundary<P extends object>(WrappedComponent: ComponentType<P>) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}
