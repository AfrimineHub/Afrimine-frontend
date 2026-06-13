import React from 'react';
import { FileText, ShoppingCart, Package, Clock, Check, MessageSquare } from 'lucide-react';
import type { VendorDashboardStats, VendorRevenueSummary } from '@/features/vendor/dashboardTypes';
import { formatVendorAmount } from '@/features/vendor/dashboardUtils';

interface StatItem {
  key: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  color: string;
  bg: string;
}

interface DashboardStatsGridProps {
  stats?: VendorDashboardStats;
  revenueCurrency?: VendorRevenueSummary['currency'];
  isLoading?: boolean;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({
  stats,
  revenueCurrency,
  isLoading,
}) => {
  const statItems: StatItem[] = [
    {
      key: 'totalListings',
      label: 'Total Listings',
      value: stats ? String(stats.totalListingsCount) : '—',
      icon: Package,
      color: 'text-white',
      bg: 'bg-blue-400',
    },
    {
      key: 'activeQuotes',
      label: 'Active Quotes',
      value: stats ? String(stats.activeQuotesCount) : '—',
      icon: FileText,
      color: 'text-white',
      bg: 'bg-purple-400',
    },
    {
      key: 'ongoingOrders',
      label: 'Ongoing Orders',
      value: stats ? String(stats.ongoingOrdersCount) : '—',
      icon: ShoppingCart,
      color: 'text-white',
      bg: 'bg-green-400',
    },
    {
      key: 'unreadMessages',
      label: 'Unread Messages',
      value: stats ? String(stats.unreadMessagesCount) : '—',
      icon: MessageSquare,
      color: 'text-white',
      bg: 'bg-sky-500',
    },
    {
      key: 'pendingPayout',
      label: 'Pending Payout',
      value: stats ? formatVendorAmount(stats.pendingPayoutAmount, revenueCurrency) : '—',
      icon: Clock,
      color: 'text-white',
      bg: 'bg-orange-600',
    },
    {
      key: 'successfulOrders',
      label: 'Successful Orders',
      value: stats ? String(stats.successfulOrdersCount) : '—',
      icon: Check,
      color: 'text-white',
      bg: 'bg-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {statItems.map((stat) => (
        <div
          key={stat.key}
          className="flex flex-col justify-between min-w-0 p-3 sm:p-4 bg-white border border-gray-100 shadow-sm rounded-xl min-h-[7rem] sm:h-28 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2 min-w-0">
            <p className="text-[11px] leading-tight sm:text-xs font-medium text-gray-500 line-clamp-2">
              {stat.label}
            </p>
            <div className={`p-1.5 rounded-md shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={16} aria-hidden />
            </div>
          </div>
          {isLoading ? (
            <div className="h-7 w-12 bg-gray-100 rounded animate-pulse" aria-hidden />
          ) : (
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums truncate">
              {stat.value}
            </h4>
          )}
        </div>
      ))}
    </div>
  );
};
