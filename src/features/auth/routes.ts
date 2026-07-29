import { USER_TYPES, type AuthUser, type UserType } from '@/features/auth/types';
import {
  SUPPLIER_DASHBOARD_PATH,
  SUPPLIER_ONBOARDING_PATH,
} from '@/features/supplier/constants';

const SHARED_AUTHENTICATED_PREFIXES = ['/messages', '/notification'];
const FALLBACK_HOME = '/marketplace';

export function getRoleHomePath(type: UserType | undefined): string {
  switch (type) {
    case USER_TYPES.supplier:
      return SUPPLIER_DASHBOARD_PATH;
    case USER_TYPES.vendor:
      return '/vendor-dashboard';
    case USER_TYPES.buyer:
      return '/buyer-dashboard';
    case USER_TYPES.investor:
      return '/investor-dashboard';
    case USER_TYPES.superAdmin:
      return '/admin';
    default:
      return FALLBACK_HOME;
  }
}


export function getRoleRoutePrefixes(type: UserType): string[] {
  switch (type) {
    case USER_TYPES.superAdmin:
      return ['/admin'];
    case USER_TYPES.supplier:
      return [
        SUPPLIER_DASHBOARD_PATH,
        SUPPLIER_ONBOARDING_PATH,
        '/supplier/',
        '/vendor-dashboard',
        '/my-ad',
        '/dashboard/',
        '/vendor-profile',
        '/vendor/',
        '/my-order',
      ];
    case USER_TYPES.vendor:
      return [
        '/vendor-dashboard',
        '/my-ad',
        '/dashboard/',
        '/vendor-profile',
        '/vendor/',
      ];
    case USER_TYPES.buyer:
      return ['/buyer-dashboard', '/my-order', '/rfq'];
    case USER_TYPES.investor:
      return ['/investor-dashboard'];
    default:
      return [];
  }
}


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
  if (user?.type === null) {
    return FALLBACK_HOME;
  }

  return getRoleHomePath(user?.type);
}

export function isPathAllowedForUser(path: string, user: AuthUser | null | undefined): boolean {
  const normalized = normalizePath(path);

  if (pathMatchesAnyPrefix(normalized, SHARED_AUTHENTICATED_PREFIXES)) {
    return true;
  }

  if (user?.type != null) {
    const allowedPrefixes = getRoleRoutePrefixes(user.type);
    if (pathMatchesAnyPrefix(normalized, allowedPrefixes)) {
      return true;
    }

    const allKnownTypes: UserType[] = [
      USER_TYPES.superAdmin,
      USER_TYPES.vendor,
      USER_TYPES.supplier,
      USER_TYPES.buyer,
      USER_TYPES.investor,
    ];

    for (const roleType of allKnownTypes) {
      if (roleType === user.type) continue;
      if (pathMatchesAnyPrefix(normalized, getRoleRoutePrefixes(roleType))) {
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
