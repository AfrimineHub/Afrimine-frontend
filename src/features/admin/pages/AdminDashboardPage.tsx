import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { StatCard } from '../components/AdminStatsCard';
import { PriorityAlert } from '../components/PriorityAlertComponent';
import { ActivityItem } from '../components/AdminActivityItem';
import { useAdminDashboardQuery } from '@/features/admin/queries';
import { formatAdminAmount, formatAdminRelativeTime } from '@/features/admin/utils';
import { getApiErrorMessage } from '@/lib/api/errors';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const AdminDashboardPage = () => {
  const dashboardQuery = useAdminDashboardQuery();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = dashboardQuery.data?.stats ?? [];
  const priorityAlerts = dashboardQuery.data?.priorityAlerts ?? [];
  const liveActivityFeed = dashboardQuery.data?.recentActivity ?? [];
  const ongoingTransactions = dashboardQuery.data?.ongoingTransactions ?? [];

  const loadError =
    dashboardQuery.isError &&
    getApiErrorMessage(dashboardQuery.error, 'Could not load admin dashboard.');

  return (
    <div className="flex w-full h-full bg-[#F4F5F7] font-sans overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-gray-900">Admin Dashboard</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            {loadError ? (
              <p className="text-sm text-red-600 rounded-lg border border-red-100 bg-red-50 px-4 py-3" role="alert">
                {loadError}
              </p>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardQuery.isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-28 rounded-xl border border-gray-200 bg-white animate-pulse" />
                  ))
                : stats.map((stat) => (
                    <StatCard
                      key={stat.id}
                      title={stat.title}
                      value={stat.value}
                      trend={stat.trend ?? '—'}
                      isPositive={stat.isPositive ?? undefined}
                      isNeutral={stat.isNeutral ?? undefined}
                    />
                  ))}
            </div>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Priority Alerts</h2>
              <div className="space-y-3">
                {dashboardQuery.isLoading ? (
                  <div className="h-20 rounded-xl bg-white border border-gray-200 animate-pulse" />
                ) : priorityAlerts.length === 0 ? (
                  <p className="text-sm text-gray-500">No priority alerts right now.</p>
                ) : (
                  priorityAlerts.map((alert) => (
                    <PriorityAlert
                      key={alert.id}
                      type={alert.type}
                      title={alert.title}
                      description={alert.description}
                      time={alert.time}
                      actionText={alert.actionText}
                      actionUrl={alert.actionUrl}
                    />
                  ))
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Live Activity Feed</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {dashboardQuery.isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-14 animate-pulse bg-gray-50 my-2 rounded" />
                    ))
                  ) : liveActivityFeed.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">No recent activity.</p>
                  ) : (
                    liveActivityFeed.map((activity) => (
                      <ActivityItem
                        key={activity.id}
                        type={activity.type}
                        title={activity.title}
                        desc={activity.description}
                        time={formatAdminRelativeTime(activity.createdAt)}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Ongoing Transactions</h2>
                  <Link
                    to="/admin/order-tracker"
                    className="text-xs font-bold text-[#B89047] hover:text-[#9A7639]"
                  >
                    View All Orders
                  </Link>
                </div>

                {/* Mobile: stacked cards */}
                <div className="sm:hidden space-y-3">
                  {dashboardQuery.isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-24 rounded-lg bg-gray-50 animate-pulse" />
                    ))
                  ) : ongoingTransactions.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">No ongoing transactions.</p>
                  ) : (
                    ongoingTransactions.map((tx) => (
                      <Link
                        key={tx.id}
                        to={`/admin/order-tracker?q=${encodeURIComponent(tx.orderId)}`}
                        className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">{tx.orderId}</span>
                          <span
                            className={`text-xs font-medium whitespace-nowrap ${
                              (tx.status ?? '').toLowerCase().includes('dispute')
                                ? 'text-red-500'
                                : 'text-yellow-600'
                            }`}
                          >
                            {tx.status ?? '—'}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate">
                            {tx.buyerName ?? '—'} → {tx.vendorName ?? '—'}
                          </span>
                          <span className="font-bold text-gray-900 whitespace-nowrap ml-2">
                            {formatAdminAmount(tx.amount, tx.currency)}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* Desktop/tablet: table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Buyer</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Vendor</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dashboardQuery.isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <tr key={index}>
                            <td colSpan={6} className="py-4">
                              <div className="h-4 bg-gray-100 rounded animate-pulse" />
                            </td>
                          </tr>
                        ))
                      ) : ongoingTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-sm text-gray-500 text-center">
                            No ongoing transactions.
                          </td>
                        </tr>
                      ) : (
                        ongoingTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="py-3 text-sm font-medium text-gray-900">{tx.orderId}</td>
                            <td className="py-3 text-sm text-gray-600">{tx.buyerName ?? '—'}</td>
                            <td className="py-3 text-sm text-gray-600">{tx.vendorName ?? '—'}</td>
                            <td className="py-3 text-sm font-bold text-gray-900">
                              {formatAdminAmount(tx.amount, tx.currency)}
                            </td>
                            <td className="py-3 text-xs font-medium">
                              <span
                                className={
                                  (tx.status ?? '').toLowerCase().includes('dispute')
                                    ? 'text-red-500'
                                    : 'text-yellow-600'
                                }
                              >
                                {tx.status ?? '—'}
                              </span>
                            </td>
                            <td className="py-3 text-xs font-bold text-blue-500 hover:text-blue-700">
                              <Link to={`/admin/order-tracker?q=${encodeURIComponent(tx.orderId)}`}>
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
