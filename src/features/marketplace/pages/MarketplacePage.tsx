import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchHero, FilterBar, CategoryGrid, ListingsGrid } from '../components';
import { DEFAULT_MARKETPLACE_FILTERS, type MarketplaceFilters } from '../types';

const PAGE_SIZE = 24;
const LOCATION_DEBOUNCE_MS = 300;
const SEARCH_DEBOUNCE_MS = 300;

export const MarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_MARKETPLACE_FILTERS);
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, LOCATION_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [filters.location]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedLocation, filters.machineType, filters.maxDailyRate, filters.availableOnly, searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleFiltersChange = (next: MarketplaceFilters) => {
    setFilters(next);
    if (next.location === filters.location) {
      setPage(1);
    }
  };

  const listingFilters = useMemo(
    () => ({
      searchQuery,
      location: debouncedLocation.trim() || undefined,
      machineType: filters.machineType !== '' ? Number(filters.machineType) : undefined,
      maxDailyRate: filters.maxDailyRate !== '' ? Number(filters.maxDailyRate) : undefined,
      availableOnly: filters.availableOnly,
      page,
      pageSize: PAGE_SIZE,
      onPageChange: setPage,
      OnFetchingChange: setIsSearching,
    }),
    [
      debouncedLocation,
      filters.availableOnly,
      filters.machineType,
      filters.maxDailyRate,
      page,
      searchQuery,
    ],
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <SearchHero
        searchQuery={searchInput}
        onSearchQueryChange={setSearchInput}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      <CategoryGrid />
      <ListingsGrid {...listingFilters} />
    </div>
  );
};

export default MarketplacePage;