import { clearStaleChunkReloadFlag } from '@/lib/staleChunkRecovery';

export type AppErrorKind = 'chunk' | 'generic';

interface AppErrorFallbackProps {
  kind: AppErrorKind;
  title?: string;
  message?: string;
  onRetry?: () => void;
  /** When true, show a Go home control. */
  showHomeLink?: boolean;
}

const COPY: Record<AppErrorKind, { title: string; message: string }> = {
  chunk: {
    title: 'Update available',
    message: 'This page is out of date after a recent deploy. Reload to load the latest version.',
  },
  generic: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. You can try again or go back to the home page.',
  },
};

export function AppErrorFallback({
  kind,
  title,
  message,
  onRetry,
  showHomeLink = true,
}: AppErrorFallbackProps) {
  const defaults = COPY[kind];

  const handleReload = () => {
    clearStaleChunkReloadFlag();
    window.location.reload();
  };

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-slate-50 px-4 py-12 text-center">
      <h1 className="text-lg font-bold text-slate-900">{title ?? defaults.title}</h1>
      <p className="max-w-md text-sm text-slate-600">{message ?? defaults.message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && kind === 'generic' ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
          >
            Try again
          </button>
        ) : null}
        <button
          type="button"
          onClick={handleReload}
          className={
            kind === 'chunk' || !onRetry
              ? 'rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90'
              : 'rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50'
          }
        >
          Reload
        </button>
        {showHomeLink ? (
          <a
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Go home
          </a>
        ) : null}
      </div>
    </div>
  );
}
