import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchHero, FilterBar, CategoryGrid, ListingsGrid } from '../components';
import { DEFAULT_MARKETPLACE_FILTERS, type MarketplaceFilters } from '../types';

const PAGE_SIZE = 24;
const LOCATION_DEBOUNCE_MS = 300;

export const MarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_MARKETPLACE_FILTERS);
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedLocation(filters.location);
    }, LOCATION_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [filters.location]);

  useEffect(() => {
    setPage(1);
  }, [debouncedLocation, filters.mineral, filters.listingType, filters.verifiedOnly]);

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
      mineral: filters.mineral || undefined,
      listingType: filters.listingType || undefined,
      verifiedOnly: filters.verifiedOnly || undefined,
      page,
      pageSize: PAGE_SIZE,
      onPageChange: setPage,
    }),
    [
      debouncedLocation,
      filters.listingType,
      filters.mineral,
      filters.verifiedOnly,
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
      />
      <FilterBar filters={filters} onFiltersChange={handleFiltersChange} />
      <CategoryGrid />
      <ListingsGrid {...listingFilters} />
    </div>
  );
};

export default MarketplacePage;
