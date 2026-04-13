import { Search, Plus } from 'lucide-react';

export const AdsFilterBar = () => {
  return (
    <div className="space-y-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Listings</h2>
          <p className="text-sm text-gray-500">Manage and track your assets</p>
        </div>
        <button className="bg-[#22272B] hover:bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm">
          <Plus size={18} /> Create New Listing
        </button>
      </div>

      <div className="relative max-w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by title..." 
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
        />
      </div>
    </div>
  );
};