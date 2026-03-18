import { Search, Home } from 'lucide-react';

export const SearchHero = () => (
  <header className="space-y-6">
    <div className="text-xs text-gray-400 flex items-center gap-2">
      <Home size={16} />
      <span className="hover:text-gray-600 cursor-pointer">Home</span> 
      <span className="text-gray-300">▶</span> 
      <span className="text-gray-600 font-medium">Marketplace</span>
    </div>

    <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-5xl">
      <div className="flex flex-1 items-center px-4 gap-3">
        <Search size={20} className="text-gray-300" />
        <input 
          type="text" 
          placeholder="Search for minerals, sites, or equipment" 
          className="w-full outline-none text-sm py-2 placeholder:text-gray-300" 
        />
      </div>
      <button className="bg-[#22272B] text-white px-10 py-2.5 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-all cursor-pointer">
        Search
      </button>

      <button className="bg-yellow-500 text-black px-10 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-400 transition-all cursor-pointer">
        List Item
      </button>
    </div>
  </header>
);