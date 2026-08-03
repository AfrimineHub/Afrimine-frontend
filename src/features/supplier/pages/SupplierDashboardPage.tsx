import { Link } from 'react-router-dom';
import { Plus, Truck, CalendarClock, Wallet, Lock } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { SupplierLayout } from '@/features/supplier/components/SupplierLayout';
import { SUPPLIER_MACHINES_PATH, SUPPLIER_BOOKINGS_PATH } from '@/features/supplier/constants';
import type { SupplierDashboardStats } from '@/features/supplier/types';
import { useSupplierStatsQuery } from '@/features/supplier/dashboard/dashboardQueries';
import { useSupplierStatusQuery } from '@/features/supplier/onboarding/onboardingQueries';
import { useSupplierAssetsQuery } from '@/features/supplier/onboarding/assetsQueries';
import { useBookingsQuery } from '@/features/supplier/bookings/bookingsQueries';
import { BOOKING_STATUS_STYLES, normalizeBookingsList } from '@/features/supplier/bookings/bookingsUtils';
import { ACCOUNT_STATUS } from '@/features/supplier/constants';

function normalizeSupplierStats(raw: unknown): Partial<SupplierDashboardStats> {
  if (!raw || typeof raw !== 'object') return {};
  const r = raw as Record<string, unknown>;

  const num = (keys: string[]): number | undefined => {
    for (const key of keys) {
      const v = r[key];
      if (typeof v === 'number') return v;
    }
    return undefined;
  };
  const str = (keys: string[]): string | undefined => {
    for (const key of keys) {
      const v = r[key];
      if (typeof v === 'string' && v) return v;
    }
    return undefined;
  };

  return {
    totalMachines: num(['totalMachines', 'totalAssets', 'machinesCount']),
    activeBookings: num(['activeBookings', 'activeLeases', 'ongoingBookings']),
    currentEarnings: num(['currentMonthEarnings', 'thisMonthEarnings', 'monthlyEarnings']),
    pendingEscrow: num(['pendingEscrow', 'pendingPayout', 'escrowPending']),
    currency: str(['currency']),
  };
}

function normalizeAssetsCount(raw: unknown): number | undefined {
  if (Array.isArray(raw)) return raw.length;
  if (raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).items)) {
    return ((raw as Record<string, unknown>).items as unknown[]).length;
  }
  return undefined;
}

function normalizeVerificationPending(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  const status = (raw as Record<string, unknown>).status;
  return status === ACCOUNT_STATUS.Pending;
}

const STATUS_STYLES = BOOKING_STATUS_STYLES;

export default function SupplierDashboardPage() {
  const { user } = useAuth();

  const statsQuery = useSupplierStatsQuery();
  const statusQuery = useSupplierStatusQuery();
  const assetsQuery = useSupplierAssetsQuery();
  const bookingsQuery = useBookingsQuery();

  const normalizedStats = normalizeSupplierStats(statsQuery.data);
  const assetsCount = normalizeAssetsCount(assetsQuery.data);

  const stats: SupplierDashboardStats = {
    totalMachines: normalizedStats.totalMachines ?? assetsCount ?? 0,
    activeBookings: normalizedStats.activeBookings ?? 0,
    currentEarnings: normalizedStats.currentEarnings ?? 0,
    pendingEscrow: normalizedStats.pendingEscrow ?? 0,
    currency: normalizedStats.currency ?? 'NGN',
  };

  const leases = normalizeBookingsList(bookingsQuery.data);
  const pending = normalizeVerificationPending(statusQuery.data) ?? false;

  const displayName = user?.fullName ?? user?.companyName ?? 'Supplier';

  const kpiCards = [
    {
      label: 'Total Machines Listed',
      value: stats.totalMachines,
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
          Our agent will contact you within 24 hours.
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
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Active Leases</h2>
          <Link
            to={SUPPLIER_BOOKINGS_PATH}
            className="text-sm font-semibold text-[#CA8A04] hover:underline"
          >
            View all
          </Link>
        </div>

        {bookingsQuery.isLoading ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">Loading leases…</p>
          </div>
        ) : leases.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">No active leases yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Booking requests from miners will appear here.
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
                    <td className="px-5 py-3 font-medium text-slate-900">
                      <Link
                        to={`${SUPPLIER_BOOKINGS_PATH}/${lease.id}`}
                        className="hover:text-[#CA8A04] hover:underline"
                      >
                        {lease.machineName}
                      </Link>
                    </td>
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