import React from 'react';
import { Clock, Wallet, DollarSign, TrendingUp, type LucideIcon } from 'lucide-react';
import type { WalletBalance } from '@/features/supplier/wallet/walletTypes';
import { formatWalletAmount } from '@/features/supplier/wallet/walletUtils';

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  bg: string;
  smallText: string;
};

interface PayoutsStatsGridProps {
  balance?: WalletBalance;
  transactionsCount?: number;
  isLoading?: boolean;
}

export const PayoutsStatsGrid: React.FC<PayoutsStatsGridProps> = ({ balance, transactionsCount, isLoading }) => {
  const currency = balance?.currency;

  const stats: Stat[] = [
    {
      label: 'Available Balance',
      value: balance ? formatWalletAmount(balance.availableBalance, currency) : '—',
      icon: Wallet,
      bg: 'bg-green-400',
      smallText: 'Ready to withdraw',
    },
    {
      label: 'Pending Balance',
      value: balance ? formatWalletAmount(balance.pendingBalance, currency) : '—',
      icon: Clock,
      bg: 'bg-yellow-600',
      smallText: 'Locked in escrow',
    },
    {
      label: 'Recent Activity',
      value: transactionsCount != null ? String(transactionsCount) : '—',
      icon: TrendingUp,
      bg: 'bg-blue-400',
      smallText: 'Latest transactions',
    },
    {
      label: 'Currency',
      value: currency?.trim().toUpperCase() || '—',
      icon: DollarSign,
      bg: 'bg-purple-400',
      smallText: 'Wallet currency',
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