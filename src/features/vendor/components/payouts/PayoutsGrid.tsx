import React from 'react';
import { Clock, Wallet, DollarSign, TrendingUp, type LucideIcon } from 'lucide-react';

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  smallText: string;
};

const stats: Stat[] = [
  { label: 'This Month', value: '#42,000', icon: TrendingUp, color: 'text-white', bg: 'bg-blue-400', smallText: '+12% from last month', },
  { label: 'Available Balance', value: '#500,000', icon: DollarSign, color: 'text-white', bg: 'bg-purple-400', smallText: 'Ready to withdraw' },
  { label: 'Pending', value: '#420,000', icon: Clock, color: 'text-white', bg: 'bg-green-400', smallText: 'Processing' },
  { label: 'Total Earnings', value: '₦80,000,000', icon: Wallet, color: 'text-white', bg: 'bg-yellow-600', smallText: 'All time' },
];

export const PayoutsStatsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-12 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col justify-between min-w-0 p-3 sm:p-4 border border-gray-100 shadow-sm rounded-xl min-h-[7rem] sm:h-28 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-1 min-w-0">
            <span>
              <stat.icon size={16} aria-hidden />
            </span>
            <p className="text-xs">{stat.label}</p>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums truncate">{stat.value}</h4>
          <h6 className='text-xs text-green-600'>{stat.smallText}</h6>
        </div>
      ))}
    </div>
  );
};
