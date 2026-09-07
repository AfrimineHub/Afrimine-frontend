import { useEffect } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import {
  isStaleChunkError,
  recoverFromStaleChunk,
} from '@/lib/staleChunkRecovery';
import { AppErrorFallback } from '@/app/AppErrorFallback';

function resolveError(error: unknown): { kind: 'chunk' | 'generic'; message?: string } {
  if (isStaleChunkError(error)) {
    return { kind: 'chunk' };
  }

  if (isRouteErrorResponse(error)) {
    const detail =
      typeof error.data === 'string'
        ? error.data
        : error.data && typeof error.data === 'object' && 'message' in error.data
          ? String((error.data as { message?: unknown }).message ?? '')
          : '';
    return {
      kind: 'generic',
      message:
        detail ||
        (error.statusText
          ? `${error.status} ${error.statusText}`
          : `Request failed (${error.status}).`),
    };
  }

  if (error instanceof Error && error.message) {
    return { kind: 'generic', message: error.message };
  }

  return { kind: 'generic' };
}

/**
 * React Router `errorElement` for layout routes. Keeps the shell when possible
 * (parent layout still renders) and shares chunk-recovery with AppErrorBoundary.
 */
export function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { kind, message } = resolveError(error);

  useEffect(() => {
    if (kind === 'chunk') {
      recoverFromStaleChunk();
    }
  }, [kind]);

  return (
    <AppErrorFallback
      kind={kind}
      message={kind === 'generic' ? message : undefined}
      onRetry={
        kind === 'generic'
          ? () => {
              void navigate(0);
            }
          : undefined
      }
      showHomeLink
    />
  );
}
