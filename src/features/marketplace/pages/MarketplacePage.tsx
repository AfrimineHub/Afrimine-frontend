import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchHero, FilterBar, CategoryGrid, ListingsGrid } from '../components';

export const MarketplacePage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const listingFilters = useMemo(
    () => ({
      searchQuery,
    }),
    [searchQuery],
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 lg:px-16">
      <SearchHero
        searchQuery={searchInput}
        onSearchQueryChange={setSearchInput}
        onSearch={handleSearch}
      />
      <FilterBar />
      <CategoryGrid />
      <ListingsGrid {...listingFilters} />
    </div>
  );
};

export default MarketplacePage;
