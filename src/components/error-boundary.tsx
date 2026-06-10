import { Component, type ReactNode, type ErrorInfo } from 'react'
import { cn } from '../lib/cn'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((props: { error: Error; reset: () => void }) => ReactNode)
  onError?: (error: Error, info: ErrorInfo) => void
  className?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    if (this.props.fallback) {
      return typeof this.props.fallback === 'function'
        ? this.props.fallback({ error, reset: this.reset })
        : this.props.fallback
    }

    return (
      <div className={cn('flex flex-col items-center justify-center gap-3 py-8 text-center', this.props.className)}>
        <p className="text-sm text-danger font-medium">Something went wrong</p>
        <p className="text-xs text-fg-muted max-w-sm">{error.message}</p>
        <button
          type="button"
          onClick={this.reset}
          className="px-3 py-1.5 text-xs font-medium rounded-[var(--base-radius)] bg-primary text-white hover:bg-primary-600 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }
}
