import { getHomePathForUser } from '@/features/auth/routes';
import { ADMIN_PROFILE_PATH } from '@/features/admin/config';
import { BUYER_PROFILE_PATH } from '@/features/buyer/constants';
import { isSellerRole, USER_TYPES, type AuthUser, type UserType } from '@/features/auth/types';
import {
  SUPPLIER_DASHBOARD_PATH,
  SUPPLIER_MACHINES_PATH,
} from '@/features/supplier/constants';

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
  if (isSellerRole(user?.type)) {
    return '/vendor-profile';
  }
  if (user?.type === USER_TYPES.buyer) {
    return BUYER_PROFILE_PATH;
  }
  if (user?.type === USER_TYPES.superAdmin) {
    return ADMIN_PROFILE_PATH;
  }
  return null;
}

export function getAccountMenuLinks(user: AuthUser | null | undefined): RoleNavLink[] {
  const links: RoleNavLink[] = [{ label: 'Dashboard', path: getHomePathForUser(user) }];

  const profilePath = getProfilePathForUser(user);
  if (profilePath) {
    links.push({ label: 'Profile', path: profilePath });
  }

  if (isSellerRole(user?.type)) {
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

  if (isSellerRole(type)) {
    links.push(
      { label: 'My Machines', path: SUPPLIER_MACHINES_PATH },
      { label: 'Bookings', path: '/supplier/bookings' },
      { label: 'Payouts', path: '/dashboard/my-payouts' },
    );
  } else if (type === USER_TYPES.buyer) {
    links.push(
      { label: 'My Bookings', path: '/my-bookings' },
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

/** @deprecated Prefer SUPPLIER_DASHBOARD_PATH from supplier constants */
export { SUPPLIER_DASHBOARD_PATH };
