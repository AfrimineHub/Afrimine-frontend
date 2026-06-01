const STORAGE_KEY = 'afrimine.access_token';

/** Runtime copy used by axios interceptors. */
let accessToken: string | null = null;

function readPersistedToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePersistedToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(STORAGE_KEY, token);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode / disabled storage — in-memory session only.
  }
}

/** Restore token after a full page load (same tab). */
export function hydrateAccessToken(): void {
  if (!accessToken) {
    accessToken = readPersistedToken();
  }
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  writePersistedToken(token);
}

export function clearAccessToken(): void {
  accessToken = null;
  writePersistedToken(null);
}
