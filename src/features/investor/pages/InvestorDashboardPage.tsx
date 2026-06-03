import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Bookmark } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  NotificationFeed,
  RecommendedListingsGrid,
  SavedListingsPanel,
} from '@/features/dashboard/components/DashboardPanels';
import {
  useDashboardNotificationsQuery,
  useDashboardSummaryQuery,
  useRecommendedListingsQuery,
  useSavedListingsQuery,
} from '@/features/dashboard/queries';
import { getApiErrorMessage } from '@/lib/api/errors';

const InvestorDashboardPage = () => {
  const { user } = useAuth();
  const displayName = user?.fullName ?? user?.companyName ?? 'Investor';

  const summaryQuery = useDashboardSummaryQuery();
  const notificationsQuery = useDashboardNotificationsQuery();
  const recommendedQuery = useRecommendedListingsQuery();
  const savedQuery = useSavedListingsQuery({ page: 1, pageSize: 5 });

  const summary = summaryQuery.data;
  const recommendedCount = recommendedQuery.data?.length ?? 0;

  const savedItems =
    savedQuery.data?.items.map((item) => ({
      savedId: item.savedId,
      title: item.listing.title ?? 'Untitled listing',
      subtitle: [item.listing.location, item.listing.country].filter(Boolean).join(', ') || undefined,
      imageUrl: item.listing.imageUrl,
    })) ?? [];

  const recommendedListings =
    recommendedQuery.data?.map((listing) => ({
      id: listing.id,
      title: listing.title ?? 'Untitled listing',
      location: [listing.location, listing.country].filter(Boolean).join(', ') || listing.category || 'Africa',
      imageUrl: listing.imageUrl,
    })) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {displayName}</h1>
        <p className="text-sm text-gray-500 mt-2">
          Track mining opportunities, saved projects, and investment insights.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Briefcase className="text-yellow-600 mb-3" size={22} aria-hidden />
            <p className="text-sm text-gray-500">Recommended opportunities</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {recommendedQuery.isLoading ? '…' : recommendedCount}
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Bookmark className="text-yellow-600 mb-3" size={22} aria-hidden />
            <p className="text-sm text-gray-500">Saved projects</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {summaryQuery.isLoading ? '…' : (summary?.savedListingsCount ?? 0)}
            </p>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
            <TrendingUp className="text-yellow-600 mb-3" size={22} aria-hidden />
            <p className="text-sm text-gray-500">Portfolio value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">—</p>
            <p className="text-xs text-gray-400 mt-1">Requires investor portfolio API</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Marketplace', path: '/marketplace' },
            { label: 'Messages', path: '/messages' },
            { label: 'Notifications', path: '/notification' },
            { label: 'Saved listings', path: '/marketplace' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-yellow-500 hover:text-yellow-700 text-center"
            >
              {action.label}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <RecommendedListingsGrid
            title="Investment opportunities"
            listings={recommendedListings}
            isLoading={recommendedQuery.isLoading}
            errorMessage={
              recommendedQuery.isError
                ? getApiErrorMessage(recommendedQuery.error, 'Could not load opportunities.')
                : undefined
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NotificationFeed
            title="Deal alerts"
            notifications={notificationsQuery.data}
            isLoading={notificationsQuery.isLoading}
            errorMessage={
              notificationsQuery.isError
                ? getApiErrorMessage(notificationsQuery.error, 'Could not load alerts.')
                : undefined
            }
          />
          <SavedListingsPanel
            title="Watchlist"
            items={savedItems}
            isLoading={savedQuery.isLoading}
            errorMessage={
              savedQuery.isError
                ? getApiErrorMessage(savedQuery.error, 'Could not load watchlist.')
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboardPage;
