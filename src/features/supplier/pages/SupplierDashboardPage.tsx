import { Link } from 'react-router-dom';
import { Plus, Truck, CalendarClock, Wallet, Lock } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { loadOnboardingDraft } from '@/features/supplier/onboarding/onboardingStorage';
import { SUPPLIER_MACHINES_PATH } from '@/features/supplier/constants';
import type { ActiveLeaseRow, SupplierDashboardStats } from '@/features/supplier/types';
import { useVendorDashboardQuery, useVendorRevenueSummaryQuery } from '@/features/vendor/dashboardQueries';

function buildStats(
  draftMachineCount: number,
  vendorStats?: {
    totalListingsCount?: number;
    ongoingOrdersCount?: number;
    pendingPayoutAmount?: number;
  },
  revenue?: { thisMonthInflow?: number; currency?: string | null },
): SupplierDashboardStats {
  return {
    totalMachines: Math.max(draftMachineCount, vendorStats?.totalListingsCount ?? 0),
    activeBookings: vendorStats?.ongoingOrdersCount ?? 0,
    currentEarnings: revenue?.thisMonthInflow ?? 0,
    pendingEscrow: vendorStats?.pendingPayoutAmount ?? 0,
    currency: revenue?.currency ?? 'NGN',
    machinesTrend: draftMachineCount > 0 ? `+${draftMachineCount} listed` : undefined,
  };
}

const STATUS_STYLES: Record<ActiveLeaseRow['status'], string> = {
  pending: 'bg-amber-50 text-amber-800',
  active: 'bg-emerald-50 text-emerald-800',
  completed: 'bg-slate-100 text-slate-600',
  declined: 'bg-red-50 text-red-700',
};

export default function SupplierDashboardPage() {
  const { user } = useAuth();
  const draft = loadOnboardingDraft(user?.id);
  const dashboardQuery = useVendorDashboardQuery();
  const revenueQuery = useVendorRevenueSummaryQuery();

  const stats = buildStats(
    draft.machines.filter((m) => m.brandModel).length,
    dashboardQuery.data?.stats,
    revenueQuery.data ?? dashboardQuery.data?.revenue,
  );

  const leases: ActiveLeaseRow[] = [];
  const pending = draft.status === 'pending_verification';
  const displayName = user?.fullName ?? user?.companyName ?? 'Supplier';

  const kpiCards = [
    {
      label: 'Total Machines Listed',
      value: stats.totalMachines,
      trend: stats.machinesTrend,
      icon: Truck,
    },
    {
      label: 'Active Bookings',
      value: stats.activeBookings,
      icon: CalendarClock,
    },
    {
      label: 'Current Earnings',
      value: `${stats.currency} ${stats.currentEarnings.toLocaleString()}`,
      icon: Wallet,
    },
    {
      label: 'Pending Escrow',
      value: `${stats.currency} ${stats.pendingEscrow.toLocaleString()}`,
      icon: Lock,
    },
  ];

  return (
    <SupplierLayout>
      {pending && (
        <div className="mb-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white sm:px-5">
          <span className="font-semibold text-[#EAB308]">Account pending verification.</span>{' '}
          Field agents in the Jos / Nasarawa hub will contact you within 24 hours.
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, {displayName}</p>
        </div>
        <Link
          to={`${SUPPLIER_MACHINES_PATH}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EAB308] to-[#CA8A04] px-5 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
        >
          <Plus size={18} aria-hidden />
          List New Machine
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.label}
                </p>
                <Icon className="text-[#CA8A04]" size={18} aria-hidden />
              </div>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{card.value}</p>
              {card.trend ? (
                <p className="mt-2 text-xs font-semibold text-emerald-600">{card.trend}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Active Leases</h2>
          <Link
            to="/supplier/bookings"
            className="text-sm font-semibold text-[#CA8A04] hover:underline"
          >
            View all
          </Link>
        </div>

        {leases.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">No active leases yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Booking requests from miners will appear here once the booking API is live.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Machine</th>
                  <th className="px-5 py-3 font-semibold">Miner</th>
                  <th className="px-5 py-3 font-semibold">Lease period</th>
                  <th className="px-5 py-3 font-semibold">Next milestone</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {leases.map((lease) => (
                  <tr key={lease.id} className="border-t border-slate-100">
                    <td className="px-5 py-3 font-medium text-slate-900">{lease.machineName}</td>
                    <td className="px-5 py-3 text-slate-600">{lease.minerName}</td>
                    <td className="px-5 py-3 text-slate-600">{lease.leasePeriod}</td>
                    <td className="px-5 py-3 text-slate-600">{lease.nextMilestone}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[lease.status]}`}
                      >
                        {lease.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
