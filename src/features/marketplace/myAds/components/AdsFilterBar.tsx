import { ChevronDown, Plus } from 'lucide-react';

export const AdsFilterBar = () => {
  const tabs = [
    { name: 'All Listings', count: 8 },
    { name: 'Active Listings', count: 5 },
    { name: 'Pending Listings', count: 8, alert: true },
    { name: 'Drafts', count: 1 },
  ];

  return (
    <div className="space-y-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900">My Ads</h2>
        <button className="bg-yellow-500 hover:bg-[#D66A20] text-black px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold shadow-sm transition-all cursor-pointer w-full sm:w-auto">
          <Plus size={18} /> Add New Listing
        </button>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-100 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button key={tab.name} className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-900 relative whitespace-nowrap cursor-pointer">
            {tab.name} ({tab.count})
            {tab.alert && <span className="absolute top-0 -right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {['Listing Type', 'Active', 'Regions', 'Sort by'].map((filter) => (
          <div key={filter} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
            {filter === 'Active' && <span className="w-4 h-4 bg-[#8B5E3C]/20 text-[#8B5E3C] flex items-center justify-center rounded text-[10px]">8</span>}
            {filter} <ChevronDown size={14} className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};