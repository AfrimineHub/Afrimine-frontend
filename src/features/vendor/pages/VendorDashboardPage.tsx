import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardOverviewCards } from '../components/DashboardOverviewCards';
import { DashboardStatsGrid } from '../components/DashboardStatsGrid';
import { ListingPerformanceTable } from '../components/ListingPerformanceTable';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useDashboardNotificationsQuery, useDashboardSummaryQuery } from '@/features/dashboard/queries';
import { useVendorListingsQuery } from '@/features/listings/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

export const VendorDashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const summaryQuery = useDashboardSummaryQuery();
  const notificationsQuery = useDashboardNotificationsQuery();
  const listingsQuery = useVendorListingsQuery({ page: 1, pageSize: 1 });

  const displayName = user?.fullName ?? user?.companyName;
  const summaryError =
    summaryQuery.isError && getApiErrorMessage(summaryQuery.error, 'Could not load dashboard summary.');

  useEffect(() => {
    if (!isSidebarOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex w-full bg-gray-50">
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 max-w-[min(16rem,100vw)] bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:max-w-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden overscroll-none touch-none"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden shrink-0 flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 bg-white border-b border-gray-100">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center min-h-11 min-w-11 -ml-1 rounded-lg text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            aria-label="Open navigation menu"
          >
            <Menu size={24} aria-hidden />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full pb-[max(1.5rem,calc(1.5rem+env(safe-area-inset-bottom)))]">
          {summaryError ? (
            <p className="mb-4 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
              {summaryError}
            </p>
          ) : null}

          <DashboardHeader
            displayName={displayName}
            unreadMessagesCount={summaryQuery.data?.unreadMessagesCount}
          />
          <DashboardOverviewCards />
          <DashboardStatsGrid
            summary={summaryQuery.data}
            totalListings={listingsQuery.data?.totalCount ?? null}
            isLoading={summaryQuery.isLoading || listingsQuery.isLoading}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ListingPerformanceTable />
            <RecentActivityFeed
              notifications={notificationsQuery.data}
              isLoading={notificationsQuery.isLoading}
              isError={notificationsQuery.isError}
              errorMessage={
                notificationsQuery.isError
                  ? getApiErrorMessage(notificationsQuery.error, 'Could not load recent activity.')
                  : undefined
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};
