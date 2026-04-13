import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const QuotesFilterBar: React.FC = () => {
  const tabs = [
    { name: 'All Quotes', count: 12, active: true },
    { name: 'Active Quotes', count: 8, active: false },
    { name: 'Drafts', count: 2, active: false },
    { name: 'Completed', count: 2, active: false },
  ];

  return (
    <div className="mb-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-sm text-gray-500">Manage and track quotes</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by quote ID, status..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button 
            key={tab.name} 
            className={`pb-3 text-sm font-medium relative ${tab.active ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab.name} <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs ${tab.active ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span>
            {tab.active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3">
        {['Quote Status', 'Quote Type', 'Sort by'].map((filter) => (
          <button key={filter} className="bg-white border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            {filter} <ChevronDown size={16} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};