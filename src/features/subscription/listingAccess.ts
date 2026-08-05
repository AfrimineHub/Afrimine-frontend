import type { VendorSubscription } from '@/features/vendor/dashboardTypes';

export interface ListingQuota {
  limit: number;
  used: number;
  remaining: number;
}

const isGatingFrozen = true as boolean; // TODO: Remove to unfreeze subscription

export function getListingQuota(
  subscription: VendorSubscription | null | undefined,
): ListingQuota {

  // Freeze sub gating globally. Remove to unfreeze subscription
  if (isGatingFrozen) {
    return {
      used: 0,
      limit: 999,
      remaining: 999,
    };
  }

  const limit = subscription?.listingsLimit ?? 0;
  const used = subscription?.listingsUsed ?? 0;
  const remaining =
    typeof subscription?.listingsRemaining === 'number'
      ? subscription.listingsRemaining
      : Math.max(limit - used, 0);
 
  return { limit, used, remaining };
}

export function canCreateNewListing(
  subscription: VendorSubscription | null | undefined,
): boolean {
  if (isGatingFrozen) return true; // TODO: Remove to unfreeze subscription

  if (!subscription) return false;
  return getListingQuota(subscription).remaining > 0;
}

