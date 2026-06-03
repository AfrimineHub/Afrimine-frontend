import { USER_TYPES, type AuthUser, type UserType } from '@/features/auth/types';

export const ROLE_HOME_PATH: Record<UserType, string> = {
  [USER_TYPES.vendor]: '/vendor-dashboard',
  [USER_TYPES.buyer]: '/buyer-dashboard',
  [USER_TYPES.investor]: '/investor-dashboard',
  [USER_TYPES.supplier]: '/vendor-dashboard',
  [USER_TYPES.superAdmin]: '/admin',
};

const SHARED_AUTHENTICATED_PREFIXES = ['/messages', '/notification'];

const ROLE_ROUTE_PREFIXES: Record<UserType, string[]> = {
  [USER_TYPES.superAdmin]: ['/admin'],
  [USER_TYPES.vendor]: [
    '/vendor-dashboard',
    '/my-ad',
    '/dashboard/',
    '/vendor-profile',
    '/vendor/',
  ],
  [USER_TYPES.supplier]: [
    '/vendor-dashboard',
    '/my-ad',
    '/dashboard/',
    '/vendor-profile',
    '/vendor/',
  ],
  [USER_TYPES.buyer]: ['/buyer-dashboard', '/my-order', '/rfq'],
  [USER_TYPES.investor]: ['/investor-dashboard'],
};

const FALLBACK_HOME = '/marketplace';

function normalizePath(path: string): string {
  const pathname = path.split('?')[0].replace(/\/+$/, '') || '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

function pathMatchesPrefix(path: string, prefix: string): boolean {
  const normalized = normalizePath(path);
  const normalizedPrefix = normalizePath(prefix);
  return normalized === normalizedPrefix || normalized.startsWith(`${normalizedPrefix}/`);
}

function pathMatchesAnyPrefix(path: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathMatchesPrefix(path, prefix));
}

export function getHomePathForUser(user: AuthUser | null | undefined): string {
  if (user?.type != null && user.type in ROLE_HOME_PATH) {
    return ROLE_HOME_PATH[user.type];
  }
  return FALLBACK_HOME;
}

export function isPathAllowedForUser(path: string, user: AuthUser | null | undefined): boolean {
  const normalized = normalizePath(path);

  if (pathMatchesAnyPrefix(normalized, SHARED_AUTHENTICATED_PREFIXES)) {
    return true;
  }

  if (user?.type != null) {
    const allowedPrefixes = ROLE_ROUTE_PREFIXES[user.type] ?? [];
    if (pathMatchesAnyPrefix(normalized, allowedPrefixes)) {
      return true;
    }

    for (const [roleKey, prefixes] of Object.entries(ROLE_ROUTE_PREFIXES)) {
      if (Number(roleKey) === user.type) continue;
      if (pathMatchesAnyPrefix(normalized, prefixes)) {
        return false;
      }
    }
  }

  return true;
}

export function resolvePostAuthPath(
  user: AuthUser | null | undefined,
  requestedPath?: string | null,
): string {
  const home = getHomePathForUser(user);
  if (!requestedPath) return home;
  return isPathAllowedForUser(requestedPath, user) ? normalizePath(requestedPath) : home;
}

export function userHasRole(user: AuthUser | null | undefined, allowed: UserType[]): boolean {
  return user?.type != null && allowed.includes(user.type);
}
