import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { FilterDropdown } from '../components/FilterDropDown';
import { AdminPagination } from '../components/AdminPagination';
import { useAdminMilestonesQuery, useReleaseAdminMilestoneMutation } from '@/features/admin/queries';
import { formatAdminAmount, formatAdminDateTime, titleCaseStatus } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';
import type { AdminMilestoneItem } from '@/features/admin/types';

const MILESTONE_STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Locked', value: 'Locked' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Released', value: 'Released' },
];

const milestoneKey = (item: AdminMilestoneItem) => `${item.bookingId}-${item.milestoneNumber}`;

const MilestonesPage = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [releasingKey, setReleasingKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      status: status || undefined,
      page,
      pageSize: 20,
    }),
    [status, page],
  );

  const milestonesQuery = useAdminMilestonesQuery(queryParams);
  const releaseMutation = useReleaseAdminMilestoneMutation();

  const items = milestonesQuery.data?.items ?? [];

  const loadError =
    milestonesQuery.isError && getApiErrorMessage(milestonesQuery.error, 'Could not load milestones.');

  const handleRelease = async (item: AdminMilestoneItem) => {
    const key = milestoneKey(item);
    const confirmed = window.confirm(
      `Manually release Milestone ${item.milestoneNumber} (${formatAdminAmount(item.amount)}) for booking ${item.bookingId}?\n\nThis is a SuperAdmin override outside the normal release trigger — use it for stuck payments or dispute resolutions.`,
    );
    if (!confirmed) return;

    setActionError(null);
    setReleasingKey(key);
    try {
      await releaseMutation.mutateAsync({ bookingId: item.bookingId, milestoneNumber: item.milestoneNumber });
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not release milestone.'));
    } finally {
      setReleasingKey(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      <main className="w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Milestones</h1>
          <p className="text-sm text-gray-500 font-medium">
            Review payout milestones across all bookings and manually release stuck or disputed payments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <FilterDropdown
            placeholder="All Statuses"
            value={status}
            options={MILESTONE_STATUS_OPTIONS}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        {actionError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {actionError}
          </p>
        ) : null}

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Booking ID</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Milestone</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Miner</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Supplier</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Amount</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Booking Status</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Released</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {milestonesQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={9} className="py-4 px-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-sm text-gray-500">
                    No milestones found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const key = milestoneKey(item);
                  const statusLabel = titleCaseStatus(item.status);
                  const isReleased = (item.status ?? '').toLowerCase() === 'released';
                  const isBusy = releasingKey === key && releaseMutation.isPending;

                  return (
                    <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.bookingId}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        #{item.milestoneNumber}
                        {item.name ? ` — ${item.name}` : ''}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.minerName ?? '—'}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.supplierName ?? '—'}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900">
                        {formatAdminAmount(item.amount)}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge type="milestone" value={statusLabel} />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{item.bookingStatus ?? '—'}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatAdminDateTime(item.releasedAt)}</td>
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleRelease(item)}
                          disabled={isReleased || isBusy}
                          className="text-xs font-bold text-[#B89047] hover:text-[#9A7639] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isBusy ? 'Releasing…' : isReleased ? 'Released' : 'Release'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {milestonesQuery.data ? (
            <AdminPagination
              page={milestonesQuery.data.page}
              pageSize={milestonesQuery.data.pageSize}
              totalCount={milestonesQuery.data.totalCount}
              totalPages={milestonesQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={milestonesQuery.isFetching}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default MilestonesPage;