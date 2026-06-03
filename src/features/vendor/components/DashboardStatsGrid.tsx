import React from 'react';
import { FileText, ShoppingCart, Package, Clock, Check, MessageSquare } from 'lucide-react';
import type { DashboardSummary } from '@/features/dashboard/types';

interface StatItem {
  key: string;
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  color: string;
  bg: string;
  fromApi?: boolean;
}

interface DashboardStatsGridProps {
  summary?: DashboardSummary;
  totalListings?: number | null;
  isLoading?: boolean;
}

export const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({
  summary,
  totalListings,
  isLoading,
}) => {
  const stats: StatItem[] = [
    {
      key: 'totalListings',
      label: 'Total Listings',
      value: totalListings != null ? String(totalListings) : '—',
      icon: Package,
      color: 'text-white',
      bg: 'bg-blue-400',
      fromApi: totalListings != null,
    },
    {
      key: 'activeQuotes',
      label: 'Active Quotes',
      value: '—',
      icon: FileText,
      color: 'text-white',
      bg: 'bg-purple-400',
    },
    {
      key: 'ongoingOrders',
      label: 'Ongoing Orders',
      value: summary ? String(summary.ongoingOrdersCount) : '—',
      icon: ShoppingCart,
      color: 'text-white',
      bg: 'bg-green-400',
      fromApi: true,
    },
    {
      key: 'unreadMessages',
      label: 'Unread Messages',
      value: summary ? String(summary.unreadMessagesCount) : '—',
      icon: MessageSquare,
      color: 'text-white',
      bg: 'bg-sky-500',
      fromApi: true,
    },
    {
      key: 'pendingPayout',
      label: 'Pending Payout',
      value: '—',
      icon: Clock,
      color: 'text-white',
      bg: 'bg-orange-600',
    },
    {
      key: 'successfulOrders',
      label: 'Successful Orders',
      value: '—',
      icon: Check,
      color: 'text-white',
      bg: 'bg-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="flex flex-col justify-between min-w-0 p-3 sm:p-4 bg-white border border-gray-100 shadow-sm rounded-xl min-h-[7rem] sm:h-28 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-2 min-w-0">
            <p className="text-[11px] leading-tight sm:text-xs font-medium text-gray-500 line-clamp-2">{stat.label}</p>
            <div className={`p-1.5 rounded-md shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={16} aria-hidden />
            </div>
          </div>
          {isLoading && stat.fromApi ? (
            <div className="h-7 w-12 bg-gray-100 rounded animate-pulse" aria-hidden />
          ) : (
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums truncate">{stat.value}</h4>
          )}
        </div>
      ))}
    </div>
  );
};
