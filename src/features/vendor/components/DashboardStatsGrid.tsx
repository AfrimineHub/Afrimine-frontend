import React from 'react';
import { FileText, ShoppingCart, Package, Clock, Check, Wallet } from 'lucide-react';

const stats = [
  { label: 'Total Listings', value: '24', icon: Package, color: 'text-white', bg: 'bg-blue-400' },
  { label: 'Active Quotes', value: '12', icon: FileText, color: 'text-white', bg: 'bg-purple-400' },
  { label: 'Ongoing Orders', value: '8', icon: ShoppingCart, color: 'text-white', bg: 'bg-green-400' },
  { label: 'Total Earnings', value: '₦45,280', icon: Wallet, color: 'text-white', bg: 'bg-yellow-600' },
  { label: 'Pending Payout', value: '₦8,450', icon: Clock, color: 'text-white', bg: 'bg-orange-600' },
  { label: 'Successful Orders', value: '10', icon: Check, color: 'text-white', bg: 'bg-emerald-500' },
];

export const DashboardStatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col justify-between min-w-0 p-3 sm:p-4 bg-white border border-gray-100 shadow-sm rounded-xl min-h-[7rem] sm:h-28 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <p className="text-[11px] leading-tight sm:text-xs font-medium text-gray-500 line-clamp-2">{stat.label}</p>
            <div className={`p-1.5 rounded-md shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={16} aria-hidden />
            </div>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums truncate">{stat.value}</h4>
        </div>
      ))}
    </div>
  );
};
