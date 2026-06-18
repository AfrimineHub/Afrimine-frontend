import { useMemo, useState } from 'react';
import { Search, Bookmark, MessageSquare, Package, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DataListSection from '../components/DataListSection';
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
import {
  useBuyerRfqsQuery,
  useInvestmentInsightsQuery,
  useMarketTrendsQuery,
} from '@/features/buyer/dashboardQueries';
import {
  mapInvestmentInsightToRow,
  mapMarketTrendToRow,
} from '@/features/buyer/dashboardUtils';
import { getApiErrorMessage } from '@/lib/api/errors';

const HomePage = () => {
  const { user } = useAuth();
  const displayName = user?.fullName ?? user?.companyName ?? 'there';
  const [searchQuery, setSearchQuery] = useState('');

  const summaryQuery = useDashboardSummaryQuery();
  const rfqsQuery = useBuyerRfqsQuery({ Page: 1, PageSize: 50 });
  const notificationsQuery = useDashboardNotificationsQuery();
  const recommendedQuery = useRecommendedListingsQuery();
  const savedQuery = useSavedListingsQuery({ page: 1, pageSize: 5 });
  const trendsQuery = useMarketTrendsQuery();
  const insightsQuery = useInvestmentInsightsQuery();

  const summary = summaryQuery.data;
  const marketplaceSearchUrl = searchQuery.trim()
    ? `/marketplace?q=${encodeURIComponent(searchQuery.trim())}`
    : '/marketplace';

  const savedItems =
    savedQuery.data?.items.map((item) => ({
      savedId: item.savedId,
      title: item.listing.title ?? 'Untitled listing',
      subtitle: [item.listing.location, item.listing.country].filter(Boolean).join(', ') || item.listing.category || undefined,
      imageUrl: item.listing.imageUrl,
    })) ?? [];

  const recommendedListings =
    recommendedQuery.data?.map((listing) => ({
      id: listing.id,
      title: listing.title ?? 'Untitled listing',
      location: [listing.location, listing.country].filter(Boolean).join(', ') || listing.category || 'Africa',
      imageUrl: listing.imageUrl,
    })) ?? [];

  const trendItems = useMemo(
    () => (trendsQuery.data ?? []).map(mapMarketTrendToRow),
    [trendsQuery.data],
  );

  const insightItems = useMemo(
    () =>
      (insightsQuery.data ?? []).map((insight) => {
        const row = mapInvestmentInsightToRow(insight);
        return { label: row.title, timeAgo: row.timeAgo };
      }),
    [insightsQuery.data],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] text-gray-400 mb-2">
          <span><Home size={16} /></span> <span>Dashboard</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName}</h1>
        <p className="text-gray-500 text-sm">Find mining opportunities that match your interests.</p>

        <div className="mt-6 flex gap-4 max-w-4xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for minerals, sites, or equipment"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            />
          </div>
          <Link
            to={marketplaceSearchUrl}
            className="bg-[#0d0d0d] text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors inline-flex items-center"
          >
            Search
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <Link to="/marketplace" className="block hover:opacity-90 transition-opacity">
          {summaryQuery.isLoading ? (
            <div className="bg-white border border-gray-100 p-4 rounded-xl h-[72px] animate-pulse" />
          ) : (
            <StatCard
              icon={<Bookmark size={18} className="fill-yellow-500" />}
              label="Saved Listings"
              count={summary?.savedListingsCount ?? 0}
            />
          )}
        </Link>
        <Link to="/messages" className="block hover:opacity-90 transition-opacity">
          {summaryQuery.isLoading ? (
            <div className="bg-white border border-gray-100 p-4 rounded-xl h-[72px] animate-pulse" />
          ) : (
            <StatCard
              icon={<MessageSquare size={18} className="fill-yellow-500" />}
              label="Messages"
              count={summary?.unreadMessagesCount ?? 0}
              badge={summary && summary.unreadMessagesCount > 0 ? 'new' : undefined}
            />
          )}
        </Link>
        <Link to="/rfq" className="block hover:opacity-90 transition-opacity">
          {summaryQuery.isLoading ? (
            <div className="bg-white border border-gray-100 p-4 rounded-xl h-[72px] animate-pulse" />
          ) : (
            <StatCard
              icon={<Search size={18} className="text-yellow-500" />}
              label="My RFQs"
              count={rfqsQuery.data?.totalCount ?? 0}
            />
          )}
        </Link>
        <Link to="/my-order" className="block hover:opacity-90 transition-opacity">
          {summaryQuery.isLoading ? (
            <div className="bg-white border border-gray-100 p-4 rounded-xl h-[72px] animate-pulse" />
          ) : (
            <StatCard
              icon={<Package size={18} className="fill-yellow-500" />}
              label="Ongoing Orders"
              count={summary?.ongoingOrdersCount ?? 0}
            />
          )}
        </Link>
        <Link
          to="/marketplace"
          className="bg-yellow-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-orange-600 min-h-[72px]"
        >
          Browse marketplace
        </Link>
      </div>

      {summaryQuery.isError ? (
        <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
          {getApiErrorMessage(summaryQuery.error, 'Could not load dashboard summary.')}
        </p>
      ) : null}

      <RecommendedListingsGrid
        listings={recommendedListings}
        isLoading={recommendedQuery.isLoading}
        errorMessage={
          recommendedQuery.isError
            ? getApiErrorMessage(recommendedQuery.error, 'Could not load recommendations.')
            : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <NotificationFeed
          notifications={notificationsQuery.data}
          isLoading={notificationsQuery.isLoading}
          errorMessage={
            notificationsQuery.isError
              ? getApiErrorMessage(notificationsQuery.error, 'Could not load notifications.')
              : undefined
          }
        />
        <SavedListingsPanel
          items={savedItems}
          isLoading={savedQuery.isLoading}
          errorMessage={
            savedQuery.isError
              ? getApiErrorMessage(savedQuery.error, 'Could not load saved listings.')
              : undefined
          }
        />
        <DataListSection
          title="Market Trends"
          showTrends
          trendItems={trendItems}
          isLoading={trendsQuery.isLoading}
          errorMessage={
            trendsQuery.isError
              ? getApiErrorMessage(trendsQuery.error, 'Could not load market trends.')
              : undefined
          }
        />
        <DataListSection
          title="Investment Insight"
          isInsight
          icon={<ChevronRight size={16} className="fill-gray-900 text-yellow-500" />}
          insightItems={insightItems}
          isLoading={insightsQuery.isLoading}
          errorMessage={
            insightsQuery.isError
              ? getApiErrorMessage(insightsQuery.error, 'Could not load investment insights.')
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default HomePage;
