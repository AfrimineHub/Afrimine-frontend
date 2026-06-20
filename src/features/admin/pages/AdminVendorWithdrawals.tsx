import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AdminPagination } from '../components/AdminPagination';
import WithdrawalModal from '../components/AdminVendorWithdrawalModal';
import { useAdminWithdrawalsQuery } from '@/features/admin/queries';
import {
  avatarColorClass,
  formatAdminAmount,
  formatAdminDate,
  getInitials,
  titleCaseStatus,
} from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes('pending')) return 'text-amber-500';
  if (normalized.includes('approve')) return 'text-emerald-500';
  if (normalized.includes('hold')) return 'text-blue-500';
  if (normalized.includes('reject')) return 'text-rose-400';
  return 'text-slate-400';
};

const AdminVendorWithdrawals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      page,
      pageSize: 20,
    }),
    [page, searchQuery],
  );

  const withdrawalsQuery = useAdminWithdrawalsQuery(queryParams);
  const withdrawals = withdrawalsQuery.data?.items ?? [];
  const selectedWithdrawal = withdrawals.find((item) => item.id === selectedWithdrawalId) ?? null;

  const loadError =
    withdrawalsQuery.isError &&
    getApiErrorMessage(withdrawalsQuery.error, 'Could not load withdrawal requests.');

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Vendor Withdrawals</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and process vendor payout requests</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search vendor or bank..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-100 transition-all"
            />
          </div>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Bank</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Request Date</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {withdrawalsQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No withdrawal requests found.
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((req) => {
                    const vendorName = req.vendorName ?? 'Vendor';
                    const color = avatarColorClass(vendorName);
                    const statusLabel = titleCaseStatus(req.status);

                    return (
                      <tr
                        key={req.id}
                        onClick={() => setSelectedWithdrawalId(req.id)}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${color}`}
                            >
                              {getInitials(vendorName)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">{vendorName}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{req.vendorEmail ?? '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-black text-slate-800">
                            {formatAdminAmount(req.amount, req.currency)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-semibold text-slate-500">{req.bankName ?? '—'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-slate-400 font-medium">
                            {formatAdminDate(req.requestedAt)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className={`text-xs font-black uppercase tracking-widest ${getStatusStyles(statusLabel)}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {withdrawalsQuery.data ? (
            <AdminPagination
              page={withdrawalsQuery.data.page}
              pageSize={withdrawalsQuery.data.pageSize}
              totalCount={withdrawalsQuery.data.totalCount}
              totalPages={withdrawalsQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={withdrawalsQuery.isFetching}
            />
          ) : null}
        </div>
      </main>

      <WithdrawalModal
        isOpen={Boolean(selectedWithdrawal)}
        onClose={() => setSelectedWithdrawalId(null)}
        data={selectedWithdrawal}
      />
    </div>
  );
};

export default AdminVendorWithdrawals;
