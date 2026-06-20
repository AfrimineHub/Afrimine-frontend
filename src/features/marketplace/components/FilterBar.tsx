import { useEffect, useRef, useState, type ComponentType } from 'react';
import { MapPin, Globe, Layers, Eye, ChevronDown } from 'lucide-react';
import { LISTING_CATEGORY_OPTIONS, MINERAL_TYPES } from '@/features/listings/constants';
import type { MarketplaceFilters } from '@/features/marketplace/types';

const LISTING_TYPE_OPTIONS = [
  { label: 'All types', value: '' },
  ...LISTING_CATEGORY_OPTIONS.map((option) => ({ label: option.label, value: option.label })),
];

const MINERAL_OPTIONS = [{ label: 'All minerals', value: '' }, ...MINERAL_TYPES];

interface FilterBarProps {
  filters: MarketplaceFilters;
  onFiltersChange: (filters: MarketplaceFilters) => void;
}

interface FilterDropdownProps {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({ icon: Icon, label, value, options, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors border-r border-gray-100 last:border-0 border-r-0 sm:border-r"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Icon size={18} className="text-gray-400" />
        <span className="text-sm font-medium">{selected?.value ? selected.label : label}</span>
        <ChevronDown size={14} className={`ml-1 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-gray-100 bg-white py-2 shadow-lg"
          role="listbox"
        >
          {options.map((option) => (
            <button
              key={option.value || 'all'}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                option.value === value
                  ? 'bg-yellow-50 font-semibold text-yellow-800'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const updateFilter = <K extends keyof MarketplaceFilters>(key: K, value: MarketplaceFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 py-4 sm:py-6 border-b border-gray-100">
      <div className="flex items-center gap-2 px-4 py-2 text-gray-500 border-r border-gray-100 border-r-0 sm:border-r">
        <MapPin size={18} className="shrink-0 text-gray-400" />
        <input
          type="text"
          value={filters.location}
          onChange={(event) => updateFilter('location', event.target.value)}
          placeholder="Location"
          className="w-full min-w-[120px] bg-transparent text-sm font-medium text-gray-700 placeholder:text-gray-400 outline-none sm:w-36"
          aria-label="Filter by location"
        />
      </div>

      <FilterDropdown
        icon={Globe}
        label="Minerals"
        value={filters.mineral}
        options={MINERAL_OPTIONS}
        onChange={(value) => updateFilter('mineral', value)}
      />

      <FilterDropdown
        icon={Layers}
        label="Listing Type"
        value={filters.listingType}
        options={LISTING_TYPE_OPTIONS}
        onChange={(value) => updateFilter('listingType', value)}
      />

      <button
        type="button"
        onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm w-full sm:w-auto sm:ml-auto cursor-pointer transition-colors ${
          filters.verifiedOnly
            ? 'bg-yellow-400 font-semibold text-gray-900'
            : 'bg-gray-200 text-gray-500 hover:text-gray-700'
        }`}
        aria-pressed={filters.verifiedOnly}
      >
        <Eye size={18} className={filters.verifiedOnly ? 'text-gray-900' : 'text-gray-400'} />
        <span className="font-medium">Only Verified Listings</span>
      </button>
    </div>
  );
};
