import { getHomePathForUser } from '@/features/auth/routes';
import { USER_TYPES, type AuthUser, type UserType } from '@/features/auth/types';

export interface RoleNavLink {
  label: string;
  path: string;
}

function normalizePath(path: string): string {
  const pathname = path.split('?')[0].replace(/\/+$/, '') || '/';
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function isNavLinkActive(currentPath: string, linkPath: string, user?: AuthUser | null): boolean {
  const path = normalizePath(currentPath);
  const target = normalizePath(linkPath);
  const dashboardHome = getHomePathForUser(user);

  if (target === dashboardHome) {
    return path === dashboardHome;
  }

  return path === target || path.startsWith(`${target}/`);
}

export function getProfilePathForUser(user: AuthUser | null | undefined): string | null {
  switch (user?.type) {
    case USER_TYPES.vendor:
    case USER_TYPES.supplier:
      return '/vendor-profile';
    case USER_TYPES.superAdmin:
      return '/admin/user-management';
    default:
      return null;
  }
}

export function getAccountMenuLinks(user: AuthUser | null | undefined): RoleNavLink[] {
  const links: RoleNavLink[] = [{ label: 'Dashboard', path: getHomePathForUser(user) }];

  const profilePath = getProfilePathForUser(user);
  if (profilePath) {
    links.push({ label: 'Profile', path: profilePath });
  }

  if (user?.type === USER_TYPES.vendor || user?.type === USER_TYPES.supplier) {
    links.push({ label: 'KYC / Verification', path: '/dashboard/my-kyc' });
  }

  return links;
}

export function getNavLinksForUser(
  user: AuthUser | null | undefined,
  isAuthenticated: boolean,
): RoleNavLink[] {
  const links: RoleNavLink[] = [
    { label: 'Home', path: '/home' },
    { label: 'Marketplace', path: '/marketplace' },
  ];

  if (!isAuthenticated) return links;

  const type = user?.type as UserType | undefined;

  links.push({ label: 'Dashboard', path: getHomePathForUser(user) });

  if (type === USER_TYPES.vendor || type === USER_TYPES.supplier) {
    links.push(
      { label: 'My Listings', path: '/my-ad' },
      { label: 'Quotes', path: '/dashboard/my-quotes' },
      { label: 'My Orders', path: '/my-order' },
    );
  } else if (type === USER_TYPES.buyer) {
    links.push(
      { label: 'My Orders', path: '/my-order' },
      { label: 'RFQ', path: '/rfq' },
    );
  }

  if (type !== USER_TYPES.superAdmin) {
    links.push({ label: 'Messages', path: '/messages' });
  }

  links.push({ label: 'Notifications', path: '/notification' });

  return links;
}
