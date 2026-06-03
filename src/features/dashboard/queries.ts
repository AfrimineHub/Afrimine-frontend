import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DASHBOARD_NOTIFICATIONS_QUERY_KEY,
  DASHBOARD_RECOMMENDED_QUERY_KEY,
  DASHBOARD_SAVED_LISTINGS_QUERY_KEY,
  DASHBOARD_SUMMARY_QUERY_KEY,
} from '@/features/dashboard/config';
import {
  fetchDashboardNotifications,
  fetchDashboardSummary,
  fetchRecommendedListings,
  fetchSavedListings,
  markAllNotificationsRead,
} from '@/features/dashboard/api';
import type { SavedListingsQueryParams } from '@/features/dashboard/types';

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: fetchDashboardSummary,
    staleTime: 60 * 1000,
  });
}

export function useDashboardNotificationsQuery() {
  return useQuery({
    queryKey: DASHBOARD_NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchDashboardNotifications,
    staleTime: 30 * 1000,
  });
}

export function useRecommendedListingsQuery() {
  return useQuery({
    queryKey: DASHBOARD_RECOMMENDED_QUERY_KEY,
    queryFn: fetchRecommendedListings,
    staleTime: 60 * 1000,
  });
}

export function useSavedListingsQuery(params: SavedListingsQueryParams = { page: 1, pageSize: 10 }) {
  return useQuery({
    queryKey: [...DASHBOARD_SAVED_LISTINGS_QUERY_KEY, params],
    queryFn: () => fetchSavedListings(params),
    staleTime: 60 * 1000,
  });
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_NOTIFICATIONS_QUERY_KEY });
    },
  });
}
