import React from 'react';
import { Clock, Wallet, DollarSign, TrendingUp, type LucideIcon } from 'lucide-react';
import type { VendorPayoutSummary } from '@/features/vendor/dashboardTypes';
import { formatVendorAmount } from '@/features/vendor/dashboardUtils';

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  smallText: string;
};

interface PayoutsStatsGridProps {
  summary?: VendorPayoutSummary;
  isLoading?: boolean;
}

export const PayoutsStatsGrid: React.FC<PayoutsStatsGridProps> = ({ summary, isLoading }) => {
  const currency = summary?.currency;

  const stats: Stat[] = [
    {
      label: 'Pending',
      value: summary ? formatVendorAmount(summary.pendingAmount, currency) : '—',
      icon: Clock,
      color: 'text-white',
      bg: 'bg-green-400',
      smallText: 'Awaiting processing',
    },
    {
      label: 'Total Paid',
      value: summary ? formatVendorAmount(summary.totalPaid, currency) : '—',
      icon: Wallet,
      color: 'text-white',
      bg: 'bg-yellow-600',
      smallText: 'All time payouts',
    },
    {
      label: 'Recent Activity',
      value: summary ? String(summary.recentPayouts.length) : '—',
      icon: TrendingUp,
      color: 'text-white',
      bg: 'bg-blue-400',
      smallText: 'Latest transactions',
    },
    {
      label: 'Currency',
      value: currency?.trim().toUpperCase() || '—',
      icon: DollarSign,
      color: 'text-white',
      bg: 'bg-purple-400',
      smallText: 'Payout currency',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-12 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between min-w-0 p-3 sm:p-4 border border-gray-100 shadow-sm rounded-xl min-h-[7rem] sm:h-28 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-1 min-w-0">
            <span>
              <stat.icon size={16} aria-hidden />
            </span>
            <p className="text-xs">{stat.label}</p>
          </div>
          {isLoading ? (
            <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" aria-hidden />
          ) : (
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums truncate">
              {stat.value}
            </h4>
          )}
          <h6 className="text-xs text-green-600">{stat.smallText}</h6>
        </div>
      ))}
    </div>
  );
};
