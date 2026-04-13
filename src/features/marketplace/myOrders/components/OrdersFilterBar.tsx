import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const OrdersFilterBar: React.FC<FilterBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { name: 'All Orders', count: 5 },
    { name: 'Inquiries', count: 9 },
    { name: 'Negotiations', count: 5 },
    { name: 'Agreements', count: 12 },
    { name: 'Closed', count: 32 }
  ];

  return (
    <div className="space-y-6 mb-6">
      <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`pb-4 text-sm font-semibold transition-all relative ${
              activeTab === tab.name ? 'text-slate-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.name} <span className="ml-1 text-[11px] opacity-70">({tab.count})</span>
            {activeTab === tab.name && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500" />}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for orders..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-50"
          />
        </div>
        <div className="flex gap-2">
          {['Region', 'Listing Type', 'Sort by'].map((f) => (
            <button key={f} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-700">
              {f} <ChevronDown size={14} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};