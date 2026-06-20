import { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AdminPagination } from '../components/AdminPagination';
import {
  useAdminRevenueSummaryQuery,
  useAdminRevenueTransactionsQuery,
} from '@/features/admin/queries';
import { formatAdminAmount, formatAdminDate, titleCaseStatus } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const getStatusStyles = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes('complete')) return 'bg-emerald-100 text-emerald-600';
  if (normalized.includes('pending')) return 'bg-amber-100 text-amber-600';
  if (normalized.includes('fail')) return 'bg-rose-100 text-rose-600';
  return 'bg-slate-100 text-slate-600';
};

const RevenueDashboard = () => {
  const [page, setPage] = useState(1);

  const transactionsParams = useMemo(() => ({ page, pageSize: 20 }), [page]);
  const summaryQuery = useAdminRevenueSummaryQuery();
  const transactionsQuery = useAdminRevenueTransactionsQuery(transactionsParams);

  const summary = summaryQuery.data;
  const transactions = transactionsQuery.data?.items ?? [];
  const currency = summary?.currency ?? 'NGN';

  const loadError =
    (summaryQuery.isError &&
      getApiErrorMessage(summaryQuery.error, 'Could not load revenue summary.')) ||
    (transactionsQuery.isError &&
      getApiErrorMessage(transactionsQuery.error, 'Could not load revenue transactions.'));

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
      <main className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Revenue Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitor platform earnings, vendor payouts, and transaction status
          </p>
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Total Platform Revenue
            </p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {summaryQuery.isLoading
                  ? '…'
                  : formatAdminAmount(summary?.totalPlatformRevenue ?? 0, currency)}
              </h2>
              {summary?.totalPlatformRevenueChangePercent != null ? (
                <span className="text-emerald-500 flex items-center text-sm font-bold">
                  <ArrowUpRight size={14} /> {summary.totalPlatformRevenueChangePercent}%
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Total from all asset sales</p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Vendor Payouts</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {summaryQuery.isLoading
                  ? '…'
                  : formatAdminAmount(summary?.vendorPayouts ?? 0, currency)}
              </h2>
              {summary?.vendorPayoutsChangePercent != null ? (
                <span className="text-blue-500 flex items-center text-sm font-bold">
                  <ArrowUpRight size={14} /> {summary.vendorPayoutsChangePercent}%
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Successfully processed payouts</p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pending Payments</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                {summaryQuery.isLoading
                  ? '…'
                  : formatAdminAmount(summary?.pendingPayments ?? 0, currency)}
              </h2>
              {summary?.pendingPaymentsChangePercent != null ? (
                <span className="text-rose-400 flex items-center text-sm font-bold">
                  <ArrowDownRight size={14} /> {summary.pendingPaymentsChangePercent}%
                </span>
              ) : null}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Escrowed funds awaiting release</p>
          </div>
        </div>

        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactionsQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={6} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No revenue transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn) => {
                    const statusLabel = titleCaseStatus(txn.status);
                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6 text-sm font-bold text-slate-700">{txn.id}</td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                          {txn.vendorName ?? '—'}
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">{txn.productName ?? '—'}</td>
                        <td className="py-4 px-6 text-sm font-black text-slate-800">
                          {formatAdminAmount(txn.amount, txn.currency ?? currency)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(statusLabel)}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-400 font-medium">
                          {formatAdminDate(txn.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {transactionsQuery.data ? (
            <AdminPagination
              page={transactionsQuery.data.page}
              pageSize={transactionsQuery.data.pageSize}
              totalCount={transactionsQuery.data.totalCount}
              totalPages={transactionsQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={transactionsQuery.isFetching}
            />
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default RevenueDashboard;
