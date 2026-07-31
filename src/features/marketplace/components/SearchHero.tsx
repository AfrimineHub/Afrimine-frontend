import { Search, Home, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_TYPES } from '@/features/auth/types';
import { SUPPLIER_MACHINES_PATH } from '@/features/supplier/constants';

interface SearchHeroProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export const SearchHero = ({ searchQuery, onSearchQueryChange, onSearch, isSearching=false }: SearchHeroProps) => {
  const { user } = useAuth();
  const isSupplier = user?.type === USER_TYPES.supplier;

  return (
    <header className="space-y-6">
      <div className="text-xs text-gray-400 flex items-center gap-2">
        <Home size={16} />
        <Link to="/home" className="hover:text-gray-600">Home</Link>
        <span className="text-gray-300">▶</span>
        <span className="text-gray-600 font-medium">Marketplace</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-5xl">
        <div className="flex flex-1 items-center px-4 gap-3">
          {isSearching ? (
            <Loader2 size={20} className="text-gray-400 animate-spin" aria-hidden />
          ) : (
            <Search size={20} className="text-gray-300" />
          )}
          <input
            type="text"
            placeholder="Search by brand, model, or equipment type"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch();
            }}
            className="w-full outline-none text-sm py-2 placeholder:text-gray-300"
            aria-busy={isSearching}
          />
        </div>
        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          className="bg-[#22272B] text-white px-10 py-2.5 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-all cursor-pointer w-full sm:w-auto"
        >
          {isSearching ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
          {isSearching ? 'Searching…' : 'Search'}
        </button>

        {isSupplier ? (
          <Link
            to={`${SUPPLIER_MACHINES_PATH}/new`}
            className="bg-yellow-500 text-black px-10 py-2.5 rounded-lg font-semibold text-sm text-center hover:bg-gray-400 transition-all cursor-pointer w-full sm:w-auto"
          >
            List Item
          </Link>
        ) : null}
      </div>
    </header>
  );
};