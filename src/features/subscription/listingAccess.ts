import type { VendorSubscription } from '@/features/vendor/dashboardTypes';

export interface ListingQuota {
  limit: number;
  used: number;
  remaining: number;
}

export function getListingQuota(
  subscription: VendorSubscription | null | undefined,
): ListingQuota {
  const limit = subscription?.listingsLimit ?? 0;
  const used = subscription?.listingsUsed ?? 0;
  const remaining =
    typeof subscription?.listingsRemaining === 'number'
      ? subscription.listingsRemaining
      : Math.max(limit - used, 0);
 
  return { limit, used, remaining };
}



function isFutureDate(value: string | null | undefined): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp > Date.now();
}

export function hasActivePaidSubscription(
  subscription: VendorSubscription | null | undefined,
): boolean {
  const planId = subscription?.planId?.trim().toLowerCase();
  if (!planId || planId === 'free') return false;

  const status = subscription?.status?.trim().toLowerCase();
  if (status === 'none' || status === 'past_due') return false;

  // A canceled plan can still be active until the current paid period ends.
  if (status === 'canceled') {
    return isFutureDate(subscription?.renewsAt);
  }

  return true;
}

export function canCreateNewListing(
  subscription: VendorSubscription | null | undefined,
): boolean {
  if (!subscription) return false;
  return getListingQuota(subscription).remaining > 0;
}

