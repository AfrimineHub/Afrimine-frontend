import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { FilterDropdown } from '../components/FilterDropDown';
import { AdminPagination } from '../components/AdminPagination';
import { useAdminEscrowQuery } from '@/features/admin/queries';
import { formatAdminAmount, formatAdminDateTime, titleCaseStatus } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const ESCROW_STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Funded', value: 'funded' },
  { label: 'Released', value: 'released' },
  { label: 'Frozen', value: 'frozen' },
  { label: 'Refunded', value: 'refunded' },
];

const EscrowPage = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      status: status || undefined,
      page,
      pageSize: 20,
    }),
    [status, page],
  );

  const escrowQuery = useAdminEscrowQuery(queryParams);
  const items = escrowQuery.data?.items ?? [];

  const loadError =
    escrowQuery.isError && getApiErrorMessage(escrowQuery.error, 'Could not load escrow transactions.');

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans">
      <main className="w-full mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Escrow</h1>
          <p className="text-sm text-gray-500 font-medium">
            Every PayScrow escrow payment made on the platform, from funding through release.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <FilterDropdown
            placeholder="All Statuses"
            value={status}
            options={ESCROW_STATUS_OPTIONS}
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Order ID</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Buyer</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Vendor</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Amount</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Funded</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Released</th>
                <th className="py-4 px-4 text-sm font-bold text-gray-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {escrowQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={8} className="py-4 px-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                    No escrow transactions found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const statusLabel = titleCaseStatus(item.status);
                  const isFrozen = (item.status ?? '').toLowerCase() === 'frozen';

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.orderId}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.buyerName ?? '—'}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{item.vendorName ?? '—'}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900">
                        {formatAdminAmount(item.amount, item.currency)}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge type="escrow" value={statusLabel} forceRed={isFrozen} />
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatAdminDateTime(item.fundedAt)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatAdminDateTime(item.releasedAt)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatAdminDateTime(item.createdAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {escrowQuery.data ? (
            <AdminPagination
              page={escrowQuery.data.page}
              pageSize={escrowQuery.data.pageSize}
              totalCount={escrowQuery.data.totalCount}
              totalPages={escrowQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={escrowQuery.isFetching}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default EscrowPage;