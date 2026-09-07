const RELOAD_FLAG_KEY = 'afrimine.stale_chunk_reload';

/** True when an error looks like a missing/outdated deploy chunk. */
export function isStaleChunkError(error: unknown): boolean {
  if (!error) return false;

  const name =
    typeof error === 'object' && error !== null && 'name' in error
      ? String((error as { name?: unknown }).name)
      : '';
  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? String((error as { message?: unknown }).message)
      : typeof error === 'string'
        ? error
        : '';

  if (name === 'ChunkLoadError') return true;

  return (
    /failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /importing a module script failed/i.test(message) ||
    /loading chunk [\w-]+ failed/i.test(message) ||
    /loading css chunk [\w-]+ failed/i.test(message) ||
    /unable to preload css/i.test(message)
  );
}

function readReloadFlag(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

function writeReloadFlag(): void {
  try {
    sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
  } catch {
    // Private mode / disabled storage — still attempt a single reload below.
  }
}

/** Clear after a successful boot so a later deploy can recover again. */
export function clearStaleChunkReloadFlag(): void {
  try {
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
  } catch {
    // ignore
  }
}

/**
 * One hard reload to pick up the new index.html / chunk map.
 * Returns true if a reload was triggered; false if we already tried this session
 * (avoids an infinite reload loop when the failure is not deploy-related).
 */
export function recoverFromStaleChunk(): boolean {
  if (readReloadFlag()) {
    return false;
  }

  writeReloadFlag();
  window.location.reload();
  return true;
}

/** Vite fires this when a dynamic import / preload fails after deploy. */
export function setupVitePreloadErrorHandler(): void {
  window.addEventListener('vite:preloadError', (event) => {
    // Prevent the default unhandled rejection noise; we handle recovery.
    event.preventDefault();
    recoverFromStaleChunk();
  });
}
