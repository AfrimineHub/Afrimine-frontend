import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AdminPagination } from '../components/AdminPagination';
import { useAdminOrdersQuery, useAdminOrdersSummaryQuery } from '@/features/admin/queries';
import {
  avatarColorClass,
  formatAdminAmount,
  formatAdminDate,
  getInitials,
  titleCaseStatus,
} from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';

const getStatusColor = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes('progress') || normalized.includes('deliver')) return 'text-blue-500';
  if (normalized.includes('complete')) return 'text-emerald-500';
  if (normalized.includes('fail')) return 'text-purple-500';
  if (normalized.includes('pending')) return 'text-orange-500';
  if (normalized.includes('cancel') || normalized.includes('dispute')) return 'text-pink-500';
  return 'text-slate-500';
};

const AdminOrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      page,
      pageSize: 20,
    }),
    [page, searchQuery],
  );

  const ordersQuery = useAdminOrdersQuery(queryParams);
  const summaryQuery = useAdminOrdersSummaryQuery({ q: queryParams.q });

  const orders = ordersQuery.data?.items ?? [];
  const stats = summaryQuery.data ?? {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    failedOrCanceled: 0,
  };

  const loadError =
    ordersQuery.isError && getApiErrorMessage(ordersQuery.error, 'Could not load orders.');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Tracking Page</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor all escrow transactions</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 bg-slate-50/50"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setPage(1);
            }}
          />
        </div>

        {loadError ? (
          <p className="mb-6 text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Buyer</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ordersQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={7} className="py-4 px-6">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No orders found{searchQuery ? ` matching "${searchQuery}"` : ''}.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusLabel = titleCaseStatus(order.status);
                    const buyerName = order.buyerName ?? 'Buyer';
                    const vendorName = order.vendorName ?? 'Vendor';

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium text-blue-600">
                          <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                            {order.id}
                          </Link>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColorClass(buyerName)}`}
                            >
                              {getInitials(buyerName)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">{buyerName}</div>
                              <div className="text-xs text-slate-400">{order.buyerEmail ?? '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${avatarColorClass(vendorName)}`}
                            >
                              {getInitials(vendorName)}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">{vendorName}</div>
                              <div className="text-xs text-slate-400">{order.vendorEmail ?? '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-700">
                          {formatAdminAmount(order.amount, order.currency)}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium">
                          <span className={getStatusColor(statusLabel)}>{statusLabel}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-500">{formatAdminDate(order.createdAt)}</td>
                        <td
                          className="py-4 px-6 text-sm text-slate-500 max-w-[200px] truncate"
                          title={order.description ?? order.listingTitle ?? undefined}
                        >
                          {order.description ?? order.listingTitle ?? '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {ordersQuery.data ? (
            <AdminPagination
              page={ordersQuery.data.page}
              pageSize={ordersQuery.data.pageSize}
              totalCount={ordersQuery.data.totalCount}
              totalPages={ordersQuery.data.totalPages}
              onPageChange={setPage}
              isLoading={ordersQuery.isFetching}
            />
          ) : null}

          <div className="bg-slate-50/80 border-t border-slate-100 p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Orders</span>
              <span className="text-xl font-bold text-slate-800">{stats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-500/70 uppercase tracking-wider mb-1">Completed</span>
              <span className="text-xl font-bold text-emerald-600">{stats.completed}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-500/70 uppercase tracking-wider mb-1">In Progress</span>
              <span className="text-xl font-bold text-blue-600">{stats.inProgress}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-orange-500/70 uppercase tracking-wider mb-1">Pending</span>
              <span className="text-xl font-bold text-orange-600">{stats.pending}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-pink-500/70 uppercase tracking-wider mb-1">Failed/Canceled</span>
              <span className="text-xl font-bold text-pink-600">{stats.failedOrCanceled}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderTrackingPage;
