import { useMemo, useState } from 'react';
import { AlertCircle, Eye, Check, Trash2, Flag } from 'lucide-react';
import { AdminPagination } from '../components/AdminPagination';
import {
  useAdminListingCountsQuery,
  useAdminListingsQuery,
  useApproveAdminListingMutation,
  useArchiveAdminListingMutation,
  useRejectAdminListingMutation,
} from '@/features/admin/queries';
import {
  formatAdminAmount,
  formatAdminDate,
  mapListingStatusLabel,
} from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const TAB_STATUS: Record<string, string | undefined> = {
  'All Listings': undefined,
  Pending: 'pending',
  Approved: 'active',
  Rejected: 'rejected',
  Flagged: 'flagged',
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
    case 'Pending':
      return 'bg-slate-50 text-slate-500 border border-slate-200';
    case 'Flagged':
      return 'bg-pink-50 text-pink-600 border border-pink-100 flex items-center gap-1';
    case 'Rejected':
      return 'bg-red-50 text-red-500 border border-red-100';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const AdminListingsManagement = () => {
  const [activeTab, setActiveTab] = useState('All Listings');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      status: TAB_STATUS[activeTab],
      page,
      pageSize: 20,
    }),
    [activeTab, page],
  );

  const listingsQuery = useAdminListingsQuery(queryParams);
  const countsQuery = useAdminListingCountsQuery();
  const approveMutation = useApproveAdminListingMutation();
  const rejectMutation = useRejectAdminListingMutation();
  const archiveMutation = useArchiveAdminListingMutation();

  const counts = countsQuery.data;
  const tabs = [
    { name: 'All Listings', count: counts?.all },
    { name: 'Pending', count: counts?.pending },
    { name: 'Approved', count: counts?.approved },
    { name: 'Rejected', count: counts?.rejected },
    { name: 'Flagged', count: counts?.flagged },
  ];

  const listings = listingsQuery.data?.items ?? [];
  const loadError =
    listingsQuery.isError &&
    getApiErrorMessage(listingsQuery.error, 'Could not load listings.');

  const handleApprove = async (listingId: string) => {
    try {
      await approveMutation.mutateAsync(listingId);
    } catch (error) {
      window.alert(getApiErrorMessage(error, 'Could not approve listing.'));
    }
  };

  const handleReject = async (listingId: string) => {
    const reason = window.prompt('Rejection reason (optional):') ?? undefined;
    try {
      await rejectMutation.mutateAsync({ listingId, reason: reason?.trim() || undefined });
    } catch (error) {
      window.alert(getApiErrorMessage(error, 'Could not reject listing.'));
    }
  };

  const handleArchive = async (listingId: string) => {
    if (!window.confirm('Archive this listing?')) return;
    try {
      await archiveMutation.mutateAsync(listingId);
    } catch (error) {
      window.alert(getApiErrorMessage(error, 'Could not archive listing.'));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      <main className="max-w-[1400px] mx-auto py-8 px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Listings Management</h1>
            <p className="text-slate-500 text-sm">Review and manage mineral listings from sellers</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('Flagged');
              setPage(1);
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <AlertCircle size={16} />
            View Flagged
          </button>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="flex bg-slate-100/50 p-1 rounded-lg mb-6 w-max border border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => {
                setActiveTab(tab.name);
                setPage(1);
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.name
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.name}
              {tab.count != null ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listingsQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={8} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No listings found for this category.
                    </td>
                  </tr>
                ) : (
                  listings.map((item) => {
                    const statusLabel = mapListingStatusLabel(item.status);
                    const price =
                      item.price?.trim() ||
                      (item.priceAmount != null
                        ? formatAdminAmount(item.priceAmount, item.currency)
                        : '—');

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6 text-sm font-medium text-slate-700">
                          {item.title?.trim() || 'Untitled listing'}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">{item.category ?? '—'}</td>
                        <td className="py-4 px-6 text-sm text-slate-500">{item.location ?? '—'}</td>
                        <td className="py-4 px-6 text-sm text-slate-500">{item.sellerName ?? '—'}</td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-700">{price}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${getStatusStyles(statusLabel)}`}
                          >
                            {statusLabel === 'Flagged' && <Flag size={10} className="mr-1" />}
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">{formatAdminDate(item.createdAt)}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button type="button" className="text-slate-400 hover:text-slate-700" aria-label="View listing">
                              <Eye size={16} />
                            </button>
                            {statusLabel === 'Pending' ? (
                              <button
                                type="button"
                                onClick={() => handleApprove(item.id)}
                                disabled={approveMutation.isPending}
                                className="text-slate-400 hover:text-emerald-600 disabled:opacity-50"
                                aria-label="Approve listing"
                              >
                                <Check size={16} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleArchive(item.id)}
                                disabled={archiveMutation.isPending}
                                className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                                aria-label="Archive listing"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {statusLabel === 'Pending' ? (
                              <button
                                type="button"
                                onClick={() => handleReject(item.id)}
                                disabled={rejectMutation.isPending}
                                className="text-slate-400 hover:text-red-500 disabled:opacity-50"
                                aria-label="Reject listing"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {listingsQuery.data ? (
            <AdminPagination
              page={listingsQuery.data.page}
              pageSize={listingsQuery.data.pageSize}
              totalCount={listingsQuery.data.totalCount}
              totalPages={listingsQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={listingsQuery.isFetching}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AdminListingsManagement;
