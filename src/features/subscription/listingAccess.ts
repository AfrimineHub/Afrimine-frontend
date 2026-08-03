import type { VendorSubscription } from '@/features/vendor/dashboardTypes';

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

export function canCreatePostOnboardingListing(
  subscription: VendorSubscription | null | undefined,
): boolean {
  return hasActivePaidSubscription(subscription);
}
