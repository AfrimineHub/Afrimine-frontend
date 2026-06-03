import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { dashboardPaths } from '@/features/dashboard/config';
import type {
  DashboardNotification,
  DashboardSummary,
  ListingCard,
  SavedListing,
  SavedListingsPage,
  SavedListingsQueryParams,
} from '@/features/dashboard/types';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get(dashboardPaths.summary);
  return extractApiData<DashboardSummary>(data);
}

export async function fetchDashboardNotifications(): Promise<DashboardNotification[]> {
  const { data } = await apiClient.get(dashboardPaths.notifications);
  return extractApiData<DashboardNotification[]>(data) ?? [];
}

export async function fetchRecommendedListings(): Promise<ListingCard[]> {
  const { data } = await apiClient.get(dashboardPaths.recommended);
  return extractApiData<ListingCard[]>(data) ?? [];
}

export async function fetchSavedListings(
  params: SavedListingsQueryParams = {},
): Promise<SavedListingsPage> {
  const { data } = await apiClient.get(dashboardPaths.savedListings, { params });
  const extracted = extractApiData<SavedListingsPage | SavedListing[]>(data);

  if (Array.isArray(extracted)) {
    return {
      items: extracted,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
      totalCount: extracted.length,
      totalPages: 1,
    };
  }

  return extracted;
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch(dashboardPaths.notificationsRead);
}

export async function saveListing(listingId: string): Promise<void> {
  await apiClient.post(dashboardPaths.savedListings, { listingId });
}

export async function removeSavedListing(listingId: string): Promise<void> {
  await apiClient.delete(`${dashboardPaths.savedListings}/${listingId}`);
}
