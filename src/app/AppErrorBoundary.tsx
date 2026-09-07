import { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  clearStaleChunkReloadFlag,
  isStaleChunkError,
  recoverFromStaleChunk,
} from '@/lib/staleChunkRecovery';
import { AppErrorFallback } from '@/app/AppErrorFallback';

interface Props {
  children: ReactNode;
  /** Optional hook for logging / telemetry. */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * Global React error boundary. Handles general render failures and folds in
 * stale-chunk recovery via `recoverFromStaleChunk()`.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      isChunkError: isStaleChunkError(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);

    if (isStaleChunkError(error)) {
      recoverFromStaleChunk();
    }
  }

  componentDidMount(): void {
    if (!this.state.hasError) {
      clearStaleChunkReloadFlag();
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, isChunkError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-slate-50">
        <AppErrorFallback
          kind={this.state.isChunkError ? 'chunk' : 'generic'}
          onRetry={this.state.isChunkError ? undefined : this.handleRetry}
          showHomeLink={!this.state.isChunkError}
        />
      </div>
    );
  }
}
