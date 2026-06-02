import { apiClient } from '@/lib/api/client';
import { extractApiData } from '@/lib/api/extractApiData';
import { vendorDashboardPaths } from '@/features/vendor/config';
import type { DashboardNotification, DashboardSummary } from '@/features/vendor/types';

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get(vendorDashboardPaths.summary);
  return extractApiData<DashboardSummary>(data);
}

export async function fetchDashboardNotifications(): Promise<DashboardNotification[]> {
  const { data } = await apiClient.get(vendorDashboardPaths.notifications);
  return extractApiData<DashboardNotification[]>(data) ?? [];
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch(vendorDashboardPaths.notificationsRead);
}
