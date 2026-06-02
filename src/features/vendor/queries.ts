import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  VENDOR_DASHBOARD_NOTIFICATIONS_QUERY_KEY,
  VENDOR_DASHBOARD_SUMMARY_QUERY_KEY,
} from '@/features/vendor/config';
import {
  fetchDashboardNotifications,
  fetchDashboardSummary,
  markAllNotificationsRead,
} from '@/features/vendor/api';

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: VENDOR_DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: fetchDashboardSummary,
    staleTime: 60 * 1000,
  });
}

export function useDashboardNotificationsQuery() {
  return useQuery({
    queryKey: VENDOR_DASHBOARD_NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchDashboardNotifications,
    staleTime: 30 * 1000,
  });
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_DASHBOARD_NOTIFICATIONS_QUERY_KEY });
    },
  });
}
